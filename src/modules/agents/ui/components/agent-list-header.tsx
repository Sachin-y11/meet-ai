"use client";

import { Button } from "@/components/ui/button";
import { PlusIcon, XCircleIcon } from "lucide-react";
import NewAgentDialog from "./new-agent-dialog";
import { useState } from "react";
import AgentSearchFilter from "./agent-search-filter";
import { useAgentFilter } from "@/modules/agents/hooks/use-agent-filters";

export default function AgentListHeader() {
  const [filters, setFilters] = useAgentFilter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const isAnyFilterModified = !!filters.search;

  const onClearFilter = () => {
    setFilters({
      search: "",
      page: 1,
    });
  };

  return (
    <>
      <NewAgentDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
      <div className='px-4 md:px-8 flex flex-col gap-y-4'>
        <div className='flex items-center justify-between'>
          <h5 className='text-xl font-medium'>My Agents</h5>
          <Button onClick={() => setIsDialogOpen(true)}>
            <PlusIcon />
            New Agent
          </Button>
        </div>

        <div className='flex items-center gap-x-2 p-1'>
          <AgentSearchFilter />
          {isAnyFilterModified && (
            <Button onClick={() => onClearFilter()} variant={"outline"}>
              <XCircleIcon />
              Clear
            </Button>
          )}
        </div>
      </div>
    </>
  );
}
