// db/schema.ts
import { pgTable, text, jsonb, timestamp } from "drizzle-orm/pg-core";

export const appData = pgTable("app_data", {
  id: text().primaryKey(),
  data: jsonb().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
