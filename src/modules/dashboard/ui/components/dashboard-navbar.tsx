"use client";

import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { SearchIcon } from "lucide-react";
import DashboardCommand from "./dashboard-command";
import { useEffect, useState } from "react";

export default function DashboardNavbar() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key.toLowerCase() === "k" &&
        (event.metaKey || event.ctrlKey) &&
        !event.altKey
      ) {
        event.preventDefault();
        setOpen(true);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <DashboardCommand open={open} setOpen={setOpen} />
      <header className='sticky top-0 bg-background flex h-16 shrink-0 items-center gap-2 border-b px-4'>
        <SidebarTrigger className='-ml-1' />

        <Button
          className={
            "h-9 w-60 justify-start font-normal text-muted-foreground hover:text-muted-foreground cursor-pointer"
          }
          variant={"outline"}
          size={"sm"}
          onClick={() => setOpen(true)}
        >
          <SearchIcon />
          Search
          <kbd className='ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground'>
            Ctrl / &#8984; K
          </kbd>
        </Button>
      </header>
    </>
  );
}
