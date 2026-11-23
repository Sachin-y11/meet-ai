import type { ReactNode } from "react";

import { requireServerSession } from "@/lib/auth-session";

export default async function AccountLayout({
  children,
}: {
  children: ReactNode;
}) {
  await requireServerSession();

  return (
    <main className='bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10'>
      <div className='w-full max-w-xl'>{children}</div>
    </main>
  );
}
