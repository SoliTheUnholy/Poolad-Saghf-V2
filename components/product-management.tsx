"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Archive, PackagePlus, Save } from "lucide-react";
import { toast } from "sonner";
import {
  addProduct,
  deactivateProduct,
  updateProduct,
} from "@/actions/products";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  PRODUCT_NAMES,
  productDescription,
  type ProductRecord,
  type ProductType,
} from "@/lib/domain";

type AddValues = {
  height?: string;
  top?: string;
  bottom?: string;
  diameter?: string;
  grade?: string;
  ribbed?: string;
  producer?: string;
  price: number;
  stockKg: number;
};
const addSchema = z.object({
  height: z.string().optional(),
  top: z.string().optional(),
  bottom: z.string().optional(),
  diameter: z.string().optional(),
  grade: z.string().optional(),
  ribbed: z.string().optional(),
  producer: z.string().optional(),
  price: z.number().positive("قیمت را وارد کنید"),
  stockKg: z.number().min(0, "موجودی نمی‌تواند منفی باشد"),
});
const updateSchema = z.object({
  price: z.number().positive("قیمت را وارد کنید"),
  stockKg: z.number().min(0, "موجودی نمی‌تواند منفی باشد"),
  isActive: z.boolean(),
});

const specs: Record<
  ProductType,
  Array<{
    key: keyof AddValues;
    label: string;
    options: Array<[string, string]>;
  }>
> = {
  1: [
    {
      key: "height",
      label: "ارتفاع",
      options: [
        ["15", "پله"],
        ["20", "20"],
        ["25", "25"],
        ["30", "30"],
        ["35", "35"],
      ],
    },
    {
      key: "top",
      label: "قطر راس",
      options: [
        ["8", "8"],
        ["10", "10"],
        ["12", "12"],
      ],
    },
    {
      key: "bottom",
      label: "قطر قاعده",
      options: [
        ["8", "8"],
        ["10", "10"],
        ["12", "12"],
      ],
    },
  ],
  2: [
    {
      key: "diameter",
      label: "قطر",
      options: ["5.5", "6.5", "8", "10", "12"].map((v) => [v, v]),
    },
    {
      key: "grade",
      label: "نوع",
      options: ["AII", "AIII", "3SP", "RST", "1008", "1006"].map((v) => [v, v]),
    },
    {
      key: "ribbed",
      label: "آج",
      options: [
        ["true", "آجدار"],
        ["false", "ساده"],
      ],
    },
    {
      key: "producer",
      label: "تولیدکننده",
      options: ["گلستان", "یزد", "کرمان", "شیراز"].map((v) => [v, v]),
    },
  ],
  3: [
    {
      key: "diameter",
      label: "قطر",
      options: [
        "4",
        "4.2",
        "4.4",
        "4.6",
        "4.7",
        "5",
        "5.5",
        "6",
        "8",
        "10",
        "12",
      ].map((v) => [v, v]),
    },
    {
      key: "ribbed",
      label: "آج",
      options: [
        ["true", "آجدار"],
        ["false", "ساده"],
      ],
    },
  ],
};

