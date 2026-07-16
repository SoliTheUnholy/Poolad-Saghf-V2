"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { KeyRound } from "lucide-react";
import { toast } from "sonner";
import { changeMyPassword } from "@/actions/account";
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
import { passwordSchema } from "@/lib/validation";

type Values = z.infer<typeof passwordSchema>;
export function PasswordForm() {
  const form = useForm<Values>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { currentPassword: "", password: "", confirmPassword: "" },
  });
  async function onSubmit(values: Values) {
    const result = await changeMyPassword(values);
    if (!result.success) return toast.error(result.error);
    toast.success(result.message);
    form.reset();
  }
  return (
    <Card className="premium-panel mx-auto max-w-xl">
      <CardHeader>
        <CardTitle className="text-2xl">تغییر رمز</CardTitle>
        <CardDescription>رمز خود را تغییر دهید</CardDescription>
      </CardHeader>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardContent>
          <FieldGroup>
            {(["currentPassword", "password", "confirmPassword"] as const).map(
              (name, index) => (
                <Controller
                  key={name}
                  control={form.control}
                  name={name}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={name}>
                        {index === 0
                          ? "رمز فعلی"
                          : index === 1
                            ? "رمز جدید"
                            : "تکرار رمز جدید"}
                      </FieldLabel>
                      <Input
                        {...field}
                        id={name}
                        type="password"
                        className="h-11"
                        autoComplete={
                          index === 0 ? "current-password" : "new-password"
                        }
                      />
                      <FieldError errors={[fieldState.error]} />
                    </Field>
                  )}
                />
              ),
            )}
          </FieldGroup>
        </CardContent>
        <CardFooter className="mt-6 border-t pt-5">
          <Button
            type="submit"
            size="lg"
            disabled={form.formState.isSubmitting}
          >
            <KeyRound /> ثبت تغییرات
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
