import { LoginCard } from "@/components/auth/login-card";
export default function AdminLoginPage() { return <LoginCard title="Admin login" eyebrow="Restricted administration" redirectTo="/admin/dashboard" signupHref="/auth/sign-in"/>; }
