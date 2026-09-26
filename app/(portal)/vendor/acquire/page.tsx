import { CouponAcquirer } from "@/components/vendor/coupon-acquirer";
import { PageHeader } from "@/components/portal/page-header";
import { requireRole } from "@/lib/auth/access";

export const dynamic = "force-dynamic";
export default async function AcquireCouponPage() { await requireRole(["VENDOR"]); return <section><PageHeader eyebrow="Inventory" title="Acquire coupon" description="Select quantities from the original plan catalogue and pay through verified checkout."/><CouponAcquirer/></section>; }
