"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";

const schema = z
  .object({
    password: z.string().min(12).max(128),
    confirmPassword: z.string(),
  })
  .refine((value) => value.password === value.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match.",
  });

export default function ResetPasswordView({
  token,
  invalidToken,
}: {
  token?: string;
  invalidToken: boolean;
}) {
  const router = useRouter();
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  async function onSubmit({ password }: z.infer<typeof schema>) {
    if (!token) {
      toast.error("This reset link is invalid or has expired.");
      return;
    }

    try {
      const { error } = await authClient.resetPassword({
        newPassword: password,
        token,
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success("Your password has been reset. Sign in with your new password.");
      router.replace("/sign-in");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to reset your password.",
      );
    }
  }

  return (
    <Card>
      <CardContent className='p-6 md:p-8'>
        {invalidToken || !token ? (
          <div className='flex flex-col gap-5 text-center'>
            <h1 className='text-2xl font-bold'>Reset link unavailable</h1>
            <p className='text-muted-foreground text-sm'>
              This link is invalid or expired. Request a new one to continue.
            </p>
            <Link href='/forgot-password' className='text-primary hover:underline'>
              Request a new reset link
            </Link>
          </div>
        ) : (
          <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-6'>
            <div className='text-center'>
              <h1 className='text-2xl font-bold'>Choose a new password</h1>
              <p className='text-muted-foreground mt-2 text-sm'>
                Use at least 12 characters.
              </p>
            </div>
            <FieldGroup>
              <Controller
                name='password'
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor='reset-password'>New password</FieldLabel>
                    <Input
                      {...field}
                      id='reset-password'
                      type='password'
                      autoComplete='new-password'
                      aria-invalid={fieldState.invalid}
                      disabled={form.formState.isSubmitting}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name='confirmPassword'
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor='confirm-password'>
                      Confirm password
                    </FieldLabel>
                    <Input
                      {...field}
                      id='confirm-password'
                      type='password'
                      autoComplete='new-password'
                      aria-invalid={fieldState.invalid}
                      disabled={form.formState.isSubmitting}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
            <Button type='submit' disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Saving..." : "Reset password"}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
