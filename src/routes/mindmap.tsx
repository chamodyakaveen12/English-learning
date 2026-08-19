import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/app/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useStore, uid, folderLabel, descendantIds } from "@/lib/store";
import { Trash2 } from "lucide-react";

export const Route = createFileRoute("/mindmap")({
  head: () => ({
    meta: [
      { title: "Mind Map — English Learning OS" },
      { name: "description", content: "See your folder hierarchy and word-to-word relationships as one visual vocabulary map." },
      { property: "og:title", content: "Vocabulary Mind Map" },
      { property: "og:description", content: "Folder hierarchy plus manual word connections, filtered by folder and date." },
    ],
  }),
  component: MindMapPage,
});

const ANY = "__any__";
type Node = { id: string; label: string; x: number; y: number; kind: "root" | "folder" | "word" };

function MindMapPage() {
  const { db, update } = useStore();
  const [folder, setFolder] = useState(ANY);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [view, setView] = useState<"main" | "sub" | "full" | "words">("full");
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [type, setType] = useState(db.settings.dropdowns.linkTypes[0] ?? "related to");

  const { nodes, edges } = useMemo(() => {
    const scope = folder === ANY ? null : descendantIds(db.folders, folder);
    const depthOf = (id: string) => folderLabel(db.folders, id).split(" → ").length;
    const maxDepth = view === "main" ? 1 : view === "sub" ? 2 : 99;

    const folders = db.folders.filter((f) => (!scope || scope.includes(f.id)) && depthOf(f.id) <= maxDepth);
    const words = db.words.filter((w) => {
      if (scope && !(w.folderId && scope.includes(w.folderId))) return false;
      if (from && w.createdAt < from) return false;
      if (to && w.createdAt > to) return false;
      return true;
    });

    const levels: { id: string; label: string; kind: Node["kind"]; parent: string | null }[][] = [];
    if (view !== "words") {
      levels.push([{ id: "root", label: "English", kind: "root", parent: null }]);
      let depth = 1;
      while (depth <= maxDepth) {
        const row = folders
          .filter((f) => depthOf(f.id) === depth)
          .map((f) => ({ id: f.id, label: f.name, kind: "folder" as const, parent: f.parentId ?? "root" }));
        if (!row.length) break;
        levels.push(row);
        depth++;
      }
    }
    if (view === "full" || view === "words") {
      levels.push(words.map((w) => ({ id: w.id, label: w.word, kind: "word" as const, parent: view === "words" ? null : (w.folderId ?? "root") })));
    }

    const width = 1000;
    const rowH = 120;
    const ns: Node[] = [];
    const es: { x1: number; y1: number; x2: number; y2: number; dashed?: boolean; label?: string }[] = [];
    const pos = new Map<string, Node>();
    levels.forEach((row, li) => {
      row.forEach((n, i) => {
        const node: Node = { id: n.id, label: n.label, kind: n.kind, x: ((i + 1) * width) / (row.length + 1), y: 60 + li * rowH };
        ns.push(node);
        pos.set(n.id, node);
      });
    });
    levels.forEach((row) => row.forEach((n) => {
      if (!n.parent) return;
      const p = pos.get(n.parent); const c = pos.get(n.id);
      if (p && c) es.push({ x1: p.x, y1: p.y + 12, x2: c.x, y2: c.y - 12 });
    }));
    db.links.forEach((l) => {
      const p = pos.get(l.a); const c = pos.get(l.b);
      if (p && c) es.push({ x1: p.x, y1: p.y, x2: c.x, y2: c.y, dashed: true, label: l.type });
    });
    return { nodes: ns, edges: es, height: 60 + levels.length * rowH };
  }, [db, folder, from, to, view]);

  const height = 80 + Math.max(...nodes.map((n) => n.y), 200);

  return (
    <AppShell title="Mind Map" subtitle="Folder hierarchy plus your own word-to-word connections.">
      <div className="panel mb-5 grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="grid min-w-0 gap-1">
          <Label className="text-[11px] uppercase text-muted-foreground">Folder</Label>
          <Select value={folder} onValueChange={setFolder}>
            <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
            <SelectContent className="max-w-[min(90vw,30rem)]">
              <SelectItem value={ANY}>All folders</SelectItem>
              {db.folders.map((f) => (
                <SelectItem key={f.id} value={f.id} title={folderLabel(db.folders, f.id)}>
                  <span className="block max-w-[26rem] truncate">{folderLabel(db.folders, f.id)}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-1">
          <Label className="text-[11px] uppercase text-muted-foreground">View level</Label>
          <Select value={view} onValueChange={(v) => setView(v as typeof view)}>
            <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="main">Main folders only</SelectItem>
              <SelectItem value="sub">Main + subfolders</SelectItem>
              <SelectItem value="full">Full hierarchy</SelectItem>
              <SelectItem value="words">Words only</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-1">
          <Label className="text-[11px] uppercase text-muted-foreground">Date from</Label>
          <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
        </div>
        <div className="grid gap-1">
          <Label className="text-[11px] uppercase text-muted-foreground">Date to</Label>
          <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
        </div>
      </div>

      <div className="panel overflow-x-auto p-2">
        <svg viewBox={`0 0 1000 ${height}`} className="min-w-[900px]" style={{ height }}>
          {edges.map((e, i) => (
            <g key={i}>
              <line x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2}
                stroke={e.dashed ? "var(--accent)" : "var(--border)"} strokeWidth={e.dashed ? 1.5 : 1}
                strokeDasharray={e.dashed ? "5 4" : undefined} />
              {e.label ? (
                <text x={(e.x1 + e.x2) / 2} y={(e.y1 + e.y2) / 2 - 4} textAnchor="middle" fontSize="10" fill="var(--muted-foreground)">{e.label}</text>
              ) : null}
            </g>
          ))}
          {nodes.map((n) => {
            const w = Math.min(180, Math.max(60, n.label.length * 8 + 20));
            return (
              <g key={n.id}>
                <rect x={n.x - w / 2} y={n.y - 13} width={w} height={26} rx={13}
                  fill={n.kind === "word" ? "var(--card)" : n.kind === "root" ? "var(--primary)" : "var(--secondary)"}
                  stroke={n.kind === "word" ? "var(--accent)" : "var(--border)"} />
                <text x={n.x} y={n.y + 4} textAnchor="middle" fontSize="12"
                  fill={n.kind === "root" ? "var(--primary-foreground)" : "var(--foreground)"}>
                  {n.label.length > 20 ? n.label.slice(0, 19) + "…" : n.label}
                  <title>{n.label}</title>
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <div className="panel mt-5 p-4">
        <h2 className="text-xl">Word connections</h2>
        <div className="mt-3 flex flex-wrap items-end gap-2">
          <Select value={a} onValueChange={setA}>
            <SelectTrigger className="min-w-[160px]"><SelectValue placeholder="Word A" /></SelectTrigger>
            <SelectContent>{db.words.map((w) => <SelectItem key={w.id} value={w.id}>{w.word}</SelectItem>)}</SelectContent>
          </Select>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger className="min-w-[150px]"><SelectValue /></SelectTrigger>
            <SelectContent>{db.settings.dropdowns.linkTypes.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
          </Select>
          <Select value={b} onValueChange={setB}>
            <SelectTrigger className="min-w-[160px]"><SelectValue placeholder="Word B" /></SelectTrigger>
            <SelectContent>{db.words.map((w) => <SelectItem key={w.id} value={w.id}>{w.word}</SelectItem>)}</SelectContent>
          </Select>
          <Button disabled={!a || !b || a === b} onClick={() => update((d) => d.links.push({ id: uid(), a, b, type }))}>Connect</Button>
        </div>
        <ul className="mt-4 space-y-2 text-sm">
          {db.links.map((l) => (
            <li key={l.id} className="flex items-center gap-2">
              <span className="min-w-0 flex-1 truncate">
                {db.words.find((w) => w.id === l.a)?.word ?? "?"} <span className="text-muted-foreground">— {l.type} —</span>{" "}
                {db.words.find((w) => w.id === l.b)?.word ?? "?"}
              </span>
              <Button size="icon" variant="ghost" aria-label="Remove connection"
                onClick={() => update((d) => { d.links = d.links.filter((x) => x.id !== l.id); })}>
                <Trash2 className="size-3.5" />
              </Button>
            </li>
          ))}
          {db.links.length === 0 ? <li className="text-muted-foreground">No connections yet.</li> : null}
        </ul>
      </div>
    </AppShell>
  );
}