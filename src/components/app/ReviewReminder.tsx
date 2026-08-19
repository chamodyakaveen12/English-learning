import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { useStore, today } from "@/lib/store";

export function ReviewReminder() {
  const { db, ready } = useStore();
  const [dismissed, setDismissed] = useState(true);
  const due = db.words.filter((w) => w.due <= today()).length;

  useEffect(() => {
    if (!ready) return;
    const key = "english-os-reminder-" + today();
    if (localStorage.getItem(key)) return;
    setDismissed(false);
  }, [ready]);

  if (dismissed || !db.settings.reminder.onDue || due === 0) return null;

  const close = () => {
    localStorage.setItem("english-os-reminder-" + today(), "1");
    setDismissed(true);
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 w-[320px] panel p-4">
      <p className="font-display text-lg">Vocabulary review reminder</p>
      <p className="mt-1 text-sm text-muted-foreground">
        Today you have {due} word{due === 1 ? "" : "s"} ready for review.
      </p>
      <div className="mt-3 flex gap-2">
        <Button asChild size="sm" onClick={close}>
          <Link to="/review">Review now</Link>
        </Button>
        <Button size="sm" variant="ghost" onClick={close}>
          Later
        </Button>
      </div>
    </div>
  );
}