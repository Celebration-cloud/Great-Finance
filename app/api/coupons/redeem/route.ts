import { z } from "zod";
import { requireApiPermission, requireApiPrincipal } from "@/lib/auth/api";
import { errors } from "@/lib/errors/app-error";
import { apiSuccess, readJson, withApiHandler } from "@/lib/http/api-response";
import { redeemCoupon } from "@/features/coupons/service";

const redeemSchema = z.object({
  code: z.string().min(5).max(30),
});

export async function POST(request: Request) {
  return withApiHandler(request, "coupon.redeem", async (context) => {
    const principal = await requireApiPrincipal();
    requireApiPermission(principal, "investment:create");

    const body = redeemSchema.safeParse(await readJson(request));
    if (!body.success) throw errors.validation("Invalid coupon code.", body.error.flatten().fieldErrors);

    const result = await redeemCoupon(body.data.code, principal.userId, principal.organizationId);
    return apiSuccess(context, result, "Coupon redeemed successfully. Your investment is now active.", 201);
  });
}
