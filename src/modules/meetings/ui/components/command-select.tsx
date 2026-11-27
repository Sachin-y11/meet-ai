"use client";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "cn";
import { ChevronsUpDownIcon } from "lucide-react";
import { useState } from "react";

interface Props {
  options: Array<{
    id: string;
    value: string;
    children: React.ReactNode;
  }>;
  onSelect: (value: string) => void;
  onSearch?: (value: string) => void;
  value: string;
  placeholder?: string;
  isSearchable?: string;
  className?: string;
  shouldFilter?: boolean;
}

export default function CommandSelect({
  className,
  onSelect,
  options,
  value,
  isSearchable,
  shouldFilter = true,
  onSearch,
  placeholder,
}: Props) {
  const [open, setOpen] = useState(false);
  const selectedOption = options.find((option) => option.value === value);

  return (
    <>
      <Button
        variant={"outline"}
        type='button'
        onClick={() => setOpen(true)}
        className={cn(
          "h-9 justify-between font-normal px-2",
          !selectedOption && "text-muted-foreground",
          className,
        )}
      >
        <div className='w-full'>{selectedOption?.children ?? placeholder}</div>
        <ChevronsUpDownIcon />

        <CommandDialog open={open} onOpenChange={setOpen}>
          <CommandInput placeholder='Search...' onValueChange={onSearch} />
          <CommandList>
            <CommandEmpty>
              <span className='text-muted-foreground text-sm'>
                No options found.
              </span>
            </CommandEmpty>

            {options.map((option) => (
              <CommandItem
                key={option.id}
                onSelect={() => {
                  onSelect(option.value);
                  setOpen(false);
                }}
              >
                {option.children}
              </CommandItem>
            ))}
          </CommandList>
        </CommandDialog>
      </Button>
    </>
  );
}
