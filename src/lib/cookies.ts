import { cookies } from "next/headers";

const KEY = "admin_ok";

export function setAdminOk() {
  cookies().set(KEY, "1", { httpOnly: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 });
}

export function clearAdminOk() { 
  cookies().delete(KEY); 
}

export function hasAdminOk() { 
  return cookies().get(KEY)?.value === "1"; 
}