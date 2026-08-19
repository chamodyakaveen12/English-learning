import { createClient } from '@libsql/client';

// Try to get environment variables safely
let url = '';
let authToken = '';

try {
  url = import.meta.env.DATABASE_URL || import.meta.env.VITE_DATABASE_URL || '';
  authToken = import.meta.env.TURSO_AUTH_TOKEN || import.meta.env.VITE_TURSO_AUTH_TOKEN || '';
} catch (e) {
  console.warn('⚠️ Could not read environment variables:', e);
}

console.log('🔍 DATABASE_URL:', url ? '✅ Set' : '❌ Missing');
console.log('🔍 TURSO_AUTH_TOKEN:', authToken ? '✅ Set' : '❌ Missing');

// Create client only if we have credentials
let db: any;

if (url && authToken) {
  try {
    db = createClient({ url, authToken });
    console.log('✅ Turso client created');
  } catch (error) {
    console.error('❌ Failed to create Turso client:', error);
    db = { execute: async () => ({ rows: [] }) };
  }
} else {
  console.warn('⚠️ Missing credentials, using dummy client');
  db = { execute: async () => ({ rows: [] }) };
}

export { db };

export async function query<T = any>(sql: string, params: any[] = []): Promise<T[]> {
  try {
    if (!db || typeof db.execute !== 'function') {
      console.warn('⚠️ Database not available, returning empty result');
      return [];
    }
    const result = await db.execute({ sql, args: params });
    return result.rows as T[];
  } catch (error) {
    console.error('❌ Query error:', error);
    return [];
  }
}

export async function queryOne<T = any>(sql: string, params: any[] = []): Promise<T | null> {
  try {
    if (!db || typeof db.execute !== 'function') {
      console.warn('⚠️ Database not available, returning null');
      return null;
    }
    const result = await db.execute({ sql, args: params });
    return (result.rows[0] as T) || null;
  } catch (error) {
    console.error('❌ Query error:', error);
    return null;
  }
}