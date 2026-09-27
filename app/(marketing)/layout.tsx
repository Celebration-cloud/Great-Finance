import { getPrincipal } from "@/lib/auth/principal";
import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";

export default async function MarketingLayout({ children }: { children: React.ReactNode }) {
  const principal = await getPrincipal().catch(() => null);

  return (
    <>
      <SiteHeader principal={principal} />
      <div id="main-content">{children}</div>
      <SiteFooter />
    </>
  );
}
