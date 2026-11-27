"use client";

import ErrorState from "@/components/error-state";
import LoadingState from "@/components/loading-state";
import { DataTable } from "@/modules/agents/ui/components/data-table";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { columns } from "../components/columns";

export default function MeetingsView() {
  const trpc = useTRPC();

  const { data } = useSuspenseQuery(trpc.meetings.getMany.queryOptions({}));

  return (
    <div>
      <DataTable data={data.data} columns={columns} />
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
