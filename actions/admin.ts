"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import { actionError, requireUser } from "@/lib/auth-guard";
import type { ActionResult } from "@/lib/validation";
import User from "@/models/users";
import Cart from "@/models/cart";
import lattice from "@/models/lattices";
import coil from "@/models/coils";
import drawn from "@/models/drawns";

export async function getUsers() {
  await requireUser(["admin"]);
  await connectDB();
  return JSON.parse(
    JSON.stringify(await User.find({}).select("name number code address zipCode role createdAt").sort({ createdAt: -1 }).lean()),
  );
}

export async function changeUserRole(values: unknown): Promise<ActionResult> {
  try {
    const admin = await requireUser(["admin"]);
    const data = z.object({ id: z.string().min(1), role: z.enum(["admin", "employee", "user"]) }).parse(values);
    if (data.id === admin.id) return { success: false, error: "نقش حساب فعال را نمی‌توانید تغییر دهید" };
    await connectDB();
    const changed = await User.findByIdAndUpdate(data.id, { $set: { role: data.role } });
    if (!changed) return { success: false, error: "کاربر پیدا نشد" };
    revalidatePath("/dashboard/userslist");
    return { success: true, message: "دسترسی کاربر تغییر کرد" };
  } catch (error) {
    return { success: false, error: actionError(error) };
  }
}

export async function deleteUserAccount(id: string): Promise<ActionResult> {
  try {
    const admin = await requireUser(["admin"]);
    if (id === admin.id) return { success: false, error: "حساب فعال را نمی‌توانید حذف کنید" };
    await connectDB();
    if (await Cart.exists({ userId: id, status: { $in: ["pending", "resolved"] } })) {
      return { success: false, error: "این کاربر سفارش فعال دارد و قابل حذف نیست" };
    }
    const deleted = await User.findByIdAndDelete(id);
    if (!deleted) return { success: false, error: "کاربر پیدا نشد" };
    revalidatePath("/dashboard/userslist");
    return { success: true, message: "کاربر حذف شد" };
  } catch (error) {
    return { success: false, error: actionError(error) };
  }
}

export async function getDashboardSummary() {
  await requireUser(["admin", "employee"]);
  await connectDB();
  const [pending, resolved, users, lattices, coils, drawns, lowLattice, lowCoil, lowDrawn] = await Promise.all([
    Cart.countDocuments({ status: "pending" }),
    Cart.countDocuments({ status: "resolved" }),
    User.countDocuments({}),
    lattice.countDocuments({ isActive: { $ne: false } }),
    coil.countDocuments({ isActive: { $ne: false } }),
    drawn.countDocuments({ isActive: { $ne: false } }),
    lattice.countDocuments({ isActive: { $ne: false }, stockKg: { $ne: null, $lte: 1000 } }),
    coil.countDocuments({ isActive: { $ne: false }, stockKg: { $ne: null, $lte: 1000 } }),
    drawn.countDocuments({ isActive: { $ne: false }, stockKg: { $ne: null, $lte: 1000 } }),
  ]);
  return { pending, resolved, users, products: lattices + coils + drawns, lowStock: lowLattice + lowCoil + lowDrawn };
}
