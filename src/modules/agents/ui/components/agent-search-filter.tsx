"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { useAgentFilter } from "@/modules/agents/hooks/use-agent-filters";
import { SearchIcon } from "lucide-react";

export default function AgentSearchFilter() {
  const [filters, setFilters] = useAgentFilter();
  const [search, setSearch] = useState(filters.search);
  const [syncedSearch, setSyncedSearch] = useState(filters.search);

  if (filters.search !== syncedSearch) {
    setSyncedSearch(filters.search);
    setSearch(filters.search);
  }

  useEffect(() => {
    if (search === filters.search) return;

    const timeoutId = window.setTimeout(() => {
      setFilters({ search });
    }, 500);

    return () => window.clearTimeout(timeoutId);
  }, [filters.search, search, setFilters]);

  return (
    <form
      className='relative'
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      <Input
        placeholder='Filter by name'
        className='h-9 w-50 pl-7'
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
        }}
      />
      <SearchIcon className='size-4 absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground' />
    </form>
  );
}
