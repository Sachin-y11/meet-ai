"use client";

import ErrorState from "@/components/error-state";
import LoadingState from "@/components/loading-state";
import { useTRPC } from "@/trpc/client";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import AgentIdViewHeader from "../components/agent-id-view-header";
import GenerateAvatar from "@/components/generate-avatar";
import { Badge } from "@/components/ui/badge";
import { VideoIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useConfirm } from "@/hooks/use-confirm";
import UpdateAgentDialog from "../components/update-agent-dialog";
import { useState } from "react";

export default function AgentIdView({ agentId }: { agentId: string }) {
  const trpc = useTRPC();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [updateAgentDialog, setUpdateAgentDialog] = useState(false);

  const { data } = useSuspenseQuery(
    trpc.agents.getOne.queryOptions({ id: agentId }),
  );

  const removeAgent = useMutation(
    trpc.agents.delete.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.agents.getMany.queryOptions());

        router.push("/agents");
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

  const handleRemoveAgent = async () => {
    const ok = await confirmRemove();

    if (!ok) return;

    await removeAgent.mutateAsync({ id: agentId });
  };

  return (
    <>
      <RemoveConfirmation />
      <UpdateAgentDialog
        open={updateAgentDialog}
        onOpenChange={setUpdateAgentDialog}
        initialValues={data}
      />
      <div className='flex-1 flex flex-col gap-y-4'>
        <AgentIdViewHeader
          agentId={agentId}
          agentName={data.name}
          onEdit={() => {
            setUpdateAgentDialog(true);
          }}
          onRemove={() => {
            handleRemoveAgent();
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
              <p className='text-lg font-medium'>Intructions</p>
              <p className='text-accent-foreground'>{data.instructions}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export const AgentIdViewLoading = () => {
  return (
    <LoadingState
      title='Loading Agent Id'
      description='This may take a few seconds...'
    />
  );
};

export const AgentIdViewError = () => {
  return (
    <ErrorState
      title='Error loading agent id!'
      description='Please try again later...'
    />
  );
};
