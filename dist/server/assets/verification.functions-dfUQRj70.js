import { t as createServerFn } from "./createServerFn-CIHAFgYl.js";
import { t as createServerRpc } from "./createServerRpc-B90ckaqP.js";
import { t as requireSupabaseAuth } from "./auth-middleware-D4xjf72S.js";
import { z } from "zod";
//#region src/lib/verification.functions.ts?tss-serverfn-split
/** Send a fresh 6-digit code to the signed-in user's email or phone. */
var sendVerificationCode_createServerFn_handler = createServerRpc({
	id: "0e5118af691349ef00122273a3f8e135bb8b024e71022d22ebc7d5586c787732",
	name: "sendVerificationCode",
	filename: "src/lib/verification.functions.ts"
}, (opts) => sendVerificationCode.__executeServer(opts));
var sendVerificationCode = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => z.object({ channel: z.enum(["email", "sms"]) }).parse(d)).handler(sendVerificationCode_createServerFn_handler, async ({ data, context }) => {
	const { pickConfig, sendSms, sendEmail } = await import("./notifications.server-ULDUirAK.js");
	const { supabase, userId, claims } = context;
	const { data: profile } = await supabase.from("profiles").select("full_name, phone").eq("id", userId).maybeSingle();
	const target = data.channel === "email" ? claims?.email ?? "" : profile?.phone ?? "";
	if (!target) return {
		ok: false,
		error: data.channel === "email" ? "No email on this account" : "No phone number on this account"
	};
	let sender = null;
	try {
		const { supabaseAdmin } = await import("./client.server-UkfIcZXu.js");
		sender = await pickConfig(supabaseAdmin, null, data.channel);
	} catch (err) {
		console.error("[verify] elevated sender lookup unavailable", err);
	}
	if (!sender) sender = await pickConfig(supabase, null, data.channel);
	const cfg = sender;
	if (!cfg) return {
		ok: false,
		error: `No active ${data.channel} sender is configured yet`
	};
	const code = String(Math.floor(1e5 + Math.random() * 9e5));
	const { error: issueError } = await supabase.rpc("verify_issue", {
		_channel: data.channel,
		_target: target,
		_code: code
	});
	if (issueError) return {
		ok: false,
		error: issueError.message
	};
	const text = `Your verification code is ${code}. It expires in 15 minutes.`;
	const res = data.channel === "sms" ? await sendSms(cfg, target, text) : await sendEmail(cfg, target, "Your verification code", `<p>Hi ${profile?.full_name || ""},</p><p>Your verification code is <b style="font-size:20px">${code}</b>.</p><p>It expires in 15 minutes.</p>`);
	const logRow = {
		channel: data.channel,
		recipient: target,
		template: "signup_verification",
		status: res.ok ? "sent" : "failed",
		error: res.error || null,
		payload: null
	};
	try {
		const { supabaseAdmin } = await import("./client.server-UkfIcZXu.js");
		await supabaseAdmin.from("notification_logs").insert(logRow);
	} catch {
		await supabase.from("notification_logs").insert(logRow);
	}
	if (!res.ok) return {
		ok: false,
		error: res.error || "Could not send the code"
	};
	return {
		ok: true,
		target: maskTarget(data.channel, target)
	};
});
function maskTarget(channel, value) {
	if (channel === "email") {
		const [user, domain] = value.split("@");
		if (!domain) return value;
		return `${user.slice(0, 2)}${"*".repeat(Math.max(1, user.length - 2))}@${domain}`;
	}
	return `${value.slice(0, 3)}${"*".repeat(Math.max(1, value.length - 6))}${value.slice(-3)}`;
}
//#endregion
export { sendVerificationCode_createServerFn_handler };
