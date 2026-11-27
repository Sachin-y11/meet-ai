import MeetingListheader from "@/modules/meetings/ui/components/meeting-list-header";
import MeetingsView, {
  MeetingsViewError,
  MeetingsViewLoading,
} from "@/modules/meetings/ui/views/meetings-view";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { connection } from "next/server";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

async function AgentsPageContent() {
  await connection();

  prefetch(trpc.meetings.getMany.queryOptions({}));

  return (
    <>
      <MeetingListheader />
      <HydrateClient>
        <MeetingsView />
      </HydrateClient>
    </>
  );
}

export default function page() {
  return (
    <ErrorBoundary fallback={<MeetingsViewError />}>
      <Suspense fallback={<MeetingsViewLoading />}>
        <AgentsPageContent />
      </Suspense>
    </ErrorBoundary>
  );
}
