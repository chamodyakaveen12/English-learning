import { createClient } from '@libsql/client';

const url = import.meta.env.DATABASE_URL || import.meta.env.VITE_DATABASE_URL;
const authToken = import.meta.env.TURSO_AUTH_TOKEN || import.meta.env.VITE_TURSO_AUTH_TOKEN;

if (!url) {
  console.error('❌ DATABASE_URL is not set');
}

if (!authToken) {
  console.error('❌ TURSO_AUTH_TOKEN is not set');
}

export const db = createClient({ 
  url: url || '',
  authToken: authToken || '',
});

export async function query<T = any>(sql: string, params: any[] = []): Promise<T[]> {
  try {
    const result = await db.execute({ sql, args: params });
    return result.rows as T[];
  } catch (error) {
    console.error('❌ Query error:', error);
    return [];
  }
}

export async function queryOne<T = any>(sql: string, params: any[] = []): Promise<T | null> {
  try {
    const result = await db.execute({ sql, args: params });
    return (result.rows[0] as T) || null;
  } catch (error) {
    console.error('❌ Query error:', error);
    return null;
  }
}