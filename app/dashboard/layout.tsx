import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { DashboardShell } from "@/components/dashboard-shell";
import type { UserRole } from "@/lib/domain";
import { SidebarProvider } from "@/components/ui/sidebar";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/home/login");
  return (
    <SidebarProvider>
      <DashboardShell
        user={{ name: session.user.name, role: session.user.role as UserRole }}
      >
        {children}
      </DashboardShell>
    </SidebarProvider>
  );
}
