import { NextResponse } from "next/server";
import { getFxRate } from "@/features/fx/service";
import { getPrincipal } from "@/lib/auth/principal";

export async function GET(request: Request) {
  const principal = await getPrincipal();
  if (!principal) return NextResponse.json({ success: false, message: "Authentication required." }, { status: 401 });
  const url = new URL(request.url);
  try {
    const rate = await getFxRate(url.searchParams.get("base") ?? "NGN", url.searchParams.get("quote") ?? "USD");
    return NextResponse.json({ success: true, data: rate, message: "FX rate fetched." });
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    const clientError = message === "INVALID_CURRENCY";
    console.error("fx.fetch.failed", error);
    return NextResponse.json({ success: false, message: clientError ? "Use valid three-letter currency codes." : "FX rate is currently unavailable." }, { status: clientError ? 400 : 503 });
  }
}
