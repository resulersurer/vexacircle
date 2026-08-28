"use server";

import { revalidatePath } from "next/cache";
import { and, eq, sql } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth/session";
import { db } from "@/lib/db/neon";
import { circleMemberships, circles } from "@/lib/db/schema";

function generateId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
}

function normalizeTags(value: FormDataEntryValue | null) {
  return String(value ?? "")
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean)
    .slice(0, 5)
    .join(",");
}

export async function createCircle(formData: FormData) {
  if (!db) {
    throw new Error("DATABASE_URL ayarlı değil.");
  }

  const locale = String(formData.get("locale") ?? "tr").trim() || "tr";
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const tags = normalizeTags(formData.get("tags"));

  if (!name || !description) {
    throw new Error("Topluluk adı ve açıklama gereklidir.");
  }

  const circleId = generateId();
  const user = await getCurrentUser();

  await db.insert(circles).values({
    id: circleId,
    name,
    description,
    tags,
    memberCount: user ? 1 : 0,
  });

  if (user) {
    await db.insert(circleMemberships).values({
      id: generateId(),
      circleId,
      userId: user.id,
    });
  }

  revalidatePath(`/${locale}/topluluklar`);
}

export async function toggleCircleMembership(formData: FormData) {
  if (!db) {
    throw new Error("DATABASE_URL ayarlı değil.");
  }

  const user = await getCurrentUser();
  const locale = String(formData.get("locale") ?? "tr").trim() || "tr";
  const circleId = String(formData.get("circleId") ?? "").trim();

  if (!user || !circleId) {
    throw new Error("Topluluğa katılmak için giriş yapmalısın.");
  }

  const existing = await db
    .select()
    .from(circleMemberships)
    .where(and(eq(circleMemberships.userId, user.id), eq(circleMemberships.circleId, circleId)))
    .limit(1);

  if (existing[0]) {
    await db.delete(circleMemberships).where(eq(circleMemberships.id, existing[0].id));
    await db
      .update(circles)
      .set({ memberCount: sql`greatest(${circles.memberCount} - 1, 0)`, updatedAt: new Date() })
      .where(eq(circles.id, circleId));
  } else {
    await db.insert(circleMemberships).values({
      id: generateId(),
      circleId,
      userId: user.id,
    });
    await db
      .update(circles)
      .set({ memberCount: sql`${circles.memberCount} + 1`, updatedAt: new Date() })
      .where(eq(circles.id, circleId));
  }

  revalidatePath(`/${locale}/topluluklar`);
}
