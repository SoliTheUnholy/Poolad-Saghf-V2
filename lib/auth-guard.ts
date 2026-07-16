import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import type { UserRole } from "@/lib/domain";

export async function requireUser(roles?: UserRole[]) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("UNAUTHORIZED");
  if (roles && !roles.includes(session.user.role as UserRole)) {
    throw new Error("FORBIDDEN");
  }
  return session.user;
}

export function actionError(error: unknown) {
  if (error instanceof Error) {
    if (error.message === "UNAUTHORIZED") return "ابتدا وارد حساب کاربری شوید";
    if (error.message === "FORBIDDEN") return "دسترسی لازم را ندارید";
    if (error.message.startsWith("PUBLIC:")) return error.message.slice(7);
  }
  return "انجام عملیات ممکن نشد. دوباره تلاش کنید";
}
