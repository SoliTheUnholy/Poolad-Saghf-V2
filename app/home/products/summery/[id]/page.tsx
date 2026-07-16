import Link from "next/link";
import { redirect } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { getMyCart } from "@/actions/cart";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageMotion, Reveal } from "@/components/motion-primitives";
import { formatPrice, formatWeight, type CartRecord } from "@/lib/domain";

export const dynamic = "force-dynamic";
export default async function SummaryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const cart = (await getMyCart(id).catch(() => null)) as CartRecord | null;
  if (!cart || cart.status === "draft") redirect("/home/cart");
  return (
    <PageMotion className="section-shell py-12 sm:py-20">
      <Reveal>
        <Card className="premium-panel mx-auto max-w-2xl">
          <CardContent className="flex flex-col items-center p-8 text-center sm:p-12">
            <span className="grid size-20 place-items-center rounded-full bg-emerald-500/12 text-emerald-600">
              <CheckCircle2 className="size-10" />
            </span>
            <h1 className="mt-6 text-2xl font-black sm:text-4xl">
              سفارش شما ثبت شد و در حال بررسی است
            </h1>
            <div className="bg-muted/50 mt-8 grid w-full gap-3 rounded-2xl border p-5 text-sm sm:grid-cols-2">
              <div>
                <p className="text-muted-foreground">مجموع وزن</p>
                <p className="mt-1 font-bold">
                  {formatWeight(
                    cart.items.reduce((sum, item) => sum + item.weight, 0),
                  )}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">قیمت کل</p>
                <p className="mt-1 font-bold">{formatPrice(cart.total)}</p>
              </div>
            </div>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button render={<Link href="/dashboard/orderslist" />}>
                مشاهده سفارشات
              </Button>
              <Button variant="outline" render={<Link href="/home/products" />}>
                بازگشت به محصولات
              </Button>
            </div>
          </CardContent>
        </Card>
      </Reveal>
    </PageMotion>
  );
}
