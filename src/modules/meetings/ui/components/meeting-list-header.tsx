"use client";

import { Button } from "@/components/ui/button";
import { PlusIcon, XCircleIcon } from "lucide-react";
import { useState } from "react";
import NewMeetingDialog from "./new-meeting-dialog";
import MeetingSearchFilter from "./meeting-search-filter";
import StatusFilter from "./status-filter";
import AgentIdFilter from "./agent-id-filter";
import { useMeetingFilter } from "@/modules/meetings/hooks/use-meeting-filters";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { DEFAULT_PAGE } from "@/constants";

export default function MeetingListheader() {
  const [filters, setFilters] = useMeetingFilter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const isAnyFilterModified =
    !!filters.search || !!filters.status || !!filters.agentId;

  const onClearFilter = () => {
    setFilters({
      search: "",
      page: DEFAULT_PAGE,
      status: null,
      agentId: "",
    });
  };

  return (
    <>
      <NewMeetingDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />

      <div className='px-4 md:px-8 flex flex-col gap-y-4'>
        <div className='flex items-center justify-between'>
          <h5 className='text-xl font-medium'>My Meetings</h5>
          <Button onClick={() => setIsDialogOpen(true)}>
            <PlusIcon />
            New Meeting
          </Button>
        </div>

        <ScrollArea>
          <div className='flex items-center gap-x-2 p-1'>
            <MeetingSearchFilter />
            <StatusFilter />
            <AgentIdFilter />{" "}
            {isAnyFilterModified && (
              <Button onClick={() => onClearFilter()} variant={"outline"}>
                <XCircleIcon />
                Clear
              </Button>
            )}
          </div>
          <ScrollBar orientation='horizontal' />
        </ScrollArea>
      </div>
    </>
  );
}
