import { relations } from "drizzle-orm";
import { integer, jsonb, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  firstName: varchar('first_name', { length: 255 }).notNull(),
  lastName: varchar('last_name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  createdAT: timestamp("created_at").notNull().defaultNow(),
  updatedAT: timestamp("updated_at").notNull().$onUpdate(() => new Date()),
});

export const presentations = pgTable("presentations", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: integer('user_id').references(() => users.id, { onDelete: 'cascade'}).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  description: varchar('description', { length: 255 }),
  prompt: varchar('prompt', { length: 255 }).notNull(),
  createdAT: timestamp("created_at").notNull().defaultNow(),
  updatedAT: timestamp("updated_at").notNull().$onUpdate(() => new Date()),
});

export const prompts = pgTable("prompts", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  userId: integer("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  presentationId: integer("presentation_id")
    .references(() => presentations.id)
    .notNull(),
  parentPromptId: integer("parent_prompt_id"),
  prompt: text("prompt").notNull(),
  response: jsonb("response"), // incluye file URL, resumen, preview URL
  model: varchar("model", { length: 50 }), // ej. "gpt-4"
  tokensUsed: integer("tokens_used"),
  type: varchar("type", { length: 30 }), // ej. "rewrite", "tone-change", "audience-adapt"
  accumulatedSummary: text("accumulated_summary"), // resumen encadenado de iteraciones
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().$onUpdate(() => new Date()),
});

/* Relations */
export const usersRelations = relations(users, ({ many }) => ({
  presentations: many(presentations),
  prompts: many(prompts),
}))

export const presentationsRelations = relations(presentations, ({ one, many }) => ({
  user: one(users, {
    fields: [presentations.userId],
    references: [users.id],
  }),
  prompts: many(prompts),
}))

export const promptsRelations = relations(prompts, ({ one }) => ({
  user: one(users, {
    fields: [prompts.userId],
    references: [users.id],
  }),
  presentation: one(presentations, {
    fields: [prompts.presentationId],
    references: [presentations.id],
  }),
}))

export type User = typeof users.$inferSelect;
export type Presentation = typeof presentations.$inferSelect;
export type Prompt = typeof prompts.$inferSelect;
