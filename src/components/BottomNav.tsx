import { Link, useRouterState } from "@tanstack/react-router";
import { Home, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BottomNavItem {
  label: string;
  to: string;
  icon: LucideIcon;
  end?: boolean;
  /** Optional count badge shown on the icon. */
  badge?: number;
}

function Badge({ count }: { count: number }) {
  if (!count) return null;
  return (
    <span className="absolute -right-1.5 -top-1.5 grid min-w-4 place-items-center rounded-full bg-destructive px-1 text-[9px] font-bold leading-4 text-destructive-foreground shadow">
      {count > 99 ? "99+" : count}
    </span>
  );
}

export interface BottomNavProps {
  /** Center (home) destination. */
  homeTo: string;
  /** Left-side item. */
  left: BottomNavItem;
  /** Right-side item. */
  right: BottomNavItem;
}

function isActive(currentPath: string, to: string, end?: boolean) {
  if (end) return currentPath === to;
  return currentPath === to || currentPath.startsWith(to + "/");
}

export function BottomNav({ homeTo, left, right }: BottomNavProps) {
  const currentPath = useRouterState({ select: (r) => r.location.pathname });

  const leftActive = isActive(currentPath, left.to, left.end);
  const rightActive = isActive(currentPath, right.to, right.end);
  const homeActive = isActive(currentPath, homeTo, true);

  const LeftIcon = left.icon;
  const RightIcon = right.icon;

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 md:hidden">
      {/* safe-area padding for notched phones */}
        <div className="border-t border-border bg-background/95 backdrop-blur-md pb-[env(safe-area-inset-bottom)]">
        <div className="relative mx-auto flex h-12 max-w-md items-stretch justify-between px-6">
          {/* Left item */}
          <Link
            to={left.to}
            className="flex flex-1 flex-col items-center justify-center gap-0.5 pt-1"
            activeProps={{ "data-active": true }}
          >
            <span
              className={cn(
                "relative grid h-8 w-8 place-items-center rounded-lg transition-colors",
                leftActive
                  ? "bg-primary/15 text-primary"
                  : "text-muted-foreground",
              )}
            >
              <LeftIcon className="h-5 w-5" />
              <Badge count={left.badge ?? 0} />
            </span>
            <span
              className={cn(
                "text-[11px] font-medium leading-none transition-colors",
                leftActive ? "text-primary" : "text-muted-foreground",
              )}
            >
              {left.label}
            </span>
          </Link>

          {/* Center home — elevated round button */}
          <Link
            to={homeTo}
            className="flex w-16 flex-col items-center justify-end"
            activeProps={{ "data-active": true }}
          >
            <span
              className={cn(
                "absolute -top-4 grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-primary to-primary/70 text-primary-foreground shadow-lg ring-4 ring-background transition-transform",
                homeActive ? "scale-105" : "scale-100",
              )}
              style={{ boxShadow: "0 6px 18px -4px color-mix(in oklab, var(--primary) 55%, transparent)" }}
            >
              <Home className="h-5 w-5" />
            </span>
          </Link>

          {/* Right item */}
          <Link
            to={right.to}
            className="flex flex-1 flex-col items-center justify-center gap-0.5 pt-1"
            activeProps={{ "data-active": true }}
          >
            <span
              className={cn(
                "relative grid h-8 w-8 place-items-center rounded-lg transition-colors",
                rightActive
                  ? "bg-primary/15 text-primary"
                  : "text-muted-foreground",
              )}
            >
              <RightIcon className="h-5 w-5" />
              <Badge count={right.badge ?? 0} />
            </span>
            <span
              className={cn(
                "text-[11px] font-medium leading-none transition-colors",
                rightActive ? "text-primary" : "text-muted-foreground",
              )}
            >
              {right.label}
            </span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
