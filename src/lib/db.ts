import { createClient } from '@libsql/client';

// Only try to connect on the client side
const isServer = typeof window === 'undefined';

// Use environment variables
const url = import.meta.env.DATABASE_URL || import.meta.env.VITE_DATABASE_URL;
const authToken = import.meta.env.TURSO_AUTH_TOKEN || import.meta.env.VITE_TURSO_AUTH_TOKEN;

console.log('🔍 DATABASE_URL:', url ? '✅ Set' : '❌ Missing');
console.log('🔍 TURSO_AUTH_TOKEN:', authToken ? '✅ Set' : '❌ Missing');

// Only create client if we have credentials
let dbClient: any = null;

if (!isServer && url && authToken) {
  try {
    dbClient = createClient({ 
      url,
      authToken,
    });
    console.log('✅ Turso client created successfully');
  } catch (error) {
    console.error('❌ Failed to create Turso client:', error);
  }
} else {
  console.log('⚠️ Turso client not created (server-side or missing credentials)');
}

// Export a dummy client if real one doesn't exist
export const db = dbClient || {
  execute: async () => ({ rows: [] }),
};

export async function query<T = any>(sql: string, params: any[] = []): Promise<T[]> {
  try {
    if (!dbClient) {
      console.warn('⚠️ Turso client not available, returning empty result');
      return [];
    }
    const result = await db.execute({ sql, args: params });
    return result.rows as T[];
  } catch (error) {
    console.error('❌ Database query error:', error);
    return [];
  }
}

export async function queryOne<T = any>(sql: string, params: any[] = []): Promise<T | null> {
  try {
    if (!dbClient) {
      console.warn('⚠️ Turso client not available, returning null');
      return null;
    }
    const result = await db.execute({ sql, args: params });
    return (result.rows[0] as T) || null;
  } catch (error) {
    console.error('❌ Database query error:', error);
    return null;
  }
}