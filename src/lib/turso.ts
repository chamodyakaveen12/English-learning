// src/lib/turso.ts
import { createClient } from "@libsql/client";

const tursoUrl = "libsql://english-kaveen12.aws-ap-south-1.turso.io";
const tursoAuthToken =
  "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3ODcyMTM0NzEsImlkIjoiMDFhMDFkYjMtY2YwMS03Y2IyLWJkMTctMTdiMDk4ZTY3MzI0Iiwia2lkIjoiMUNHcmF1eUdfUGRnRk1KTFN6aDY4RC1DdlBHU05qQkFZRndfNEJyS2ZOTSIsInJpZCI6ImQ4ZTUwNjE1LTgxODgtNDZlOS1hNGQ0LTRlNGNmNjU5MDlkNyJ9.6G2ZGioVvXOuHOmvqSppYccpW9Rx3GQdkUKq71vIFmD51syezGBjr2L-bFdFtuupyp4Av73vMhRVoAoVR-sJDA";

console.log("✅ Turso URL loaded");
console.log("✅ Turso Token loaded");

export const turso = createClient({
  url: tursoUrl,
  authToken: tursoAuthToken,
});

export const tursoDb = {
  // Register new user
  register: async (email: string, password: string) => {
    try {
      const existing = await turso.execute({
        sql: "SELECT user_id FROM app_data WHERE user_id = ?",
        args: [email],
      });

      if (existing.rows.length > 0) {
        return { success: false, error: "Email already registered" };
      }

      await turso.execute({
        sql: `INSERT INTO app_data (user_id, password, data, updated_at)
              VALUES (?, ?, ?, datetime('now'))`,
        args: [email, password, JSON.stringify({})],
      });

      return { success: true };
    } catch (error: any) {
      console.error("Register error:", error);
      return { success: false, error: error?.message || "Registration failed" };
    }
  },

  // Login
  login: async (email: string, password: string) => {
    try {
      const result = await turso.execute({
        sql: "SELECT password, data FROM app_data WHERE user_id = ?",
        args: [email],
      });

      if (result.rows.length === 0) {
        return { success: false, error: "Email not found" };
      }

      const row = result.rows[0] as any;

      if (row.password !== password) {
        return { success: false, error: "Wrong password" };
      }

      return {
        success: true,
        data: row.data ? JSON.parse(row.data) : null,
      };
    } catch (error: any) {
      console.error("Login error:", error);
      return { success: false, error: error?.message || "Login failed" };
    }
  },

  // Save full user data
  save: async (userId: string, data: any) => {
    try {
      await turso.execute({
        sql: `UPDATE app_data 
              SET data = ?, updated_at = datetime('now') 
              WHERE user_id = ?`,
        args: [JSON.stringify(data), userId],
      });
      return { success: true };
    } catch (error: any) {
      console.error("Save error:", error);
      return { success: false, error };
    }
  },

  // Load full user data
  load: async (userId: string) => {
    try {
      const result = await turso.execute({
        sql: "SELECT data FROM app_data WHERE user_id = ?",
        args: [userId],
      });

      if (result.rows.length === 0) {
        return { success: true, data: null };
      }

      const row = result.rows[0] as any;
      return {
        success: true,
        data: row.data ? JSON.parse(row.data) : null,
      };
    } catch (error: any) {
      console.error("Load error:", error);
      return { success: false, error };
    }
  },
};