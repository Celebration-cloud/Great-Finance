type AuthAction = "sign-in" | "sign-up";

export function getAuthErrorMessage(error: unknown, action: AuthAction) {
  const raw = error instanceof Error ? error.message : typeof error === "string" ? error : "";
  const message = raw.toLowerCase();
  if (/invalid.*(password|credential)|incorrect.*(password|credential)|user not found/.test(message)) return "Email or password is incorrect.";
  if (/verif/.test(message)) return "Verify your email address before signing in.";
  if (/already.*(exist|register)|user.*exist/.test(message)) return "An account already exists for this email address.";
  if (/rate|too many|limit/.test(message)) return "Too many authentication attempts. Please wait and try again.";
  if (/network|fetch|timeout|unavailable|failed to connect/.test(message)) return "Authentication is temporarily unavailable. Please try again.";
  return action === "sign-in" ? "Sign in failed. Check your details and try again." : "Registration could not be completed. Please try again.";
}
