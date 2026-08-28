import { randomUUID } from "crypto";
import { cookies } from "next/headers";
import { and, eq, gt } from "drizzle-orm";
import { db } from "@/lib/db/neon";
import { sessions, users } from "@/lib/db/schema";

export const SESSION_COOKIE = "vexa_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

export type CurrentUser = {
  id: string;
  email: string;
  name: string;
  image: string | null;
};

export async function createSession(userId: string) {
  if (!db) {
    return null;
  }

  const id = randomUUID();
  const expiresAt = new Date(Date.now() + SESSION_MAX_AGE_SECONDS * 1000);

  await db.insert(sessions).values({
    id,
    userId,
    expiresAt,
  });

  return {
    id,
    maxAge: SESSION_MAX_AGE_SECONDS,
  };
}

export async function getCurrentUser(): Promise<CurrentUser | null> {
  if (!db) {
    return null;
  }

  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (!token) {
    return null;
  }

  const matches = await db
    .select({
      id: users.id,
      email: users.email,
      name: users.name,
      image: users.image,
    })
    .from(sessions)
    .innerJoin(users, eq(sessions.userId, users.id))
    .where(and(eq(sessions.id, token), gt(sessions.expiresAt, new Date())))
    .limit(1);

  return matches[0] ?? null;
}

export function sessionCookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge,
  };
}
