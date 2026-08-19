// src/lib/store.tsx - Turso Database Version
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { query, queryOne, db } from './db';

// ============= TYPES (Keep these exactly as they were) =============
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
export type ActivityLog = { id: string; date: string; typeId: string; minutes: number; note?: string };
export type DayBlock = { id: string; date: string; hour: number; label: string; typeId: string | null };
export type Settings = {
  schedule: number[];
  dropdowns: { difficulty: string[]; level: string[]; source: string[]; linkTypes: string[] };
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

// ============= HELPERS (Keep these exactly as they were) =============
export const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
export const today = () => new Date().toISOString().slice(0, 10);
export const addDays = (iso: string, n: number) => {
  const d = new Date(iso + 'T00:00:00');
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
};

export function emptyDB(): DB {
  return {
    words: [],
    folders: [],
    links: [],
    activityTypes: [
      { id: 'a-voc', name: 'Vocabulary' },
      { id: 'a-read', name: 'Reading' },
      { id: 'a-write', name: 'Writing' },
      { id: 'a-listen', name: 'Listening' },
      { id: 'a-speak', name: 'Speaking' },
      { id: 'a-gram', name: 'Grammar' },
    ],
    logs: [],
    blocks: [],
    settings: {
      schedule: [1, 2, 4, 7, 14, 30],
      dropdowns: {
        difficulty: ['Again', 'Hard', 'Good', 'Easy'],
        level: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'],
        source: ['Book', 'Movie', 'YouTube', 'University', 'Conversation', 'News'],
        linkTypes: ['related to', 'similar meaning', 'opposite of', 'same topic'],
      },
      reminder: { time: '20:00', onDue: true, threshold: 10, onIdle: true },
    },
  };
}

function seedDB(): DB {
  const db = emptyDB();
  const mk = (name: string, parentId: string | null) => {
    const f = { id: uid(), name, parentId };
    db.folders.push(f);
    return f.id;
  };
  const cima = mk('CIMA', null);
  const ma = mk('Management Accounting', cima);
  const budg = mk('Budgeting', ma);
  mk('Costing', ma);
  const daily = mk('Daily English', null);
  const idioms = mk('Idioms', daily);
  const tv = mk('TV Series', null);
  const suits = mk('Suits', tv);

  const words: [string, string, string, string, string, string, string[]][] = [
    ['Allocate', 'To distribute something for a particular purpose', 'The manager allocated resources to the project.', budg, 'Hard', 'University', ['Finance', 'Work']],
    ['Variance', 'The difference between planned and actual results', 'The team analysed the cost variance.', budg, 'Good', 'University', ['Finance']],
    ['Forecast', 'To predict a future figure or trend', 'We forecast a rise in demand.', budg, 'Good', 'Book', ['Finance']],
    ['Prudent', 'Acting with care and thought for the future', 'A prudent approach to spending.', cima, 'Hard', 'News', ['Important']],
    ['Hit the ground running', 'To start something quickly and successfully', 'She hit the ground running in her new role.', idioms, 'Again', 'Conversation', ['Idiom']],
    ['Leverage', 'To use something to maximum advantage', 'They leveraged their network to close the deal.', suits, 'Easy', 'Movie', ['Work']],
    ['Compelling', 'Evoking strong interest or conviction', 'He made a compelling argument.', suits, 'Good', 'Movie', []],
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
      level: 'B2',
      source,
      createdAt: created,
      due: addDays(today(), i % 3 === 0 ? 0 : i - 2),
      stage: i % 3,
      history: [],
    });
  });

  db.links.push({ id: uid(), a: db.words[0]!.id, b: db.words[2]!.id, type: 'same topic' });
  db.logs.push(
    { id: uid(), date: today(), typeId: 'a-voc', minutes: 30 },
    { id: uid(), date: today(), typeId: 'a-read', minutes: 45 },
    { id: uid(), date: addDays(today(), -1), typeId: 'a-speak', minutes: 20 },
  );
  return db;
}

// ============= FOLDER HELPERS (Keep these exactly as they were) =============
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
  if (!id) return 'Unfiled';
  return folderPath(folders, id).map((f) => f.name).join(' → ') || 'Unfiled';
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

export function applyReview(w: Word, rating: 'Again' | 'Hard' | 'Good' | 'Easy', schedule: number[]) {
  let stage = w.stage;
  if (rating === 'Again') stage = 0;
  else if (rating === 'Hard') stage = Math.max(0, stage);
  else if (rating === 'Good') stage = stage + 1;
  else stage = stage + 2;
  const idx = Math.min(stage, schedule.length - 1);
  let days = schedule[idx] ?? 1;
  if (rating === 'Again') days = 0;
  if (rating === 'Hard') days = Math.max(1, Math.round(days / 2));
  w.stage = stage;
  w.difficulty = rating;
  w.due = addDays(today(), days);
  w.history = [...(w.history ?? []), { date: today(), rating }];
  return w;
}

export const minutesFmt = (m: number) => `${Math.floor(m / 60)}h ${m % 60}m`;

// ============= TURSO DATABASE FUNCTIONS =============

