export type ProductType = 1 | 2 | 3;
export type UserRole = "admin" | "employee" | "user";
export type CartStatus = "draft" | "pending" | "resolved" | "rejected";

export interface ProductRecord {
  _id: string;
  price: number;
  stockKg?: number | null;
  isActive?: boolean;
  height?: number;
  top?: number;
  bottom?: number;
  diameter?: number;
  type?: string;
  ribbed?: boolean;
  producer?: string;
}

export interface CartItemRecord {
  _id: string;
  productId: string;
  type: ProductType;
  productInfo: Record<string, unknown>;
  weight: number;
  unitPrice: number;
  discount: number;
  total: number;
}

export interface UserRecord {
  _id: string;
  name?: string;
  number: string;
  code?: string;
  address?: string;
  zipCode?: string;
  role: UserRole;
}

export interface CartRecord {
  _id: string;
  userId: string;
  items: CartItemRecord[];
  status: CartStatus;
  subtotal: number;
  discountTotal: number;
  total: number;
  user?: Omit<UserRecord, "role"> | null;
}

export const PRODUCT_NAMES: Record<ProductType, string> = {
  1: "خرپا",
  2: "کلاف",
  3: "کلاف کشیده",
};

export const STATUS_LABELS = {
  draft: "سبد خرید",
  pending: "در انتظار بررسی",
  resolved: "تایید شده",
  rejected: "لغو شده",
} as const;

export function calculateDiscount(weight: number, type: ProductType) {
  if (type !== 1 || weight < 2_000) return 0;
  return weight * (weight < 10_000 ? 100 : 200);
}

export function calculateLineTotal(
  weight: number,
  unitPrice: number,
  type: ProductType,
) {
  const subtotal = weight * unitPrice;
  const discount = calculateDiscount(weight, type);
  return { subtotal, discount, total: Math.max(0, subtotal - discount) };
}

export function productInfoFromDocument(type: ProductType, product: ProductRecord) {
  if (type === 1) {
    return { height: product.height, top: product.top, bottom: product.bottom };
  }
  if (type === 2) {
    return {
      diameter: product.diameter,
      type: product.type,
      ribbed: product.ribbed,
      producer: product.producer,
    };
  }
  return { diameter: product.diameter, ribbed: product.ribbed };
}

export function productDescription(info: Record<string, unknown>) {
  const labels: Record<string, string> = {
    height: "ارتفاع",
    top: "راس",
    bottom: "قاعده",
    diameter: "قطر",
    type: "نوع",
    ribbed: "آج",
    producer: "تولیدکننده",
  };
  return Object.entries(info).map(([key, value]) => ({
    label: labels[key] ?? key,
    value:
      typeof value === "boolean" ? (value ? "آجدار" : "ساده") : String(value),
  }));
}

export function formatPrice(value: number) {
  return `${new Intl.NumberFormat("fa-IR").format(value)} تومان`;
}

export function formatWeight(value: number) {
  return `${new Intl.NumberFormat("fa-IR").format(value)} کیلوگرم`;
}
