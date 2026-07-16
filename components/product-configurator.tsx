"use client";

import { useEffect, useMemo } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, useWatch } from "react-hook-form";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, Check, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { addToCart } from "@/actions/cart";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProductVisual } from "@/components/product-visual";
import {
  formatPrice,
  formatWeight,
  PRODUCT_NAMES,
  type ProductRecord,
  type ProductType,
} from "@/lib/domain";

type Values = {
  height?: string;
  top?: string;
  bottom?: string;
  diameter?: string;
  grade?: string;
  ribbed?: string;
  producer?: string;
  weight: number;
};
type ConfigKey = Exclude<keyof Values, "weight">;

const baseSchema = z.object({
  height: z.string().optional(),
  top: z.string().optional(),
  bottom: z.string().optional(),
  diameter: z.string().optional(),
  grade: z.string().optional(),
  ribbed: z.string().optional(),
  producer: z.string().optional(),
  weight: z.number().positive("مقدار سفارش را وارد کنید"),
});

const configs: Record<
  ProductType,
  Array<{ key: ConfigKey; label: string; description: string }>
> = {
  1: [
    { key: "height", label: "ارتفاع", description: "ارتفاع خرپا" },
    { key: "top", label: "قطر میله راس", description: "قطر میله بالای خرپا" },
    {
      key: "bottom",
      label: "قطر میله‌های قاعده",
      description: "قطر میله‌های پایین خرپا",
    },
  ],
  2: [
    { key: "diameter", label: "قطر", description: "قطر کلاف" },
    { key: "grade", label: "نوع", description: "نوع کلاف" },
    { key: "ribbed", label: "آج", description: "ساده یا آجدار" },
    { key: "producer", label: "تولیدکننده", description: "شرکت تولیدکننده" },
  ],
  3: [
    { key: "diameter", label: "قطر", description: "قطر کلاف کشیده" },
    { key: "ribbed", label: "آج", description: "ساده یا آجدار" },
  ],
};

function valueOf(product: ProductRecord, key: ConfigKey) {
  const value = key === "grade" ? product.type : product[key];
  return String(value);
}

function labelOf(key: keyof Values, value: string) {
  if (key === "ribbed") return value === "true" ? "آجدار" : "ساده";
  if (key === "height" && value === "15") return "پله";
  return value;
}

