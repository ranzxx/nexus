import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import AppSidebar from "@/components/dashboard/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  return (
    <SidebarProvider>
      <div className="flex w-full h-screen overflow-hidden">
        <AppSidebar />
        <main className="flex-1 flex flex-col min-h-0 bg-background dark:bg-[#09090b]">
          <div className="flex items-center p-4 border-b border-border dark:border-[#27272a]">
            <SidebarTrigger size={"icon-lg"} />
          </div>
          <div className="flex-1 overflow-hidden">{children}</div>
        </main>
      </div>
    </SidebarProvider>
  );
}
