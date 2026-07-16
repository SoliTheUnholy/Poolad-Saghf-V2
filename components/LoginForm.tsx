"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import { LogIn } from "lucide-react";
import { toast } from "sonner";
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
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { loginSchema } from "@/lib/validation";

type Values = z.infer<typeof loginSchema>;

export default function LoginForm({
  returnTo = "/dashboard",
}: {
  returnTo?: string;
}) {
  const router = useRouter();
  const form = useForm<Values>({
    resolver: zodResolver(loginSchema),
    defaultValues: { number: "", password: "" },
  });
  async function onSubmit(values: Values) {
    const result = await signIn("credentials", { ...values, redirect: false });
    if (result?.error) return toast.error("شماره تلفن یا رمز درست نیست");
    toast.success("با موفقیت وارد شدید");
    router.push(returnTo.startsWith("/") ? returnTo : "/dashboard");
    router.refresh();
  }
  return (
    <Card className="premium-panel w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl">ورود به حساب</CardTitle>
        <CardDescription>
          شماره تلفن و رمز ورود خود را وارد کنید
        </CardDescription>
      </CardHeader>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardContent>
          <FieldGroup>
            <Controller
              control={form.control}
              name="number"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="number">شماره تلفن</FieldLabel>
                  <Input
                    {...field}
                    id="number"
                    inputMode="tel"
                    autoComplete="tel"
                    placeholder="09012345678"
                    className="ltr-number h-11 text-right"
                  />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name="password"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="password">رمز</FieldLabel>
                  <Input
                    {...field}
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    className="h-11"
                  />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />
          </FieldGroup>
        </CardContent>
        <CardFooter className="mt-6 flex-col gap-4 border-t pt-5">
          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={form.formState.isSubmitting}
          >
            <LogIn /> ورود
          </Button>
          <p className="text-muted-foreground text-center text-sm">
            حساب کاربری ندارید؟{" "}
            <Link
              href="/home/register"
              className="text-primary font-bold hover:underline"
            >
              ثبت نام
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
