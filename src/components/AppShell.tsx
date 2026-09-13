import { Link, useRouterState } from "@tanstack/react-router";
import {
  LogOut,
  ChevronRight,
  ChevronDown,
  Menu,
  X,
  PanelLeftClose,
  PanelLeftOpen,
  ExternalLink,
  Search,
} from "lucide-react";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/laravel/client";
import { ResellerAvatar } from "@/components/reseller-avatar";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { clearImpersonation } from "@/lib/impersonation";
import { PwaInstallButton } from "@/components/pwa-install";
import { BottomNav, type BottomNavProps } from "@/components/BottomNav";

export interface NavItem {
  label: string;
  to: string;
  icon: ReactNode;
  end?: boolean;
  /** Open in a new browser tab instead of client-side navigation. */
  external?: boolean;
  /** Optional count badge shown next to the label (e.g. actionable orders). */
  badge?: number;
}

export interface NavGroup {
  label: string;
  icon: ReactNode;
  items: NavItem[];
}

export type NavEntry = NavItem | NavGroup;

function isGroup(entry: NavEntry): entry is NavGroup {
  return (entry as NavGroup).items !== undefined;
}

export function AppShell({
  title,
  brand,
  nav,
  user,
  headerRight,
  homeTo = "/dashboard",
  bottomNav,
  /** Extra links shown only in the mobile drawer, above Sign out. */
  mobileFooterLinks,
  children,
}: {
  title: string;
  brand: { name: string; sub?: string; logoUrl?: string | null };
  nav: NavEntry[];
  user: { name: string; email: string; avatarUrl?: string | null };
  headerRight?: ReactNode;
  mobileFooterLinks?: { label: string; to: string; icon: ReactNode; external?: boolean }[];
  /** Panel dashboard URL — logo and user name link here. */
  homeTo?: string;
  /** Optional mobile bottom navigation bar (3 items: left, center home, right). */
  bottomNav?: BottomNavProps;
  children: ReactNode;
}) {
  const currentPath = useRouterState({ select: (r) => r.location.pathname });
  const [searchQuery, setSearchQuery] = useState("");

  const activeGroupIdx = useMemo(() => {
    for (let i = 0; i < nav.length; i++) {
      const e = nav[i];
      if (
        isGroup(e) &&
        e.items.some(
          (it) => currentPath === it.to || (!it.end && currentPath.startsWith(it.to + "/")),
        )
      ) {
        return i;
      }
    }
    return -1;
  }, [nav, currentPath]);

  const [openIdx, setOpenIdx] = useState<number>(activeGroupIdx);
  useEffect(() => {
    if (activeGroupIdx !== -1) setOpenIdx(activeGroupIdx);
  }, [activeGroupIdx]);

  const [mobileOpen, setMobileOpen] = useState(false);
  useEffect(() => {
    setMobileOpen(false);
  }, [currentPath]);

  const [desktopCollapsed, setDesktopCollapsed] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return window.localStorage.getItem("appshell:collapsed") === "1";
  });
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("appshell:collapsed", desktopCollapsed ? "1" : "0");
    }
  }, [desktopCollapsed]);

  // Filter navigation items by search query if typed
  const filteredNav = useMemo(() => {
    if (!searchQuery.trim()) return nav;
    const q = searchQuery.toLowerCase();
    return nav
      .map((entry) => {
        if (!isGroup(entry)) {
          return entry.label.toLowerCase().includes(q) ? entry : null;
        }
        const matchedItems = entry.items.filter((it) => it.label.toLowerCase().includes(q));
        if (matchedItems.length > 0) {
          return { ...entry, items: matchedItems };
        }
        return entry.label.toLowerCase().includes(q) ? entry : null;
      })
      .filter(Boolean) as NavEntry[];
  }, [nav, searchQuery]);

  const renderSidebar = (collapsed: boolean, isMobile = false) => (
    <div className="flex h-full flex-col bg-card/95 backdrop-blur-xl border-r border-border/60">
      {/* Brand Header */}
      <div
        className={cn(
          "flex h-16 items-center gap-3 border-b border-border/50 px-4 transition-all",
          collapsed && "justify-center px-2",
        )}
      >
        <Link
          to={homeTo}
          title={brand.name}
          className={cn("flex min-w-0 flex-1 items-center gap-3 group", collapsed && "justify-center")}
        >
          {brand.logoUrl ? (
            <img
              src={brand.logoUrl}
              alt={brand.name}
              className={cn("object-contain transition-transform group-hover:scale-105", collapsed ? "h-8 w-8" : "h-9 max-h-10 w-auto max-w-[140px]")}
            />
          ) : (
            <div
              className={cn(
                "grid shrink-0 place-items-center rounded-xl bg-gradient-to-br from-primary via-primary/90 to-primary/70 font-bold text-primary-foreground shadow-md shadow-primary/20",
                collapsed ? "h-9 w-9 text-base" : "h-9 w-9 text-base",
              )}
            >
              {brand.name.charAt(0)}
            </div>
          )}
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
                {brand.name}
              </div>
              {brand.sub && (
                <div className="truncate text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                  {brand.sub}
                </div>
              )}
            </div>
          )}
        </Link>
        {!collapsed && isMobile && (
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Quick Search inside Sidebar */}
      {!collapsed && (
        <div className="px-3 pt-3 pb-1">
          <div className="relative flex items-center">
            <Search className="absolute left-2.5 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              placeholder="Quick search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-border/60 bg-muted/40 pl-8 pr-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:bg-background focus:outline-none focus:ring-1 focus:ring-primary/40 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2 text-xs text-muted-foreground hover:text-foreground"
              >
                ×
              </button>
            )}
          </div>
        </div>
      )}

      {/* Navigation Links */}
      <nav className={cn("flex-1 overflow-y-auto px-3 py-2 space-y-1 no-scrollbar")}>
        {filteredNav.map((entry, idx) => {
          if (!isGroup(entry)) {
            return <LeafLink key={entry.to} item={entry} collapsed={collapsed} />;
          }
          const isOpen = openIdx === idx && !collapsed;
          const hasActive = entry.items.some(
            (it) => currentPath === it.to || (!it.end && currentPath.startsWith(it.to + "/")),
          );
          if (collapsed) {
            return (
              <button
                key={entry.label}
                type="button"
                onClick={() => {
                  setDesktopCollapsed(false);
                  setOpenIdx(idx);
                }}
                title={entry.label}
                className={cn(
                  "mb-1 flex w-full items-center justify-center rounded-xl p-2.5 text-muted-foreground hover:bg-primary/10 hover:text-primary transition-all",
                  hasActive && "bg-primary/15 text-primary font-semibold shadow-sm",
                )}
              >
                {entry.icon}
              </button>
            );
          }
          return (
            <div key={entry.label} className="mb-0.5">
              <button
                type="button"
                onClick={() => setOpenIdx(isOpen ? -1 : idx)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl px-3 py-2 text-xs font-semibold text-foreground/80 transition-all hover:bg-muted/70 hover:text-foreground",
                  hasActive && "bg-primary/10 text-primary font-bold shadow-xs",
                )}
                aria-expanded={isOpen}
              >
                <span className={cn("transition-colors", hasActive ? "text-primary" : "text-muted-foreground")}>
                  {entry.icon}
                </span>
                <span className="flex-1 text-left truncate">{entry.label}</span>
                <ChevronDown
                  className={cn(
                    "h-3.5 w-3.5 transition-transform duration-200",
                    hasActive ? "text-primary" : "text-muted-foreground/70",
                    isOpen ? "rotate-0" : "-rotate-90",
                  )}
                />
              </button>
              {isOpen && (
                <div className="mt-0.5 ml-3 border-l-2 border-primary/20 pl-2 space-y-0.5 py-0.5">
                  {entry.items.map((it) => (
                    <LeafLink key={it.to} item={it} nested collapsed={false} />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* User Profile & Footer */}
      <div className={cn("border-t border-border/50 p-3 bg-muted/20")}>
        {isMobile && !collapsed && mobileFooterLinks && mobileFooterLinks.length > 0 && (
          <div className="mb-2 space-y-1 border-b border-border/40 pb-2">
            {mobileFooterLinks.map((l) =>
              l.external ? (
                <a
                  key={l.to}
                  href={l.to}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 rounded-lg px-2 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                >
                  {l.icon}
                  <span className="flex-1">{l.label}</span>
                  <ExternalLink className="h-3.5 w-3.5 opacity-40" />
                </a>
              ) : (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 rounded-lg px-2 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                >
                  {l.icon}
                  <span className="flex-1">{l.label}</span>
                </Link>
              ),
            )}
          </div>
        )}
        {!collapsed && (
          <div className="mb-2 flex items-center gap-2.5 rounded-xl bg-card/60 p-2 border border-border/40 shadow-xs">
            <div className="relative">
              <ResellerAvatar url={user.avatarUrl} name={user.name} size={34} />
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-card" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-xs font-bold text-foreground">
                {user.name}
              </div>
              <div className="truncate text-[11px] text-muted-foreground">{user.email}</div>
            </div>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          title="Sign out"
          onClick={async () => {
            clearImpersonation();
            await supabase.auth.signOut();
            window.location.href = "/login";
          }}
          className={cn(
            "rounded-lg text-xs font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors",
            collapsed ? "w-full justify-center px-0 h-9" : "flex w-full justify-start gap-2",
          )}
        >
          <LogOut className="h-3.5 w-3.5" /> {!collapsed && "Sign out"}
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20 selection:text-primary">
      <div className="flex">
        {/* Desktop Sidebar */}
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-40 hidden flex-col transition-[width] duration-250 ease-in-out md:flex shadow-xs",
            desktopCollapsed ? "w-16" : "w-64",
          )}
        >
          {renderSidebar(desktopCollapsed)}
        </aside>

        {/* Mobile drawer overlay */}
        {mobileOpen && (
          <div
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-md transition-opacity md:hidden"
            onClick={() => setMobileOpen(false)}
            aria-hidden
          />
        )}
        {/* Mobile drawer */}
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-50 flex w-72 max-w-[85vw] flex-col shadow-2xl transition-transform duration-250 ease-out md:hidden",
            mobileOpen ? "translate-x-0" : "-translate-x-full",
          )}
        >
          {renderSidebar(false, true)}
        </aside>

        {/* Main Content Area */}
        <main
          className={cn(
            "min-w-0 max-w-full flex-1 overflow-x-hidden transition-[margin] duration-250 ease-in-out",
            desktopCollapsed ? "md:ml-16" : "md:ml-64",
          )}
        >
          {/* Header */}
          <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border/60 bg-background/85 px-4 backdrop-blur-xl md:px-6 shadow-xs">
            <div className="flex flex-1 items-center gap-2 overflow-hidden">
              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                className="md:hidden -ml-1 rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => setDesktopCollapsed((v) => !v)}
                className="hidden md:inline-flex -ml-1 rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                aria-label={desktopCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                title={desktopCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                {desktopCollapsed ? (
                  <PanelLeftOpen className="h-4 w-4" />
                ) : (
                  <PanelLeftClose className="h-4 w-4" />
                )}
              </button>
              <Link
                to={homeTo}
                title="Go to dashboard"
                className="flex min-w-0 items-center gap-2 rounded-lg px-2 py-1 transition-colors hover:bg-muted/60"
              >
                {brand.logoUrl ? (
                  <img
                    src={brand.logoUrl}
                    alt={brand.name}
                    className="md:hidden h-7 w-auto max-w-[130px] object-contain"
                  />
                ) : (
                  <span className="truncate text-sm font-bold tracking-tight md:hidden">
                    {title}
                  </span>
                )}
              </Link>
            </div>
            <div className="flex items-center gap-2">
              <PwaInstallButton />
              {headerRight}
            </div>
          </header>

          {/* Page Content */}
          <div className="p-4 pb-24 md:p-6 md:pb-8 max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
      {bottomNav && (
        <BottomNav homeTo={bottomNav.homeTo} left={bottomNav.left} right={bottomNav.right} />
      )}
    </div>
  );
}

function LeafLink({
  item,
  nested = false,
  collapsed = false,
}: {
  item: NavItem;
  nested?: boolean;
  collapsed?: boolean;
}) {
  if (item.external) {
    return (
      <a
        href={item.to}
        target="_blank"
        rel="noreferrer"
        title={item.label}
        className={cn(
          "group mb-0.5 flex items-center rounded-xl text-muted-foreground transition-all hover:bg-muted/70 hover:text-foreground",
          collapsed ? "justify-center p-2.5" : "gap-3 px-3 py-2 text-xs font-medium",
          !collapsed && nested && "py-1.5 text-[12px]",
        )}
      >
        <span className="text-current shrink-0">{item.icon}</span>
        {collapsed ? null : (
          <>
            <span className="flex-1 truncate">{item.label}</span>
            <ExternalLink className="h-3 w-3 opacity-40 group-hover:opacity-80 transition-opacity" />
          </>
        )}
      </a>
    );
  }
  if (collapsed) {
    return (
      <Link
        to={item.to}
        activeOptions={{ exact: item.end }}
        title={item.label}
        className="relative mb-0.5 flex items-center justify-center rounded-xl p-2.5 text-muted-foreground transition-all hover:bg-primary/10 hover:text-primary"
        activeProps={{ className: "bg-primary text-primary-foreground font-bold shadow-md shadow-primary/20" }}
      >
        {item.icon}
        {!!item.badge && (
          <span className="absolute right-1 top-1 grid min-w-4 place-items-center rounded-full bg-destructive px-1 text-[9px] font-bold leading-4 text-destructive-foreground shadow-xs">
            {item.badge > 99 ? "99+" : item.badge}
          </span>
        )}
      </Link>
    );
  }
  return (
    <Link
      to={item.to}
      activeOptions={{ exact: item.end }}
      className={cn(
        "group mb-0.5 flex items-center gap-3 rounded-xl px-3 py-2 text-xs transition-all",
        nested
          ? "py-1.5 text-[12px] font-medium text-muted-foreground hover:bg-muted/50 hover:text-foreground"
          : "font-semibold text-foreground/80 hover:bg-muted/70 hover:text-foreground",
      )}
      activeProps={{
        className: nested
          ? "bg-primary/10 text-primary font-semibold border-l-2 border-primary pl-2"
          : "bg-primary/10 text-primary font-bold shadow-xs",
      }}
    >
      <span className="text-current shrink-0 transition-transform group-hover:scale-105">{item.icon}</span>
      <span className="flex-1 truncate">{item.label}</span>
      {!!item.badge && (
        <span className="grid min-w-5 place-items-center rounded-full bg-destructive px-1.5 text-[10px] font-bold leading-5 text-destructive-foreground shadow-xs animate-pulse">
          {item.badge > 99 ? "99+" : item.badge}
        </span>
      )}
      <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-70 transition-opacity" />
    </Link>
  );
}
