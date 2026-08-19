import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/app/AppShell";
import { Button } from "@/components/ui/button";
import { useStore, today, addDays, minutesFmt, folderLabel } from "@/lib/store";
import { useState } from "react";
import { WordDialog } from "@/components/app/WordDialog";
import { Plus } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — Personal English Learning OS" },
      { name: "description", content: "Collect words, organise them in your own folders, review with spaced repetition and track your English habits." },
      { property: "og:title", content: "Personal English Learning OS" },
      { property: "og:description", content: "One connected system for vocabulary, folders, mind maps, review and habit analytics." },
    ],
  }),
  component: Dashboard,
});

function Stat({ label, value, hint }: { label: string; value: string | number; hint?: string }) {
  return (
    <div className="panel p-4">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-1 font-display text-3xl">{value}</p>
      {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

function Dashboard() {
  const { db } = useStore();
  const [open, setOpen] = useState(false);
  const weekAgo = addDays(today(), -7);
  const newThisWeek = db.words.filter((w) => w.createdAt >= weekAgo).length;
  const due = db.words.filter((w) => w.due <= today());
  const reviewedToday = db.words.filter((w) => (w.history ?? []).some((h) => h.date === today())).length;
  const minutesToday = db.logs.filter((l) => l.date === today()).reduce((s, l) => s + l.minutes, 0);

  return (
    <AppShell title="Your English at a glance" subtitle="Everything below reads from one central word database.">
      <div className="mb-6 flex flex-wrap gap-2">
        <Button onClick={() => setOpen(true)}>
          <Plus className="size-4" /> Quick add word
        </Button>
        <Button variant="secondary" asChild><Link to="/review">Review {due.length} due</Link></Button>
        <Button variant="ghost" asChild><Link to="/focus">Start focus session</Link></Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Total words" value={db.words.length} />
        <Stat label="New this week" value={newThisWeek} />
        <Stat label="Reviewed today" value={reviewedToday} />
        <Stat label="English time today" value={minutesFmt(minutesToday)} />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="panel p-5">
          <h2 className="text-xl">Latest words</h2>
          <ul className="mt-3 space-y-3">
            {db.words.slice(0, 6).map((w) => (
              <li key={w.id} className="border-b border-border/60 pb-2 last:border-0">
                <div className="flex items-baseline justify-between gap-3">
                  <span className="font-medium">{w.word}</span>
                  <span className="shrink-0 text-xs text-muted-foreground">{w.createdAt}</span>
                </div>
                <p className="truncate text-sm text-muted-foreground" title={w.meaning}>{w.meaning}</p>
                <p className="mt-0.5 truncate text-xs text-accent" title={folderLabel(db.folders, w.folderId)}>
                  {folderLabel(db.folders, w.folderId)}
                </p>
              </li>
            ))}
            {db.words.length === 0 ? <li className="text-sm text-muted-foreground">No words yet — add your first.</li> : null}
          </ul>
        </div>
        <div className="panel p-5">
          <h2 className="text-xl">Due for review</h2>
          <ul className="mt-3 space-y-2">
            {due.slice(0, 8).map((w) => (
              <li key={w.id} className="flex items-center justify-between gap-3 text-sm">
                <span className="truncate">{w.word}</span>
                <span className="shrink-0 rounded-full bg-secondary px-2 py-0.5 text-xs text-muted-foreground">{w.difficulty}</span>
              </li>
            ))}
            {due.length === 0 ? <li className="text-sm text-muted-foreground">Nothing due. Nice work.</li> : null}
          </ul>
        </div>
      </div>
      <WordDialog open={open} onOpenChange={setOpen} />
    </AppShell>
  );
}
