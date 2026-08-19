import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/app/AppShell";
import { Button } from "@/components/ui/button";
import { useStore, today, applyReview, folderLabel } from "@/lib/store";

export const Route = createFileRoute("/review")({
  head: () => ({
    meta: [
      { title: "Review — English Learning OS" },
      { name: "description", content: "Spaced repetition review with Again, Hard, Good and Easy on your own custom schedule." },
      { property: "og:title", content: "Spaced Repetition Review" },
      { property: "og:description", content: "Rate each word and the next review date adjusts automatically." },
    ],
  }),
  component: ReviewPage,
});

const RATINGS = [
  { key: "Again", cls: "bg-destructive text-destructive-foreground" },
  { key: "Hard", cls: "bg-chart-4 text-primary-foreground" },
  { key: "Good", cls: "bg-accent text-accent-foreground" },
  { key: "Easy", cls: "bg-chart-5 text-primary-foreground" },
] as const;

function ReviewPage() {
  const { db, update } = useStore();
  const [i, setI] = useState(0);
  const [show, setShow] = useState(false);
  const [done, setDone] = useState(0);

  const queue = useMemo(() => db.words.filter((w) => w.due <= today()), [db.words]);
  const card = queue[i];

  const rate = (r: "Again" | "Hard" | "Good" | "Easy") => {
    if (!card) return;
    update((d) => {
      const w = d.words.find((x) => x.id === card.id);
      if (w) applyReview(w, r, d.settings.schedule);
    });
    setShow(false);
    setDone((n) => n + 1);
    setI((n) => (r === "Again" ? n + 1 : n));
  };

  return (
    <AppShell title="Review" subtitle={`${queue.length} due · ${done} completed this session`}>
      {!card ? (
        <div className="panel p-10 text-center">
          <p className="font-display text-2xl">All caught up</p>
          <p className="mt-1 text-sm text-muted-foreground">No words are due right now. Come back after your next interval.</p>
        </div>
      ) : (
        <div className="panel mx-auto max-w-xl p-8 text-center">
          <p className="truncate text-xs uppercase tracking-wide text-muted-foreground" title={folderLabel(db.folders, card.folderId)}>
            {folderLabel(db.folders, card.folderId)}
          </p>
          <h2 className="mt-3 font-display text-4xl">{card.word}</h2>
          {!show ? (
            <>
              <p className="mt-4 text-sm text-muted-foreground">Can you remember the meaning?</p>
              <Button className="mt-6" onClick={() => setShow(true)}>Show answer</Button>
            </>
          ) : (
            <>
              <p className="mt-4 text-base">{card.meaning}</p>
              {card.example ? <p className="mt-2 text-sm italic text-muted-foreground">“{card.example}”</p> : null}
              <div className="mt-7 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {RATINGS.map((r) => (
                  <button key={r.key} onClick={() => rate(r.key)}
                    className={`rounded-lg px-3 py-2 text-sm font-medium transition-opacity hover:opacity-90 ${r.cls}`}>
                    {r.key}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      <div className="panel mt-6 p-4">
        <h2 className="text-xl">Your schedule</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {db.settings.schedule.map((d, idx) => `Review ${idx + 1}: ${d}d`).join(" · ")} — change it in Customization.
        </p>
      </div>
    </AppShell>
  );
}