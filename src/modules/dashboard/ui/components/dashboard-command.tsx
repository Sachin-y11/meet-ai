import {
  CommandDialog,
  CommandInput,
  CommandEmpty,
  CommandList,
} from "@/components/ui/command";
import { Dispatch, SetStateAction } from "react";

export default function DashboardCommand({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder='Find a meeting or agent.' />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
      </CommandList>
    </CommandDialog>
  );
}
