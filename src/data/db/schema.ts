import { relations, sql } from "drizzle-orm";
import {
  index,
  integer,
  sqliteTable,
  text,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";

export const users = sqliteTable(
  "users",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    email: text("email").notNull(),
    password: text("password").notNull(),
    tokensValidAfter: integer("tokens_valid_after", {
      mode: "timestamp",
    })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => ({
    emailIdx: uniqueIndex("email_idx").on(table.email),
  }),
);

export const clips = sqliteTable("clips", {
  id: text("id").notNull().primaryKey(),
  userId: integer("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  title: text("title").notNull(),
  status: text("status").default("uploading").notNull(),
  videoFormat: text("video_format").notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  clips: many(clips),
}));

export const clipsRelations = relations(clips, ({ one }) => ({
  users: one(users, {
    fields: [clips.userId],
    references: [users.id],
  }),
}));
