"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth/session";
import { db } from "@/lib/db/neon";
import { notifications } from "@/lib/db/schema";

export async function markNotificationRead(formData: FormData) {
  if (!db) {
    throw new Error("DATABASE_URL ayarlı değil.");
  }

  const user = await getCurrentUser();
  const locale = String(formData.get("locale") ?? "tr").trim() || "tr";
  const id = String(formData.get("notificationId") ?? "").trim();

  if (!user || !id) {
    throw new Error("Bildirimleri yönetmek için giriş yapmalısın.");
  }

  await db.update(notifications).set({ read: true }).where(eq(notifications.id, id));
  revalidatePath(`/${locale}/bildirimler`);
}
