"use client";

import ErrorState from "@/components/error-state";
import LoadingState from "@/components/loading-state";
import { DataTable } from "@/modules/agents/ui/components/data-table";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { columns } from "../components/columns";
import { useMeetingFilter } from "@/modules/meetings/hooks/use-meeting-filters";
import { useRouter } from "next/navigation";
import DataPagination from "@/modules/meetings/ui/components/data-pagination";

export default function MeetingsView() {
  const trpc = useTRPC();

  const [filters, setFilters] = useMeetingFilter();

  const router = useRouter();

  const { data } = useSuspenseQuery(
    trpc.meetings.getMany.queryOptions({
      ...filters,
    }),
  );

  return (
    <div>
      <DataTable data={data.data} columns={columns} />
      <DataPagination
        page={filters.page}
        totalPages={data.totalPages}
        onPageChange={(page) => setFilters({ page })}
      />
    </div>
  );
}

export const MeetingsViewLoading = () => {
  return (
    <LoadingState
      title='Loading Meetings'
      description='This may take a few seconds...'
    />
  );
};

export const MeetingsViewError = () => {
  return (
    <ErrorState
      title='Error loading meetings!'
      description='Please try again later...'
    />
  );
};
