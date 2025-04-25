import { relations } from "drizzle-orm";
import {
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  clerkId: varchar("clerk_id", { length: 255 }).notNull().unique(),
  firstName: varchar("first_name", { length: 255 }).notNull(),
  lastName: varchar("last_name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  createdAT: timestamp("created_at").notNull().defaultNow(),
  updatedAT: timestamp("updated_at").$onUpdate(() => new Date()),
});

export const presentations = pgTable(
  "presentations",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    userId: integer("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    title: varchar("title", { length: 255 }).notNull(),
    fileUrl: varchar("file_url", { length: 512 }).notNull(),
    createdAT: timestamp("created_at").notNull().defaultNow(),
    updatedAT: timestamp("updated_at").$onUpdate(() => new Date()),
  },
  (table) => [
    index("presentations_user_id_idx").on(table.userId),
    index("presentations_created_at_idx").on(table.createdAT),
  ]
);

export const presentationVersions = pgTable(
  "presentation_versions",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    presentationId: integer("presentation_id")
      .references(() => presentations.id, { onDelete: "cascade" })
      .notNull(),
    promptId: integer("prompt_id")
      .references(() => prompts.id, { onDelete: "cascade" })
      .notNull(),
    fileUrl: varchar("file_url", { length: 512 }).notNull(),
    previewImageUrl: varchar("preview_image_url", { length: 512 }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [
    index("presentation_versions_presentation_id_idx").on(table.presentationId),
  ]
);

export const prompts = pgTable(
  "prompts",
  {
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
    updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
  },
  (table) => [
    index("prompts_presentation_id_idx").on(table.presentationId),
    index("prompts_parent_prompt_id_idx").on(table.parentPromptId),
    index("prompts_created_at_idx").on(table.createdAt),
  ]
);

/* Relations */
export const usersRelations = relations(users, ({ many }) => ({
  presentations: many(presentations),
  prompts: many(prompts),
}));

export const presentationsRelations = relations(
  presentations,
  ({ one, many }) => ({
    user: one(users, {
      fields: [presentations.userId],
      references: [users.id],
    }),
    prompts: many(prompts),
  })
);

export const presentationVersionsRelations = relations(
  presentationVersions,
  ({ one }) => ({
    presentation: one(presentations, {
      fields: [presentationVersions.presentationId],
      references: [presentations.id],
    }),
    prompt: one(prompts, {
      fields: [presentationVersions.promptId],
      references: [prompts.id],
    }),
  })
);

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