// Load all data from Turso
async function loadFromTurso(): Promise<DB> {
  const db = emptyDB();

  // Load folders
  const folders = await query<Folder>('SELECT * FROM folders ORDER BY name');
  db.folders = folders;

  // Load words
  const words = await query<Word>('SELECT * FROM words ORDER BY word');
  db.words = words.map(w => ({
    ...w,
    tags: JSON.parse(w.tags as unknown as string),
    history: JSON.parse(w.history as unknown as string),
  }));

  // Load word links
  const links = await query<WordLink>('SELECT * FROM word_links');
  db.links = links;

  // Load activity types
  const activityTypes = await query<ActivityType>('SELECT * FROM activity_types ORDER BY name');
  db.activityTypes = activityTypes;

  // Load activity logs
  const logs = await query<ActivityLog>('SELECT * FROM activity_logs ORDER BY log_date DESC');
  db.logs = logs;

  // Load day blocks
  const blocks = await query<DayBlock>('SELECT * FROM day_blocks ORDER BY block_date, hour');
  db.blocks = blocks;

  // Load settings
  const settings = await queryOne<Settings>('SELECT schedule, dropdowns, reminder FROM settings WHERE id = 1');
  if (settings) {
    db.settings = {
      schedule: JSON.parse(settings.schedule as unknown as string),
      dropdowns: JSON.parse(settings.dropdowns as unknown as string),
      reminder: JSON.parse(settings.reminder as unknown as string),
    };
  }

  return db;
}

// Save entire DB to Turso (used for initial seed or reset)
async function saveToTurso(db: DB) {
  // Clear existing data
  await db.execute('DELETE FROM folders');
  await db.execute('DELETE FROM words');
  await db.execute('DELETE FROM word_links');
  await db.execute('DELETE FROM activity_types');
  await db.execute('DELETE FROM activity_logs');
  await db.execute('DELETE FROM day_blocks');
  await db.execute('DELETE FROM settings');

  // Insert folders
  for (const folder of db.folders) {
    await db.execute({
      sql: 'INSERT INTO folders (id, name, parent_id) VALUES (?, ?, ?)',
      args: [folder.id, folder.name, folder.parentId],
    });
  }

  // Insert words
  for (const word of db.words) {
    await db.execute({
      sql: `INSERT INTO words (id, word, meaning, example, folder_id, tags, difficulty, level, source, created_at, due, stage, history) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        word.id,
        word.word,
        word.meaning,
        word.example,
        word.folderId,
        JSON.stringify(word.tags),
        word.difficulty,
        word.level,
        word.source,
        word.createdAt,
        word.due,
        word.stage,
        JSON.stringify(word.history),
      ],
    });
  }

  // Insert word links
  for (const link of db.links) {
    await db.execute({
      sql: 'INSERT INTO word_links (id, word_a_id, word_b_id, type) VALUES (?, ?, ?, ?)',
      args: [link.id, link.a, link.b, link.type],
    });
  }

  // Insert activity types
  for (const type of db.activityTypes) {
    await db.execute({
      sql: 'INSERT INTO activity_types (id, name) VALUES (?, ?)',
      args: [type.id, type.name],
    });
  }

  // Insert activity logs
  for (const log of db.logs) {
    await db.execute({
      sql: 'INSERT INTO activity_logs (id, log_date, type_id, minutes, note) VALUES (?, ?, ?, ?, ?)',
      args: [log.id, log.date, log.typeId, log.minutes, log.note || null],
    });
  }

  // Insert day blocks
  for (const block of db.blocks) {
    await db.execute({
      sql: 'INSERT INTO day_blocks (id, block_date, hour, label, type_id) VALUES (?, ?, ?, ?, ?)',
      args: [block.id, block.date, block.hour, block.label, block.typeId],
    });
  }

  // Insert settings
  await db.execute({
    sql: 'INSERT INTO settings (id, schedule, dropdowns, reminder) VALUES (1, ?, ?, ?)',
    args: [
      JSON.stringify(db.settings.schedule),
      JSON.stringify(db.settings.dropdowns),
      JSON.stringify(db.settings.reminder),
    ],
  });
}

// ============= STORE CONTEXT =============
type Ctx = {
  db: DB;
  ready: boolean;
  loading: boolean;
  update: (fn: (d: DB) => void) => void;
  reset: () => void;
};

const StoreContext = createContext<Ctx | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [db, setDb] = useState<DB>(() => emptyDB());
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load data from Turso on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await loadFromTurso();
        
        // Check if we got any data, if not seed the database
        if (data.words.length === 0 && data.folders.length === 0) {
          const seedData = seedDB();
          await saveToTurso(seedData);
          setDb(seedData);
        } else {
          setDb(data);
        }
      } catch (error) {
        console.error('Failed to load from Turso:', error);
        // Fallback to seed data
        const seedData = seedDB();
        setDb(seedData);
      } finally {
        setLoading(false);
        setReady(true);
      }
    };
    loadData();
  }, []);

  // Update function - writes to Turso
  const update = useCallback((fn: (d: DB) => void) => {
    setDb((prev) => {
      const next: DB = JSON.parse(JSON.stringify(prev));
      fn(next);
      
      // Save to Turso in background
      saveToTurso(next).catch((error) => {
        console.error('Failed to save to Turso:', error);
      });
      
      return next;
    });
  }, []);

  // Reset function - resets to seed data
  const reset = useCallback(async () => {
    const fresh = seedDB();
    try {
      await saveToTurso(fresh);
      setDb(fresh);
    } catch (error) {
      console.error('Failed to reset database:', error);
    }
  }, []);

  const value = useMemo(() => ({
    db,
    ready,
    loading,
    update,
    reset,
  }), [db, ready, loading, update, reset]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used inside StoreProvider');
  return ctx;
}