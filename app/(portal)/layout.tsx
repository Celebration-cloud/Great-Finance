import { redirect } from "next/navigation";
import { hasAuthConfig, hasDatabaseConfig } from "@/lib/env/server";
import { requirePrincipal } from "@/lib/auth/principal";
import { PortalNavigation } from "@/components/portal/portal-navigation";

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  if (!hasAuthConfig() || !hasDatabaseConfig()) redirect("/setup");
  const principal = await requirePrincipal();
  const workspaceLabel = principal.role === "CUSTOMER" ? "Customer workspace" : principal.role === "VENDOR" ? "Vendor workspace" : "Administration workspace";
  const roleLabel = principal.role.replace("_", " ");

  return (
    <div className="min-h-screen bg-[var(--paper)] lg:grid lg:grid-cols-[17.5rem_minmax(0,1fr)]" data-portal-shell>
      <PortalNavigation email={principal.email} role={principal.role} />
      <section className="min-w-0">
        <header className="sticky top-0 z-30 hidden min-h-20 items-center justify-between gap-6 border-b border-[var(--line)] bg-[var(--surface)]/80 px-8 backdrop-blur lg:flex xl:px-12">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.14em] text-[var(--brand)]">{workspaceLabel}</p>
            <p className="mt-1 text-sm text-[var(--muted)]">Secure operations and verified records</p>
          </div>
          <div className="flex min-w-0 items-center gap-3">
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-[var(--surface-muted)] text-sm font-bold text-[var(--brand)]" aria-hidden="true">
              {principal.email.charAt(0).toUpperCase()}
            </span>
            <div className="min-w-0 text-right">
              <p className="max-w-64 truncate text-sm font-semibold">{principal.email}</p>
              <p className="mt-0.5 text-xs font-bold uppercase tracking-[.1em] text-[var(--muted)]">{roleLabel}</p>
            </div>
          </div>
        </header>
        <main className="mx-auto w-full max-w-[76rem] px-4 py-7 sm:px-6 sm:py-9 lg:px-8 lg:py-10 xl:px-12">
          {children}
        </main>
      </section>
    </div>
  );
}
