"use client";

import { QRCodeSVG } from "qrcode.react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";

type Enrollment = {
  totpURI: string;
  backupCodes: string[];
};

export default function SecuritySettingsView() {
  const { data: session, isPending } = authClient.useSession();
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [enabledOverride, setEnabledOverride] = useState<boolean | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const twoFactorEnabled =
    enabledOverride ?? Boolean(session?.user.twoFactorEnabled);

  async function startEnrollment(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const { data, error } = await authClient.twoFactor.enable({
        password,
        method: "totp",
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      if (!data || data.method !== "totp") {
        throw new Error("The authenticator setup could not be started.");
      }

      setEnrollment({
        totpURI: data.totpURI,
        backupCodes: data.backupCodes,
      });
      setPassword("");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to start authenticator setup.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function finishEnrollment(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await authClient.twoFactor.verifyTotp({
        code,
        trustDevice: false,
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      setEnabledOverride(true);
      setCode("");
      toast.success("Two-factor authentication is enabled.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to verify the code.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function disableTwoFactor(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await authClient.twoFactor.disable({ password });

      if (error) {
        toast.error(error.message);
        return;
      }

      setEnabledOverride(false);
      setEnrollment(null);
      setPassword("");
      toast.success("Two-factor authentication is disabled.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to disable 2FA.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function copyBackupCodes() {
    if (!enrollment) return;

    try {
      await navigator.clipboard.writeText(enrollment.backupCodes.join("\n"));
      toast.success("Backup codes copied.");
    } catch {
      toast.error("Could not copy the codes. Save them manually.");
    }
  }

  if (isPending) {
    return <p className='text-muted-foreground'>Loading account security...</p>;
  }

  if (!session) {
    return <p className='text-muted-foreground'>Sign in to manage security.</p>;
  }

  return (
    <Card>
      <CardContent className='flex flex-col gap-6 p-6 md:p-8'>
        <div>
          <h1 className='text-2xl font-bold'>Account security</h1>
          <p className='text-muted-foreground mt-2 text-sm'>
            Add an authenticator app as a second sign-in factor.
          </p>
        </div>

        {twoFactorEnabled ? (
          <form onSubmit={disableTwoFactor} className='flex flex-col gap-4'>
            <p>Two-factor authentication is enabled for your account.</p>
            <label htmlFor='disable-password' className='text-sm font-medium'>
              Confirm your password to disable it
            </label>
            <Input
              id='disable-password'
              type='password'
              autoComplete='current-password'
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              disabled={isSubmitting}
            />
            <Button type='submit' variant='destructive' disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Disable 2FA"}
            </Button>
          </form>
        ) : enrollment ? (
          <div className='flex flex-col gap-5'>
            <p>
              Scan this QR code using your authenticator app. It is rendered in
              your browser and is not sent to a QR service.
            </p>
            <div className='w-fit rounded bg-white p-3'>
              <QRCodeSVG value={enrollment.totpURI} size={192} />
            </div>
            <p className='font-medium'>Save these backup codes securely:</p>
            <ul className='grid grid-cols-2 gap-2 font-mono text-sm'>
              {enrollment.backupCodes.map((backupCode) => (
                <li key={backupCode}>{backupCode}</li>
              ))}
            </ul>
            <Button type='button' variant='outline' onClick={copyBackupCodes}>
              Copy backup codes
            </Button>
            <form onSubmit={finishEnrollment} className='flex flex-col gap-4'>
              <label htmlFor='enrollment-code' className='text-sm font-medium'>
                Enter the current authenticator code to finish setup
              </label>
              <Input
                id='enrollment-code'
                value={code}
                onChange={(event) => setCode(event.target.value.trim())}
                autoComplete='one-time-code'
                inputMode='numeric'
                pattern='[0-9]{6}'
                maxLength={6}
                required
                disabled={isSubmitting}
              />
              <Button type='submit' disabled={isSubmitting || code.length !== 6}>
                {isSubmitting ? "Verifying..." : "Verify and enable"}
              </Button>
            </form>
          </div>
        ) : (
          <form onSubmit={startEnrollment} className='flex flex-col gap-4'>
            <label htmlFor='enable-password' className='text-sm font-medium'>
              Confirm your password to start setup
            </label>
            <Input
              id='enable-password'
              type='password'
              autoComplete='current-password'
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              disabled={isSubmitting}
            />
            <Button type='submit' disabled={isSubmitting}>
              {isSubmitting ? "Starting..." : "Set up authenticator"}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
