import ErrorState from "@/components/error-state";
import AgentListHeader from "@/modules/agents/ui/components/agent-list-header";
import AgentsView, {
  AgentsViewError,
  AgentsViewLoading,
} from "@/modules/agents/ui/views/agents-view";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { connection } from "next/server";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

async function AgentsPageContent() {
  await connection();
  prefetch(trpc.agents.getMany.queryOptions());

  return (
    <>
      <AgentListHeader />
      <HydrateClient>
        <AgentsView />
      </HydrateClient>
    </>
  );
}

export default function page() {
  return (
    <ErrorBoundary fallback={<AgentsViewError />}>
      <Suspense fallback={<AgentsViewLoading />}>
        <AgentsPageContent />
      </Suspense>
    </ErrorBoundary>
  );
}
