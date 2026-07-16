import RegisterForm from "@/components/RegisterForm";
import { AuthShell } from "@/components/auth-shell";

export default function RegisterPage() {
  return (
    <AuthShell>
      <RegisterForm />
    </AuthShell>
  );
}
