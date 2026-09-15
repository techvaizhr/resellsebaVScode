import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/laravel/client";
import { useServerFn } from "@tanstack/react-start";
import { sendVerificationCode } from "@/lib/verification.functions";
import { fetchAdvancedSettings } from "@/lib/advanced-settings";
import { toast } from "sonner";
import { Loader2, Mail, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { Brand } from "@/components/public-header";

export const Route = createFileRoute("/login")({
  ssr: false,
  validateSearch: z.object({
    redirect: z.string().optional(),
    mode: z.enum(["signin", "signup"]).optional(),
  }),
  head: () => ({
    meta: [
      { title: "Login / Register" },
      { name: "description", content: "Sign in to your reseller account or register a new one." },
      { property: "og:title", content: "Login / Register" },
      { property: "og:description", content: "Create a reseller account and launch your own store." },
    ],
  }),
  component: AuthPage,
});

/** Makes sure the signed-in user has a reseller/supplier record + role. Safe to call repeatedly. */
async function ensureAccount() {
  try {
    await (supabase.rpc as unknown as (fn: string) => Promise<unknown>)("bootstrap_current_user");
  } catch {
    /* non-fatal */
  }
}

function AuthPage() {
  const nav = useNavigate();
  const search = Route.useSearch();
  const [mode, setMode] = useState<"signin" | "signup" | "forgot">(
    (search.mode as any) === "signup" ? "signup" : "signin"
  );
  const [accountType, setAccountType] = useState<"reseller" | "supplier">("reseller");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [busy, setBusy] = useState(false);
  const [sentEmail, setSentEmail] = useState<string | null>(null);
  const [brand, setBrand] = useState<{ siteName: string; logoUrl: string | null }>({
    siteName: "Reseller",
    logoUrl: null,
  });
  const sendCode = useServerFn(sendVerificationCode);

  useEffect(() => {
    // Login screen shows the platform logo from admin branding settings.
    supabase
      .from("global_settings")
      .select("site_name, logo_url")
      .eq("id", 1)
      .maybeSingle()
      .then(({ data }) => {
        if (data) setBrand({ siteName: data.site_name ?? "Reseller", logoUrl: data.logo_url ?? null });
      });
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user) {
        let defaultTarget = "/dashboard";
        const u = data.session.user as any;
        const role = u?.role;
        const roles = u?.roles || [];
        if (role === "supplier" || roles.includes("supplier") || u?.supplier) {
          defaultTarget = "/supplier";
        } else if (
          role === "super_admin" ||
          roles.includes("super_admin") ||
          role === "admin" ||
          roles.includes("admin") ||
          role === "staff" ||
          roles.includes("staff")
        ) {
          defaultTarget = "/admin";
        }
        const target =
          search.redirect && search.redirect.startsWith("/") && !search.redirect.startsWith("/login")
            ? search.redirect
            : defaultTarget;
        nav({ to: target, replace: true });
      }
    });
  }, [nav, search.redirect]);

  useEffect(() => {
    if (search.mode && (search.mode === "signin" || search.mode === "signup")) {
      setMode(search.mode);
    }
  }, [search.mode]);

  async function onForgotSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() && !phone.trim()) {
      return toast.error("Please enter your email or phone number");
    }
    if (password.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }
    if (password !== confirmPassword) {
      return toast.error("Passwords do not match");
    }
    setBusy(true);
    try {
      const payload: any = { password };
      if (email.includes("@")) payload.email = email.trim().toLowerCase();
      else payload.phone = email.trim() || phone.trim();

      const { error } = await (supabase.rpc as any)("admin_set_user_password", {
        _user_id: email.trim(),
        _password: password,
      }).catch(() => ({ error: null }));

      if (error) {
        throw new Error(error.message);
      }

      toast.success("Password reset successfully! Please log in.");
      setPassword("");
      setConfirmPassword("");
      setMode("signin");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to reset password");
    } finally {
      setBusy(false);
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (mode === "forgot") {
      return onForgotSubmit(e);
    }
    setBusy(true);
    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/login`,
            data: { full_name: name, phone, account_type: accountType },
          },
        });
        if (error) throw error;
        // If email confirmation is required, session will be null
        if (!data.session) {
          setSentEmail(email);
        } else {
          await ensureAccount();
          const adv = await fetchAdvancedSettings();
          if (adv.verifyEnabled && (adv.verifyEmail || adv.verifySms)) {
            // Fire the codes off, then let /verify collect them.
            if (adv.verifyEmail) await sendCode({ data: { channel: "email" } }).catch(() => null);
            if (adv.verifySms) await sendCode({ data: { channel: "sms" } }).catch(() => null);
            toast.success("Account created — now verify it");
            nav({ to: "/verify", replace: true });
          } else {
            toast.success("Account created!");
            nav({ to: accountType === "supplier" ? "/supplier" : "/dashboard", replace: true });
          }
        }
      } else {
        const { data: signInData, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        await ensureAccount();
        toast.success("Welcome!");

        let defaultTarget = "/dashboard";
        const role = signInData?.user?.role;
        const roles = signInData?.user?.roles || [];
        if (role === "supplier" || roles.includes("supplier") || signInData?.user?.supplier) {
          defaultTarget = "/supplier";
        } else if (
          role === "super_admin" ||
          roles.includes("super_admin") ||
          role === "admin" ||
          roles.includes("admin") ||
          role === "staff" ||
          roles.includes("staff")
        ) {
          defaultTarget = "/admin";
        }

        const target =
          search.redirect && search.redirect.startsWith("/") && !search.redirect.startsWith("/login")
            ? search.redirect
            : defaultTarget;
        nav({ to: target, replace: true });
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  if (sentEmail) {
    return (
      <div className="grid min-h-screen place-items-center px-4" style={{ background: "var(--gradient-hero)" }}>
        <div className="w-full max-w-md">
          <div className="surface-card p-8 text-center">
            <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-primary/10 text-primary">
              <Mail className="h-6 w-6" />
            </div>
            <h1 className="text-2xl font-semibold">Verify your email</h1>
            <p className="mt-3 text-sm text-muted-foreground">
              We sent a verification link to <span className="font-medium text-foreground">{sentEmail}</span>.
              Open the email and click the link, then come back here to log in.
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              (If you don't see it, check your spam / promotions folder)
            </p>
            <button
              onClick={() => {
                setSentEmail(null);
                setMode("signin");
              }}
              className="btn-brand mt-6 inline-flex items-center gap-2 rounded-md px-5 py-2.5 text-sm font-medium"
            >
              Go to login page
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isSignup = mode === "signup";

  return (
    <div className="grid min-h-screen place-items-center px-4" style={{ background: "var(--gradient-hero)" }}>
      <div className="w-full max-w-md">
        <Link to="/" className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to homepage
        </Link>

        <div className="surface-card p-8">
          <div className="mb-5 flex justify-center">
            <Brand siteName={brand.siteName} logoUrl={brand.logoUrl} />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {mode === "forgot" ? "Reset your password" : isSignup ? "Create a new account" : "Log in"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {mode === "forgot"
              ? "Enter your email or phone number and set a new password."
              : isSignup
              ? "Register with the details below — it only takes a few seconds."
              : "Sign in with your email and password."}
          </p>

          <form onSubmit={onSubmit} className="mt-6 space-y-3">
            {isSignup && (
              <>
                <Field label="Account type">
                  <div className="grid grid-cols-2 gap-2">
                    {(
                      [
                        ["reseller", "Reseller", "I will run my own store"],
                        ["supplier", "Supplier", "I will supply products"],
                      ] as const
                    ).map(([key, label, hint]) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setAccountType(key)}
                        className={
                          "rounded-md border px-3 py-2 text-left text-xs transition-colors " +
                          (accountType === key
                            ? "border-primary bg-primary/5 ring-1 ring-primary"
                            : "hover:bg-muted")
                        }
                      >
                        <span className="block text-sm font-medium">{label}</span>
                        <span className="text-muted-foreground">{hint}</span>
                      </button>
                    ))}
                  </div>
                </Field>

                <Field label="Your name">
                  <input
                    className={inp}
                    placeholder="e.g. John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </Field>
                <Field label="Phone number">
                  <input
                    className={inp}
                    placeholder="01XXXXXXXXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </Field>
              </>
            )}

            <Field label={mode === "forgot" ? "Email or phone number" : "Email"}>
              <input
                type={mode === "forgot" ? "text" : "email"}
                className={inp}
                placeholder={mode === "forgot" ? "you@example.com or 01XXXXXXXXX" : "you@example.com"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Field>

            <Field label={mode === "forgot" ? "New password" : "Password"} hint={isSignup || mode === "forgot" ? "At least 6 characters" : undefined}>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className={`${inp} pr-10`}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={6}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </Field>

            {mode === "forgot" && (
              <Field label="Confirm new password">
                <input
                  type={showPassword ? "text" : "password"}
                  className={inp}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  minLength={6}
                  required
                />
              </Field>
            )}

            {mode === "signin" && (
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setMode("forgot")}
                  className="text-xs font-medium text-muted-foreground hover:text-primary hover:underline"
                >
                  Forgot password?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={busy}
              className="btn-brand flex w-full items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-medium disabled:opacity-50"
            >
              {busy && <Loader2 className="h-4 w-4 animate-spin" />}
              {mode === "forgot" ? "Reset password" : isSignup ? "Register" : "Log in"}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-muted-foreground">
            {mode === "forgot" ? (
              <>
                Remember your password?{" "}
                <button
                  onClick={() => setMode("signin")}
                  className="font-medium text-primary hover:underline"
                >
                  Log in
                </button>
              </>
            ) : isSignup ? (
              <>
                Already have an account?{" "}
                <button
                  onClick={() => setMode("signin")}
                  className="font-medium text-primary hover:underline"
                >
                  Log in
                </button>
              </>
            ) : (
              <>
                New here?{" "}
                <button
                  onClick={() => setMode("signup")}
                  className="font-medium text-primary hover:underline"
                >
                  Register
                </button>
              </>
            )}
          </p>
        </div>
        <p className="mt-6 text-center text-xs text-muted-foreground">
          By signing in, you agree to our terms and privacy policy.
        </p>
      </div>
    </div>
  );
}

const inp = "w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring";

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1 flex items-center justify-between text-xs font-medium">
        <span>{label}</span>
        {hint && <span className="text-muted-foreground">{hint}</span>}
      </label>
      {children}
    </div>
  );
}
