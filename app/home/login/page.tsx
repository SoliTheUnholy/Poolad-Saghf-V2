import LoginForm from "@/components/LoginForm";
import { AuthShell } from "@/components/auth-shell";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ returnTo?: string }> }) {
  const { returnTo } = await searchParams;
  return <AuthShell><LoginForm returnTo={returnTo} /></AuthShell>;
}
