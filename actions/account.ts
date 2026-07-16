"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { connectDB } from "@/lib/mongodb";
import { actionError, requireUser } from "@/lib/auth-guard";
import { passwordSchema, profileSchema, registerSchema, type ActionResult } from "@/lib/validation";
import User from "@/models/users";

function normalizePhone(value: string) {
  const digits = value.replace(/\D/g, "");
  if (digits.startsWith("0098")) return `0${digits.slice(4)}`;
  if (digits.startsWith("98")) return `0${digits.slice(2)}`;
  if (digits.startsWith("9") && digits.length === 10) return `0${digits}`;
  return digits;
}

export async function createAccount(values: unknown): Promise<ActionResult<{ number: string }>> {
  try {
    const data = registerSchema.parse(values);
    const number = normalizePhone(data.number);
    if (!/^09\d{9}$/.test(number)) return { success: false, error: "شماره تلفن را درست وارد کنید" };
    await connectDB();
    if (await User.exists({ number })) return { success: false, error: "این شماره قبلا استفاده شده است" };
    const password = await bcrypt.hash(data.password, 12);
    await User.create({ role: "user", number, password });
    return { success: true, data: { number }, message: "حساب کاربری ساخته شد" };
  } catch (error) {
    return { success: false, error: actionError(error) };
  }
}

export async function getMyProfile() {
  const user = await requireUser();
  await connectDB();
  const profile = await User.findById(user.id).select("name number code address zipCode role").lean();
  return profile ? JSON.parse(JSON.stringify(profile)) : null;
}

export async function updateMyProfile(values: unknown): Promise<ActionResult> {
  try {
    const user = await requireUser();
    const data = profileSchema.parse(values);
    await connectDB();
    await User.findByIdAndUpdate(user.id, { $set: data }, { runValidators: true });
    revalidatePath("/dashboard/changeinfo");
    revalidatePath("/home/cart");
    return { success: true, message: "مشخصات شما ذخیره شد" };
  } catch (error) {
    return { success: false, error: actionError(error) };
  }
}

export async function changeMyPassword(values: unknown): Promise<ActionResult> {
  try {
    const user = await requireUser();
    const data = passwordSchema.parse(values);
    await connectDB();
    const account = await User.findById(user.id).select("+password");
    if (!account || !(await bcrypt.compare(data.currentPassword, account.password))) {
      return { success: false, error: "رمز فعلی درست نیست" };
    }
    account.password = await bcrypt.hash(data.password, 12);
    await account.save();
    return { success: true, message: "رمز ورود تغییر کرد" };
  } catch (error) {
    return { success: false, error: actionError(error) };
  }
}
