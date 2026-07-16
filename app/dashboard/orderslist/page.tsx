import { getServerSession } from "next-auth";
import { getMySubmittedCarts, getSubmittedCarts } from "@/actions/cart";
import { OrdersDashboard } from "@/components/orders-dashboard";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";
export default async function OrdersPage() { const session = await getServerSession(authOptions); const canReview = session?.user.role === "admin" || session?.user.role === "employee"; return <OrdersDashboard carts={canReview ? await getSubmittedCarts() : await getMySubmittedCarts()} canReview={canReview} />; }
