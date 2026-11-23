"use client";
/* eslint-disable @next/next/no-img-element */

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
import { Separator } from "@/components/ui/separator";
import { authClient } from "@/lib/auth-client";
import type { OAuthProvider } from "@/lib/auth-types";
import { SocialAuthButtons } from "@/modules/auth/ui/components/social-auth-buttons";

const signUpSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  password: z.string().min(12).max(128),
});

export default function SignUpView({
  providers,
}: {
  providers: OAuthProvider[];
}) {
  const router = useRouter();

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: z.infer<typeof signUpSchema>) {
    await authClient.signUp.email(
      {
        name: data.name,
        email: data.email,
        password: data.password,
        callbackURL: new URL("/", window.location.origin).toString(),
      },
      {
        onSuccess: () => {
          toast.success("Check your email to verify your account.");
          router.push("/verify-email");
        },
        onError: (error) => {
          toast.error(error.error.message);
        },
      },
    );
  }

  const isDisabled = form.formState.isSubmitting;

  return (
    <div className='flex flex-col gap-6'>
      <Card className='overflow-hidden p-0'>
        <CardContent className='grid p-0 md:grid-cols-2'>
          <form
            id='form-rhf-demo'
            onSubmit={form.handleSubmit(onSubmit)}
            className='p-6 md:p-8'
          >
            <div className='flex flex-col gap-6'>
              <div className='flex flex-col items-center text-center'>
                <h2 className='text-2xl font-bold'>Create an account</h2>
                <p className='text-muted-foreground text-balance'>
                  Enter your details to create an account
                </p>
              </div>
              <FieldGroup>
                <Controller
                  name='name'
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor='form-rhf-demo-name'>Name</FieldLabel>
                      <Input
                        {...field}
                        id='form-rhf-demo-name'
                        aria-invalid={fieldState.invalid}
                        placeholder='John Doe'
                        autoComplete='name'
                        disabled={isDisabled}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <Controller
                  name='email'
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor='form-rhf-demo-email'>
                        Email
                      </FieldLabel>
                      <Input
                        {...field}
                        id='form-rhf-demo-email'
                        aria-invalid={fieldState.invalid}
                        placeholder='you@example.com'
                        autoComplete='email'
                        disabled={isDisabled}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <Controller
                  name='password'
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor='form-rhf-demo-password'>
                        Password
                      </FieldLabel>
                      <Input
                        {...field}
                        id='form-rhf-demo-password'
                        aria-invalid={fieldState.invalid}
                        placeholder='At least 12 characters'
                        type='password'
                        autoComplete='new-password'
                        disabled={isDisabled}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </FieldGroup>
              <Button type='submit' className={"w-full"} disabled={isDisabled}>
                {isDisabled ? "Signing Up..." : "Sign Up"}
              </Button>
              <div className='grid grid-cols-3 items-center gap-4'>
                <Separator />
                <span>or continue</span>
                <Separator />
              </div>
              <SocialAuthButtons
                providers={providers}
                disabled={isDisabled}
              />

              <div className='text-center text-sm text-muted-foreground'>
                Already have an account?{" "}
                <Link href='/sign-in' className='text-primary hover:underline'>
                  Sign in
                </Link>
              </div>
            </div>
          </form>

          <div className='bg-radial from-green-700 to-green-900 relative hidden md:flex flex-col gap-y-4 items-center justify-center'>
            <img src='/logo.svg' alt='logo' className='size-23' />{" "}
            <p className='text-2xl font-semibold text-muted'>Meet.AI</p>
          </div>
        </CardContent>
      </Card>

      <div className='text-muted-foreground *:[a]:hover:text-primary text-center text-sm text-balance *:[a]:underline *:[a]:underline-offset-4'>
        By clicking continue, you agree to our <a href='#'>Terms of service</a>{" "}
        and <a href='#'>Privacy policy</a>.
      </div>
    </div>
  );
}
