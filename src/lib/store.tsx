// src/lib/store.tsx
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { tursoDb } from "./turso";

// ============================================
// TYPES
// ============================================

export type Folder = { id: string; name: string; parentId: string | null };

export type Word = {
  id: string;
  word: string;
  meaning: string;
  example: string;
  folderId: string | null;
  tags: string[];
  difficulty: string;
  level: string;
  source: string;
  createdAt: string;
  due: string;
  stage: number;
  history: { date: string; rating: string }[];
};

export type WordLink = { id: string; a: string; b: string; type: string };
export type ActivityType = { id: string; name: string };
export type ActivityLog = {
  id: string;
  date: string;
  typeId: string;
  minutes: number;
  note?: string;
};
export type DayBlock = {
  id: string;
  date: string;
  hour: number;
  label: string;
  typeId: string | null;
};
export type Settings = {
  schedule: number[];
  dropdowns: {
    difficulty: string[];
    level: string[];
    source: string[];
    linkTypes: string[];
  };
  reminder: { time: string; onDue: boolean; threshold: number; onIdle: boolean };
};

export type DB = {
  words: Word[];
  folders: Folder[];
  links: WordLink[];
  activityTypes: ActivityType[];
  logs: ActivityLog[];
  blocks: DayBlock[];
  settings: Settings;
};

// ============================================
// HELPERS
// ============================================

export const uid = () =>
  Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);

export const today = () => new Date().toISOString().slice(0, 10);

export const addDays = (iso: string, n: number) => {
  const d = new Date(iso + "T00:00:00");
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
};

const KEY = "english-os-v1";
const USER_KEY = "english-os-user-id";

// ============================================
// EMPTY + SEED
// ============================================

export function emptyDB(): DB {
  return {
    words: [],
    folders: [],
    links: [],
    activityTypes: [
      { id: "a-voc", name: "Vocabulary" },
      { id: "a-read", name: "Reading" },
      { id: "a-write", name: "Writing" },
      { id: "a-listen", name: "Listening" },
      { id: "a-speak", name: "Speaking" },
      { id: "a-gram", name: "Grammar" },
    ],
    logs: [],
    blocks: [],
    settings: {
      schedule: [1, 2, 4, 7, 14, 30],
      dropdowns: {
        difficulty: ["Again", "Hard", "Good", "Easy"],
        level: ["A1", "A2", "B1", "B2", "C1", "C2"],
        source: ["Book", "Movie", "YouTube", "University", "Conversation", "News"],
        linkTypes: ["related to", "similar meaning", "opposite of", "same topic"],
      },
      reminder: { time: "20:00", onDue: true, threshold: 10, onIdle: true },
    },
  };
}

function seedDB(): DB {
  const db = emptyDB();
  // You can keep the seed words if you want, or leave empty
  return db;
}

// ============================================
// FOLDER HELPERS
// ============================================

export function folderPath(folders: Folder[], id: string | null): Folder[] {
  const out: Folder[] = [];
  let cur = folders.find((f) => f.id === id);
  while (cur) {
    out.unshift(cur);
    cur = folders.find((f) => f.id === cur!.parentId) ?? undefined;
  }
  return out;
}

export function folderLabel(folders: Folder[], id: string | null) {
  if (!id) return "Unfiled";
  return folderPath(folders, id).map((f) => f.name).join(" → ") || "Unfiled";
}

export function descendantIds(folders: Folder[], id: string): string[] {
  const out = [id];
  const walk = (parent: string) => {
    folders
      .filter((f) => f.parentId === parent)
      .forEach((f) => {
        out.push(f.id);
        walk(f.id);
      });
  };
  walk(id);
  return out;
}

export function isDescendant(folders: Folder[], candidate: string, ancestor: string) {
  return descendantIds(folders, ancestor).includes(candidate);
}

// ============================================
// SRS
// ============================================

export function applyReview(
  w: Word,
  rating: "Again" | "Hard" | "Good" | "Easy",
  schedule: number[]
) {
  let stage = w.stage;
  if (rating === "Again") stage = 0;
  else if (rating === "Hard") stage = Math.max(0, stage);
  else if (rating === "Good") stage = stage + 1;
  else stage = stage + 2;

  const idx = Math.min(stage, schedule.length - 1);
  let days = schedule[idx] ?? 1;
  if (rating === "Again") days = 0;
  if (rating === "Hard") days = Math.max(1, Math.round(days / 2));

  w.stage = stage;
  w.difficulty = rating;
  w.due = addDays(today(), days);
  w.history = [...(w.history ?? []), { date: today(), rating }];
  return w;
}

export const minutesFmt = (m: number) => `${Math.floor(m / 60)}h ${m % 60}m`;

// ============================================
// CONTEXT
// ============================================

type Ctx = {
  db: DB;
  ready: boolean;
  loading: boolean;
  userId: string | null;
  isAuthenticated: boolean;
  update: (fn: (d: DB) => void) => void;
  reset: () => void;
  logout: () => void;
  loginSuccess: (email: string, data?: DB | null) => void;
};

const StoreContext = createContext<Ctx | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [db, setDb] = useState<DB>(() => emptyDB());
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Save to Turso + localStorage
  const saveData = useCallback(async (uid: string, data: DB) => {
    try {
      localStorage.setItem(KEY, JSON.stringify(data));
      await tursoDb.save(uid, data);
    } catch (err) {
      console.error("Save failed:", err);
    }
  }, []);

  const update = useCallback(
    (fn: (d: DB) => void) => {
      setDb((prev) => {
        const next: DB = JSON.parse(JSON.stringify(prev));
        fn(next);

        if (userId) {
          saveData(userId, next);
        } else {
          localStorage.setItem(KEY, JSON.stringify(next));
        }
        return next;
      });
    },
    [userId, saveData]
  );

  const reset = useCallback(() => {
    const fresh = seedDB();
    setDb(fresh);
    if (userId) {
      saveData(userId, fresh);
    } else {
      localStorage.setItem(KEY, JSON.stringify(fresh));
    }
  }, [userId, saveData]);

  const logout = useCallback(() => {
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem("english-os-logged-in");
    setUserId(null);
    setIsAuthenticated(false);
    setDb(emptyDB());
  }, []);

  const loginSuccess = useCallback(
    (email: string, data?: DB | null) => {
      localStorage.setItem(USER_KEY, email);
      localStorage.setItem("english-os-logged-in", "true");
      setUserId(email);
      setIsAuthenticated(true);

      if (data) {
        setDb({ ...emptyDB(), ...data });
      } else {
        setDb(emptyDB());
      }
    },
    []
  );

  // INIT
  useEffect(() => {
    const init = async () => {
      setLoading(true);
      const storedUserId = localStorage.getItem(USER_KEY);

      if (storedUserId) {
        setUserId(storedUserId);
        setIsAuthenticated(true);

        const result = await tursoDb.load(storedUserId);
        if (result.success && result.data) {
          setDb({ ...emptyDB(), ...result.data });
        } else {
          // fallback to localStorage
          try {
            const raw = localStorage.getItem(KEY);
            if (raw) setDb({ ...emptyDB(), ...JSON.parse(raw) });
            else setDb(emptyDB());
          } catch {
            setDb(emptyDB());
          }
        }
      } else {
        // not logged in
        setDb(emptyDB());
      }

      setReady(true);
      setLoading(false);
    };

    init();
  }, []);

  return (
    <StoreContext.Provider
      value={{
        db,
        ready,
        loading,
        userId,
        isAuthenticated,
        update,
        reset,
        logout,
        loginSuccess,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}