"use client";

import { createColumnHelper } from "@tanstack/react-table";

import GenerateAvatar from "@/components/generate-avatar";
import { CornerDownRightIcon, VideoIcon } from "lucide-react";
import { AgentGetOne } from "../../types";
import { type DataTableFeatures } from "./data-table-features";
import { Badge } from "@/components/ui/badge";

// Use `accessor` for data columns and `display` for columns without one.
const columnHelper = createColumnHelper<DataTableFeatures, AgentGetOne>();

export const columns = columnHelper.columns([
  columnHelper.accessor("name", {
    header: "Agent Name",
    cell: ({ row }) => (
      <div className='flex flex-col gap-y-1'>
        <div className='flex items-center gap-x-2'>
          <GenerateAvatar
            seed={row.original.name}
            variant='botttsNeutral'
            className='size-6'
          />
          <span className='font-semibold capitalize'>{row.original.name}</span>
        </div>
        <div className='flex items-center gap-x-2'>
          <CornerDownRightIcon className='size-3 text-muted-foreground' />
          <span className='text-sm text-muted-foreground max-w-50 truncate capitalize'>
            {row.original.instructions}
          </span>
        </div>
      </div>
    ),
  }),
  // change id to meeting count
  columnHelper.accessor("id", {
    header: "Meetings",
    cell: ({ row }) => (
      <Badge
        variant={"outline"}
        className='flex items-center gap-x-2 [&>svg]:size-4'
      >
        <VideoIcon />
        {row.original.id}
        {/* {row.original.meetingCount} {row.original.meetingCount===1?'Meeting':'meetings'} */}
      </Badge>
    ),
  }),
]);
