"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import type { OAuthProvider } from "@/lib/auth-types";
import { useState } from "react";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { toast } from "sonner";

const providerDetails = {
  google: { label: "Google", icon: FcGoogle },
  github: { label: "GitHub", icon: FaGithub },
} satisfies Record<
  OAuthProvider,
  { label: string; icon: typeof FcGoogle | typeof FaGithub }
>;

const supportedProviders: OAuthProvider[] = ["google", "github"];

export function SocialAuthButtons({
  providers,
  disabled = false,
}: {
  providers: OAuthProvider[];
  disabled?: boolean;
}) {
  const [connecting, setConnecting] = useState<OAuthProvider | null>(null);

  async function signInWithProvider(provider: OAuthProvider) {
    setConnecting(provider);

    try {
      const { error } = await authClient.signIn.social({
        provider,
        callbackURL: new URL("/", window.location.origin).toString(),
      });

      if (error) {
        toast.error(error.message);
        setConnecting(null);
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to start sign-in.",
      );
      setConnecting(null);
    }
  }

  return (
    <div className='grid grid-cols-2 gap-2'>
      {supportedProviders.map((provider) => {
        const { label, icon: Icon } = providerDetails[provider];
        const isConfigured = providers.includes(provider);

        return (
          <Button
            key={provider}
            className='w-full'
            type='button'
            variant='outline'
            disabled={disabled || connecting !== null || !isConfigured}
            onClick={() => void signInWithProvider(provider)}
          >
            <Icon className='mr-2' />
            {connecting === provider
              ? "Connecting..."
              : isConfigured
                ? label
                : `${label} (not configured)`}
          </Button>
        );
      })}
    </div>
  );
}
