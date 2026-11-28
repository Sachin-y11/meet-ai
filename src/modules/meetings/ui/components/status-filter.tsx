"use client";

import { MeetingStatus } from "@/generated/prisma/enums";
import {
  CircleCheckIcon,
  ClockArrowUpIcon,
  LoaderIcon,
  VideoIcon,
} from "lucide-react";
import { useState } from "react";
import { useMeetingFilter } from "@/modules/meetings/hooks/use-meeting-filters";
import CommandSelect from "./command-select";

const options = [
  {
    id: MeetingStatus.upcoming,
    value: MeetingStatus.upcoming,
    children: (
      <div className='flex items-center gap-x-2 capitalize'>
        <ClockArrowUpIcon />
        {MeetingStatus.upcoming}
      </div>
    ),
  },
  {
    id: MeetingStatus.active,
    value: MeetingStatus.active,
    children: (
      <div className='flex items-center gap-x-2 capitalize'>
        <VideoIcon />
        {MeetingStatus.active}
      </div>
    ),
  },
  {
    id: MeetingStatus.processing,
    value: MeetingStatus.processing,
    children: (
      <div className='flex items-center gap-x-2 capitalize'>
        <LoaderIcon />
        {MeetingStatus.processing}
      </div>
    ),
  },
  {
    id: MeetingStatus.cancel,
    value: MeetingStatus.cancel,
    children: (
      <div className='flex items-center gap-x-2 capitalize'>
        <LoaderIcon />
        {MeetingStatus.cancel}
      </div>
    ),
  },
  {
    id: MeetingStatus.completed,
    value: MeetingStatus.completed,
    children: (
      <div className='flex items-center gap-x-2 capitalize'>
        <CircleCheckIcon />
        {MeetingStatus.completed}
      </div>
    ),
  },
];

export default function StatusFilter() {
  const [filters, setFilters] = useMeetingFilter();

  return (
    <CommandSelect
      placeholder='Status'
      className='h-9'
      options={options}
      onSelect={(value) => setFilters({ status: value as MeetingStatus })}
      value={filters.status ?? ""}
    />
  );
}
