import { z } from "zod";

export const approvalRequestSchema = z.object({
  resourceType: z.string().min(2).max(80),
  resourceId: z.string().min(1).max(120),
  action: z.string().min(2).max(80),
  payload: z.record(z.string(), z.unknown()),
});

export const approvalReviewSchema = z.object({
  decision: z.enum(["APPROVED", "REJECTED"]),
  note: z.string().trim().min(3).max(500),
});
