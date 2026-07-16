"use server";

import { revalidatePath } from "next/cache";
import { connectDB } from "@/lib/mongodb";
import { actionError, requireUser } from "@/lib/auth-guard";
import {
  calculateLineTotal,
  productInfoFromDocument,
  type ProductType,
} from "@/lib/domain";
import { getProductModel } from "@/lib/products-server";
import {
  addToCartSchema,
  cartItemUpdateSchema,
  cartStatusSchema,
  type ActionResult,
} from "@/lib/validation";
import Cart from "@/models/cart";
import User from "@/models/users";

type CartLine = {
  productId: string | { toString(): string };
  type: ProductType;
  weight: number;
  unitPrice: number;
  discount: number;
  total: number;
};

function serialize<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

function totals(items: CartLine[]) {
  return items.reduce(
    (sum, item) => ({
      subtotal: sum.subtotal + item.weight * item.unitPrice,
      discountTotal: sum.discountTotal + item.discount,
      total: sum.total + item.total,
    }),
    { subtotal: 0, discountTotal: 0, total: 0 },
  );
}

function groupItems(items: Array<Pick<CartLine, "productId" | "type" | "weight">>) {
  const grouped = new Map<string, { productId: string; type: ProductType; weight: number }>();
  for (const item of items) {
    const productId = String(item.productId);
    const key = `${item.type}:${productId}`;
    const current = grouped.get(key);
    if (current) current.weight += item.weight;
    else grouped.set(key, { productId, type: item.type, weight: item.weight });
  }
  return [...grouped.values()];
}

async function reserveInventory(items: Array<Pick<CartLine, "productId" | "type" | "weight">>) {
  const reserved: Array<{ productId: string; type: ProductType; weight: number }> = [];
  for (const item of groupItems(items)) {
    const Model = getProductModel(item.type);
    const product = await Model.findById(item.productId).lean();
    if (!product || product.isActive === false) {
      await releaseInventory(reserved);
      throw new Error("PUBLIC:یکی از محصولات سبد دیگر قابل سفارش نیست");
    }
    if (product.stockKg == null) continue;
    const changed = await Model.findOneAndUpdate(
      { _id: item.productId, isActive: { $ne: false }, stockKg: { $gte: item.weight } },
      { $inc: { stockKg: -item.weight } },
      { new: true },
    );
    if (!changed) {
      await releaseInventory(reserved);
      throw new Error("PUBLIC:موجودی یکی از محصولات برای این مقدار کافی نیست");
    }
    reserved.push(item);
  }
}

async function releaseInventory(items: Array<Pick<CartLine, "productId" | "type" | "weight">>) {
  for (const item of groupItems(items)) {
    const Model = getProductModel(item.type);
    const product = await Model.findById(item.productId).select("stockKg").lean();
    if (product?.stockKg != null) {
      await Model.findByIdAndUpdate(item.productId, { $inc: { stockKg: item.weight } });
    }
  }
}

async function getDraft(userId: string) {
  let cart = await Cart.findOne({ userId, status: "draft" });
  if (!cart) {
    try {
      cart = await Cart.create({ userId, status: "draft", items: [] });
    } catch (error) {
      if ((error as { code?: number })?.code === 11000) {
        cart = await Cart.findOne({ userId, status: "draft" });
      } else throw error;
    }
  }
  if (!cart) throw new Error("PUBLIC:ساخت سبد خرید ممکن نشد");
  return cart;
}

export async function addToCart(values: unknown): Promise<ActionResult<{ cartId: string }>> {
  try {
    const user = await requireUser(["user", "employee", "admin"]);
    const data = addToCartSchema.parse(values);
    const type = data.type as ProductType;
    await connectDB();
    const Model = getProductModel(type);
    const product = await Model.findOne({ _id: data.productId, isActive: { $ne: false } }).lean();
    if (!product) return { success: false, error: "محصول انتخاب‌شده موجود نیست" };

    const cart = await getDraft(user.id);
    const existing = cart.items.find(
      (item: CartLine) => String(item.productId) === data.productId && item.type === type,
    );
    const requestedWeight = data.weight + (existing?.weight ?? 0);
    if (product.stockKg != null && requestedWeight > product.stockKg) {
      return { success: false, error: "مقدار انتخاب‌شده بیشتر از موجودی محصول است" };
    }

    const line = calculateLineTotal(requestedWeight, product.price, type);
    if (existing) {
      existing.weight = requestedWeight;
      existing.unitPrice = product.price;
      existing.discount = line.discount;
      existing.total = line.total;
      existing.productInfo = productInfoFromDocument(type, product);
    } else {
      cart.items.push({
        productId: data.productId,
        type,
        productInfo: productInfoFromDocument(type, product),
        weight: data.weight,
        unitPrice: product.price,
        discount: line.discount,
        total: line.total,
      });
    }
    Object.assign(cart, totals(cart.items));
    await cart.save();
    revalidatePath("/home/cart");
    revalidatePath("/dashboard/cart");
    return { success: true, data: { cartId: String(cart._id) }, message: "به سبد خرید اضافه شد" };
  } catch (error) {
    return { success: false, error: actionError(error) };
  }
}

export async function getMyDraftCart() {
  try {
    const user = await requireUser();
    await connectDB();
    const cart = await Cart.findOne({ userId: user.id, status: "draft" }).lean();
    return cart ? serialize(cart) : null;
  } catch {
    return null;
  }
}

