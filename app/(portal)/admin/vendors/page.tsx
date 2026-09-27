import { AdminUserActions } from "@/components/admin/admin-user-actions";
import { DataTable, EmptyState, PageHeader } from "@/components/portal/page-header";
import { Pagination } from "@/components/portal/pagination";
import { requireRole } from "@/lib/auth/access";
import { getPrisma } from "@/lib/db";

export const dynamic = "force-dynamic";

interface Props {
  searchParams: Promise<{ page?: string; q?: string }>;
}

export default async function VendorManagementPage({ searchParams }: Props) {
  await requireRole(["ADMIN", "SUPER_ADMIN"]);
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page || "1", 10));
  const pageSize = 20;
  const skip = (page - 1) * pageSize;

  const db = getPrisma();

  const [totalCount, vendors] = await Promise.all([
    db.membership.count({ where: { role: "VENDOR" } }),
    db.membership.findMany({
      where: { role: "VENDOR" },
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
        eyebrow="Distributor Directory"
        title="Vendor Management"
        description="Inspect regional distributor accounts, verify WhatsApp contact records, and exercise immediate administrative suspensions (bans) or reactivations."
      />

      <div className="space-y-2">
        <DataTable columns={["Vendor Name", "Vendor ID", "WhatsApp Contact", "Status", "Actions"]}>
          {vendors.map((vendor) => {
            const displayName = vendor.organization.profile?.displayName ?? vendor.organization.name;
            const whatsapp = vendor.organization.profile?.whatsapp ?? vendor.organization.profile?.phone ?? "—";

            return (
              <tr key={vendor.id} className="hover:bg-[var(--surface-muted)]/50 transition">
                <td className="px-5 py-4">
                  <div className="font-bold text-[var(--ink)]">{displayName}</div>
                  <div className="font-mono text-[0.68rem] text-[var(--muted)]">{vendor.organization.slug}</div>
                </td>
                <td className="px-5 py-4 font-mono text-xs text-[var(--muted)]">
                  {vendor.authUserId}
                </td>
                <td className="px-5 py-4 text-xs font-semibold text-[var(--ink)]">
                  {whatsapp}
                </td>
                <td className="px-5 py-4">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ${
                      vendor.status === "ACTIVE"
                        ? "bg-emerald-100 text-emerald-800"
                        : vendor.status === "SUSPENDED"
                          ? "bg-red-100 text-red-800"
                          : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {vendor.status}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <AdminUserActions
                    membershipId={vendor.id}
                    currentStatus={vendor.status}
                    subject="Vendor"
                    name={displayName}
                  />
                </td>
              </tr>
            );
          })}
        </DataTable>

        {!vendors.length && (
          <div className="rounded-b-[1.25rem] border-x border-b border-[var(--line)] bg-white">
            <EmptyState
              title="No vendors registered"
              description="Vendor memberships will appear here after regional distributor registrations."
            />
          </div>
        )}

        <Pagination
          page={page}
          totalPages={totalPages}
          totalCount={totalCount}
          pageSize={pageSize}
          baseUrl="/admin/vendors"
        />
      </div>
    </section>
  );
}
