"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
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

const schema = z.object({
  email: z.string().email(),
});

export default function ForgotPasswordView() {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { email: "" },
  });

  async function onSubmit({ email }: z.infer<typeof schema>) {
    try {
      const { error } = await authClient.requestPasswordReset({
        email,
        redirectTo: new URL("/reset-password", window.location.origin).toString(),
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success(
        "If an account exists for that email, a reset link is on its way.",
      );
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to request a reset.",
      );
    }
  }

  return (
    <Card>
      <CardContent className='p-6 md:p-8'>
        <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-6'>
          <div className='text-center'>
            <h1 className='text-2xl font-bold'>Reset your password</h1>
            <p className='text-muted-foreground mt-2 text-sm'>
              We’ll send a reset link if an account is associated with that
              email.
            </p>
          </div>
          <FieldGroup>
            <Controller
              name='email'
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor='forgot-password-email'>Email</FieldLabel>
                  <Input
                    {...field}
                    id='forgot-password-email'
                    type='email'
                    autoComplete='email'
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
            {form.formState.isSubmitting ? "Sending..." : "Send reset link"}
          </Button>
          <Link
            href='/sign-in'
            className='text-center text-sm text-primary hover:underline'
          >
            Back to sign in
          </Link>
        </form>
      </CardContent>
    </Card>
  );
}
