import { pgTable, text, jsonb, timestamp } from "drizzle-orm/pg-core";

export const profiles = pgTable("profiles", {
  userId: text("user_id").primaryKey(),
  vocabList: jsonb("vocab_list").notNull().default([]),
  stats: jsonb("stats").notNull().default({}),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
