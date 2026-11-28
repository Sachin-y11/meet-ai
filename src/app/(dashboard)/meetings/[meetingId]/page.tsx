import MeetingIdView, {
  MeetingIdViewError,
  MeetingIdViewLoading,
} from "@/modules/meetings/ui/views/meeting-id-view";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { connection } from "next/server";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

type Props = {
  params: Promise<{
    meetingId: string;
  }>;
};

export default function page({ params }: Props) {
  return (
    <ErrorBoundary fallback={<MeetingIdViewError />}>
      <Suspense fallback={<MeetingIdViewLoading />}>
        <MeetingIdPageContent params={params} />
      </Suspense>
    </ErrorBoundary>
  );
}

async function MeetingIdPageContent({ params }: Props) {
  await connection();

  const { meetingId } = await params;

  prefetch(trpc.meetings.getOne.queryOptions({ id: meetingId }));

  return (
    <HydrateClient>
      <MeetingIdView meetingId={meetingId} />
    </HydrateClient>
  );
}