function AddProductForm({ type }: { type: ProductType }) {
  const router = useRouter();
  const fields = specs[type];
  const schema = addSchema.superRefine((values, context) =>
    fields.forEach((field) => {
      if (!values[field.key] && values[field.key] !== "false")
        context.addIssue({
          code: "custom",
          path: [field.key],
          message: `${field.label} را انتخاب کنید`,
        });
    }),
  );
  const form = useForm<AddValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      price: 0,
      stockKg: 0,
      height: "",
      top: "",
      bottom: "",
      diameter: "",
      grade: "",
      ribbed: "",
      producer: "",
    },
  });
  async function onSubmit(values: AddValues) {
    const common = {
      type,
      price: values.price,
      stockKg: values.stockKg,
      isActive: true,
    };
    const payload =
      type === 1
        ? {
            ...common,
            height: Number(values.height),
            top: Number(values.top),
            bottom: Number(values.bottom),
          }
        : type === 2
          ? {
              ...common,
              diameter: Number(values.diameter),
              grade: values.grade,
              ribbed: values.ribbed === "true",
              producer: values.producer,
            }
          : {
              ...common,
              diameter: Number(values.diameter),
              ribbed: values.ribbed === "true",
            };
    const result = await addProduct(payload);
    if (!result.success) return toast.error(result.error);
    toast.success(result.message);
    form.reset();
    router.refresh();
  }
  return (
    <Card className="premium-panel">
      <CardHeader>
        <CardTitle>افزودن {PRODUCT_NAMES[type]}</CardTitle>
        <CardDescription>
          مشخصات، قیمت و موجودی محصول را ثبت کنید
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {fields.map((spec) => (
              <Controller
                key={spec.key}
                control={form.control}
                name={spec.key}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>{spec.label}</FieldLabel>
                    <Select
                      items={Object.fromEntries(spec.options)}
                      value={String(field.value ?? "")}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="h-10 w-full">
                        <SelectValue placeholder="انتخاب کنید" />
                      </SelectTrigger>
                      <SelectContent dir="rtl">
                        {spec.options.map(([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FieldError errors={[fieldState.error]} />
                  </Field>
                )}
              />
            ))}
            <Controller
              control={form.control}
              name="price"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>قیمت (تومان)</FieldLabel>
                  <Input
                    type="number"
                    min={1}
                    value={field.value || ""}
                    onChange={(e) =>
                      field.onChange(e.target.valueAsNumber || 0)
                    }
                  />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name="stockKg"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>موجودی (کیلوگرم)</FieldLabel>
                  <Input
                    type="number"
                    min={0}
                    value={field.value ?? ""}
                    onChange={(e) =>
                      field.onChange(e.target.valueAsNumber || 0)
                    }
                  />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />
            <div className="flex items-end">
              <Button
                type="submit"
                className="h-10 w-full"
                disabled={form.formState.isSubmitting}
              >
                <PackagePlus /> افزودن
              </Button>
            </div>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}

function ProductRow({
  type,
  product,
}: {
  type: ProductType;
  product: ProductRecord;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof updateSchema>>({
    resolver: zodResolver(updateSchema),
    defaultValues: {
      price: product.price,
      stockKg: product.stockKg ?? 0,
      isActive: product.isActive !== false,
    },
  });
  function save(values: z.infer<typeof updateSchema>) {
    startTransition(async () => {
      const result = await updateProduct({ id: product._id, type, ...values });
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      toast.success(result.message);
      router.refresh();
    });
  }
  function archive() {
    startTransition(async () => {
      const result = await deactivateProduct(type, product._id);
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      toast.success(result.message);
      router.refresh();
    });
  }
  return (
    <TableRow>
      <TableCell>
        <div className="flex flex-wrap gap-x-3 gap-y-1">
          {productDescription(
            type === 1
              ? {
                  height: product.height,
                  top: product.top,
                  bottom: product.bottom,
                }
              : type === 2
                ? {
                    diameter: product.diameter,
                    type: product.type,
                    ribbed: product.ribbed,
                    producer: product.producer,
                  }
                : { diameter: product.diameter, ribbed: product.ribbed },
          ).map((detail) => (
            <span key={detail.label} className="text-xs">
              <span className="text-muted-foreground">{detail.label}: </span>
              {detail.value}
            </span>
          ))}
        </div>
      </TableCell>
      <TableCell colSpan={4}>
        <form
          onSubmit={form.handleSubmit(save)}
          className="grid items-start gap-3 sm:grid-cols-[1fr_1fr_auto_auto]"
        >
          <Controller
            control={form.control}
            name="price"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <Input
                  aria-label="قیمت"
                  type="number"
                  min={1}
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                />
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />
          <Controller
            control={form.control}
            name="stockKg"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <Input
                  aria-label="موجودی"
                  type="number"
                  min={0}
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                />
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />
          <Controller
            control={form.control}
            name="isActive"
            render={({ field }) => (
              <label className="flex h-8 items-center gap-2 text-xs whitespace-nowrap">
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />{" "}
                فعال
              </label>
            )}
          />
          <div className="flex gap-2">
            <Button
              type="submit"
              size="icon"
              variant="secondary"
              disabled={isPending}
              aria-label="ذخیره"
            >
              <Save />
            </Button>
            <AlertDialog>
              <AlertDialogTrigger
                render={
                  <Button
                    type="button"
                    size="icon"
                    variant="destructive"
                    disabled={isPending}
                    aria-label="غیرفعال کردن"
                  />
                }
              >
                <Archive />
              </AlertDialogTrigger>
              <AlertDialogContent dir="rtl">
                <AlertDialogHeader>
                  <AlertDialogTitle>غیرفعال کردن محصول</AlertDialogTitle>
                  <AlertDialogDescription>
                    این محصول دیگر در فهرست سفارش نمایش داده نمی‌شود.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>انصراف</AlertDialogCancel>
                  <AlertDialogAction variant="destructive" onClick={archive}>
                    غیرفعال
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </form>
      </TableCell>
    </TableRow>
  );
}

export function ProductManagement({
  type,
  products,
}: {
  type: ProductType;
  products: ProductRecord[];
}) {
  return (
    <div className="space-y-6">
      <div>
        <Badge variant="secondary">محصولات</Badge>
        <h1 className="mt-3 text-3xl font-black">
          مدیریت {PRODUCT_NAMES[type]}
        </h1>
      </div>
      <AddProductForm type={type} />
      <Card className="premium-panel overflow-hidden">
        <CardHeader>
          <CardTitle>قیمت و موجودی</CardTitle>
          <CardDescription>مقادیر را ویرایش و ذخیره کنید</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-xl border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>مشخصات</TableHead>
                  <TableHead>قیمت</TableHead>
                  <TableHead>موجودی</TableHead>
                  <TableHead>وضعیت</TableHead>
                  <TableHead>عملیات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.length ? (
                  products.map((product) => (
                    <ProductRow
                      key={product._id}
                      type={type}
                      product={product}
                    />
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-muted-foreground h-28 text-center"
                    >
                      محصولی ثبت نشده است
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
