"use client";

import { useState } from "react";

export function CopyReferralCode({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => { await navigator.clipboard.writeText(code); setCopied(true); window.setTimeout(() => setCopied(false), 1200); };
  return <div className="mt-8 flex flex-wrap items-center gap-3 rounded-2xl bg-[var(--ink)] p-5 text-white"><code className="text-lg text-[var(--accent)]">{code}</code><button onClick={copy} className="ml-auto rounded-lg bg-white px-4 py-2 text-sm font-bold text-[var(--ink)]">Copy referral code</button>{copied && <span role="status" className="text-sm">Copied</span>}</div>;
}
