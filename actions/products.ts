"use server";

import { revalidatePath } from "next/cache";
import { connectDB } from "@/lib/mongodb";
import { actionError, requireUser } from "@/lib/auth-guard";
import type { ProductType } from "@/lib/domain";
import { getProductModel } from "@/lib/products-server";
import {
  productSchema,
  productUpdateSchema,
  type ActionResult,
} from "@/lib/validation";

function serialize<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

export async function getProducts(type: ProductType, includeInactive = false) {
  if (includeInactive) await requireUser(["admin", "employee"]);
  await connectDB();
  const Model = getProductModel(type);
  const query = includeInactive ? {} : { isActive: { $ne: false } };
  return serialize(await Model.find(query).sort({ updatedAt: -1 }).lean());
}

export async function addProduct(values: unknown): Promise<ActionResult> {
  try {
    await requireUser(["admin", "employee"]);
    const data = productSchema.parse(values);
    await connectDB();
    const Model = getProductModel(data.type);

    const common = {
      price: data.price,
      stockKg: data.stockKg,
      isActive: data.isActive,
    };
    let productData: Record<string, unknown>;
    let uniqueQuery: Record<string, unknown>;

    if (data.type === 1) {
      productData = { ...common, height: data.height, top: data.top, bottom: data.bottom };
      uniqueQuery = { height: data.height, top: data.top, bottom: data.bottom };
    } else if (data.type === 2) {
      productData = {
        ...common,
        diameter: data.diameter,
        type: data.grade,
        ribbed: data.ribbed,
        producer: data.producer,
      };
      uniqueQuery = {
        diameter: data.diameter,
        type: data.grade,
        ribbed: data.ribbed,
        producer: data.producer,
      };
    } else {
      productData = { ...common, diameter: data.diameter, ribbed: data.ribbed };
      uniqueQuery = { diameter: data.diameter, ribbed: data.ribbed };
    }

    if (await Model.exists(uniqueQuery)) {
      return { success: false, error: "این محصول قبلا ثبت شده است" };
    }
    await Model.create(productData);
    revalidatePath("/dashboard/lattice");
    revalidatePath("/dashboard/coil");
    revalidatePath("/dashboard/drawncoil");
    revalidatePath("/home/products");
    return { success: true, message: "محصول ثبت شد" };
  } catch (error) {
    return { success: false, error: actionError(error) };
  }
}

export async function updateProduct(values: unknown): Promise<ActionResult> {
  try {
    await requireUser(["admin", "employee"]);
    const data = productUpdateSchema.parse(values);
    await connectDB();
    const Model = getProductModel(data.type as ProductType);
    const updated = await Model.findByIdAndUpdate(
      data.id,
      { $set: { price: data.price, stockKg: data.stockKg, isActive: data.isActive } },
      { new: true, runValidators: true },
    );
    if (!updated) return { success: false, error: "محصول پیدا نشد" };
    revalidatePath("/dashboard/lattice");
    revalidatePath("/dashboard/coil");
    revalidatePath("/dashboard/drawncoil");
    revalidatePath("/home/products");
    return { success: true, message: "قیمت و موجودی به‌روزرسانی شد" };
  } catch (error) {
    return { success: false, error: actionError(error) };
  }
}

export async function deactivateProduct(
  type: ProductType,
  id: string,
): Promise<ActionResult> {
  try {
    await requireUser(["admin", "employee"]);
    await connectDB();
    const Model = getProductModel(type);
    const updated = await Model.findByIdAndUpdate(id, { $set: { isActive: false } });
    if (!updated) return { success: false, error: "محصول پیدا نشد" };
    revalidatePath("/dashboard/lattice");
    revalidatePath("/dashboard/coil");
    revalidatePath("/dashboard/drawncoil");
    revalidatePath("/home/products");
    return { success: true, message: "محصول غیرفعال شد" };
  } catch (error) {
    return { success: false, error: actionError(error) };
  }
}
