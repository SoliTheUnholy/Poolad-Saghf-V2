"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { motion } from "motion/react";
import { PackagePlus, Send, ShoppingBasket, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { removeCartItem, submitCart, updateCartItem } from "@/actions/cart";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
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
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { ProductVisual } from "@/components/product-visual";
import {
  formatPrice,
  formatWeight,
  PRODUCT_NAMES,
  productDescription,
  type CartItemRecord,
  type CartRecord,
  type ProductType,
} from "@/lib/domain";

const itemSchema = z.object({
  weight: z.number().positive("مقدار سفارش را وارد کنید"),
});

function CartLine({ cartId, item }: { cartId: string; item: CartItemRecord }) {
  const router = useRouter();
  const form = useForm<{ weight: number }>({
    resolver: zodResolver(itemSchema),
    defaultValues: { weight: item.weight },
  });
  async function update(values: { weight: number }) {
    const result = await updateCartItem({
      cartId,
      itemId: item._id,
      weight: values.weight,
    });
    if (!result.success) return toast.error(result.error);
    toast.success(result.message);
    router.refresh();
  }
  async function remove() {
    const result = await removeCartItem(cartId, item._id);
    if (!result.success) return toast.error(result.error);
    toast.success(result.message);
    router.refresh();
  }
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      className="bg-background/45 grid gap-5 rounded-2xl border p-4 sm:grid-cols-[110px_1fr]"
    >
      <ProductVisual
        type={item.type as ProductType}
        className="mx-auto w-full max-w-28"
      />
      <div className="min-w-0">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="font-black">
              {PRODUCT_NAMES[item.type as ProductType]}
            </h3>
            <div className="text-muted-foreground mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs">
              {productDescription(item.productInfo).map((detail) => (
                <span key={detail.label}>
                  {detail.label}:{" "}
                  <span className="text-foreground">{detail.value}</span>
                </span>
              ))}
            </div>
          </div>
          <p className="text-primary text-lg font-black">
            {formatPrice(item.total)}
          </p>
        </div>
        <form
          onSubmit={form.handleSubmit(update)}
          className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-end"
        >
          <Controller
            control={form.control}
            name="weight"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="max-w-56">
                <FieldLabel htmlFor={`weight-${item._id}`}>
                  مقدار (کیلوگرم)
                </FieldLabel>
                <Input
                  id={`weight-${item._id}`}
                  type="number"
                  min={1}
                  value={field.value}
                  onChange={(event) =>
                    field.onChange(event.target.valueAsNumber || 0)
                  }
                />
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />
          <Button
            type="submit"
            variant="secondary"
            disabled={form.formState.isSubmitting}
          >
            به‌روزرسانی
          </Button>
          <AlertDialog>
            <AlertDialogTrigger
              render={
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  aria-label="حذف از سبد"
                />
              }
            >
              <Trash2 />
            </AlertDialogTrigger>
            <AlertDialogContent dir="rtl">
              <AlertDialogHeader>
                <AlertDialogMedia>
                  <Trash2 />
                </AlertDialogMedia>
                <AlertDialogTitle>حذف از سبد خرید</AlertDialogTitle>
                <AlertDialogDescription>
                  این محصول از سبد خرید حذف شود؟
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>انصراف</AlertDialogCancel>
                <AlertDialogAction variant="destructive" onClick={remove}>
                  حذف
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </form>
      </div>
    </motion.div>
  );
}

export function CartView({ cart }: { cart: CartRecord | null }) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  if (!cart?.items?.length) {
    return (
      <Card className="premium-panel">
        <CardContent className="p-8">
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <ShoppingBasket />
              </EmptyMedia>
              <EmptyTitle>سبد خرید خالی است</EmptyTitle>
              <EmptyDescription>
                محصول مورد نظر را انتخاب و به سبد خرید اضافه کنید
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button render={<Link href="/home/products" />}>
                <PackagePlus /> مشاهده محصولات
              </Button>
            </EmptyContent>
          </Empty>
        </CardContent>
      </Card>
    );
  }
  const cartId = cart._id;
  async function submit() {
    setSubmitting(true);
    const result = await submitCart(cartId);
    setSubmitting(false);
    if (!result.success) {
      toast.error(result.error);
      if (result.error.includes("مشخصات حساب"))
        router.push("/dashboard/changeinfo?returnTo=/home/cart");
      return;
    }
    toast.success(result.message);
    router.push(`/home/products/summery/${result.data?.cartId}`);
  }
  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
      <Card className="premium-panel">
        <CardHeader>
          <CardTitle>محصولات سبد خرید</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {cart.items.map((item) => (
            <CartLine key={item._id} cartId={cart._id} item={item} />
          ))}
        </CardContent>
      </Card>
      <Card className="premium-panel h-fit xl:sticky xl:top-28">
        <CardHeader>
          <CardTitle>خلاصه سفارش</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">مجموع وزن</span>
            <span className="font-bold">
              {formatWeight(
                cart.items.reduce((sum, item) => sum + item.weight, 0),
              )}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">جمع</span>
            <span>{formatPrice(cart.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">تخفیف</span>
            <span>{formatPrice(cart.discountTotal)}</span>
          </div>
          <div className="flex justify-between border-t pt-4 text-base">
            <span className="font-bold">قیمت کل</span>
            <span className="text-primary font-black">
              {formatPrice(cart.total)}
            </span>
          </div>
        </CardContent>
        <CardFooter className="flex-col gap-3">
          <AlertDialog>
            <AlertDialogTrigger
              render={
                <Button size="lg" className="w-full" disabled={submitting} />
              }
            >
              <Send /> ثبت سفارش
            </AlertDialogTrigger>
            <AlertDialogContent dir="rtl">
              <AlertDialogHeader>
                <AlertDialogMedia>
                  <Send />
                </AlertDialogMedia>
                <AlertDialogTitle>ثبت سفارش</AlertDialogTitle>
                <AlertDialogDescription>
                  همه محصولات این سبد به‌صورت یک سفارش برای بررسی ارسال می‌شوند.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>انصراف</AlertDialogCancel>
                <AlertDialogAction onClick={submit}>
                  ثبت سفارش
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Button
            variant="outline"
            className="w-full"
            render={<Link href="/home/products" />}
          >
            <PackagePlus /> افزودن محصول دیگر
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
