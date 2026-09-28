import { LoginCard } from "@/components/auth/login-card";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ reset?: string }>;
}) {
  const { reset } = await searchParams;

  return (
    <LoginCard
      title="Login"
      eyebrow="Customer workspace"
      redirectTo="/dashboard"
      signupHref="/signup"
      resetSuccess={reset === "success"}
    />
  );
}
