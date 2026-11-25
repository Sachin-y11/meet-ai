import AgentIdView, {
  AgentIdViewError,
  AgentIdViewLoading,
} from "@/modules/agents/ui/views/agent-id-view";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { connection } from "next/server";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

type Props = {
  params: Promise<{
    agentId: string;
  }>;
};

export default function page({ params }: Props) {
  return (
    <ErrorBoundary fallback={<AgentIdViewError />}>
      <Suspense fallback={<AgentIdViewLoading />}>
        <AgentIdPageContent params={params} />
      </Suspense>
    </ErrorBoundary>
  );
}

async function AgentIdPageContent({ params }: Props) {
  await connection();

  const { agentId } = await params;

  prefetch(trpc.agents.getOne.queryOptions({ id: agentId }));

  return (
    <HydrateClient>
      <AgentIdView agentId={agentId} />
    </HydrateClient>
  );
}
