"use client";

import { LoaderCircle, ShieldCheck } from "lucide-react";
import { useRef } from "react";
import { upload } from "@vercel/blob/client";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/http/api-fetch";
import { useApiMutation } from "@/hooks/use-api-mutation";

type UploadKind = "identity" | "selfie";
type StorageProvider = "neon-storage" | "vercel-blob";
type UploadedObject = { key: string; provider: StorageProvider; contentType: string; size: number };

async function uploadFile(kind: UploadKind, file: File): Promise<UploadedObject> {
  const result = await apiFetch<{ key: string; provider: StorageProvider; uploadUrl?: string }>(
    "/api/storage/kyc/upload-url",
    {
      method: "POST",
      body: JSON.stringify({ kind, fileName: file.name, contentType: file.type, size: file.size }),
    },
  );
  if (!result.ok) throw new Error(result.error.message);

  if (result.data.provider === "vercel-blob") {
    await upload(result.data.key, file, {
      access: "private",
      handleUploadUrl: "/api/storage/kyc/blob-upload",
      contentType: file.type,
      clientPayload: JSON.stringify({ kind, contentType: file.type, size: file.size }),
      multipart: file.size > 5 * 1024 * 1024,
    });
  } else {
    if (!result.data.uploadUrl) throw new Error("The secure document upload URL is missing.");
    const uploaded = await fetch(result.data.uploadUrl, { method: "PUT", headers: { "Content-Type": file.type }, body: file });
    if (!uploaded.ok) throw new Error(`The ${kind === "identity" ? "identity document" : "photo"} upload failed.`);
  }

  return { key: result.data.key, provider: result.data.provider, contentType: file.type, size: file.size };
}

type KycSubmitBody = {
  fullName: string;
  stateOfOrigin: string;
  localGovernment: string;
  identity: UploadedObject;
  selfie: UploadedObject;
};

export function KycForm() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  const { mutate, isLoading, isSuccess, isError, error } = useApiMutation<unknown, KycSubmitBody>(
    "/api/storage/kyc/submit",
    { successMessage: "KYC verification submitted securely." },
  );

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);

    const identityFile = form.get("identityFile");
    const selfieFile = form.get("selfieFile");
    if (!(identityFile instanceof File) || !(selfieFile instanceof File) || !identityFile.size || !selfieFile.size) {
      return;
    }

    let identity: UploadedObject;
    let selfie: UploadedObject;
    try {
      [identity, selfie] = await Promise.all([uploadFile("identity", identityFile), uploadFile("selfie", selfieFile)]);
    } catch (uploadError) {
      // Upload errors (presign fetch or PUT) are surfaced as thrown Errors — toast manually.
      const { toast } = await import("@/lib/toast");
      toast.error(uploadError instanceof Error ? uploadError.message : "File upload failed.");
      return;
    }

    const result = await mutate({
      fullName: String(form.get("fullName")),
      stateOfOrigin: String(form.get("stateOfOrigin")),
      localGovernment: String(form.get("localGovernment")),
      identity,
      selfie,
    });

    if (result.ok) {
      formElement.reset();
      router.refresh();
    }
  }

  const fieldClass = "rounded-xl border border-[var(--line)] bg-white px-4 py-3";
  return (
    <form ref={formRef} className="mt-8 grid gap-5 rounded-[1.35rem] bg-white p-6" onSubmit={submit}>
      <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-950">
        <ShieldCheck className="mt-0.5 shrink-0" size={20} />
        <p>Identity documents and photos are stored securely in encrypted storage. Only image formats (JPEG, PNG, WebP) are supported. Every reviewer access is authenticated and written to the audit log.</p>
      </div>
      <label className="grid gap-2 text-sm font-bold">1. Full name as it appears on your ID<input className={fieldClass} name="fullName" autoComplete="name" required /></label>
      <label className="grid gap-2 text-sm font-bold">2. State of origin<input className={fieldClass} name="stateOfOrigin" required /></label>
      <label className="grid gap-2 text-sm font-bold">3. Local government of origin<input className={fieldClass} name="localGovernment" required /></label>
      <label className="grid gap-2 text-sm font-bold">
        4. Means of identification (Image only){" "}
        <span className="font-normal text-[var(--muted)]">NIN slip/card, driver&apos;s license, voter&apos;s card, or passport photo (JPEG, PNG, WebP up to 40 MB)</span>
        <input className="rounded-xl border border-dashed border-[var(--line)] p-5" name="identityFile" type="file" accept="image/jpeg,image/png,image/webp" required />
      </label>
      <label className="grid gap-2 text-sm font-bold">
        5. Recent selfie photo{" "}
        <span className="font-normal text-[var(--muted)]">Clear facial photo (JPEG, PNG, WebP up to 40 MB)</span>
        <input className="rounded-xl border border-dashed border-[var(--line)] p-5" name="selfieFile" type="file" accept="image/jpeg,image/png,image/webp" required />
      </label>

      <button
        disabled={isLoading || isSuccess}
        className="flex items-center justify-center gap-2 rounded-xl bg-[var(--brand)] px-5 py-3 font-bold text-white disabled:opacity-60"
      >
        {isLoading && <LoaderCircle className="animate-spin" size={18} />}
        {isLoading ? "Encrypting and uploading…" : isSuccess ? "Verification submitted" : "Complete KYC Verification"}
      </button>
      {isError && (
        <p role="alert" className="rounded-xl p-3 text-sm bg-red-50 text-red-800">
          {error?.message ?? "KYC submission failed."}
        </p>
      )}
    </form>
  );
}
