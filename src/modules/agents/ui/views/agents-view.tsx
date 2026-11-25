"use client";

import ErrorState from "@/components/error-state";
import LoadingState from "@/components/loading-state";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { DataTable } from "@/modules/agents/ui/components/data-table";
import { columns } from "@/modules/agents/ui/components/columns";
import { useAgentFilter } from "@/modules/agents/hooks/use-agent-filters";
import DataPagination from "@/modules/agents/ui/components/data-pagination";

export default function AgentsView() {
  const [filters, setFilters] = useAgentFilter();
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(
    trpc.agents.getMany.queryOptions({
      ...filters,
    }),
  );

  return (
    <div>
      <DataTable columns={columns} data={data.data} />
      <DataPagination
        page={filters.page}
        totalPages={data.totalPages}
        onPageChange={(page) => setFilters({ page })}
      />
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

export const AgentsViewError = () => {
  return (
    <ErrorState
      title='Error loading agents!'
      description='Please try again later...'
    />
  );
};
