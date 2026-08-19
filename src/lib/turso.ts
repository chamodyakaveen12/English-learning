// src/lib/turso.ts
import { createClient } from '@libsql/client';

// ============================================
// TURSO DATABASE CLIENT
// ============================================

// Get credentials from environment variables
const tursoUrl = import.meta.env.VITE_TURSO_URL;
const tursoAuthToken = import.meta.env.VITE_TURSO_AUTH_TOKEN;

// Validate environment variables
if (!tursoUrl) {
  console.error('❌ VITE_TURSO_URL is not set in .env file');
  throw new Error('VITE_TURSO_URL environment variable is not set');
}

if (!tursoAuthToken) {
  console.error('❌ VITE_TURSO_AUTH_TOKEN is not set in .env file');
  throw new Error('VITE_TURSO_AUTH_TOKEN environment variable is not set');
}

console.log('✅ Turso client initialized');
console.log(`📡 Database URL: ${tursoUrl.substring(0, 50)}...`);

// Create Turso client
export const turso = createClient({
  url: tursoUrl,
  authToken: tursoAuthToken,
});

// ============================================
// DATABASE OPERATIONS
// ============================================

export const tursoDb = {
  /**
   * Save user data to Turso
   * @param userId - The user's unique ID
   * @param data - The user's data object
   * @returns { success: boolean, error?: any }
   */
  save: async (userId: string, data: any) => {
    try {
      const result = await turso.execute({
        sql: `INSERT OR REPLACE INTO app_data (user_id, data, updated_at) 
              VALUES (?, ?, datetime('now'))`,
        args: [userId, JSON.stringify(data)],
      });
      console.log(`✅ Data saved for user: ${userId}`);
      return { success: true, result };
    } catch (error) {
      console.error('❌ Turso save error:', error);
      return { success: false, error };
    }
  },

  /**
   * Load user data from Turso
   * @param userId - The user's unique ID
   * @returns { success: boolean, data?: any, error?: any }
   */
  load: async (userId: string) => {
    try {
      const result = await turso.execute({
        sql: 'SELECT data FROM app_data WHERE user_id = ?',
        args: [userId],
      });
      
      if (result.rows && result.rows.length > 0) {
        const row = result.rows[0] as any;
        console.log(`✅ Data loaded for user: ${userId}`);
        return { 
          success: true, 
          data: JSON.parse(row.data as string) 
        };
      }
      
      console.log(`ℹ️ No data found for user: ${userId}`);
      return { success: true, data: null };
    } catch (error) {
      console.error('❌ Turso load error:', error);
      return { success: false, error };
    }
  },

  /**
   * Delete user data from Turso
   * @param userId - The user's unique ID
   * @returns { success: boolean, error?: any }
   */
  delete: async (userId: string) => {
    try {
      const result = await turso.execute({
        sql: 'DELETE FROM app_data WHERE user_id = ?',
        args: [userId],
      });
      console.log(`🗑️ Data deleted for user: ${userId}`);
      return { success: true, result };
    } catch (error) {
      console.error('❌ Turso delete error:', error);
      return { success: false, error };
    }
  },

  /**
   * Get all users (admin only)
   * @returns { success: boolean, rows?: any[], error?: any }
   */
  getAllUsers: async () => {
    try {
      const result = await turso.execute({
        sql: 'SELECT user_id, updated_at FROM app_data ORDER BY updated_at DESC',
        args: [],
      });
      console.log(`📊 Found ${result.rows?.length || 0} users`);
      return { success: true, rows: result.rows };
    } catch (error) {
      console.error('❌ Turso get all users error:', error);
      return { success: false, error };
    }
  },

  /**
   * Check if user exists in database
   * @param userId - The user's unique ID
   * @returns { success: boolean, exists: boolean, error?: any }
   */
  userExists: async (userId: string) => {
    try {
      const result = await turso.execute({
        sql: 'SELECT user_id FROM app_data WHERE user_id = ?',
        args: [userId],
      });
      const exists = result.rows && result.rows.length > 0;
      console.log(`🔍 User ${userId}: ${exists ? 'exists' : 'not found'}`);
      return { success: true, exists };
    } catch (error) {
      console.error('❌ Turso user exists error:', error);
      return { success: false, error };
    }
  },
};

export default turso;