export function ProductConfigurator({
  type,
  products,
}: {
  type: ProductType;
  products: ProductRecord[];
}) {
  const router = useRouter();
  const session = useSession();
  const fields = configs[type];
  const schema = useMemo(
    () =>
      baseSchema.superRefine((values, context) => {
        for (const field of fields) {
          if (!values[field.key])
            context.addIssue({
              code: "custom",
              path: [field.key],
              message: `${field.label} را انتخاب کنید`,
            });
        }
      }),
    [fields],
  );
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      height: "",
      top: "",
      bottom: "",
      diameter: "",
      grade: "",
      ribbed: "",
      producer: "",
      weight: 0,
    },
  });
  const values = useWatch({ control: form.control });

  useEffect(() => {
    if (session.status === "unauthenticated") {
      toast.info("ابتدا وارد حساب کاربری خود شوید");
      router.replace(
        `/home/login?returnTo=${encodeURIComponent(location.pathname)}`,
      );
    }
  }, [router, session.status]);

  const matchedProduct = products.find((product) =>
    fields.every(
      (field) =>
        values[field.key] &&
        valueOf(product, field.key) === String(values[field.key]),
    ),
  );
  const completeCount = fields.filter((field) => values[field.key]).length;
  const progress = Math.round(
    ((completeCount + (Number(values.weight) > 0 ? 1 : 0)) /
      (fields.length + 1)) *
      100,
  );

  function optionsFor(key: ConfigKey) {
    const compatible = products.filter((product) =>
      fields.every(
        (field) =>
          field.key === key ||
          !values[field.key] ||
          valueOf(product, field.key) === String(values[field.key]),
      ),
    );
    return [...new Set(compatible.map((product) => valueOf(product, key)))];
  }

  async function onSubmit(data: Values) {
    if (!matchedProduct) {
      toast.error("محصولی با این مشخصات موجود نیست");
      return;
    }
    const result = await addToCart({
      productId: matchedProduct._id,
      type,
      weight: data.weight,
    });
    if (!result.success) return toast.error(result.error);
    toast.success(result.message);
    router.push("/home/cart");
  }

  const unitPrice = Number(matchedProduct?.price ?? 0);
  const total =
    unitPrice * Number(values.weight || 0) -
    (type === 1 && Number(values.weight) >= 2000
      ? Number(values.weight) * (Number(values.weight) < 10000 ? 100 : 200)
      : 0);

  return (
    <div className="grid gap-6 lg:grid-cols-[.9fr_1.1fr]">
      <motion.div
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        className="lg:sticky lg:top-28 lg:h-fit"
      >
        <Card className="premium-panel overflow-hidden p-0!">
          <div className="from-primary/12 bg-gradient-to-b to-transparent p-6">
            <ProductVisual type={type} className="mx-auto max-w-md" />
          </div>
          <CardContent className="border-t p-6">
            <p className="text-muted-foreground text-sm">محصول</p>
            <h1 className="mt-1 text-2xl font-black">{PRODUCT_NAMES[type]}</h1>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: -24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.08 }}
      >
        <Card className="premium-panel h-full">
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div>
                <CardTitle className="text-2xl">ثبت سفارش</CardTitle>
                <CardDescription className="mt-2">
                  مشخصات و مقدار محصول را انتخاب کنید
                </CardDescription>
              </div>
              <span className="text-muted-foreground text-xs font-bold">
                {progress.toLocaleString("fa-IR")}٪
              </span>
            </div>
            <Progress value={progress} className="mt-4" />
          </CardHeader>
          <form
            className="flex h-full flex-col justify-between"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <CardContent className="pb-4">
              <FieldGroup className="grid gap-5 sm:grid-cols-2">
                {fields.map((config) => (
                  <Controller
                    key={config.key}
                    control={form.control}
                    name={config.key}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel>{config.label}</FieldLabel>
                        <Select
                          items={Object.fromEntries(
                            optionsFor(config.key).map((option) => [
                              option,
                              labelOf(config.key, option),
                            ]),
                          )}
                          value={String(field.value ?? "")}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="h-11 w-full">
                            <SelectValue placeholder="انتخاب کنید" />
                          </SelectTrigger>
                          <SelectContent dir="rtl">
                            {optionsFor(config.key).map((option) => (
                              <SelectItem key={option} value={option}>
                                {labelOf(config.key, option)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FieldDescription>
                          {config.description}
                        </FieldDescription>
                        <FieldError errors={[fieldState.error]} />
                      </Field>
                    )}
                  />
                ))}
                <Controller
                  control={form.control}
                  name="weight"
                  render={({ field, fieldState }) => (
                    <Field
                      data-invalid={fieldState.invalid}
                      className="sm:col-span-2"
                    >
                      <FieldLabel htmlFor="weight">مقدار</FieldLabel>
                      <Input
                        id="weight"
                        type="number"
                        min={1}
                        step={1}
                        className="h-11"
                        disabled={!matchedProduct}
                        value={field.value || ""}
                        onChange={(event) =>
                          field.onChange(event.target.valueAsNumber || 0)
                        }
                      />
                      <FieldDescription>
                        مقدار مورد نظر (کیلوگرم)
                      </FieldDescription>
                      <FieldError errors={[fieldState.error]} />
                    </Field>
                  )}
                />
              </FieldGroup>

              <AnimatePresence mode="wait">
                <motion.div
                  key={matchedProduct?._id ?? "empty"}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="bg-muted/55 mt-7 rounded-2xl border p-5"
                >
                  {matchedProduct ? (
                    <div className="grid gap-4 sm:grid-cols-3">
                      <div>
                        <p className="text-muted-foreground text-xs">
                          قیمت واحد
                        </p>
                        <p className="mt-1 font-bold">
                          {formatPrice(unitPrice)}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs">مقدار</p>
                        <p className="mt-1 font-bold">
                          {formatWeight(Number(values.weight || 0))}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs">
                          قیمت محاسبه‌شده
                        </p>
                        <p className="text-primary mt-1 text-lg font-black">
                          {formatPrice(Math.max(0, total))}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-sm">
                      برای مشاهده قیمت، مشخصات محصول را کامل کنید
                    </p>
                  )}
                </motion.div>
              </AnimatePresence>
            </CardContent>
            <CardFooter className="justify-between gap-3 border-t pt-4">
              <Button
                type="button"
                variant="ghost"
                onClick={() => router.push("/home/products")}
              >
                <ArrowRight /> محصولات
              </Button>
              <Button
                type="submit"
                size="lg"
                disabled={!matchedProduct || form.formState.isSubmitting}
              >
                <ShoppingCart /> افزودن به سبد خرید <Check />
              </Button>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </div>
  );
}
