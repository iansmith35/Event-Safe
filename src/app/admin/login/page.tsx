"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [pass, setPass] = useState("");
  const [show, setShow] = useState(false);
  const [err, setErr] = useState<string | undefined>();
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  // Get current user email from your existing auth context/hook if available.
  // Fallback to localStorage or prompt; for now accept manual input if not available.
  const [email, setEmail] = useState<string>("");

  async function submit() {
    setBusy(true); setErr(undefined);
    try {
      const res = await fetch("/api/admin/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode: pass, email })
      });
      if (res.ok) { router.push("/admin"); return; }
      const data = await res.json().catch(() => ({}));
      if (res.status === 401) setErr("Incorrect passcode. Try again.");
      else if (res.status === 403) setErr("Your email isn't on the admin allow-list.");
      else setErr("Unexpected error. Please try again.");
    } finally { setBusy(false); }
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-4 rounded-lg border p-6 bg-black/30">
        <h1 className="text-2xl font-semibold text-center">Admin Access</h1>
        <label className="block text-sm">Current User Email</label>
        <input value={email} onChange={e => setEmail(e.target.value)} placeholder="you@domain.com"
               className="w-full rounded border bg-transparent p-2" />
        <label className="block text-sm mt-2">Admin Passcode</label>
        <div className="flex gap-2">
          <input type={show ? "text" : "password"} value={pass} onChange={e => setPass(e.target.value)}
                 className="flex-1 rounded border bg-transparent p-2" />
          <button onClick={() => setShow(s => !s)} className="rounded border px-3">{show ? "Hide" : "Show"}</button>
        </div>
        {err && <p className="text-red-400 text-sm">{err}</p>}
        <button disabled={busy} onClick={submit} className="w-full rounded bg-yellow-500/90 py-2 font-semibold">
          {busy ? "Verifying…" : "Access Admin Panel"}
        </button>
      </div>
    </main>
  );
}