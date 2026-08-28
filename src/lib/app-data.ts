import { desc, eq } from "drizzle-orm";
import { db } from "@/lib/db/neon";
import {
  circleMemberships,
  circles,
  conversations,
  messages,
  notifications,
  posts,
} from "@/lib/db/schema";

export async function getUnreadCounts(userId?: string) {
  if (!db) {
    return { circles: 0, messages: 0, notifications: 0 };
  }

  try {
    const [allConversations, userNotifications] = await Promise.all([
      db.select().from(conversations),
      userId
        ? db.select().from(notifications).where(eq(notifications.userId, userId))
        : db.select().from(notifications),
    ]);

    return {
      circles: 0,
      messages: allConversations.reduce((total, item) => total + item.unreadCount, 0),
      notifications: userNotifications.filter((item) => !item.read).length,
    };
  } catch {
    return { circles: 0, messages: 0, notifications: 0 };
  }
}

export async function getProfileStats(userId?: string) {
  if (!db || !userId) {
    return { circles: 0, connections: 0, posts: 0 };
  }

  try {
    const [memberships, userPosts] = await Promise.all([
      db.select().from(circleMemberships).where(eq(circleMemberships.userId, userId)),
      db.select().from(posts).where(eq(posts.authorId, userId)),
    ]);

    return {
      circles: memberships.length,
      connections: memberships.length * 8,
      posts: userPosts.length,
    };
  } catch {
    return { circles: 0, connections: 0, posts: 0 };
  }
}

export async function getCircles(userId?: string) {
  if (!db) {
    return { circles: [], joinedIds: new Set<string>(), unavailable: true };
  }

  try {
    const [items, memberships] = await Promise.all([
      db.select().from(circles).orderBy(desc(circles.memberCount), desc(circles.createdAt)),
      userId
        ? db.select().from(circleMemberships).where(eq(circleMemberships.userId, userId))
        : Promise.resolve([]),
    ]);

    return {
      circles: items,
      joinedIds: new Set(memberships.map((item) => item.circleId)),
      unavailable: false,
    };
  } catch (error) {
    console.error("Circles query failed:", error);
    return { circles: [], joinedIds: new Set<string>(), unavailable: true };
  }
}

export async function getConversations() {
  if (!db) {
    return { conversations: [], latestMessages: new Map<string, string>(), unavailable: true };
  }

  try {
    const [items, latest] = await Promise.all([
      db.select().from(conversations).orderBy(desc(conversations.updatedAt)),
      db.select().from(messages).orderBy(desc(messages.createdAt)).limit(100),
    ]);

    const latestMessages = new Map<string, string>();
    for (const message of latest) {
      if (!latestMessages.has(message.conversationId)) {
        latestMessages.set(message.conversationId, message.body);
      }
    }

    return { conversations: items, latestMessages, unavailable: false };
  } catch (error) {
    console.error("Conversations query failed:", error);
    return { conversations: [], latestMessages: new Map<string, string>(), unavailable: true };
  }
}

export async function getNotifications(userId?: string) {
  if (!db) {
    return { notifications: [], unavailable: true };
  }

  try {
    const items = userId
      ? await db
          .select()
          .from(notifications)
          .where(eq(notifications.userId, userId))
          .orderBy(desc(notifications.createdAt))
      : await db.select().from(notifications).orderBy(desc(notifications.createdAt));

    return { notifications: items, unavailable: false };
  } catch (error) {
    console.error("Notifications query failed:", error);
    return { notifications: [], unavailable: true };
  }
}
