import { createClient } from '@libsql/client';

// ============================================
// GET ENVIRONMENT VARIABLES
// ============================================
const url = import.meta.env.DATABASE_URL || import.meta.env.VITE_DATABASE_URL;
const authToken = import.meta.env.TURSO_AUTH_TOKEN || import.meta.env.VITE_TURSO_AUTH_TOKEN;

// ============================================
// DEBUG LOGGING
// ============================================
console.log('🔍 DATABASE_URL:', url ? '✅ Set' : '❌ Missing');
console.log('🔍 TURSO_AUTH_TOKEN:', authToken ? '✅ Set' : '❌ Missing');

if (!url) {
  console.error('❌ DATABASE_URL is not set in environment variables');
}

if (!authToken) {
  console.error('❌ TURSO_AUTH_TOKEN is not set in environment variables');
}

// ============================================
// CREATE TURSO CLIENT
// ============================================
let db: any;

try {
  db = createClient({
    url: url || 'libsql://english-learning-kaveen12.aws-ap-south-1.turso.io',
    authToken: authToken || '',
  });
  console.log('✅ Turso client created successfully');
} catch (error) {
  console.error('❌ Failed to create Turso client:', error);
  // Create a dummy client that won't crash the app
  db = {
    execute: async () => {
      console.warn('⚠️ Using dummy database client');
      return { rows: [] };
    }
  };
}

export { db };

// ============================================
// QUERY FUNCTIONS
// ============================================

export async function query<T = any>(sql: string, params: any[] = []): Promise<T[]> {
  try {
    if (!db || typeof db.execute !== 'function') {
      console.warn('⚠️ Database client not available, returning empty result');
      return [];
    }
    
    console.log(`📤 Executing query: ${sql.substring(0, 100)}${sql.length > 100 ? '...' : ''}`);
    const result = await db.execute({ sql, args: params });
    
    if (result && result.rows) {
      console.log(`📥 Query returned ${result.rows.length} rows`);
      return result.rows as T[];
    }
    
    return [];
  } catch (error) {
    console.error('❌ Query error:', error);
    console.error('❌ SQL:', sql);
    console.error('❌ Params:', params);
    return [];
  }
}

export async function queryOne<T = any>(sql: string, params: any[] = []): Promise<T | null> {
  try {
    if (!db || typeof db.execute !== 'function') {
      console.warn('⚠️ Database client not available, returning null');
      return null;
    }
    
    console.log(`📤 Executing query (one): ${sql.substring(0, 100)}${sql.length > 100 ? '...' : ''}`);
    const result = await db.execute({ sql, args: params });
    
    if (result && result.rows && result.rows.length > 0) {
      console.log(`📥 Query returned 1 row`);
      return result.rows[0] as T;
    }
    
    return null;
  } catch (error) {
    console.error('❌ Query error:', error);
    console.error('❌ SQL:', sql);
    console.error('❌ Params:', params);
    return null;
  }
}

// ============================================
// TEST CONNECTION FUNCTION
// ============================================

export async function testConnection(): Promise<boolean> {
  try {
    console.log('🔌 Testing Turso connection...');
    const result = await query('SELECT 1 as test');
    if (result && result.length > 0) {
      console.log('✅ Turso connection test passed!');
      return true;
    }
    console.log('❌ Turso connection test failed - no result');
    return false;
  } catch (error) {
    console.error('❌ Turso connection test failed:', error);
    return false;
  }
}