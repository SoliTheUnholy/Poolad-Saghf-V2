import { z } from "zod";

const requiredText = (label: string, min = 2) =>
  z.string().trim().min(min, `${label} را وارد کنید`);

export const loginSchema = z.object({
  number: z.string().trim().min(10, "شماره تلفن را درست وارد کنید"),
  password: z.string().min(6, "رمز باید حداقل ۶ کاراکتر باشد"),
});

export const registerSchema = loginSchema
  .extend({ confirmPassword: z.string().min(6) })
  .refine((value) => value.password === value.confirmPassword, {
    path: ["confirmPassword"],
    message: "رمزها یکسان نیستند",
  });

export const profileSchema = z.object({
  name: requiredText("نام"),
  code: requiredText("کد ملی / کد شرکت", 5),
  address: requiredText("نشانی", 5),
  zipCode: z.string().trim().min(5, "کد پستی را وارد کنید"),
});

export const passwordSchema = z
  .object({
    currentPassword: z.string().min(6, "رمز فعلی را وارد کنید"),
    password: z.string().min(6, "رمز جدید باید حداقل ۶ کاراکتر باشد"),
    confirmPassword: z.string().min(6),
  })
  .refine((value) => value.password === value.confirmPassword, {
    path: ["confirmPassword"],
    message: "رمزهای جدید یکسان نیستند",
  });

export const addToCartSchema = z.object({
  productId: z.string().min(1),
  type: z.coerce.number().int().min(1).max(3),
  weight: z.coerce.number().positive("مقدار سفارش را وارد کنید"),
});

export const cartItemUpdateSchema = z.object({
  cartId: z.string().min(1),
  itemId: z.string().min(1),
  weight: z.coerce.number().positive("مقدار سفارش را وارد کنید"),
});

export const productBaseSchema = z.object({
  price: z.coerce.number().positive("قیمت را وارد کنید"),
  stockKg: z.coerce.number().min(0, "موجودی نمی‌تواند منفی باشد"),
  isActive: z.boolean().default(true),
});

export const latticeProductSchema = productBaseSchema.extend({
  type: z.literal(1),
  height: z.coerce.number(),
  top: z.coerce.number(),
  bottom: z.coerce.number(),
});

export const coilProductSchema = productBaseSchema.extend({
  type: z.literal(2),
  diameter: z.coerce.number(),
  grade: z.string().min(1, "نوع کلاف را انتخاب کنید"),
  ribbed: z.boolean(),
  producer: z.string().min(1, "تولیدکننده را انتخاب کنید"),
});

export const drawnProductSchema = productBaseSchema.extend({
  type: z.literal(3),
  diameter: z.coerce.number(),
  ribbed: z.boolean(),
});

export const productSchema = z.discriminatedUnion("type", [
  latticeProductSchema,
  coilProductSchema,
  drawnProductSchema,
]);

export const productUpdateSchema = z.object({
  id: z.string().min(1),
  type: z.coerce.number().int().min(1).max(3),
  price: z.coerce.number().positive("قیمت را وارد کنید"),
  stockKg: z.coerce.number().min(0, "موجودی نمی‌تواند منفی باشد"),
  isActive: z.boolean(),
});

export const cartStatusSchema = z.object({
  cartId: z.string().min(1),
  status: z.enum(["pending", "resolved", "rejected"]),
});

export type ActionResult<T = undefined> =
  | { success: true; data?: T; message?: string }
  | { success: false; error: string };
