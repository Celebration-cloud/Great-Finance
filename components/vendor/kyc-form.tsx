"use client";

import { LoaderCircle, ShieldCheck } from "lucide-react";
import { useState } from "react";

type UploadKind = "identity" | "selfie";
type UploadedObject = { key: string; contentType: string; size: number };

async function uploadFile(kind: UploadKind, file: File): Promise<UploadedObject> {
  const response = await fetch("/api/storage/kyc/upload-url", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ kind, fileName: file.name, contentType: file.type, size: file.size }),
  });
  const result = await response.json() as { data?: { key: string; uploadUrl: string }; message?: string };
  if (!response.ok || !result.data) throw new Error(result.message ?? "Could not prepare the secure upload.");

  const upload = await fetch(result.data.uploadUrl, { method: "PUT", headers: { "Content-Type": file.type }, body: file });
  if (!upload.ok) throw new Error(`The ${kind === "identity" ? "identity document" : "photo"} upload failed.`);
  return { key: result.data.key, contentType: file.type, size: file.size };
}

export function KycForm() {
  const [state, setState] = useState<"idle" | "uploading" | "submitted" | "error">("idle");
  const [message, setMessage] = useState<string>();

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    setState("uploading");
    setMessage(undefined);

    try {
      const form = new FormData(formElement);
      const identityFile = form.get("identityFile");
      const selfieFile = form.get("selfieFile");
      if (!(identityFile instanceof File) || !(selfieFile instanceof File) || !identityFile.size || !selfieFile.size) throw new Error("Choose both required files.");

      const [identity, selfie] = await Promise.all([uploadFile("identity", identityFile), uploadFile("selfie", selfieFile)]);
      const response = await fetch("/api/storage/kyc/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: form.get("fullName"),
          stateOfOrigin: form.get("stateOfOrigin"),
          localGovernment: form.get("localGovernment"),
          identity,
          selfie,
        }),
      });
      const result = await response.json() as { message?: string };
      if (!response.ok) throw new Error(result.message ?? "KYC submission failed.");
      formElement.reset();
      setState("submitted");
      setMessage(result.message ?? "KYC verification submitted securely.");
    } catch (error) {
      setState("error");
      setMessage(error instanceof Error ? error.message : "KYC submission failed.");
    }
  }

  const fieldClass = "rounded-xl border border-[var(--line)] bg-white px-4 py-3";
  return <form className="mt-8 grid gap-5 rounded-[1.35rem] bg-white p-6" onSubmit={submit}>
    <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-950"><ShieldCheck className="mt-0.5 shrink-0" size={20}/><p>Documents are stored in a private, branch-matched Neon bucket. Review links expire after five minutes, and every reviewer access is written to the audit log.</p></div>
    <label className="grid gap-2 text-sm font-bold">1. Full name as it appears on your ID<input className={fieldClass} name="fullName" autoComplete="name" required/></label>
    <label className="grid gap-2 text-sm font-bold">2. State of origin<input className={fieldClass} name="stateOfOrigin" required/></label>
    <label className="grid gap-2 text-sm font-bold">3. Local government of origin<input className={fieldClass} name="localGovernment" required/></label>
    <label className="grid gap-2 text-sm font-bold">4. Means of identification <span className="font-normal text-[var(--muted)]">NIN, driver’s licence, passport; image or PDF, up to 40 MB</span><input className="rounded-xl border border-dashed border-[var(--line)] p-5" name="identityFile" type="file" accept="image/jpeg,image/png,image/webp,application/pdf" required/></label>
    <label className="grid gap-2 text-sm font-bold">5. Recent photo <span className="font-normal text-[var(--muted)]">JPEG, up to 40 MB</span><input className="rounded-xl border border-dashed border-[var(--line)] p-5" name="selfieFile" type="file" accept="image/jpeg" required/></label>
    <button disabled={state === "uploading" || state === "submitted"} className="flex items-center justify-center gap-2 rounded-xl bg-[var(--brand)] px-5 py-3 font-bold text-white disabled:opacity-60">{state === "uploading" && <LoaderCircle className="animate-spin" size={18}/>} {state === "uploading" ? "Encrypting and uploading…" : state === "submitted" ? "Verification submitted" : "Complete KYC Verification"}</button>
    {message && <p role={state === "error" ? "alert" : "status"} className={`rounded-xl p-3 text-sm ${state === "error" ? "bg-red-50 text-red-800" : "bg-emerald-50 text-emerald-900"}`}>{message}</p>}
  </form>;
}
