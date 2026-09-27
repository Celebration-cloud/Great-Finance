import { z } from "zod";

export const planItemSchema = z.object({
  planAmount: z.number().int().positive(),
  quantity: z.number().int().min(1).max(500),
});

export const initializePaymentSchema = z.object({
  amountMinor: z.number().int().min(100).max(100_000_000),
  currency: z.enum(["NGN", "GHS", "ZAR", "USD"]).default("NGN"),
  idempotencyKey: z.string().min(12).max(150),
  /** Plan breakdown — stored in PaymentIntent.metadata for coupon minting on webhook */
  planItems: z.array(planItemSchema).min(1).optional(),
});

export const paystackWebhookSchema = z.object({
  event: z.string(),
  data: z.object({
    reference: z.string(),
    amount: z.number().int().nonnegative(),
    currency: z.string().length(3),
    status: z.string(),
  }).passthrough(),
}).passthrough();

export const paystackVerificationSchema = z.object({
  status: z.boolean(),
  message: z.string(),
  data: z.object({
    reference: z.string(),
    amount: z.number().int(),
    currency: z.string(),
    status: z.string(),
    paid_at: z.string().nullable().optional(),
  }).passthrough(),
});
