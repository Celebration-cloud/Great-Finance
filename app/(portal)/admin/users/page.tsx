import { AdminUserActions } from "@/components/admin/admin-user-actions";
import { DataTable, EmptyState, PageHeader } from "@/components/portal/page-header";
import { Pagination } from "@/components/portal/pagination";
import { requireRole } from "@/lib/auth/access";
import { getPrisma } from "@/lib/db";

export const dynamic = "force-dynamic";

interface Props {
  searchParams: Promise<{ page?: string; q?: string }>;
}

export default async function UserManagementPage({ searchParams }: Props) {
  await requireRole(["ADMIN", "SUPER_ADMIN"]);
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page || "1", 10));
  const pageSize = 20;
  const skip = (page - 1) * pageSize;

  const db = getPrisma();

  const [totalCount, users] = await Promise.all([
    db.membership.count({ where: { role: "CUSTOMER" } }),
    db.membership.findMany({
      where: { role: "CUSTOMER" },
      include: {
        organization: {
          include: { profile: true },
        },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: pageSize,
    }),
  ]);

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <section className="space-y-6">
      <PageHeader
        eyebrow="Directory & Governance"
        title="Customer User Management"
        description="Inspect registered customer accounts, manage authorization status, and issue immediate account suspensions (bans) or reactivations."
      />

      <div className="space-y-2">
        <DataTable columns={["Customer Name", "Account ID", "Registered Phone", "Bank Account", "Status", "Actions"]}>
          {users.map((user) => {
            const displayName = user.organization.profile?.displayName ?? user.organization.name;
            const phone = user.organization.profile?.phone ?? "—";
            const bank = user.organization.profile?.bankName
              ? `${user.organization.profile.bankName} (••${user.organization.profile.accountNumberLast4 ?? ""})`
              : "Not linked";

            return (
              <tr key={user.id} className="hover:bg-[var(--surface-muted)]/50 transition">
                <td className="px-5 py-4">
                  <div className="font-bold text-[var(--ink)]">{displayName}</div>
                  <div className="font-mono text-[0.68rem] text-[var(--muted)]">{user.organization.slug}</div>
                </td>
                <td className="px-5 py-4 font-mono text-xs text-[var(--muted)]">
                  {user.authUserId}
                </td>
                <td className="px-5 py-4 text-xs font-semibold text-[var(--ink)]">
                  {phone}
                </td>
                <td className="px-5 py-4 text-xs text-[var(--muted)]">
                  {bank}
                </td>
                <td className="px-5 py-4">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ${
                      user.status === "ACTIVE"
                        ? "bg-emerald-100 text-emerald-800"
                        : user.status === "SUSPENDED"
                          ? "bg-red-100 text-red-800"
                          : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {user.status}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <AdminUserActions
                    membershipId={user.id}
                    currentStatus={user.status}
                    subject="User"
                    name={displayName}
                  />
                </td>
              </tr>
            );
          })}
        </DataTable>

        {!users.length && (
          <div className="rounded-b-[1.25rem] border-x border-b border-[var(--line)] bg-white">
            <EmptyState
              title="No customer users registered"
              description="Customer memberships will appear here after accounts are created."
            />
          </div>
        )}

        <Pagination
          page={page}
          totalPages={totalPages}
          totalCount={totalCount}
          pageSize={pageSize}
          baseUrl="/admin/users"
        />
      </div>
    </section>
  );
}
