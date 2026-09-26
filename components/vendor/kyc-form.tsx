"use client";

import { useState } from "react";

export function KycForm() {
  const [message, setMessage] = useState<string>();
  return <form className="mt-8 grid gap-5 rounded-[1.35rem] bg-white p-6" onSubmit={(event) => { event.preventDefault(); setMessage("Secure document storage is not connected. Your files were not uploaded."); }}><label className="grid gap-2 text-sm font-bold">1. Full name as it appears on your ID<input className="rounded-xl border border-[var(--line)] px-4 py-3" required/></label><label className="grid gap-2 text-sm font-bold">2. State of origin<input className="rounded-xl border border-[var(--line)] px-4 py-3" required/></label><label className="grid gap-2 text-sm font-bold">3. Local government of origin<input className="rounded-xl border border-[var(--line)] px-4 py-3" required/></label><label className="grid gap-2 text-sm font-bold">4. Upload a means of identification (NIN, drivers licence, passport)<input className="rounded-xl border border-dashed border-[var(--line)] p-5" type="file" accept="image/*,.pdf" required/></label><label className="grid gap-2 text-sm font-bold">5. Upload a photo of yourself (JPEG not more than 40mb)<input className="rounded-xl border border-dashed border-[var(--line)] p-5" type="file" accept="image/jpeg" required/></label><button className="rounded-xl bg-[var(--brand)] px-5 py-3 font-bold text-white">Complete KYC Verification</button>{message && <p role="status" className="rounded-xl bg-amber-50 p-3 text-sm text-amber-900">{message}</p>}</form>;
}
