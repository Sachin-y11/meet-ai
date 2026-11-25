"use client";

import ErrorState from "@/components/error-state";
import LoadingState from "@/components/loading-state";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import AgentIdViewHeader from "../components/agent-id-view-header";
import GenerateAvatar from "@/components/generate-avatar";
import { Badge } from "@/components/ui/badge";
import { VideoIcon } from "lucide-react";

export default function AgentIdView({ agentId }: { agentId: string }) {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(
    trpc.agents.getOne.queryOptions({ id: agentId }),
  );

  return (
    <div className='flex-1 flex flex-col gap-y-4'>
      <AgentIdViewHeader
        agentId={agentId}
        agentName={data.name}
        onEdit={() => {}}
        onRemove={() => {}}
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
