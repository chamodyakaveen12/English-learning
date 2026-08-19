import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useStore, uid, today, folderLabel, addDays, type Word } from "@/lib/store";

type Props = { open: boolean; onOpenChange: (v: boolean) => void; word?: Word | null; defaultFolder?: string | null };

export function WordDialog({ open, onOpenChange, word, defaultFolder }: Props) {
  const { db, update } = useStore();
  const [form, setForm] = useState({
    word: "",
    meaning: "",
    example: "",
    folderId: defaultFolder ?? "none",
    tags: "",
    difficulty: db.settings.dropdowns.difficulty[0] ?? "Good",
    level: db.settings.dropdowns.level[3] ?? "B1",
    source: db.settings.dropdowns.source[0] ?? "Other",
    createdAt: today(),
  });

  useEffect(() => {
    if (!open) return;
    setForm({
      word: word?.word ?? "",
      meaning: word?.meaning ?? "",
      example: word?.example ?? "",
      folderId: word?.folderId ?? defaultFolder ?? "none",
      tags: word?.tags.join(", ") ?? "",
      difficulty: word?.difficulty ?? db.settings.dropdowns.difficulty[0] ?? "Good",
      level: word?.level ?? db.settings.dropdowns.level[3] ?? "B1",
      source: word?.source ?? db.settings.dropdowns.source[0] ?? "Other",
      createdAt: word?.createdAt ?? today(),
    });
  }, [open, word, defaultFolder, db.settings.dropdowns]);

  const save = () => {
    if (!form.word.trim()) return;
    const tags = form.tags.split(",").map((t) => t.trim()).filter(Boolean);
    const folderId = form.folderId === "none" ? null : form.folderId;

    update((d) => {
      if (word) {
        const w = d.words.find((x) => x.id === word.id);
        if (w) Object.assign(w, { ...form, folderId, tags });
      } else {
        d.words.unshift({
          id: uid(),
          word: form.word.trim(),
          meaning: form.meaning,
          example: form.example,
          folderId,
          tags,
          difficulty: form.difficulty,
          level: form.level,
          source: form.source,
          createdAt: form.createdAt,
          due: addDays(form.createdAt, d.settings.schedule[0] ?? 1),
          stage: 0,
          history: [],
        });
      }
    });
    onOpenChange(false);
  };

  const dd = db.settings.dropdowns;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">{word ? "Edit word" : "New word"}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-3">
          <div className="grid gap-1.5">
            <Label>Word</Label>
            <Input value={form.word} onChange={(e) => setForm({ ...form, word: e.target.value })} placeholder="Allocate" />
          </div>
          <div className="grid gap-1.5">
            <Label>Meaning</Label>
            <Textarea value={form.meaning} onChange={(e) => setForm({ ...form, meaning: e.target.value })} rows={2} />
          </div>
          <div className="grid gap-1.5">
            <Label>Example</Label>
            <Textarea value={form.example} onChange={(e) => setForm({ ...form, example: e.target.value })} rows={2} />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="grid min-w-0 gap-1.5">
              <Label>Folder</Label>
              <Select value={form.folderId} onValueChange={(v) => setForm({ ...form, folderId: v })}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent className="max-w-[min(90vw,28rem)]">
                  <SelectItem value="none">Unfiled</SelectItem>
                  {db.folders.map((f) => (
                    <SelectItem key={f.id} value={f.id} title={folderLabel(db.folders, f.id)}>
                      <span className="block truncate">{folderLabel(db.folders, f.id)}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-1.5">
              <Label>Date found</Label>
              <Input type="date" value={form.createdAt} onChange={(e) => setForm({ ...form, createdAt: e.target.value })} />
            </div>
            <div className="grid gap-1.5">
              <Label>Difficulty</Label>
              <Select value={form.difficulty} onValueChange={(v) => setForm({ ...form, difficulty: v })}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>{dd.difficulty.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="grid gap-1.5">
              <Label>English level</Label>
              <Select value={form.level} onValueChange={(v) => setForm({ ...form, level: v })}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>{dd.level.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="grid gap-1.5">
              <Label>Source</Label>
              <Select value={form.source} onValueChange={(v) => setForm({ ...form, source: v })}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>{dd.source.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="grid gap-1.5">
              <Label>Tags (comma separated)</Label>
              <Input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="Finance, Work" />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={save}>{word ? "Save changes" : "Add word"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}