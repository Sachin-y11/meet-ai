import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ChevronRightIcon,
  MoreVerticalIcon,
  PencilIcon,
  TrashIcon,
} from "lucide-react";
import Link from "next/link";

interface Props {
  agentId: string;
  agentName: string;
  onEdit: () => void;
  onRemove: () => void;
}

export default function AgentIdViewHeader({
  agentId,
  agentName,
  onEdit,
  onRemove,
}: Props) {
  return (
    <div className='flex items-center justify-between'>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink
              className='font-medium text-md'
              render={<Link href={"/agents"}>My Agents</Link>}
            />
          </BreadcrumbItem>
          <BreadcrumbSeparator className='text-foreground text-md font-medium [&>svg]:size-4'>
            <ChevronRightIcon />
          </BreadcrumbSeparator>
          <BreadcrumbLink
            className='font-medium text-md'
            render={<Link href={`/agents/${agentId}`}>{agentName}</Link>}
          />
        </BreadcrumbList>
      </Breadcrumb>

      <DropdownMenu modal={false}>
        <DropdownMenuTrigger
          render={
            <Button variant={"ghost"}>
              <MoreVerticalIcon />
            </Button>
          }
        />
        <DropdownMenuContent>
          <DropdownMenuItem onClick={onEdit}>
            <PencilIcon />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onRemove} variant='destructive'>
            <TrashIcon />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
