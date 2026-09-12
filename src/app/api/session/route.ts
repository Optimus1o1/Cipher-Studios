import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyIdToken } from "@/lib/firebaseAdmin";

const SESSION_COOKIE_NAME = "cipher_session";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { idToken } = body;

    if (!idToken || typeof idToken !== "string") {
      return NextResponse.json({ error: "Missing or invalid idToken" }, { status: 400 });
    }

    const verifiedUser = await verifyIdToken(idToken);

    if (!verifiedUser) {
      return NextResponse.json({ error: "Unauthorized: Invalid token" }, { status: 401 });
    }

    const sessionPayload = JSON.stringify({
      uid: verifiedUser.uid,
      email: verifiedUser.email,
      name: verifiedUser.name,
      role: verifiedUser.role,
      isAdmin: verifiedUser.isAdmin,
      createdAt: Date.now(),
    });

    const isProd = process.env.NODE_ENV === "production";
    const cookieStore = cookies();

    cookieStore.set({
      name: SESSION_COOKIE_NAME,
      value: Buffer.from(sessionPayload).toString("base64"),
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return NextResponse.json({
      ok: true,
      user: verifiedUser,
    });
  } catch (error: any) {
    console.error("Session creation error:", error);
    return NextResponse.json({ error: "Failed to establish session" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const cookieStore = cookies();
    const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    if (!sessionCookie) {
      return NextResponse.json({ authenticated: false }, { status: 200 });
    }

    const decoded = JSON.parse(Buffer.from(sessionCookie, "base64").toString("utf-8"));

    return NextResponse.json({
      authenticated: true,
      user: decoded,
    });
  } catch (error) {
    return NextResponse.json({ authenticated: false }, { status: 200 });
  }
}

export async function DELETE() {
  try {
    const cookieStore = cookies();
    cookieStore.set({
      name: SESSION_COOKIE_NAME,
      value: "",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to clear session" }, { status: 500 });
  }
}
