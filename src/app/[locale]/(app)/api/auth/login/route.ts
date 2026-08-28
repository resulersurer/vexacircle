import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db/neon";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { createSession, SESSION_COOKIE, sessionCookieOptions } from "@/lib/auth/session";

export async function POST(request: Request) {
  try {
    if (!db) {
      return NextResponse.json(
        { error: "Veritabanı bağlantısı ayarlanmamış." },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { email, password } = body;

    const normalizedEmail = String(email ?? "").trim().toLowerCase();

    const matches = await db.select().from(users).where(eq(users.email, normalizedEmail)).limit(1);

    if (matches.length === 0) {
      return NextResponse.json(
        { error: "E-posta veya şifre hatalı." },
        { status: 401 }
      );
    }

    const user = matches[0];

    if (!user.passwordHash) {
      return NextResponse.json(
        { error: "Bu hesap şifre ile girişe kapalı." },
        { status: 400 }
      );
    }

    const valid = await bcrypt.compare(String(password ?? ""), user.passwordHash);

    if (!valid) {
      return NextResponse.json(
        { error: "E-posta veya şifre hatalı." },
        { status: 401 }
      );
    }

    const session = await createSession(user.id);
    const response = NextResponse.json(
      {
        ok: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        },
      },
      { status: 200 }
    );

    if (session) {
      response.cookies.set(SESSION_COOKIE, session.id, sessionCookieOptions(session.maxAge));
    }

    return response;
  } catch (error) {
    console.error("Login API error:", error);
    const message =
      error instanceof Error ? error.message : "Bir şeyler yanlış gitti. Lütfen daha sonra tekrar dene.";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
