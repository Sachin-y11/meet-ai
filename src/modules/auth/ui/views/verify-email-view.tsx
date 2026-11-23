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

export default function VerifyEmailView() {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { email: "" },
  });

  async function onSubmit({ email }: z.infer<typeof schema>) {
    try {
      const { error } = await authClient.sendVerificationEmail({
        email,
        callbackURL: new URL("/", window.location.origin).toString(),
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success("If the account needs verification, an email is on its way.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to send the email.",
      );
    }
  }

  return (
    <Card>
      <CardContent className='p-6 md:p-8'>
        <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-6'>
          <div className='text-center'>
            <h1 className='text-2xl font-bold'>Verify your email</h1>
            <p className='text-muted-foreground mt-2 text-sm'>
              Enter your email address and we’ll send a verification link if
              your account needs one.
            </p>
          </div>
          <FieldGroup>
            <Controller
              name='email'
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor='verify-email'>Email</FieldLabel>
                  <Input
                    {...field}
                    id='verify-email'
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
            {form.formState.isSubmitting ? "Sending..." : "Resend verification"}
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
