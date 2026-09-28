import { unstable_rethrow } from "next/navigation";
import { getPrincipal } from "@/lib/auth/principal";
import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";
import { PublicMotionOrchestrator } from "@/components/marketing/public-motion-orchestrator";

export const dynamic = "force-dynamic";

export default async function MarketingLayout({ children }: { children: React.ReactNode }) {
  let principal = null;
  try {
    principal = await getPrincipal();
  } catch (cause) {
    unstable_rethrow(cause);
  }

  return (
    <>
      <SiteHeader principal={principal} />
      <div id="main-content">
        <PublicMotionOrchestrator>{children}</PublicMotionOrchestrator>
      </div>
      <SiteFooter />
    </>
  );
}
