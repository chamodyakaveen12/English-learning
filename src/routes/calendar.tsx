import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/app/AppShell";
import { Button } from "@/components/ui/button";
import { useStore, today, folderLabel, minutesFmt } from "@/lib/store";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/calendar")({
  head: () => ({
    meta: [
      { title: "Calendar — English Learning OS" },
      { name: "description", content: "Your English learning history day by day: words collected, reviews due and study time." },
      { property: "og:title", content: "Learning Calendar" },
      { property: "og:description", content: "Words collected, reviews due and study minutes on every day." },
    ],
  }),
  component: CalendarPage,
});

function CalendarPage() {
  const { db } = useStore();
  const now = new Date();
  const [ym, setYm] = useState({ y: now.getFullYear(), m: now.getMonth() });
  const [selected, setSelected] = useState(today());

  const days = useMemo(() => {
    const first = new Date(ym.y, ym.m, 1);
    const start = new Date(first);
    start.setDate(1 - ((first.getDay() + 6) % 7));
    return Array.from({ length: 42 }, (_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      return { iso, day: d.getDate(), inMonth: d.getMonth() === ym.m };
    });
  }, [ym]);

  const stats = (iso: string) => ({
    collected: db.words.filter((w) => w.createdAt === iso).length,
    due: db.words.filter((w) => w.due === iso).length,
    minutes: db.logs.filter((l) => l.date === iso).reduce((s, l) => s + l.minutes, 0),
  });

  const sel = stats(selected);
  const monthName = new Date(ym.y, ym.m).toLocaleString("en", { month: "long", year: "numeric" });
  const months = Array.from({ length: 12 }, (_, i) => new Date(2000, i).toLocaleString("en", { month: "long" }));

  return (
    <AppShell title="Calendar" subtitle="One calendar for words, reviews and study activity.">
      <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
        <div className="panel p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-xl">{monthName}</h2>
            <div className="flex gap-1">
              <Button size="icon" variant="ghost" aria-label="Previous month"
                onClick={() => setYm(({ y, m }) => (m === 0 ? { y: y - 1, m: 11 } : { y, m: m - 1 }))}><ChevronLeft className="size-4" /></Button>
              <Button size="icon" variant="ghost" aria-label="Next month"
                onClick={() => setYm(({ y, m }) => (m === 11 ? { y: y + 1, m: 0 } : { y, m: m + 1 }))}><ChevronRight className="size-4" /></Button>
            </div>
          </div>
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <select aria-label="Jump to month" value={ym.m}
              onChange={(e) => setYm((p) => ({ ...p, m: Number(e.target.value) }))}
              className="h-9 rounded-md border border-border bg-background px-2 text-sm">
              {months.map((mn, i) => <option key={mn} value={i}>{mn}</option>)}
            </select>
            <Input type="number" aria-label="Jump to year" className="h-9 w-24" value={ym.y}
              onChange={(e) => setYm((p) => ({ ...p, y: Number(e.target.value) || p.y }))} />
            <Input type="date" aria-label="Jump to date" className="h-9 w-44" value={selected}
              onChange={(e) => {
                const iso = e.target.value;
                if (!iso) return;
                setSelected(iso);
                const d = new Date(iso + "T00:00:00");
                setYm({ y: d.getFullYear(), m: d.getMonth() });
              }} />
            <Button size="sm" variant="secondary" onClick={() => {
              const t = today();
              setSelected(t);
              const d = new Date(t + "T00:00:00");
              setYm({ y: d.getFullYear(), m: d.getMonth() });
            }}>Today</Button>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center text-[11px] uppercase text-muted-foreground">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => <div key={d}>{d}</div>)}
          </div>
          <div className="mt-1 grid grid-cols-7 gap-1">
            {days.map((d) => {
              const s = stats(d.iso);
              return (
                <button key={d.iso} onClick={() => setSelected(d.iso)}
                  className={`h-[70px] rounded-lg border p-1 text-left text-xs transition-colors ${
                    selected === d.iso ? "border-primary bg-primary/10" : "border-border hover:bg-secondary/60"
                  } ${d.inMonth ? "" : "opacity-40"}`}>
                  <span className={d.iso === today() ? "font-semibold text-primary" : ""}>{d.day}</span>
                  <span className="mt-1 flex flex-col gap-0.5">
                    {s.collected ? <span className="text-accent">● {s.collected} new</span> : null}
                    {s.due ? <span className="text-primary">● {s.due} due</span> : null}
                    {s.minutes ? <span className="text-muted-foreground">● {s.minutes}m</span> : null}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
        <div className="panel p-4">
          <h2 className="text-xl">{selected}</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {sel.collected} collected · {sel.due} due · {minutesFmt(sel.minutes)} studied
          </p>
          <h3 className="mt-4 text-sm uppercase tracking-wide text-muted-foreground">Words collected</h3>
          <ul className="mt-2 space-y-1 text-sm">
            {db.words.filter((w) => w.createdAt === selected).map((w) => (
              <li key={w.id} className="truncate" title={folderLabel(db.folders, w.folderId)}>
                <span className="font-medium">{w.word}</span> <span className="text-muted-foreground">— {folderLabel(db.folders, w.folderId)}</span>
              </li>
            ))}
            {sel.collected === 0 ? <li className="text-muted-foreground">None</li> : null}
          </ul>
          <h3 className="mt-4 text-sm uppercase tracking-wide text-muted-foreground">Study activity</h3>
          <ul className="mt-2 space-y-1 text-sm">
            {db.logs.filter((l) => l.date === selected).map((l) => (
              <li key={l.id}>{db.activityTypes.find((a) => a.id === l.typeId)?.name ?? "Activity"}: {l.minutes} min</li>
            ))}
            {sel.minutes === 0 ? <li className="text-muted-foreground">Nothing logged</li> : null}
          </ul>
        </div>
      </div>
    </AppShell>
  );
}