"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth/session";
import { db } from "@/lib/db/neon";
import { posts } from "@/lib/db/schema";

function generateId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
}

function makeHandle(name: string) {
  const normalized = name
    .trim()
    .toLocaleLowerCase("tr-TR")
    .replace(/[^a-z0-9ığüşöçİĞÜŞÖÇ]+/gi, "")
    .slice(0, 24);

  return normalized ? `@${normalized}` : "@vexa";
}

export async function createPost(formData: FormData) {
  if (!db) {
    throw new Error("DATABASE_URL ayarlı değil.");
  }

  const user = await getCurrentUser();
  const title = String(formData.get("title") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  const locale = String(formData.get("locale") ?? "tr").trim() || "tr";

  if (!user) {
    throw new Error("Gönderi paylaşmak için giriş yapmalısın.");
  }

  if (!title || !body) {
    throw new Error("Başlık ve gönderi metni gereklidir.");
  }

  await db.insert(posts).values({
    id: generateId(),
    authorId: user.id,
    authorName: user.name,
    authorHandle: makeHandle(user.name),
    authorImage: user.image,
    title,
    body,
  });

  revalidatePath(`/${locale}/kesfet`);
}
