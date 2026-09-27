export type VendorTierKey =
  | "TIER_1_STARTER"
  | "TIER_2_SILVER"
  | "TIER_3_GOLD"
  | "TIER_4_MASTER";

export interface VendorTierDefinition {
  key: VendorTierKey;
  name: string;
  badge: string;
  volume: string;
  marginPercent: number;
  marginLabel: string;
  minMonthlyVolumeMinor: number;
  features: readonly string[];
  recommended?: boolean;
}

export const VENDOR_TIERS: Record<VendorTierKey, VendorTierDefinition> = {
  TIER_1_STARTER: {
    key: "TIER_1_STARTER",
    name: "Starter Vendor",
    badge: "Tier 1: Starter Vendor",
    volume: "₦50,000 – ₦250,000",
    marginPercent: 5,
    marginLabel: "5% Wholesale Margin",
    minMonthlyVolumeMinor: 50_000_00,
    features: [
      "5% Wholesale Margin",
      "Immediate coupon code generation",
      "Standard Paystack checkout",
      "Real-time inventory table",
      "Email support desk",
    ],
  },
  TIER_2_SILVER: {
    key: "TIER_2_SILVER",
    name: "Silver Distributor",
    badge: "Tier 2: Silver Distributor",
    volume: "₦250,000 – ₦1,000,000",
    marginPercent: 8,
    marginLabel: "8% Wholesale Margin",
    minMonthlyVolumeMinor: 250_000_00,
    recommended: true,
    features: [
      "8% Wholesale Margin",
      "All Starter Vendor perks",
      "Priority KYC verification SLA",
      "Dedicated WhatsApp dispatch desk",
      "Weekly volume rebate eligibility",
    ],
  },
  TIER_3_GOLD: {
    key: "TIER_3_GOLD",
    name: "Gold Regional Partner",
    badge: "Tier 3: Gold Regional Partner",
    volume: "₦1,000,000 – ₦5,000,000",
    marginPercent: 12,
    marginLabel: "12% Wholesale Margin",
    minMonthlyVolumeMinor: 1_000_000_00,
    features: [
      "12% Wholesale Margin",
      "All Silver Distributor perks",
      "Custom batch allocation sizes",
      "Direct account executive",
      "Regional promotional listing",
    ],
  },
  TIER_4_MASTER: {
    key: "TIER_4_MASTER",
    name: "Master Liquidity Node",
    badge: "Tier 4: Master Liquidity Node",
    volume: "₦5,000,000+",
    marginPercent: 15,
    marginLabel: "15% Wholesale Margin",
    minMonthlyVolumeMinor: 5_000_000_00,
    features: [
      "15% Wholesale Margin",
      "Maximum wholesale discount tier",
      "Guaranteed liquidity reserve",
      "Institutional SLA with dedicated engineer",
      "Direct API integration for offline POS",
    ],
  },
};

export const VENDOR_TIER_LIST: readonly VendorTierDefinition[] = [
  VENDOR_TIERS.TIER_1_STARTER,
  VENDOR_TIERS.TIER_2_SILVER,
  VENDOR_TIERS.TIER_3_GOLD,
  VENDOR_TIERS.TIER_4_MASTER,
];

export function parseVendorTier(tierStr?: string | null): VendorTierKey {
  if (!tierStr) return "TIER_1_STARTER";
  const upper = tierStr.toUpperCase();
  if (upper in VENDOR_TIERS) return upper as VendorTierKey;
  if (upper.includes("4") || upper.includes("MASTER")) return "TIER_4_MASTER";
  if (upper.includes("3") || upper.includes("GOLD")) return "TIER_3_GOLD";
  if (upper.includes("2") || upper.includes("SILVER")) return "TIER_2_SILVER";
  return "TIER_1_STARTER";
}

export function calculateWholesalePrice(faceValueMinor: number, tierKey: VendorTierKey = "TIER_1_STARTER") {
  const tier = VENDOR_TIERS[tierKey] ?? VENDOR_TIERS.TIER_1_STARTER;
  const discountMinor = Math.round(faceValueMinor * (tier.marginPercent / 100));
  const payableMinor = Math.max(0, faceValueMinor - discountMinor);
  return {
    faceValueMinor,
    discountMinor,
    payableMinor,
    marginPercent: tier.marginPercent,
    tierName: tier.name,
  };
}