export async function updateCartItem(values: unknown): Promise<ActionResult> {
  try {
    const user = await requireUser();
    const data = cartItemUpdateSchema.parse(values);
    await connectDB();
    const cart = await Cart.findOne({ _id: data.cartId, userId: user.id, status: "draft" });
    if (!cart) return { success: false, error: "سبد خرید پیدا نشد" };
    const item = cart.items.id(data.itemId);
    if (!item) return { success: false, error: "محصول از سبد حذف شده است" };
    const Model = getProductModel(item.type as ProductType);
    const product = await Model.findOne({ _id: item.productId, isActive: { $ne: false } }).lean();
    if (!product) return { success: false, error: "این محصول دیگر قابل سفارش نیست" };
    if (product.stockKg != null && data.weight > product.stockKg) {
      return { success: false, error: "مقدار انتخاب‌شده بیشتر از موجودی محصول است" };
    }
    const line = calculateLineTotal(data.weight, product.price, item.type as ProductType);
    item.weight = data.weight;
    item.unitPrice = product.price;
    item.discount = line.discount;
    item.total = line.total;
    item.productInfo = productInfoFromDocument(item.type as ProductType, product);
    Object.assign(cart, totals(cart.items));
    await cart.save();
    revalidatePath("/home/cart");
    return { success: true, message: "سبد خرید به‌روزرسانی شد" };
  } catch (error) {
    return { success: false, error: actionError(error) };
  }
}

export async function removeCartItem(cartId: string, itemId: string): Promise<ActionResult> {
  try {
    const user = await requireUser();
    await connectDB();
    const cart = await Cart.findOne({ _id: cartId, userId: user.id, status: "draft" });
    if (!cart) return { success: false, error: "سبد خرید پیدا نشد" };
    cart.items.pull({ _id: itemId });
    Object.assign(cart, totals(cart.items));
    await cart.save();
    revalidatePath("/home/cart");
    return { success: true, message: "از سبد خرید حذف شد" };
  } catch (error) {
    return { success: false, error: actionError(error) };
  }
}

export async function submitCart(cartId: string): Promise<ActionResult<{ cartId: string }>> {
  try {
    const user = await requireUser();
    await connectDB();
    const profile = await User.findById(user.id).lean();
    if (!profile?.name || !profile.code || !profile.address || !profile.zipCode) {
      return { success: false, error: "پیش از ثبت سفارش، مشخصات حساب را تکمیل کنید" };
    }
    const cart = await Cart.findOne({ _id: cartId, userId: user.id, status: "draft" });
    if (!cart || cart.items.length === 0) return { success: false, error: "سبد خرید خالی است" };

    for (const item of cart.items) {
      const Model = getProductModel(item.type as ProductType);
      const product = await Model.findOne({ _id: item.productId, isActive: { $ne: false } }).lean();
      if (!product) return { success: false, error: "یکی از محصولات دیگر قابل سفارش نیست" };
      const line = calculateLineTotal(item.weight, product.price, item.type as ProductType);
      item.unitPrice = product.price;
      item.discount = line.discount;
      item.total = line.total;
      item.productInfo = productInfoFromDocument(item.type as ProductType, product);
    }
    Object.assign(cart, totals(cart.items));
    await reserveInventory(cart.items);
    cart.status = "pending";
    cart.inventoryReserved = true;
    cart.submittedAt = new Date();
    cart.reviewHistory.push({ status: "pending", by: user.id, at: new Date() });
    try {
      await cart.save();
    } catch (error) {
      await releaseInventory(cart.items);
      throw error;
    }
    revalidatePath("/home/cart");
    revalidatePath("/dashboard/orderslist");
    return { success: true, data: { cartId: String(cart._id) }, message: "سفارش شما ثبت شد و در حال بررسی است" };
  } catch (error) {
    return { success: false, error: actionError(error) };
  }
}

export async function getMySubmittedCarts() {
  const user = await requireUser();
  await connectDB();
  return serialize(
    await Cart.find({ userId: user.id, status: { $ne: "draft" } }).sort({ submittedAt: -1 }).lean(),
  );
}

export async function getMyCart(cartId: string) {
  const user = await requireUser();
  await connectDB();
  const cart = await Cart.findOne({ _id: cartId, userId: user.id }).lean();
  return cart ? serialize(cart) : null;
}

export async function getSubmittedCarts() {
  await requireUser(["admin", "employee"]);
  await connectDB();
  const carts = await Cart.find({ status: { $ne: "draft" } }).sort({ submittedAt: -1 }).lean();
  const userIds = [...new Set(carts.map((cart) => cart.userId))];
  const users = await User.find({ _id: { $in: userIds } })
    .select("name number code address zipCode")
    .lean();
  const userMap = new Map(users.map((item) => [String(item._id), item]));
  return serialize(carts.map((cart) => ({ ...cart, user: userMap.get(cart.userId) ?? null })));
}

export async function updateCartStatus(values: unknown): Promise<ActionResult> {
  try {
    const reviewer = await requireUser(["admin", "employee"]);
    const data = cartStatusSchema.parse(values);
    await connectDB();
    const cart = await Cart.findOne({ _id: data.cartId, status: { $ne: "draft" } });
    if (!cart) return { success: false, error: "سفارش پیدا نشد" };

    const needsInventory = data.status !== "rejected";
    if (needsInventory && !cart.inventoryReserved) {
      await reserveInventory(cart.items);
      cart.inventoryReserved = true;
    } else if (!needsInventory && cart.inventoryReserved) {
      await releaseInventory(cart.items);
      cart.inventoryReserved = false;
    }
    cart.status = data.status;
    cart.reviewedAt = new Date();
    cart.reviewedBy = reviewer.id;
    cart.reviewHistory.push({ status: data.status, by: reviewer.id, at: new Date() });
    await cart.save();
    revalidatePath("/dashboard/orderslist");
    return { success: true, message: "وضعیت سفارش به‌روزرسانی شد" };
  } catch (error) {
    return { success: false, error: actionError(error) };
  }
}
