"use server";

import { revalidatePath } from "next/cache";
import { desc, eq } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth/session";
import { db } from "@/lib/db/neon";
import { conversations, messages } from "@/lib/db/schema";

function generateId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
}

export async function sendMessage(formData: FormData) {
  if (!db) {
    throw new Error("DATABASE_URL ayarlı değil.");
  }

  const user = await getCurrentUser();
  const locale = String(formData.get("locale") ?? "tr").trim() || "tr";
  const body = String(formData.get("body") ?? "").trim();

  if (!user || !body) {
    throw new Error("Mesaj göndermek için giriş yapmalısın.");
  }

  const existing = await db
    .select()
    .from(conversations)
    .orderBy(desc(conversations.updatedAt))
    .limit(1);

  const conversationId = existing[0]?.id ?? generateId();

  if (!existing[0]) {
    await db.insert(conversations).values({
      id: conversationId,
      title: "VEXA Destek",
      unreadCount: 0,
    });
  }

  await db.insert(messages).values({
    id: generateId(),
    conversationId,
    senderName: user.name,
    body,
  });

  await db
    .update(conversations)
    .set({ updatedAt: new Date() })
    .where(eq(conversations.id, conversationId));

  revalidatePath(`/${locale}/mesajlar`);
}
