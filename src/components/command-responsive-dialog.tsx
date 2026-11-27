"use client";

import { useState } from "react";
import { ChevronsUpDownIcon } from "lucide-react";

import ResponsiveDialog from "@/components/responsive-dialog";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "cn";

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
  title?: string;
  description?: string;
  className?: string;
}

export default function CommandResponsiveDialog({
  className,
  description = "Search and select an option.",
  onSearch,
  onSelect,
  options,
  placeholder = "Select an option",
  title = "Select an option",
  value,
}: Props) {
  const [open, setOpen] = useState(false);
  const selectedOption = options.find((option) => option.value === value);

  return (
    <>
      <Button
        variant='outline'
        type='button'
        onClick={() => setOpen(true)}
        className={cn(
          "h-9 justify-between px-2 font-normal",
          !selectedOption && "text-muted-foreground",
          className,
        )}
      >
        <span>{selectedOption?.children ?? placeholder}</span>
        <ChevronsUpDownIcon />
      </Button>

      <ResponsiveDialog
        open={open}
        onOpenChange={setOpen}
        title={title}
        description={description}
      >
        <Command>
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
        </Command>
      </ResponsiveDialog>
    </>
  );
}
