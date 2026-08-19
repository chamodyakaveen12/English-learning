import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { AppShell } from "@/components/app/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useStore, uid, today, minutesFmt } from "@/lib/store";

export const Route = createFileRoute("/focus")({
  head: () => ({
    meta: [
      { title: "Focus — English Learning OS" },
      { name: "description", content: "Forest-style focus sessions that automatically log your English study time everywhere." },
      { property: "og:title", content: "Focus Sessions" },
      { property: "og:description", content: "Grow a session, finish it, and the minutes land in your tracker and analytics." },
    ],
  }),
  component: FocusPage,
});

function FocusPage() {
  const { db, update } = useStore();
  const [typeId, setTypeId] = useState(db.activityTypes[0]?.id ?? "");
  const [task, setTask] = useState("Vocabulary review");
  const [duration, setDuration] = useState(25);
  const [left, setLeft] = useState(0);
  const [running, setRunning] = useState(false);
  const doneRef = useRef(false);

  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => setLeft((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, [running]);

  useEffect(() => {
    if (running && left === 0 && !doneRef.current) {
      doneRef.current = true;
      setRunning(false);
      update((d) => d.logs.push({ id: uid(), date: today(), typeId, minutes: duration, note: `Focus: ${task}` }));
    }
  }, [left, running, duration, typeId, task, update]);

  const start = () => { doneRef.current = false; setLeft(duration * 60); setRunning(true); };
  const cancel = () => { setRunning(false); setLeft(0); };

  const sessions = db.logs.filter((l) => l.note?.startsWith("Focus:"));
  const totalFocus = sessions.reduce((s, l) => s + l.minutes, 0);
  const pct = running && duration ? 1 - left / (duration * 60) : 0;

  return (
    <AppShell title="Focus" subtitle="Complete a session and the time is logged automatically.">
      <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
        <div className="panel p-6 text-center">
          <div className="mx-auto grid size-48 place-items-center rounded-full"
            style={{ background: `conic-gradient(var(--primary) ${pct * 360}deg, var(--secondary) 0deg)` }}>
            <div className="grid size-40 place-items-center rounded-full bg-card">
              <span className="font-display text-4xl">
                {String(Math.floor(left / 60)).padStart(2, "0")}:{String(left % 60).padStart(2, "0")}
              </span>
            </div>
          </div>
          <div className="mt-6 grid gap-3 text-left">
            <div className="grid gap-1"><Label>Task</Label><Input value={task} onChange={(e) => setTask(e.target.value)} /></div>
            <div className="grid gap-1"><Label>Counts as</Label>
              <Select value={typeId} onValueChange={setTypeId}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>{db.activityTypes.map((a) => <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>)}</SelectContent>
              </Select></div>
            <div className="grid gap-1"><Label>Duration (minutes)</Label>
              <Input type="number" value={duration} onChange={(e) => setDuration(Number(e.target.value) || 1)} /></div>
          </div>
          <div className="mt-5 flex justify-center gap-2">
            {running ? <Button variant="ghost" onClick={cancel}>Give up</Button> : <Button onClick={start}>🌱 Start focus session</Button>}
          </div>
        </div>
        <div className="panel p-5">
          <h2 className="text-xl">Focus history</h2>
          <p className="mt-1 text-sm text-muted-foreground">{sessions.length} sessions · {minutesFmt(totalFocus)} focused</p>
          <ul className="mt-3 space-y-2 text-sm">
            {sessions.slice().reverse().map((l) => (
              <li key={l.id} className="flex justify-between gap-3 border-b border-border/60 pb-1">
                <span className="truncate">🌳 {l.note?.replace("Focus: ", "")}</span>
                <span className="shrink-0 text-muted-foreground">{l.date} · {l.minutes}m</span>
              </li>
            ))}
            {sessions.length === 0 ? <li className="text-muted-foreground">No completed sessions yet.</li> : null}
          </ul>
        </div>
      </div>
    </AppShell>
  );
}