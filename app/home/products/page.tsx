import Link from "next/link";
import { ArrowLeft, ClipboardCheck, Settings2, ShoppingCart } from "lucide-react";
import { getProducts } from "@/actions/products";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { HoverLift, PageMotion, Reveal } from "@/components/motion-primitives";
import { ProductVisual } from "@/components/product-visual";
import {
  formatPrice,
  PRODUCT_NAMES,
  productDescription,
  productInfoFromDocument,
  type ProductRecord,
  type ProductType,
} from "@/lib/domain";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const groups = await Promise.all(
    ([1, 2, 3] as ProductType[]).map(async (type) => ({
      type,
      products: await getProducts(type),
    })),
  );
  return (
    <PageMotion className="section-shell space-y-10 py-8 sm:py-14">
      <Reveal>
        <div className="premium-panel relative overflow-hidden rounded-[2rem] p-7 sm:p-10 lg:p-14">
          <div className="bg-primary/12 absolute -top-24 -left-16 size-72 rounded-full blur-3xl" />
          <div className="relative grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
            <div className="max-w-3xl">
              <Badge variant="secondary">محصولات</Badge>
              <h1 className="mt-5 text-4xl font-bold sm:text-6xl">انتخاب و ثبت سفارش</h1>
              <p className="text-muted-foreground mt-5 leading-8">محصول و مشخصات فنی را انتخاب کنید، مقدار مورد نظر را به سبد خرید اضافه کنید و سبد کامل را برای بررسی ثبت کنید.</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3 lg:w-[470px]">
              {[[Settings2,"انتخاب محصول"],[ShoppingCart,"سبد خرید"],[ClipboardCheck,"ثبت سفارش"]].map(([Icon,label], index) => {
                const StepIcon = Icon as typeof Settings2;
                return <div key={label as string} className="bg-background/55 rounded-xl border p-4"><span className="text-primary text-xs font-bold">۰{index + 1}</span><StepIcon className="text-primary mt-4 size-5" /><p className="mt-2 text-xs font-bold">{label as string}</p></div>;
              })}
            </div>
          </div>
        </div>
      </Reveal>
      <div className="grid gap-5 md:grid-cols-3">
        {groups.map(({ type }) => (
          <Reveal key={type}>
            <HoverLift>
              <Card className="premium-panel overflow-hidden p-0! gap-0">
                <div className="bg-primary/8 p-5">
                  <ProductVisual type={type} className="mx-auto max-w-60" />
                </div>
                <CardContent className="flex items-center justify-between border-t p-5">
                  <CardTitle>{PRODUCT_NAMES[type]}</CardTitle>
                  <Button
                    render={
                      <Link
                        href={
                          type === 1
                            ? "/home/products/lattice"
                            : type === 2
                              ? "/home/products/coil"
                              : "/home/products/drawn"
                        }
                      />
                    }
                  >
                    انتخاب <ArrowLeft />
                  </Button>
                </CardContent>
              </Card>
            </HoverLift>
          </Reveal>
        ))}
      </div>
      <Reveal>
        <Card className="premium-panel overflow-hidden">
          <CardHeader>
            <CardTitle>لیست موجودی</CardTitle>
            <CardDescription>محصولات قابل سفارش</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            {groups.map(({ type, products }) => (
              <div key={type} className="overflow-hidden rounded-2xl border">
                <div className="bg-muted/60 flex items-center justify-between px-4 py-3">
                  <h2 className="font-black">{PRODUCT_NAMES[type]}</h2>
                  <Badge variant="outline">
                    {products.length.toLocaleString("fa-IR")} مورد
                  </Badge>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>مشخصات</TableHead>
                      <TableHead>قیمت</TableHead>
                      <TableHead>موجودی</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.length ? (
                      products.map((product: ProductRecord) => (
                        <TableRow key={product._id}>
                          <TableCell>
                            <div className="flex flex-wrap gap-x-4 gap-y-1">
                              {productDescription(
                                productInfoFromDocument(type, product),
                              ).map((item) => (
                                <span key={item.label} className="text-sm">
                                  <span className="text-muted-foreground">
                                    {item.label}:{" "}
                                  </span>
                                  {item.value}
                                </span>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell className="font-bold">
                            {formatPrice(product.price)}
                          </TableCell>
                          <TableCell>
                            {product.stockKg == null
                              ? "ثبت نشده"
                              : `${Number(product.stockKg).toLocaleString("fa-IR")} کیلوگرم`}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={3}
                          className="text-muted-foreground h-24 text-center"
                        >
                          محصول موجود نیست
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            ))}
          </CardContent>
        </Card>
      </Reveal>
    </PageMotion>
  );
}
