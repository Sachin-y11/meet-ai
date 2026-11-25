import { loadAgentFilterParam } from "@/modules/agents/params";
import AgentListHeader from "@/modules/agents/ui/components/agent-list-header";
import AgentsView, {
  AgentsViewError,
  AgentsViewLoading,
} from "@/modules/agents/ui/views/agents-view";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { connection } from "next/server";
import type { SearchParams } from "nuqs";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

interface Props {
  searchParams: Promise<SearchParams>;
}

async function AgentsPageContent({ searchParams }: Props) {
  await connection();
  const agentFilter = await loadAgentFilterParam(searchParams);

  prefetch(trpc.agents.getMany.queryOptions({ ...agentFilter }));

  return (
    <>
      <AgentListHeader />
      <HydrateClient>
        <AgentsView />
      </HydrateClient>
    </>
  );
}

export default function page({ searchParams }: Props) {
  return (
    <ErrorBoundary fallback={<AgentsViewError />}>
      <Suspense fallback={<AgentsViewLoading />}>
        <AgentsPageContent searchParams={searchParams} />
      </Suspense>
    </ErrorBoundary>
  );
}
