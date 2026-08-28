import { boolean, integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  image: text("image"),
  passwordHash: text("password_hash"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export const sessions = pgTable("sessions", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type Session = typeof sessions.$inferSelect;
export type NewSession = typeof sessions.$inferInsert;

export const posts = pgTable("posts", {
  id: text("id").primaryKey(),
  authorId: text("author_id").references(() => users.id),
  authorName: text("author_name").notNull(),
  authorHandle: text("author_handle").notNull(),
  authorImage: text("author_image"),
  title: text("title").notNull(),
  body: text("body").notNull(),
  likes: integer("likes").notNull().default(0),
  comments: integer("comments").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type Post = typeof posts.$inferSelect;
export type NewPost = typeof posts.$inferInsert;

export const circles = pgTable("circles", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  tags: text("tags").notNull().default(""),
  memberCount: integer("member_count").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const circleMemberships = pgTable("circle_memberships", {
  id: text("id").primaryKey(),
  circleId: text("circle_id")
    .notNull()
    .references(() => circles.id),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const conversations = pgTable("conversations", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  isGroup: boolean("is_group").notNull().default(false),
  image: text("image"),
  unreadCount: integer("unread_count").notNull().default(0),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const messages = pgTable("messages", {
  id: text("id").primaryKey(),
  conversationId: text("conversation_id")
    .notNull()
    .references(() => conversations.id),
  senderName: text("sender_name").notNull(),
  body: text("body").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const notifications = pgTable("notifications", {
  id: text("id").primaryKey(),
  userId: text("user_id").references(() => users.id),
  title: text("title").notNull(),
  body: text("body").notNull(),
  kind: text("kind").notNull().default("info"),
  read: boolean("read").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
