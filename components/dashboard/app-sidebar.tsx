"use client";

import Link from "next/link";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar";
import { usePathname } from "next/navigation";
import ThemeToggle from "../marketing/theme-toggle";
import { NavUser } from "./nav-user";
import { useEffect, useState } from "react";
import { getConversations } from "@/actions/conversation";
import { Plus } from "lucide-react";
import ConversationItem from "./conversation-item";
import { Skeleton } from "../ui/skeleton";

type Conversation = {
  id: string;
  title: string;
  updatedAt: Date;
};

export default function AppSidebar() {
  const pathname = usePathname();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoadingConversations, setIsLoadingConversations] =
    useState<boolean>(true);

  useEffect(() => {
    let cancelled = false;

    const load = () =>
      getConversations()
        .then((data) => {
          if (!cancelled) setConversations(data);
        })
        .catch(() => {})
        .finally(() => {
          if (!cancelled) setIsLoadingConversations(false);
        });

    load();
    const interval = setInterval(() => {
      if (!document.hidden) load();
    }, 3000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  return (
    <Sidebar className="border-r border-border dark:border-[#27272A] bg-card dark:bg-[#0A0A0A] text-muted-foreground dark:text-[#A1A1AA]">
      <SidebarHeader className="h-16 justify-center px-6 py-0 border-b border-border dark:border-[#27272A]">
        <Link
          href="/chat"
          className="flex items-center text-foreground dark:text-[#FAFAFA]"
        >
          <span className="text-lg font-semibold tracking-tight">Nexus</span>
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-3 py-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  className="h-10 w-full justify-center gap-2 rounded-none border border-border dark:border-[#27272A] bg-transparent font-mono text-xs uppercase tracking-[0.14em] text-foreground dark:text-[#FAFAFA] hover:bg-muted dark:hover:bg-[#121212]"
                >
                  <Link href="/chat">
                    <Plus className="h-4 w-4" />
                    <span>New chat</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-5">
          <SidebarGroupLabel className="mb-2 px-2 font-mono text-[11px] font-normal uppercase tracking-[0.14em] text-muted-foreground dark:text-[#A1A1AA]">
            Recent chats
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {isLoadingConversations
                ? Array.from({ length: 4 }).map((_, i) => (
                    <SidebarMenuItem key={i} className="px-3 py-1.5">
                      <Skeleton className="h-6 w-full rounded-none" />
                    </SidebarMenuItem>
                  ))
                : conversations.length > 0
                  ? conversations
                      .slice(0, 10)
                      .map((conv) => (
                        <ConversationItem
                          key={conv.id}
                          id={conv.id}
                          title={conv.title}
                          isActive={pathname === `/chat/${conv.id}`}
                          onDelete={(id) =>
                            setConversations((prev) =>
                              prev.filter((c) => c.id !== id),
                            )
                          }
                          onRename={(id, title) =>
                            setConversations((prev) =>
                              prev.map((c) =>
                                c.id === id ? { ...c, title } : c,
                              ),
                            )
                          }
                        />
                      ))
                  : null}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="flex flex-row items-center justify-between border-t border-border dark:border-[#27272A] p-4">
        <NavUser />
        <ThemeToggle size={"icon-lg"} />
      </SidebarFooter>
    </Sidebar>
  );
}