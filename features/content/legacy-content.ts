export const investmentSteps = [
  "visit the great finance website and register",
  "once you are registered, click the dropdown menu and click invest, then click contact vendor.",
  "select any vendor of your choice from the list of vendors and click chat.",
  "chat the vendor and purchase your coupon codes then return to the website and key-in the coupon code.",
] as const;

export const investmentPlans = [
  { amount: 2000, returnAmount: 3000, duration: 7, name: "BASIC PLAN" },
  { amount: 4000, returnAmount: 6000, duration: 7, name: "LINCON PLAN" },
  { amount: 7000, returnAmount: 11000, duration: 7, name: "PRIME PLAN" },
  { amount: 10000, returnAmount: 16000, duration: 7, name: "MAXI PLAN" },
  { amount: 20000, returnAmount: 28000, duration: 7, name: "STANDARD PLAN" },
  { amount: 30000, returnAmount: 40000, duration: 7, name: "DIAMOND PLAN" },
  { amount: 50000, returnAmount: 70000, duration: 7, name: "PLATINUM PLAN" },
] as const;

export const legacyExplanation = "Great Finance connects customers, verified vendors, and operations teams in one accountable financial workflow. Customers can purchase approved coupons, track investments, request withdrawals, and manage referrals. Vendors can complete KYC, acquire coupon inventory, and follow verified purchase history. Every sensitive action is checked on the server, recorded for review, and reconciled against provider data before balances change.";
