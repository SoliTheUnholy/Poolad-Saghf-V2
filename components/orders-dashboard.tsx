"use client";

import { useMemo, useState, useTransition } from "react";
import { motion } from "motion/react";
import {
  CheckCircle2,
  Clock3,
  Phone,
  RotateCcw,
  Search,
  XCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { updateCartStatus } from "@/actions/cart";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductVisual } from "@/components/product-visual";
import {
  formatPrice,
  formatWeight,
  PRODUCT_NAMES,
  productDescription,
  STATUS_LABELS,
  type CartRecord,
  type ProductType,
} from "@/lib/domain";

const statusStyle = {
  pending:
    "border-amber-500/25 bg-amber-500/10 text-amber-700 dark:text-amber-300",
  resolved:
    "border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  rejected:
    "border-rose-500/25 bg-rose-500/10 text-rose-700 dark:text-rose-300",
} as const;

export function OrdersDashboard({
  carts,
  canReview,
}: {
  carts: CartRecord[];
  canReview: boolean;
}) {
  const router = useRouter();
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [isPending, startTransition] = useTransition();
  const filtered = useMemo(
    () =>
      carts.filter((cart) => {
        const matchesStatus = filter === "all" || cart.status === filter;
        const haystack =
          `${cart._id} ${cart.user?.name ?? ""} ${cart.user?.number ?? ""}`.toLowerCase();
        return matchesStatus && haystack.includes(query.trim().toLowerCase());
      }),
    [carts, filter, query],
  );

  function change(cartId: string, status: "pending" | "resolved" | "rejected") {
    startTransition(async () => {
      const result = await updateCartStatus({ cartId, status });
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      toast.success(result.message);
      router.refresh();
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-black">سفارشات</h1>
          <p className="text-muted-foreground mt-2 text-sm">
            هر سبد به‌صورت یک سفارش بررسی می‌شود
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative">
            <Search className="text-muted-foreground absolute top-1/2 right-3 size-4 -translate-y-1/2" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="جستجو"
              className="h-10 min-w-64 pr-9"
            />
          </div>
          <Tabs  value={filter} onValueChange={setFilter}>
            <TabsList>
              <TabsTrigger value="all">همه</TabsTrigger>
              <TabsTrigger value="pending">در انتظار</TabsTrigger>
              <TabsTrigger value="resolved">تایید</TabsTrigger>
              <TabsTrigger value="rejected">لغو</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {filtered.length ? (
        <div className="grid gap-5 2xl:grid-cols-2">
          {filtered.map((cart, index) => (
            <motion.div
              key={cart._id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(index * 0.04, 0.3) }}
            >
              <Card className="premium-panel overflow-hidden">
                <CardHeader className="flex-row items-start justify-between gap-4 border-b">
                  <div>
                    <CardTitle className="text-base">
                      سفارش{" "}
                      <span className="ltr-number text-muted-foreground">
                        #{String(cart._id).slice(-6)}
                      </span>
                    </CardTitle>
                    {cart.user && (
                      <div className="mt-3 text-sm">
                        <p className="font-bold">
                          {cart.user.name || "بدون نام"}
                        </p>
                        <a
                          href={`tel:${cart.user.number}`}
                          className="text-muted-foreground hover:text-foreground mt-1 flex items-center gap-1"
                        >
                          <Phone className="size-3.5" />
                          <span className="ltr-number">{cart.user.number}</span>
                        </a>
                      </div>
                    )}
                  </div>
                  <Badge
                    variant="outline"
                    className={
                      statusStyle[cart.status as keyof typeof statusStyle]
                    }
                  >
                    {STATUS_LABELS[cart.status as keyof typeof STATUS_LABELS]}
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-3 pt-5">
                  {cart.items.map((item) => (
                    <div
                      key={item._id}
                      className="bg-background/45 grid grid-cols-[64px_1fr_auto] items-center gap-3 rounded-xl border p-3"
                    >
                      <ProductVisual
                        type={item.type as ProductType}
                        className="w-16"
                      />
                      <div className="min-w-0">
                        <p className="text-sm font-bold">
                          {PRODUCT_NAMES[item.type as ProductType]}
                        </p>
                        <p className="text-muted-foreground mt-1 truncate text-xs">
                          {productDescription(item.productInfo)
                            .map((d) => `${d.label}: ${d.value}`)
                            .join(" · ")}
                        </p>
                        <p className="mt-1 text-xs">
                          {formatWeight(item.weight)}
                        </p>
                      </div>
                      <p className="text-sm font-bold">
                        {formatPrice(item.total)}
                      </p>
                    </div>
                  ))}
                </CardContent>
                <CardFooter className="flex-col items-stretch gap-4 border-t pt-5">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground text-sm">
                      قیمت کل
                    </span>
                    <span className="text-primary text-lg font-black">
                      {formatPrice(cart.total)}
                    </span>
                  </div>
                  {canReview && (
                    <div className="grid grid-cols-3 gap-2">
                      <Button
                        variant="secondary"
                        disabled={isPending || cart.status === "resolved"}
                        onClick={() => change(cart._id, "resolved")}
                      >
                        <CheckCircle2 /> تایید
                      </Button>
                      <Button
                        variant="outline"
                        disabled={isPending || cart.status === "pending"}
                        onClick={() => change(cart._id, "pending")}
                      >
                        <RotateCcw /> تعلیق
                      </Button>
                      <Button
                        variant="destructive"
                        disabled={isPending || cart.status === "rejected"}
                        onClick={() => change(cart._id, "rejected")}
                      >
                        <XCircle /> لغو
                      </Button>
                    </div>
                  )}
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <Card className="premium-panel">
          <CardContent className="p-8">
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <Clock3 />
                </EmptyMedia>
                <EmptyTitle>سفارشی پیدا نشد</EmptyTitle>
                <EmptyDescription>
                  فهرست سفارشات با این فیلتر خالی است
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
