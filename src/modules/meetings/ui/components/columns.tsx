"use client";

import { createColumnHelper } from "@tanstack/react-table";
import humanizeDuration from "humanize-duration";
import { format } from "date-fns";
import GenerateAvatar from "@/components/generate-avatar";
import {
  CircleCheckIcon,
  CircleXIcon,
  ClockArrowUpIcon,
  ClockFadingIcon,
  CornerDownRightIcon,
  LoaderIcon,
  VideoIcon,
} from "lucide-react";
import type { MeetingGetMany } from "../../types";
import { type DataTableFeatures } from "./data-table-features";
import { Badge } from "@/components/ui/badge";
import { cn } from "cn";

function formatDuration(seconds: number) {
  return humanizeDuration(seconds * 1000, {
    largest: 1,
    round: true,
    units: ["h", "m", "s"],
  });
}

const statusIconMap = {
  upcoming: ClockArrowUpIcon,
  active: LoaderIcon,
  completed: CircleCheckIcon,
  processing: LoaderIcon,
  cancelled: CircleXIcon,
};

const statusColorMap = {
  upcoming: "bg-yellow-500/20 text-yellow-800 border-yellow-800/5",
  active: "bg-blue-500/20 text-blue-800 border-blue-800/5",
  completed: "bg-emerald-500/20 text-emerald-800 border-emerald-800/5",
  cancelled: "bg-rose-500/20 text-rose-800 border-rose-800/5",
  processing: "bg-gray-500/20 text-gray-800 border-gray-800/5",
};

// Use `accessor` for data columns and `display` for columns without one.
const columnHelper = createColumnHelper<
  DataTableFeatures,
  MeetingGetMany["data"][number]
>();

export const columns = columnHelper.columns([
  columnHelper.accessor("name", {
    header: "Meeting Name",
    cell: ({ row }) => (
      <div className='flex flex-col gap-y-1'>
        <span className='font-semibold capitalize'>{row.original.name}</span>

        <div className='flex items-center gap-x-2'>
          <div className='flex items-center gap-x-1'>
            <CornerDownRightIcon className='size-3 text-muted-foreground' />
            <span className='text-sm text-muted-foreground max-w-50 truncate capitalize'>
              {row.original.name}
            </span>
          </div>
          <GenerateAvatar
            variant='botttsNeutral'
            seed={row.original.agent.name}
            className='size-4'
          />
          <span className='text-sm text-muted-foreground'>
            {row.original.startedAt
              ? format(row.original.startedAt, "MMM d")
              : ""}
          </span>
        </div>
      </div>
    ),
  }),
  // change id to meeting count
  columnHelper.accessor("status", {
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status as keyof typeof statusIconMap;

      // Get the correct icon
      const Icon = statusIconMap[status] ?? LoaderIcon;

      // Get the correct background and text colors
      const statusColor =
        statusColorMap[status] ??
        "bg-gray-500/20 text-gray-800 border-gray-800/5";

      return (
        <Badge
          variant='outline'
          className={cn(
            "capitalize [&>svg]:size-4 text-muted-foreground",
            statusColor,
          )}
        >
          <Icon />
          {row.original.status}
        </Badge>
      );
    },
  }),

  columnHelper.accessor("duration", {
    header: "Duration",
    cell: ({ row }) => {
      return (
        <Badge
          variant='outline'
          className={cn("capitalize [&>svg]:size-4 flex items-center gap-x-2")}
        >
          <ClockFadingIcon />
          {row.original.duration
            ? formatDuration(row.original.duration)
            : "No duration"}
        </Badge>
      );
    },
  }),
]);
