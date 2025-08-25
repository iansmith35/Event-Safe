import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { setAdminOk } from "@/lib/cookies";

function emailAllowed(email: string) {
  const list = (process.env.ADMIN_EMAIL_ALLOWLIST || "").toLowerCase().split(",").map(s => s.trim()).filter(Boolean);
  return list.length === 0 || list.includes(email.toLowerCase());
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const pass = (body?.passcode ?? "").toString();
    const email = (body?.email ?? "").toString();

    if (!emailAllowed(email)) {
      return NextResponse.json({ code: "not_admin" }, { status: 403 });
    }

    const hash = process.env.ADMIN_PASSCODE_HASH;
    const plain = process.env.ADMIN_PASSCODE ?? "";
    const ok = hash ? (await bcrypt.compare(pass, hash)) : (pass === plain);

    if (!ok) return NextResponse.json({ code: "bad_pass" }, { status: 401 });

    setAdminOk();
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ code: "server_error" }, { status: 500 });
  }
}