import { PageHeader } from "@/components/portal/page-header";
import { AdminInviteForm } from "@/components/admin/admin-invite-form";
import { requireRole } from "@/lib/auth/access";

export const dynamic = "force-dynamic";

export default async function AdminInvitePage() {
  await requireRole(["SUPER_ADMIN"]);

  return (
    <section className="space-y-8">
      <PageHeader
        eyebrow="Access Control"
        title="Invite New Administrator"
        description="Provision admin and reviewer accounts by sending a secure, time-limited invitation link. Recipients will complete their account setup via email. Self-registration for admin roles is disabled."
      />

      <AdminInviteForm />
    </section>
  );
}
