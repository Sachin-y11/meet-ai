import { loadMeetingtFilterParam } from "@/modules/meetings/params";
import MeetingListheader from "@/modules/meetings/ui/components/meeting-list-header";
import MeetingsView, {
  MeetingsViewError,
  MeetingsViewLoading,
} from "@/modules/meetings/ui/views/meetings-view";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { connection } from "next/server";
import { SearchParams } from "nuqs/server";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

interface Props {
  searchParams: Promise<SearchParams>;
}

async function AgentsPageContent({ searchParams }: Props) {
  await connection();

  const meetingFilter = await loadMeetingtFilterParam(searchParams);
  prefetch(trpc.meetings.getMany.queryOptions({ ...meetingFilter }));

  return (
    <>
      <MeetingListheader />
      <HydrateClient>
        <MeetingsView />
      </HydrateClient>
    </>
  );
}

export default async function page({ searchParams }: Props) {
  return (
    <ErrorBoundary fallback={<MeetingsViewError />}>
      <Suspense fallback={<MeetingsViewLoading />}>
        <AgentsPageContent searchParams={searchParams} />
      </Suspense>
    </ErrorBoundary>
  );
}
