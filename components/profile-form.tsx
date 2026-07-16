"use client";

import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Save } from "lucide-react";
import { toast } from "sonner";
import { updateMyProfile } from "@/actions/account";
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { profileSchema } from "@/lib/validation";

type Values = z.infer<typeof profileSchema>;

export function ProfileForm({
  profile,
  onboarding = false,
}: {
  profile?: Partial<Values> | null;
  onboarding?: boolean;
}) {
  const router = useRouter();
  const form = useForm<Values>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: profile?.name ?? "",
      code: profile?.code ?? "",
      address: profile?.address ?? "",
      zipCode: profile?.zipCode ?? "",
    },
  });
  async function onSubmit(values: Values) {
    const result = await updateMyProfile(values);
    if (!result.success) return toast.error(result.error);
    toast.success(result.message);
    router.push(onboarding ? "/home" : "/dashboard");
    router.refresh();
  }
  return (
    <Card className="premium-panel mx-auto w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="text-2xl">مشخصات</CardTitle>
        <CardDescription>
          {onboarding
            ? "مشخصات خود را جهت تکمیل ثبت نام وارد کنید"
            : "مشخصات خود را تغییر دهید"}
        </CardDescription>
        {onboarding && (
          <Tabs defaultValue="company" className="mt-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="company">شرکتی</TabsTrigger>
              <TabsTrigger value="personal">شخصی</TabsTrigger>
            </TabsList>
          </Tabs>
        )}
      </CardHeader>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardContent>
          <FieldGroup className="grid sm:grid-cols-2">
            <Controller
              control={form.control}
              name="name"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="name">
                    نام و نام خانوادگی / نام شرکت
                  </FieldLabel>
                  <Input {...field} id="name" className="h-11" />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name="code"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="code">کد ملی / کد شرکت</FieldLabel>
                  <Input {...field} id="code" className="h-11" />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name="address"
              render={({ field, fieldState }) => (
                <Field
                  data-invalid={fieldState.invalid}
                  className="sm:col-span-2"
                >
                  <FieldLabel htmlFor="address">نشانی</FieldLabel>
                  <Textarea {...field} id="address" rows={4} />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name="zipCode"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="zipCode">کد پستی</FieldLabel>
                  <Input {...field} id="zipCode" className="h-11" />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />
          </FieldGroup>
        </CardContent>
        <CardFooter className="mt-6 border-t pt-5">
          <Button
            type="submit"
            size="lg"
            disabled={form.formState.isSubmitting}
          >
            <Save /> ثبت مشخصات
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
