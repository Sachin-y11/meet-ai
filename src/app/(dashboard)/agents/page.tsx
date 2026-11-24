import AgentsView, {
  AgentsViewLoading,
} from "@/modules/agents/ui/views/agents-view";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { connection } from "next/server";
import { Suspense } from "react";

async function AgentsPageContent() {
  await connection();
  prefetch(trpc.agents.getMany.queryOptions());

  return (
    <HydrateClient>
      <AgentsView />
    </HydrateClient>
  );
}

export default function page() {
  return (
    <Suspense fallback={<AgentsViewLoading />}>
      <AgentsPageContent />
    </Suspense>
  );
}
