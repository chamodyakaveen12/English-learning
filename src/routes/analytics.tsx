import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/app/AppShell";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis } from "recharts";
import { useStore, today, addDays, minutesFmt, folderPath, folderLabel } from "@/lib/store";

export const Route = createFileRoute("/analytics")({
  head: () => ({
    meta: [
      { title: "Analytics — English Learning OS" },
      { name: "description", content: "Custom breakdowns of your vocabulary, review performance and English time allocation." },
      { property: "og:title", content: "Learning Analytics" },
      { property: "og:description", content: "Break your vocabulary down by any field, and see where your English time goes." },
    ],
  }),
  component: AnalyticsPage,
});

const COLORS = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"];

function AnalyticsPage() {
  const { db } = useStore();
  const [dim, setDim] = useState("folder");

  const breakdown = useMemo(() => {
    const counts = new Map<string, number>();
    db.words.forEach((w) => {
      let key = "Unspecified";
      if (dim === "folder") key = folderPath(db.folders, w.folderId)[0]?.name ?? "Unfiled";
      else if (dim === "subfolder") key = folderLabel(db.folders, w.folderId);
      else if (dim === "difficulty") key = w.difficulty;
      else if (dim === "level") key = w.level;
      else if (dim === "source") key = w.source;
      else if (dim === "date") key = w.createdAt;
      else if (dim === "status") key = w.due <= today() ? "Due" : "Scheduled";
      else if (dim === "tag") key = w.tags[0] ?? "No tag";
      counts.set(key, (counts.get(key) ?? 0) + 1);
    });
    return Array.from(counts, ([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  }, [db.words, db.folders, dim]);

  const timeSplit = useMemo(() => db.activityTypes.map((a) => ({
    name: a.name,
    value: db.logs.filter((l) => l.typeId === a.id).reduce((s, l) => s + l.minutes, 0),
  })).filter((x) => x.value > 0), [db]);

  const trend = useMemo(() => Array.from({ length: 7 }, (_, i) => {
    const d = addDays(today(), i - 6);
    return { day: d.slice(5), words: db.words.filter((w) => w.createdAt === d).length };
  }), [db.words]);

  const minutesIn = (fromISO: string) => db.logs.filter((l) => l.date >= fromISO).reduce((s, l) => s + l.minutes, 0);
  const due = db.words.filter((w) => w.due <= today()).length;
  const completed = db.words.filter((w) => (w.history ?? []).some((h) => h.date === today())).length;
  const rate = due + completed ? Math.round((completed / (due + completed)) * 100) : 0;

  return (
    <AppShell title="Analytics" subtitle="Choose your own breakdown — nothing is predefined.">
      <div className="grid gap-3 sm:grid-cols-3">
        {[["Today", minutesIn(today())], ["This week", minutesIn(addDays(today(), -6))], ["This month", minutesIn(addDays(today(), -29))]].map(([l, v]) => (
          <div key={l as string} className="panel p-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">{l as string}</p>
            <p className="mt-1 font-display text-3xl">{minutesFmt(v as number)}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <div className="panel p-5">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <h2 className="text-xl">Vocabulary breakdown</h2>
            <div className="grid gap-1">
              <Label className="text-[11px] uppercase text-muted-foreground">Break down by</Label>
              <Select value={dim} onValueChange={setDim}>
                <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="folder">Folder</SelectItem>
                  <SelectItem value="subfolder">Subfolder path</SelectItem>
                  <SelectItem value="difficulty">Difficulty</SelectItem>
                  <SelectItem value="level">English level</SelectItem>
                  <SelectItem value="source">Source</SelectItem>
                  <SelectItem value="date">Date collected</SelectItem>
                  <SelectItem value="status">Review status</SelectItem>
                  <SelectItem value="tag">Tag</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="mt-4 h-64">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={breakdown} dataKey="value" nameKey="name" innerRadius={50} outerRadius={90}>
                  {breakdown.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="mt-2 space-y-1 text-sm">
            {breakdown.slice(0, 8).map((b, i) => (
              <li key={b.name} className="flex items-center gap-2">
                <span className="size-2.5 shrink-0 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                <span className="min-w-0 flex-1 truncate" title={b.name}>{b.name}</span>
                <span className="text-muted-foreground">{b.value}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="panel p-5">
          <h2 className="text-xl">English time allocation</h2>
          <div className="mt-4 h-64">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={timeSplit} dataKey="value" nameKey="name" outerRadius={90}>
                  {timeSplit.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <p className="text-sm text-muted-foreground">
            {timeSplit.length ? timeSplit.map((t) => `${t.name} ${t.value}m`).join(" · ") : "Log some activity to see the split."}
          </p>
        </div>

        <div className="panel p-5">
          <h2 className="text-xl">Collection trend (7 days)</h2>
          <div className="mt-4 h-56">
            <ResponsiveContainer>
              <BarChart data={trend}>
                <XAxis dataKey="day" stroke="var(--muted-foreground)" fontSize={12} />
                <YAxis allowDecimals={false} stroke="var(--muted-foreground)" fontSize={12} />
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }} />
                <Bar dataKey="words" fill="var(--chart-1)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="panel p-5">
          <h2 className="text-xl">Review completion</h2>
          <ul className="mt-3 space-y-2 text-sm">
            <li className="flex justify-between"><span>Due today</span><span>{due + completed}</span></li>
            <li className="flex justify-between"><span>Completed</span><span>{completed}</span></li>
            <li className="flex justify-between"><span>Remaining</span><span>{due}</span></li>
            <li className="flex justify-between"><span>Completion rate</span><span>{rate}%</span></li>
          </ul>
          <div className="mt-3 h-2 rounded-full bg-secondary">
            <div className="h-full rounded-full bg-primary" style={{ width: `${rate}%` }} />
          </div>
        </div>
      </div>
    </AppShell>
  );
}