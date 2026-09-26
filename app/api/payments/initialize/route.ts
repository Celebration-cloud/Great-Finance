import { NextResponse } from "next/server";
import { initializePaymentSchema } from "@/features/payments/schemas";
import { initializePayment } from "@/features/payments/service";
import { assertPermission } from "@/lib/auth/permissions";
import { getPrincipal } from "@/lib/auth/principal";
import { getServerEnv } from "@/lib/env/server";

export async function POST(request: Request) {
  try {
    const principal = await getPrincipal();
    if (!principal) return NextResponse.json({ success: false, message: "Authentication required." }, { status: 401 });
    assertPermission(principal.role, "payment:create");
    const body = initializePaymentSchema.safeParse(await request.json());
    if (!body.success) return NextResponse.json({ success: false, message: "Invalid payment request.", errors: body.error.flatten().fieldErrors }, { status: 400 });
    const env = getServerEnv();
    const payment = await initializePayment({ organizationId: principal.organizationId, actorId: principal.userId, email: principal.email, ...body.data }, { secret: env.PAYSTACK_SECRET_KEY, appUrl: env.APP_URL });
    return NextResponse.json({ success: true, data: { reference: payment.reference, authorizationUrl: payment.authorizationUrl }, message: "Payment initialized." }, { status: 201 });
  } catch (error) {
    const forbidden = error instanceof Error && error.message === "FORBIDDEN";
    console.error("payment.initialize.failed", error);
    return NextResponse.json({ success: false, message: forbidden ? "You do not have permission to create a payment." : "Unable to initialize payment." }, { status: forbidden ? 403 : 500 });
  }
}
