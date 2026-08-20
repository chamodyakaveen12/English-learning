import { Link, useNavigate } from "@tanstack/react-router";
import type { ReactNode } from "react";
import {
  LayoutDashboard,
  Library,
  FolderTree,
  Network,
  CalendarDays,
  RotateCcw,
  Timer,
  Sprout,
  PieChart,
  Settings2,
  LogOut,
} from "lucide-react";
import { useStore, today } from "@/lib/store";
import { ReviewReminder } from "./ReviewReminder";

const nav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/library", label: "Word Library", icon: Library },
  { to: "/folders", label: "Folders", icon: FolderTree },
  { to: "/mindmap", label: "Mind Map", icon: Network },
  { to: "/calendar", label: "Calendar", icon: CalendarDays },
  { to: "/review", label: "Review", icon: RotateCcw },
  { to: "/activity", label: "Activity", icon: Timer },
  { to: "/focus", label: "Focus", icon: Sprout },
  { to: "/analytics", label: "Analytics", icon: PieChart },
  { to: "/settings", label: "Customization", icon: Settings2 },
] as const;

export function AppShell({ title, subtitle, children }: { title: string; subtitle?: string; children: ReactNode }) {
  const { db, logout } = useStore();
  const navigate = useNavigate();
  const due = db.words.filter((w) => w.due <= today()).length;

  const handleLogout = () => {
    logout();
    navigate({ to: "/login" });
  };

  return (
    <div className="min-h-screen lg:flex">
      <aside className="lg:sticky lg:top-0 lg:h-screen lg:w-60 shrink-0 border-b border-border bg-sidebar/80 backdrop-blur lg:border-b-0 lg:border-r flex flex-col">
        <div className="flex items-center gap-2 px-5 py-5">
          <span className="grid size-8 place-items-center rounded-lg bg-primary text-primary-foreground font-display text-lg">E</span>
          <div className="leading-tight">
            <p className="font-display text-base">English OS</p>
            <p className="text-[11px] text-muted-foreground">personal learning system</p>
          </div>
        </div>

        <nav className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-col lg:overflow-visible flex-1">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              activeOptions={{ exact: n.to === "/" }}
              activeProps={{ className: "bg-sidebar-accent text-sidebar-accent-foreground" }}
              className="flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            >
              <n.icon className="size-4" />
              <span>{n.label}</span>
              {n.to === "/review" && due > 0 ? (
                <span className="ml-auto rounded-full bg-primary px-1.5 text-[11px] text-primary-foreground">{due}</span>
              ) : null}
            </Link>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="px-3 pb-5 mt-auto">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-400 transition-colors hover:bg-red-500/10 hover:text-red-300"
          >
            <LogOut className="size-4" />
            <span>Log out</span>
          </button>
        </div>
      </aside>

      <main className="min-w-0 flex-1 px-5 py-7 lg:px-9">
        <header className="mb-6">
          <h1 className="text-3xl">{title}</h1>
          {subtitle ? <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p> : null}
        </header>
        {children}
      </main>
      <ReviewReminder />
    </div>
  );
}