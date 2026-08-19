import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/app/AppShell";
import { WordDialog } from "@/components/app/WordDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { useStore, folderLabel, descendantIds, today, type Word } from "@/lib/store";

export const Route = createFileRoute("/library")({
  head: () => ({
    meta: [
      { title: "Word Library — English Learning OS" },
      { name: "description", content: "Search, filter and manage every English word you have collected by folder, date, difficulty, tag and source." },
      { property: "og:title", content: "Word Library" },
      { property: "og:description", content: "Every word you collected, filterable by folder, date, difficulty, tag and source." },
    ],
  }),
  component: LibraryPage,
});

const ANY = "__any__";

function LibraryPage() {
  const { db, update } = useStore();
  const [q, setQ] = useState("");
  const [folder, setFolder] = useState(ANY);
  const [difficulty, setDifficulty] = useState(ANY);
  const [level, setLevel] = useState(ANY);
  const [source, setSource] = useState(ANY);
  const [tag, setTag] = useState(ANY);
  const [status, setStatus] = useState(ANY);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [editing, setEditing] = useState<Word | null>(null);
  const [open, setOpen] = useState(false);

  const tags = useMemo(() => Array.from(new Set(db.words.flatMap((w) => w.tags))), [db.words]);

  const words = useMemo(() => {
    const scope = folder === ANY ? null : descendantIds(db.folders, folder);
    return db.words.filter((w) => {
      if (q && !(`${w.word} ${w.meaning} ${w.example}`.toLowerCase().includes(q.toLowerCase()))) return false;
      if (scope && !(w.folderId && scope.includes(w.folderId))) return false;
      if (difficulty !== ANY && w.difficulty !== difficulty) return false;
      if (level !== ANY && w.level !== level) return false;
      if (source !== ANY && w.source !== source) return false;
      if (tag !== ANY && !w.tags.includes(tag)) return false;
      if (status === "due" && !(w.due <= today())) return false;
      if (status === "scheduled" && w.due <= today()) return false;
      if (status === "new" && w.stage !== 0) return false;
      if (from && w.createdAt < from) return false;
      if (to && w.createdAt > to) return false;
      return true;
    });
  }, [db.words, db.folders, q, folder, difficulty, level, source, tag, status, from, to]);

  const clear = () => {
    setQ(""); setFolder(ANY); setDifficulty(ANY); setLevel(ANY); setSource(ANY); setTag(ANY); setStatus(ANY); setFrom(""); setTo("");
  };

  const dd = db.settings.dropdowns;

  const Filter = ({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: { v: string; l: string }[] }) => (
    <div className="grid min-w-0 gap-1">
      <Label className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
        <SelectContent className="max-w-[min(90vw,30rem)]">
          {options.map((o) => (
            <SelectItem key={o.v} value={o.v} title={o.l}>
              <span className="block max-w-[26rem] truncate">{o.l}</span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );

  return (
    <AppShell title="Word Library" subtitle={`${words.length} of ${db.words.length} words shown`}>
      <div className="panel mb-5 p-4">
        <div className="flex flex-wrap items-end gap-3">
          <div className="grid min-w-[220px] flex-1 gap-1">
            <Label className="text-[11px] uppercase tracking-wide text-muted-foreground">Search</Label>
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search word, meaning or example…" />
          </div>
          <Button onClick={() => { setEditing(null); setOpen(true); }}><Plus className="size-4" /> Add word</Button>
        </div>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Filter label="Folder / subfolder" value={folder} onChange={setFolder}
            options={[{ v: ANY, l: "All folders" }, ...db.folders.map((f) => ({ v: f.id, l: folderLabel(db.folders, f.id) }))]} />
          <Filter label="Difficulty" value={difficulty} onChange={setDifficulty}
            options={[{ v: ANY, l: "Any" }, ...dd.difficulty.map((d) => ({ v: d, l: d }))]} />
          <Filter label="English level" value={level} onChange={setLevel}
            options={[{ v: ANY, l: "Any" }, ...dd.level.map((d) => ({ v: d, l: d }))]} />
          <Filter label="Source" value={source} onChange={setSource}
            options={[{ v: ANY, l: "Any" }, ...dd.source.map((d) => ({ v: d, l: d }))]} />
          <Filter label="Tag" value={tag} onChange={setTag}
            options={[{ v: ANY, l: "Any" }, ...tags.map((d) => ({ v: d, l: d }))]} />
          <Filter label="Review status" value={status} onChange={setStatus}
            options={[{ v: ANY, l: "Any" }, { v: "due", l: "Due now" }, { v: "scheduled", l: "Scheduled" }, { v: "new", l: "New / stage 0" }]} />
          <div className="grid gap-1">
            <Label className="text-[11px] uppercase tracking-wide text-muted-foreground">Date from</Label>
            <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
          </div>
          <div className="grid gap-1">
            <Label className="text-[11px] uppercase tracking-wide text-muted-foreground">Date to</Label>
            <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
          </div>
        </div>
        <Button variant="ghost" size="sm" className="mt-3" onClick={clear}><X className="size-3.5" /> Clear filters</Button>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {words.map((w) => (
          <article key={w.id} className="panel flex flex-col gap-2 p-4">
            <div className="flex items-start justify-between gap-2">
              <h2 className="font-display text-xl leading-tight">{w.word}</h2>
              <div className="flex shrink-0 gap-1">
                <Button size="icon" variant="ghost" onClick={() => { setEditing(w); setOpen(true); }} aria-label="Edit word">
                  <Pencil className="size-4" />
                </Button>
                <Button size="icon" variant="ghost" aria-label="Delete word"
                  onClick={() => update((d) => { d.words = d.words.filter((x) => x.id !== w.id); d.links = d.links.filter((l) => l.a !== w.id && l.b !== w.id); })}>
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">{w.meaning}</p>
            {w.example ? <p className="text-sm italic text-foreground/70">“{w.example}”</p> : null}
            <p className="truncate text-xs text-accent" title={folderLabel(db.folders, w.folderId)}>{folderLabel(db.folders, w.folderId)}</p>
            <div className="mt-auto flex flex-wrap gap-1.5 pt-2 text-[11px]">
              <span className="rounded-full bg-secondary px-2 py-0.5">{w.createdAt}</span>
              <span className="rounded-full bg-secondary px-2 py-0.5">{w.difficulty}</span>
              <span className="rounded-full bg-secondary px-2 py-0.5">{w.level}</span>
              <span className="rounded-full bg-secondary px-2 py-0.5">{w.source}</span>
              {w.tags.map((t) => <span key={t} className="rounded-full bg-primary/15 px-2 py-0.5 text-primary">#{t}</span>)}
            </div>
          </article>
        ))}
        {words.length === 0 ? <p className="text-sm text-muted-foreground">No words match these filters.</p> : null}
      </div>

      <WordDialog open={open} onOpenChange={setOpen} word={editing} />
    </AppShell>
  );
}