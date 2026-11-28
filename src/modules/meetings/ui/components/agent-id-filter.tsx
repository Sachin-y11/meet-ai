"use client";

import { useMeetingFilter } from "@/modules/meetings/hooks/use-meeting-filters";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import CommandSelect from "./command-select";
import GenerateAvatar from "@/components/generate-avatar";

export default function AgentIdFilter() {
  const [filters, setFilters] = useMeetingFilter();

  const trpc = useTRPC();

  const [agentSearch, setAgentSearch] = useState("");

  const { data } = useQuery(
    trpc.agents.getMany.queryOptions({
      pageSize: 100,
      search: agentSearch,
    }),
  );

  return (
    <CommandSelect
      className='h-9'
      placeholder='Agent'
      options={(data?.data ?? []).map((agent) => ({
        id: agent.id,
        value: agent.id,
        children: (
          <div className='flex items-center gap-x-2'>
            <GenerateAvatar
              seed={agent.name}
              variant='botttsNeutral'
              className='size-4'
            />
            <span>{agent.name}</span>
          </div>
        ),
      }))}
      onSelect={(value) => setFilters({ agentId: value })}
      onSearch={setAgentSearch}
      value={filters.agentId ?? ""}
    />
  );
}
