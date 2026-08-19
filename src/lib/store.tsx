// src/lib/store.tsx
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { tursoDb } from "./turso";

// ============================================
// TYPE DEFINITIONS
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
  createdAt: string; // ISO date (yyyy-mm-dd)
  due: string; // yyyy-mm-dd
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
  schedule: number[]; // days per stage
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

export const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);

export const today = () => new Date().toISOString().slice(0, 10);

export const addDays = (iso: string, n: number) => {
  const d = new Date(iso + "T00:00:00");
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
};

const KEY = "english-os-v1";

// ============================================
// EMPTY DATABASE
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

// ============================================
// SEED DATABASE
// ============================================

function seedDB(): DB {
  const db = emptyDB();
  const mk = (name: string, parentId: string | null) => {
    const f = { id: uid(), name, parentId };
    db.folders.push(f);
    return f.id;
  };

  const cima = mk("CIMA", null);
  const ma = mk("Management Accounting", cima);
  const budg = mk("Budgeting", ma);
  mk("Costing", ma);
  const daily = mk("Daily English", null);
  const idioms = mk("Idioms", daily);
  const tv = mk("TV Series", null);
  const suits = mk("Suits", tv);

  const words: [string, string, string, string, string, string, string[]][] = [
    ["Allocate", "To distribute something for a particular purpose", "The manager allocated resources to the project.", budg, "Hard", "University", ["Finance", "Work"]],
    ["Variance", "The difference between planned and actual results", "The team analysed the cost variance.", budg, "Good", "University", ["Finance"]],
    ["Forecast", "To predict a future figure or trend", "We forecast a rise in demand.", budg, "Good", "Book", ["Finance"]],
    ["Prudent", "Acting with care and thought for the future", "A prudent approach to spending.", cima, "Hard", "News", ["Important"]],
    ["Hit the ground running", "To start something quickly and successfully", "She hit the ground running in her new role.", idioms, "Again", "Conversation", ["Idiom"]],
    ["Leverage", "To use something to maximum advantage", "They leveraged their network to close the deal.", suits, "Easy", "Movie", ["Work"]],
    ["Compelling", "Evoking strong interest or conviction", "He made a compelling argument.", suits, "Good", "Movie", []],
  ];

  words.forEach(([w, m, ex, folderId, difficulty, source, tags], i) => {
    const created = addDays(today(), -i);
    db.words.push({
      id: uid(),
      word: w,
      meaning: m,
      example: ex,
      folderId,
      tags,
      difficulty,
      level: "B2",
      source,
      createdAt: created,
      due: addDays(today(), i % 3 === 0 ? 0 : i - 2),
      stage: i % 3,
      history: [],
    });
  });

  db.links.push({ id: uid(), a: db.words[0]!.id, b: db.words[2]!.id, type: "same topic" });
  db.logs.push(
    { id: uid(), date: today(), typeId: "a-voc", minutes: 30 },
    { id: uid(), date: today(), typeId: "a-read", minutes: 45 },
    { id: uid(), date: addDays(today(), -1), typeId: "a-speak", minutes: 20 }
  );
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
    folders.filter((f) => f.parentId === parent).forEach((f) => {
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
// SRS (Spaced Repetition System)
// ============================================

export function applyReview(w: Word, rating: "Again" | "Hard" | "Good" | "Easy", schedule: number[]) {
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
// STORE CONTEXT
// ============================================

type Ctx = {
  db: DB;
  ready: boolean;
  loading: boolean;
  userId: string | null;
  isAuthenticated: boolean;
  update: (fn: (d: DB) => void) => void;
  reset: () => void;
  saveToTurso: (userId: string, data: DB) => Promise<{ success: boolean; error?: any }>;
  loadFromTurso: (userId: string) => Promise<{ success: boolean; data?: DB; error?: any }>;
  syncFromCloud: () => Promise<{ success: boolean; data?: DB; error?: any }>;
};

const StoreContext = createContext<Ctx | null>(null);

// ============================================
// STORE PROVIDER
// ============================================

export function StoreProvider({ children }: { children: ReactNode }) {
  const [db, setDb] = useState<DB>(() => emptyDB());
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // ============================================
  // TURSO FUNCTIONS
  // ============================================

  const saveToTurso = useCallback(async (userId: string, data: DB) => {
    try {
      const result = await tursoDb.save(userId, data);
      if (!result.success) {
        console.error("❌ Turso save failed:", result.error);
      } else {
        console.log("✅ Turso save successful for user:", userId);
      }
      return result;
    } catch (error) {
      console.error("❌ Turso save error:", error);
      return { success: false, error };
    }
  }, []);

  const loadFromTurso = useCallback(async (userId: string) => {
    try {
      const result = await tursoDb.load(userId);
      if (result.success && result.data) {
        const loadedData = { ...emptyDB(), ...result.data };
        setDb(loadedData);
        localStorage.setItem(KEY, JSON.stringify(loadedData));
        console.log("✅ Turso load successful for user:", userId);
        return { success: true, data: loadedData };
      }
      console.log("ℹ️ No data in Turso for user:", userId);
      return { success: true, data: null };
    } catch (error) {
      console.error("❌ Turso load error:", error);
      return { success: false, error };
    }
  }, []);

  const syncFromCloud = useCallback(async () => {
    if (!userId) {
      console.warn("⚠️ No user ID for cloud sync");
      return { success: false, error: "No user logged in" };
    }
    console.log("🔄 Syncing from Turso...");
    const result = await loadFromTurso(userId);
    if (result.success && result.data) {
      setDb(result.data);
      console.log("✅ Sync complete");
    }
    return result;
  }, [userId, loadFromTurso]);

  // ============================================
  // UPDATE FUNCTION
  // ============================================

  const update = useCallback((fn: (d: DB) => void) => {
    setDb((prev) => {
      const next: DB = JSON.parse(JSON.stringify(prev));
      fn(next);

      // Save to localStorage (fallback)
      try {
        localStorage.setItem(KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }

      // Save to Turso if authenticated
      if (userId) {
        saveToTurso(userId, next);
      }

      return next;
    });
  }, [userId, saveToTurso]);

  // ============================================
  // RESET FUNCTION
  // ============================================

  const reset = useCallback(() => {
    const fresh = seedDB();
    localStorage.setItem(KEY, JSON.stringify(fresh));
    setDb(fresh);
    if (userId) {
      saveToTurso(userId, fresh);
    }
  }, [userId, saveToTurso]);

  // ============================================
  // INIT - LOAD DATA
  // ============================================

  useEffect(() => {
    const init = async () => {
      setLoading(true);

      // Check for existing session (Supabase Auth)
      // Note: You'll need to import supabase if using it
      // For now, we'll check localStorage for userId
      const storedUserId = localStorage.getItem("english-os-user-id");
      
      if (storedUserId) {
        setUserId(storedUserId);
        setIsAuthenticated(true);
        
        // Try loading from Turso first
        const result = await loadFromTurso(storedUserId);
        if (!result.success || !result.data) {
          // Fallback to localStorage
          try {
            const raw = localStorage.getItem(KEY);
            if (raw) {
              setDb({ ...emptyDB(), ...JSON.parse(raw) });
            } else {
              setDb(seedDB());
            }
          } catch {
            setDb(seedDB());
          }
        }
      } else {
        // No user - load from localStorage only
        try {
          const raw = localStorage.getItem(KEY);
          if (raw) {
            setDb({ ...emptyDB(), ...JSON.parse(raw) });
          } else {
            setDb(seedDB());
          }
        } catch {
          setDb(seedDB());
        }
      }

      setReady(true);
      setLoading(false);
    };

    init();
  }, [loadFromTurso]);

  // ============================================
  // CONTEXT VALUE
  // ============================================

  const value = useMemo(() => ({
    db,
    ready,
    loading,
    userId,
    isAuthenticated,
    update,
    reset,
    saveToTurso,
    loadFromTurso,
    syncFromCloud,
  }), [db, ready, loading, userId, isAuthenticated, update, reset, saveToTurso, loadFromTurso, syncFromCloud]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

// ============================================
// USE STORE HOOK
// ============================================

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}