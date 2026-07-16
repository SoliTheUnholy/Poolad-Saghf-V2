"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import { UserPlus } from "lucide-react";
import { toast } from "sonner";
import { createAccount } from "@/actions/account";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { registerSchema } from "@/lib/validation";

type Values = z.infer<typeof registerSchema>;

export default function RegisterForm() {
  const router = useRouter();
  const form = useForm<Values>({ resolver: zodResolver(registerSchema), defaultValues: { number: "", password: "", confirmPassword: "" } });
  async function onSubmit(values: Values) {
    const result = await createAccount(values);
    if (!result.success) return toast.error(result.error);
    const signedIn = await signIn("credentials", { number: result.data?.number, password: values.password, redirect: false });
    if (signedIn?.error) return toast.error("حساب ساخته شد؛ برای ورود دوباره تلاش کنید");
    toast.success(result.message);
    router.push("/home/register/info");
    router.refresh();
  }
  return (
    <Card className="premium-panel w-full max-w-md">
      <CardHeader><CardTitle className="text-2xl">ساخت حساب کاربری</CardTitle><CardDescription>اطلاعات خود را جهت ساخت حساب وارد کنید</CardDescription></CardHeader>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardContent><FieldGroup>
          <Controller control={form.control} name="number" render={({ field, fieldState }) => <Field data-invalid={fieldState.invalid}><FieldLabel htmlFor="number">شماره تلفن</FieldLabel><Input {...field} id="number" inputMode="tel" autoComplete="tel" placeholder="09012345678" className="h-11 ltr-number text-right" /><FieldError errors={[fieldState.error]} /></Field>} />
          <Controller control={form.control} name="password" render={({ field, fieldState }) => <Field data-invalid={fieldState.invalid}><FieldLabel htmlFor="password">رمز</FieldLabel><Input {...field} id="password" type="password" autoComplete="new-password" className="h-11" /><FieldError errors={[fieldState.error]} /></Field>} />
          <Controller control={form.control} name="confirmPassword" render={({ field, fieldState }) => <Field data-invalid={fieldState.invalid}><FieldLabel htmlFor="confirmPassword">تکرار رمز</FieldLabel><Input {...field} id="confirmPassword" type="password" autoComplete="new-password" className="h-11" /><FieldError errors={[fieldState.error]} /></Field>} />
        </FieldGroup></CardContent>
        <CardFooter className="mt-6 flex-col gap-4 border-t pt-5"><Button type="submit" size="lg" className="w-full" disabled={form.formState.isSubmitting}><UserPlus /> ساخت حساب کاربری</Button><p className="text-center text-sm text-muted-foreground">حساب کاربری دارید؟ <Link href="/home/login" className="font-bold text-primary hover:underline">ورود</Link></p></CardFooter>
      </form>
    </Card>
  );
}
