import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { getMyDraftCart } from "@/actions/cart";
import { CartView } from "@/components/cart-view";
import { PageMotion, Reveal } from "@/components/motion-primitives";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";
export default async function CartPage() {
  if (!(await getServerSession(authOptions))) redirect("/home/login?returnTo=/home/cart");
  const cart = await getMyDraftCart();
  return <PageMotion className="section-shell py-10 sm:py-14"><Reveal className="mb-8"><h1 className="text-3xl font-black sm:text-5xl">سبد خرید</h1></Reveal><Reveal><CartView cart={cart} /></Reveal></PageMotion>;
}
