import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import DashboardNavbar from "@/modules/dashboard/ui/components/dashboard-navbar";
import DashboardSidebar from "@/modules/dashboard/ui/components/dashboard-sidebar";
import React from "react";

type Props = { children: React.ReactNode };

export default function layout({ children }: Props) {
  return (
    <SidebarProvider>
      <DashboardSidebar />
      <SidebarInset>
        <DashboardNavbar />
        <div className='flex flex-1 flex-col gap-4 p-4'>{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
