"use client";

import ErrorState from "@/components/error-state";
import GenerateAvatar from "@/components/generate-avatar";
import LoadingState from "@/components/loading-state";
import { Badge } from "@/components/ui/badge";
import { useConfirm } from "@/hooks/use-confirm";
import { useTRPC } from "@/trpc/client";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { VideoIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import MeetingIdViewHeader from "../components/meeting-id-view-header";
import UpdateMeetingDialog from "../components/update-meeting-dialog";

export default function MeetingIdView({ meetingId }: { meetingId: string }) {
  const trpc = useTRPC();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [updatemeetingDialog, setUpdatemeetingDialog] = useState(false);

  const { data } = useSuspenseQuery(
    trpc.meetings.getOne.queryOptions({ id: meetingId }),
  );

  const removemeeting = useMutation(
    trpc.meetings.delete.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.meetings.getMany.queryOptions());

        router.push("/meetings");
      },
      onError: ({ message }) => {
        toast.error("Failed deletion", {
          description: message,
        });
      },
    }),
  );

  const [RemoveConfirmation, confirmRemove] = useConfirm({
    title: "Are you sure?",
    message: `The following action will remove ${data.name}`,
  });

  const handleRemovemeeting = async () => {
    const ok = await confirmRemove();

    if (!ok) return;

    await removemeeting.mutateAsync({ id: meetingId });
  };

  return (
    <>
      <RemoveConfirmation />
      <UpdateMeetingDialog
        open={updatemeetingDialog}
        onOpenChange={setUpdatemeetingDialog}
        initialValues={data}
      />
      <div className='flex-1 flex flex-col gap-y-4'>
        <MeetingIdViewHeader
          meetingId={meetingId}
          meetingName={data.name}
          onEdit={() => {
            setUpdatemeetingDialog(true);
          }}
          onRemove={() => {
            handleRemovemeeting();
          }}
        />
        <div className='border p-2 rounded-md'>
          <div className='gap-y-5 flex flex-col col-span-5'>
            <div className='flex items-center gap-x-3'>
              <GenerateAvatar
                seed={data.name}
                variant='botttsNeutral'
                className='size-10'
              />
              <h2 className='text-2xl font-medium'>{data.name}</h2>
            </div>
            <Badge variant={"outline"} className='flex items-center gap-x-2'>
              <VideoIcon />
              {/* TODO:change id to meeting count */}
              {/* {row.original.meetingCount} {row.original.meetingCount===1?'Meeting':'meetings'} */}

              {data.id}
            </Badge>

            <div className='flex flex-col gap-y-4'>
              <p className='text-lg font-medium'>Instructions</p>
              <p className='text-accent-foreground'>
                {data.agent.instructions}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export const MeetingIdViewLoading = () => {
  return (
    <LoadingState
      title='Loading meeting Id'
      description='This may take a few seconds...'
    />
  );
};

export const MeetingIdViewError = () => {
  return (
    <ErrorState
      title='Error loading meeting id!'
      description='Please try again later...'
    />
  );
};
