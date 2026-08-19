import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/app/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useStore, emptyDB, type DB } from "@/lib/store";
import { useRef } from "react";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Customization — English Learning OS" },
      { name: "description", content: "Rename dropdowns, set your own review schedule and control reminders — nothing is fixed." },
      { property: "og:title", content: "Customization" },
      { property: "og:description", content: "Your dropdown names, review intervals and reminder rules, fully under your control." },
    ],
  }),
  component: SettingsPage,
});

type DDKey = "difficulty" | "level" | "source" | "linkTypes";

function DropdownEditor({ label, dkey }: { label: string; dkey: DDKey }) {
  const { db, update } = useStore();
  const [val, setVal] = useState("");
  const items = db.settings.dropdowns[dkey];
  return (
    <div className="panel p-4">
      <h3 className="text-lg">{label}</h3>
      <div className="mt-2 flex flex-wrap gap-2">
        {items.map((it) => (
          <span key={it} className="flex max-w-full items-center gap-1 rounded-full bg-secondary px-2 py-1 text-xs" title={it}>
            <span className="max-w-[16rem] truncate">{it}</span>
            <button aria-label={`Remove ${it}`} className="text-muted-foreground hover:text-destructive"
              onClick={() => update((d) => { d.settings.dropdowns[dkey] = d.settings.dropdowns[dkey].filter((x) => x !== it); })}>×</button>
          </span>
        ))}
      </div>
      <div className="mt-3 flex gap-2">
        <Input value={val} onChange={(e) => setVal(e.target.value)} placeholder={`Add ${label.toLowerCase()} option`} />
        <Button variant="secondary" onClick={() => {
          if (!val.trim()) return;
          update((d) => d.settings.dropdowns[dkey].push(val.trim()));
          setVal("");
        }}>Add</Button>
      </div>
    </div>
  );
}

function SettingsPage() {
  const { db, update, reset } = useStore();
  const fileRef = useRef<HTMLInputElement>(null);
  const s = db.settings;

  const downloadBackup = () => {
    const blob = new Blob([JSON.stringify(db, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `english-os-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const restoreBackup = async (file: File) => {
    try {
      const parsed = JSON.parse(await file.text()) as Partial<DB>;
      if (!Array.isArray(parsed.words) || !Array.isArray(parsed.folders)) {
        window.alert("That file does not look like an English OS backup.");
        return;
      }
      if (!window.confirm("Replace all current data with this backup?")) return;
      update((d) => Object.assign(d, emptyDB(), parsed));
    } catch {
      window.alert("Could not read that backup file.");
    }
  };

  return (
    <AppShell title="Customization" subtitle="Names, schedules and reminders — all yours.">
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="panel p-4">
          <h3 className="text-lg">Review schedule (days)</h3>
          <div className="mt-3 grid gap-2">
            {s.schedule.map((d, i) => (
              <div key={i} className="flex items-center gap-2">
                <Label className="w-24 shrink-0 text-sm">Review {i + 1}</Label>
                <Input type="number" className="w-24" value={d}
                  onChange={(e) => update((db2) => { db2.settings.schedule[i] = Number(e.target.value) || 1; })} />
                <Button size="sm" variant="ghost"
                  onClick={() => update((db2) => { db2.settings.schedule.splice(i, 1); })}>Remove</Button>
              </div>
            ))}
          </div>
          <Button className="mt-3" variant="secondary"
            onClick={() => update((db2) => db2.settings.schedule.push((db2.settings.schedule.at(-1) ?? 1) * 2))}>
            Add interval
          </Button>
        </div>

        <div className="panel p-4">
          <h3 className="text-lg">Reminders</h3>
          <div className="mt-3 grid gap-3">
            <div className="flex items-center gap-3">
              <Label className="w-40">Reminder time</Label>
              <Input type="time" className="w-32" value={s.reminder.time}
                onChange={(e) => update((d) => { d.settings.reminder.time = e.target.value; })} />
            </div>
            <div className="flex items-center justify-between">
              <Label>Remind me when words are due</Label>
              <Switch checked={s.reminder.onDue} onCheckedChange={(v) => update((d) => { d.settings.reminder.onDue = v; })} />
            </div>
            <div className="flex items-center justify-between">
              <Label>Remind me if I have not studied today</Label>
              <Switch checked={s.reminder.onIdle} onCheckedChange={(v) => update((d) => { d.settings.reminder.onIdle = v; })} />
            </div>
            <div className="flex items-center gap-3">
              <Label className="w-40">Only if more than</Label>
              <Input type="number" className="w-24" value={s.reminder.threshold}
                onChange={(e) => update((d) => { d.settings.reminder.threshold = Number(e.target.value) || 0; })} />
              <span className="text-sm text-muted-foreground">words are due</span>
            </div>
          </div>
        </div>

        <DropdownEditor label="Difficulty" dkey="difficulty" />
        <DropdownEditor label="English level" dkey="level" />
        <DropdownEditor label="Source" dkey="source" />
        <DropdownEditor label="Connection types" dkey="linkTypes" />

        <div className="panel p-4">
          <h3 className="text-lg">Data</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Everything is stored privately in this browser. Download a backup regularly — that .json file is your
            only fully portable copy until you move the data to the cloud.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button onClick={downloadBackup}>Download backup (.json)</Button>
            <Button variant="secondary" onClick={() => fileRef.current?.click()}>Restore from backup</Button>
            <Button variant="destructive"
              onClick={() => { if (window.confirm("Reset all data?")) reset(); }}>Reset all data</Button>
          </div>
          <input ref={fileRef} type="file" accept="application/json,.json" className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              e.target.value = "";
              if (f) void restoreBackup(f);
            }} />
        </div>
      </div>
    </AppShell>
  );
}