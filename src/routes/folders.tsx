import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/app/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronDown, ChevronRight, FolderPlus, Pencil, Trash2, Copy, MoveRight } from "lucide-react";
import { useStore, uid, folderLabel, descendantIds, isDescendant, type Folder } from "@/lib/store";

export const Route = createFileRoute("/folders")({
  head: () => ({
    meta: [
      { title: "Folders — English Learning OS" },
      { name: "description", content: "Build your own unlimited folder and subfolder hierarchy, then move or copy words and whole folders freely." },
      { property: "og:title", content: "Custom Folder System" },
      { property: "og:description", content: "Unlimited nesting, rename, move and copy — no structure is forced on you." },
    ],
  }),
  component: FoldersPage,
});

function FoldersPage() {
  const { db, update } = useStore();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [newName, setNewName] = useState("");
  const [target, setTarget] = useState("root");

  const children = (parentId: string | null) => db.folders.filter((f) => f.parentId === parentId);
  const wordCount = (id: string) => {
    const ids = descendantIds(db.folders, id);
    return db.words.filter((w) => w.folderId && ids.includes(w.folderId)).length;
  };

  const addFolder = () => {
    if (!newName.trim()) return;
    update((d) => d.folders.push({ id: uid(), name: newName.trim(), parentId: target === "root" ? null : target }));
    setNewName("");
  };

  const rename = (f: Folder) => {
    const name = window.prompt("Rename folder", f.name);
    if (name?.trim()) update((d) => { const x = d.folders.find((y) => y.id === f.id); if (x) x.name = name.trim(); });
  };

  const remove = (f: Folder) => {
    if (!window.confirm(`Delete "${f.name}" and its subfolders? Words inside become Unfiled.`)) return;
    update((d) => {
      const ids = descendantIds(d.folders, f.id);
      d.folders = d.folders.filter((x) => !ids.includes(x.id));
      d.words.forEach((w) => { if (w.folderId && ids.includes(w.folderId)) w.folderId = null; });
    });
  };

  const moveTo = (f: Folder, copy: boolean) => {
    const options = [{ id: "root", label: "Top level" }, ...db.folders.filter((x) => !isDescendant(db.folders, x.id, f.id)).map((x) => ({ id: x.id, label: folderLabel(db.folders, x.id) }))];
    const answer = window.prompt(
      `${copy ? "Copy" : "Move"} "${f.name}" into which folder? Type the number:\n` +
        options.map((o, i) => `${i + 1}. ${o.label}`).join("\n"),
    );
    const idx = Number(answer) - 1;
    const dest = options[idx];
    if (!dest) return;
    const destId = dest.id === "root" ? null : dest.id;
    update((d) => {
      if (!copy) {
        const x = d.folders.find((y) => y.id === f.id);
        if (x) x.parentId = destId;
        return;
      }
      const map = new Map<string, string>();
      const clone = (srcId: string, parentId: string | null) => {
        const src = d.folders.find((y) => y.id === srcId)!;
        const nid = uid();
        map.set(srcId, nid);
        d.folders.push({ id: nid, name: src.name, parentId });
        d.folders.filter((y) => y.parentId === srcId).forEach((c) => clone(c.id, nid));
      };
      clone(f.id, destId);
      const originals = d.words.filter((w) => w.folderId && map.has(w.folderId));
      originals.forEach((w) => d.words.push({ ...w, id: uid(), folderId: map.get(w.folderId!)!, history: [...w.history] }));
    });
  };

  const Row = ({ f, depth }: { f: Folder; depth: number }) => {
    const kids = children(f.id);
    const open = expanded[f.id] ?? depth < 1;
    return (
      <li>
        <div className="group flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-secondary/60" style={{ paddingLeft: depth * 18 + 8 }}>
          <button className="text-muted-foreground" onClick={() => setExpanded((e) => ({ ...e, [f.id]: !open }))} aria-label="Toggle">
            {kids.length ? (open ? <ChevronDown className="size-4" /> : <ChevronRight className="size-4" />) : <span className="inline-block size-4" />}
          </button>
          <span className="min-w-0 flex-1 truncate" title={folderLabel(db.folders, f.id)}>{f.name}</span>
          <span className="shrink-0 rounded-full bg-secondary px-2 py-0.5 text-xs text-muted-foreground">{wordCount(f.id)}</span>
          <div className="flex shrink-0 gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
            <Button size="icon" variant="ghost" aria-label="Rename" onClick={() => rename(f)}><Pencil className="size-3.5" /></Button>
            <Button size="icon" variant="ghost" aria-label="Move" onClick={() => moveTo(f, false)}><MoveRight className="size-3.5" /></Button>
            <Button size="icon" variant="ghost" aria-label="Copy" onClick={() => moveTo(f, true)}><Copy className="size-3.5" /></Button>
            <Button size="icon" variant="ghost" aria-label="Delete" onClick={() => remove(f)}><Trash2 className="size-3.5" /></Button>
          </div>
        </div>
        {open && kids.length ? <ul>{kids.map((k) => <Row key={k.id} f={k} depth={depth + 1} />)}</ul> : null}
      </li>
    );
  };

  const unfiled = db.words.filter((w) => !w.folderId);

  return (
    <AppShell title="Folders" subtitle="Unlimited hierarchy — create, rename, move, copy or delete anything.">
      <div className="panel mb-5 flex flex-wrap items-end gap-3 p-4">
        <Input className="min-w-[200px] flex-1" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="New folder name" />
        <Select value={target} onValueChange={setTarget}>
          <SelectTrigger className="min-w-[220px]"><SelectValue /></SelectTrigger>
          <SelectContent className="max-w-[min(90vw,30rem)]">
            <SelectItem value="root">Top level</SelectItem>
            {db.folders.map((f) => (
              <SelectItem key={f.id} value={f.id} title={folderLabel(db.folders, f.id)}>
                <span className="block max-w-[26rem] truncate">{folderLabel(db.folders, f.id)}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button onClick={addFolder}><FolderPlus className="size-4" /> Create folder</Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <div className="panel p-4">
          <h2 className="mb-2 text-xl">Hierarchy</h2>
          <ul>{children(null).map((f) => <Row key={f.id} f={f} depth={0} />)}</ul>
          {db.folders.length === 0 ? <p className="text-sm text-muted-foreground">No folders yet — create your first one above.</p> : null}
        </div>
        <div className="panel p-4">
          <h2 className="mb-2 text-xl">Unfiled words ({unfiled.length})</h2>
          <ul className="space-y-2">
            {unfiled.map((w) => (
              <li key={w.id} className="flex items-center gap-2">
                <span className="min-w-0 flex-1 truncate">{w.word}</span>
                <Select value="none" onValueChange={(v) => update((d) => { const x = d.words.find((y) => y.id === w.id); if (x) x.folderId = v; })}>
                  <SelectTrigger className="w-40"><SelectValue placeholder="Move to…" /></SelectTrigger>
                  <SelectContent className="max-w-[min(90vw,30rem)]">
                    <SelectItem value="none" disabled>Move to…</SelectItem>
                    {db.folders.map((f) => (
                      <SelectItem key={f.id} value={f.id} title={folderLabel(db.folders, f.id)}>
                        <span className="block max-w-[24rem] truncate">{folderLabel(db.folders, f.id)}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </li>
            ))}
            {unfiled.length === 0 ? <p className="text-sm text-muted-foreground">Everything is filed.</p> : null}
          </ul>
        </div>
      </div>
    </AppShell>
  );
}