import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/app/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useStore, uid, today, minutesFmt } from "@/lib/store";
import { Plus, Trash2 } from "lucide-react";

export const Route = createFileRoute("/activity")({
  head: () => ({
    meta: [
      { title: "Activity Tracker — English Learning OS" },
      { name: "description", content: "Log reading, writing, speaking, listening, vocabulary or your own custom English activities, hour by hour." },
      { property: "og:title", content: "English Activity Tracker" },
      { property: "og:description", content: "Daily minutes plus a 24-hour day planner feeding straight into analytics." },
    ],
  }),
  component: ActivityPage,
});

function ActivityPage() {
  const { db, update } = useStore();
  const [date, setDate] = useState(today());
  const [typeId, setTypeId] = useState(db.activityTypes[0]?.id ?? "");
  const [minutes, setMinutes] = useState("30");
  const [newType, setNewType] = useState("");

  const logs = db.logs.filter((l) => l.date === date);
  const total = logs.reduce((s, l) => s + l.minutes, 0);
  const blocks = db.blocks.filter((b) => b.date === date);

  return (
    <AppShell title="Activity Tracker" subtitle="Every minute you log here flows into the calendar and analytics.">
      <div className="panel mb-5 flex flex-wrap items-end gap-3 p-4">
        <div className="grid gap-1"><Label className="text-[11px] uppercase text-muted-foreground">Date</Label>
          <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} /></div>
        <div className="grid gap-1"><Label className="text-[11px] uppercase text-muted-foreground">Activity</Label>
          <Select value={typeId} onValueChange={setTypeId}>
            <SelectTrigger className="min-w-[180px]"><SelectValue /></SelectTrigger>
            <SelectContent>{db.activityTypes.map((a) => <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>)}</SelectContent>
          </Select></div>
        <div className="grid gap-1"><Label className="text-[11px] uppercase text-muted-foreground">Minutes</Label>
          <Input type="number" className="w-28" value={minutes} onChange={(e) => setMinutes(e.target.value)} /></div>
        <Button onClick={() => {
          const m = Number(minutes);
          if (!typeId || !m) return;
          update((d) => d.logs.push({ id: uid(), date, typeId, minutes: m }));
        }}><Plus className="size-4" /> Log time</Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
        <div className="panel p-4">
          <h2 className="text-xl">{date} — {minutesFmt(total)}</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {db.activityTypes.map((a) => {
              const m = logs.filter((l) => l.typeId === a.id).reduce((s, l) => s + l.minutes, 0);
              if (!m) return null;
              return (
                <li key={a.id}>
                  <div className="flex justify-between"><span>{a.name}</span><span className="text-muted-foreground">{m} min</span></div>
                  <div className="mt-1 h-1.5 rounded-full bg-secondary">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${total ? (m / total) * 100 : 0}%` }} />
                  </div>
                </li>
              );
            })}
            {total === 0 ? <li className="text-muted-foreground">Nothing logged for this day.</li> : null}
          </ul>

          <h3 className="mt-5 text-sm uppercase tracking-wide text-muted-foreground">Entries</h3>
          <ul className="mt-2 space-y-1 text-sm">
            {logs.map((l) => (
              <li key={l.id} className="flex items-center gap-2">
                <span className="flex-1 truncate">{db.activityTypes.find((a) => a.id === l.typeId)?.name} · {l.minutes} min{l.note ? ` · ${l.note}` : ""}</span>
                <Button size="icon" variant="ghost" aria-label="Delete entry"
                  onClick={() => update((d) => { d.logs = d.logs.filter((x) => x.id !== l.id); })}><Trash2 className="size-3.5" /></Button>
              </li>
            ))}
          </ul>

          <h3 className="mt-5 text-sm uppercase tracking-wide text-muted-foreground">Custom activities</h3>
          <div className="mt-2 flex flex-wrap gap-2">
            {db.activityTypes.map((a) => (
              <span key={a.id} className="flex items-center gap-1 rounded-full bg-secondary px-2 py-1 text-xs">
                {a.name}
                <button aria-label={`Delete ${a.name}`} className="text-muted-foreground hover:text-destructive"
                  onClick={() => update((d) => { d.activityTypes = d.activityTypes.filter((x) => x.id !== a.id); })}>×</button>
              </span>
            ))}
          </div>
          <div className="mt-2 flex gap-2">
            <Input value={newType} onChange={(e) => setNewType(e.target.value)} placeholder="Add activity (e.g. Shadowing)" />
            <Button variant="secondary" onClick={() => {
              if (!newType.trim()) return;
              update((d) => d.activityTypes.push({ id: uid(), name: newType.trim() }));
              setNewType("");
            }}>Add</Button>
          </div>
        </div>

        <div className="panel p-4">
          <h2 className="text-xl">24-hour tracker</h2>
          <p className="text-sm text-muted-foreground">Assign each hour. English hours count towards your totals.</p>
          <div className="mt-3 max-h-[520px] space-y-1 overflow-y-auto pr-1">
            {Array.from({ length: 24 }, (_, h) => {
              const block = blocks.find((b) => b.hour === h);
              return (
                <div key={h} className="flex items-center gap-2">
                  <span className="w-12 shrink-0 text-xs text-muted-foreground">{String(h).padStart(2, "0")}:00</span>
                  <Input className="h-8 flex-1" placeholder="—" defaultValue={block?.label ?? ""}
                    onBlur={(e) => {
                      const label = e.target.value;
                      update((d) => {
                        const ex = d.blocks.find((b) => b.date === date && b.hour === h);
                        if (ex) ex.label = label;
                        else d.blocks.push({ id: uid(), date, hour: h, label, typeId: null });
                      });
                    }} />
                  <Select value={block?.typeId ?? "none"} onValueChange={(v) => update((d) => {
                    const tid = v === "none" ? null : v;
                    const ex = d.blocks.find((b) => b.date === date && b.hour === h);
                    if (ex) ex.typeId = tid;
                    else d.blocks.push({ id: uid(), date, hour: h, label: "", typeId: tid });
                    d.logs = d.logs.filter((l) => !(l.date === date && l.id === `blk-${date}-${h}`));
                    if (tid) d.logs.push({ id: `blk-${date}-${h}`, date, typeId: tid, minutes: 60, note: "24h tracker" });
                  })}>
                    <SelectTrigger className="h-8 w-36 shrink-0"><SelectValue placeholder="Not English" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Not English</SelectItem>
                      {db.activityTypes.map((a) => <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </AppShell>
  );
}