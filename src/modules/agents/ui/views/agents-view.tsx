"use client";

import ErrorState from "@/components/error-state";
import LoadingState from "@/components/loading-state";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";

export default function AgentsView() {
  const trpc = useTRPC();
  const { data, isError } = useSuspenseQuery(
    trpc.agents.getMany.queryOptions(),
  );

  if (isError) {
    return (
      <ErrorState
        title='Error loading agents!'
        description='Please try again later...'
      />
    );
  }

  return (
    <div>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}

export const AgentsViewLoading = () => {
  return (
    <LoadingState
      title='Loading Agents'
      description='This may take a few seconds...'
    />
  );
};
