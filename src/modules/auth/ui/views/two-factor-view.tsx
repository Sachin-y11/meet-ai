"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";

export default function TwoFactorView() {
  const router = useRouter();
  const [method, setMethod] = useState<"totp" | "backup">("totp");
  const [code, setCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function verifyCode(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const result =
        method === "totp"
          ? await authClient.twoFactor.verifyTotp({
              code,
              trustDevice: false,
            })
          : await authClient.twoFactor.verifyBackupCode({
              code,
              trustDevice: false,
            });

      if (result.error) {
        toast.error(result.error.message);
        return;
      }

      toast.success("Two-factor verification complete.");
      router.replace("/");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to verify the code.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card>
      <CardContent className='p-6 md:p-8'>
        <form onSubmit={verifyCode} className='flex flex-col gap-6'>
          <div className='text-center'>
            <h1 className='text-2xl font-bold'>Two-factor verification</h1>
            <p className='text-muted-foreground mt-2 text-sm'>
              Enter a code from your authenticator app or use a backup code.
            </p>
          </div>
          <div className='grid grid-cols-2 gap-2'>
            <Button
              type='button'
              variant={method === "totp" ? "default" : "outline"}
              onClick={() => {
                setMethod("totp");
                setCode("");
              }}
            >
              Authenticator
            </Button>
            <Button
              type='button'
              variant={method === "backup" ? "default" : "outline"}
              onClick={() => {
                setMethod("backup");
                setCode("");
              }}
            >
              Backup code
            </Button>
          </div>
          <label htmlFor='two-factor-code' className='text-sm font-medium'>
            {method === "totp" ? "Authenticator code" : "Backup code"}
          </label>
          <Input
            id='two-factor-code'
            value={code}
            onChange={(event) => setCode(event.target.value.trim())}
            autoComplete='one-time-code'
            inputMode={method === "totp" ? "numeric" : "text"}
            pattern={method === "totp" ? "[0-9]{6}" : undefined}
            maxLength={method === "totp" ? 6 : 32}
            required
            disabled={isSubmitting}
          />
          <Button type='submit' disabled={isSubmitting || !code}>
            {isSubmitting ? "Verifying..." : "Verify"}
          </Button>
          <Link
            href='/sign-in'
            className='text-center text-sm text-primary hover:underline'
          >
            Return to sign in
          </Link>
        </form>
      </CardContent>
    </Card>
  );
}
