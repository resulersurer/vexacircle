import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db/neon";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

function generateId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
}

export async function POST(request: Request) {
  try {
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

    if (!db) {
      return NextResponse.json(
        { error: "Veritabanı bağlantısı ayarlanmamış." },
        { status: 500 }
      );
    }

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

    return NextResponse.json(
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
  } catch (error) {
    console.error("Register API error:", error);
    return NextResponse.json(
      { error: "Bir şeyler yanlış gitti. Lütfen daha sonra tekrar dene." },
      { status: 500 }
    );
  }
}
