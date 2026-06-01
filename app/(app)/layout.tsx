import AppSidebar from "@/components/dashboard/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex w-full">
        <AppSidebar />
        <main className="flex-1">
          <div className="flex items-center p-4 border-b">
            <SidebarTrigger size={"icon-lg"} />
          </div>
          <div className="p-6">{children}</div>
        </main>
      </div>
    </SidebarProvider>
  );
}
