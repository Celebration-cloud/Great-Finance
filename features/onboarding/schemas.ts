import { z } from "zod";

export const onboardingSchema = z.object({
  accountType: z.enum(["CUSTOMER", "VENDOR"]),
  fullName: z.string().trim().min(2).max(120),
  phone: z.string().regex(/^\d{10,15}$/),
  bankName: z.string().trim().max(80).optional(),
  accountNumber: z.string().regex(/^\d{10}$/).optional(),
  referralCode: z.string().trim().max(40).optional(),
  vendorTier: z.enum(["TIER_1_STARTER", "TIER_2_SILVER", "TIER_3_GOLD", "TIER_4_MASTER"]).optional(),
}).superRefine((value, context) => {
  if (value.accountType === "CUSTOMER" && (!value.bankName || !value.accountNumber)) {
    context.addIssue({ code: "custom", path: ["bankName"], message: "Bank and account number are required." });
  }
});

export const registrationSchema = onboardingSchema.extend({
  email: z.string().email(),
  password: z.string().min(8).max(128),
});

export type RegistrationValues = z.infer<typeof registrationSchema>;
