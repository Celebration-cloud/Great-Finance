import { ResetPasswordForm } from "@/components/auth/reset-password-form";

export default async function ResetPasswordPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) { const { token } = await searchParams; return <main className="shell grid min-h-[calc(100vh-73px)] place-items-center py-12"><section className="card w-full max-w-md p-7 sm:p-9"><p className="eyebrow">Account access</p><h1 className="mt-3 text-3xl font-semibold tracking-[-.03em]">Choose a new password</h1><ResetPasswordForm token={token}/></section></main>; }
