import { Suspense } from "react";

import { Spinner } from "@/components/ui/spinner";
import ResetPasswordView from "@/modules/auth/ui/views/reset-password-view";

type Props = {
  searchParams: Promise<{
    token?: string;
    error?: string;
  }>;
};

export default function page({ searchParams }: Props) {
  return (
    <Suspense
      fallback={
        <div className='bg-card flex min-h-64 items-center justify-center rounded-xl border shadow-sm'>
          <Spinner />
        </div>
      }
    >
      <ResetPasswordContent searchParams={searchParams} />
    </Suspense>
  );
}

async function ResetPasswordContent({ searchParams }: Props) {
  const { token, error } = await searchParams;

  return (
    <ResetPasswordView
      token={token}
      invalidToken={error === "INVALID_TOKEN"}
    />
  );
}
