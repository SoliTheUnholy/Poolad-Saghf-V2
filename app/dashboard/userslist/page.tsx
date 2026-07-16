import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { getUsers } from "@/actions/admin";
import { UsersDashboard } from "@/components/users-dashboard";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";
export default async function UsersPage() { const session = await getServerSession(authOptions); if (session?.user.role !== "admin") redirect("/dashboard/orderslist"); return <UsersDashboard users={await getUsers()} />; }
