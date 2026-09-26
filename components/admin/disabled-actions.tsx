export function DisabledAdminActions({ subject }: { subject: "User" | "Vendor" }) {
  return <div className="flex flex-wrap gap-2"><button disabled title="Impersonation requires a separately audited support workflow." className="rounded-lg bg-[var(--surface-muted)] px-3 py-2 text-xs font-bold text-[var(--muted)] opacity-70">Login</button><button disabled title="Suspension requires an approved administrative action." className="rounded-lg bg-red-50 px-3 py-2 text-xs font-bold text-red-800 opacity-60">Ban {subject}</button></div>;
}
