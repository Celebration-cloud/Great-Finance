import { getFxRate } from "@/features/fx/service";
import { requireApiPrincipal } from "@/lib/auth/api";
import { apiSuccess, withApiHandler } from "@/lib/http/api-response";

export async function GET(request: Request) {
  return withApiHandler(request, "fx.fetch", async (context) => {
    await requireApiPrincipal();
    const url = new URL(request.url);
    const rate = await getFxRate(url.searchParams.get("base") ?? "NGN", url.searchParams.get("quote") ?? "USD");
    return apiSuccess(context, rate, rate.stale ? "A recent cached FX rate was returned while the provider recovers." : "FX rate fetched.");
  });
}
