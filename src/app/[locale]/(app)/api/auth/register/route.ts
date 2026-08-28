import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db/neon";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { createSession, SESSION_COOKIE, sessionCookieOptions } from "@/lib/auth/session";

function generateId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
}

export async function POST(request: Request) {
  try {
    if (!db) {
      return NextResponse.json(
        { error: "Veritabanı bağlantısı ayarlanmamış. Lütfen DATABASE_URL ortam değişkenini kontrol et." },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "name, email ve şifre gereklidir." },
        { status: 400 }
      );
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const trimmedName = String(name).trim();

    const existing = await db.select().from(users).where(eq(users.email, normalizedEmail)).limit(1);

    if (existing.length > 0) {
      return NextResponse.json(
        { error: "Bu e-posta zaten kayıtlı." },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const inserted = await db.insert(users).values({
      id: generateId(),
      name: trimmedName,
      email: normalizedEmail,
      passwordHash,
    }).returning({
      id: users.id,
      email: users.email,
      name: users.name,
    });

    const user = inserted[0];

    const session = await createSession(user.id);
    const response = NextResponse.json(
      {
        ok: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      },
      { status: 201 }
    );

    if (session) {
      response.cookies.set(SESSION_COOKIE, session.id, sessionCookieOptions(session.maxAge));
    }

    return response;
  } catch (error) {
    console.error("Register API error:", error);
    const message =
      error instanceof Error ? error.message : "Bir şeyler yanlış gitti. Lütfen daha sonra tekrar dene.";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
