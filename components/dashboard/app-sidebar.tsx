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
import { PlusCircleIcon } from "lucide-react";
import ConversationItem from "./conversation-item";

type Conversation = {
  id: string;
  title: string;
  updatedAt: Date;
};

export default function AppSidebar() {
  const pathname = usePathname();
  const [conversations, setConversations] = useState<Conversation[]>([]);

  useEffect(() => {
    getConversations().then(setConversations);

    const interval = setInterval(() => {
      getConversations().then(setConversations);
    }, 3000); // refresh setiap 3 detik

    return () => clearInterval(interval);
  }, []);

  return (
    <Sidebar className="border-r border-border dark:border-[#27272a] bg-card dark:bg-[#09090b] text-muted-foreground dark:text-[#a1a1aa]">
      <SidebarHeader className="p-6 border-b border-border dark:border-[#27272a]">
        <Link
          href="/chat"
          className="font-semibold text-lg text-foreground dark:text-white flex items-center gap-2"
        >
          Nexus
        </Link>
      </SidebarHeader>
      <SidebarContent className="px-3 py-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  className="bg-foreground text-background hover:bg-foreground/90 hover:text-background dark:bg-white dark:text-black dark:hover:bg-white/90 dark:hover:text-black font-medium w-full justify-start rounded-md shadow-sm h-10 px-4"
                >
                  <Link href="/chat">
                    <PlusCircleIcon className="w-5 h-5 mr-2" />
                    <span>New chat</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        {conversations.length > 0 && (
          <SidebarGroup className="mt-5">
            <SidebarGroupLabel className="text-muted-foreground/70 dark:text-[#a1a1aa]/70 text-xs font-semibold tracking-wider uppercase px-2 mb-2">
              Recent Chats
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {conversations.slice(0, 10).map((conv) => (
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
                        prev.map((c) => (c.id === id ? { ...c, title } : c)),
                      )
                    }
                  />
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
      <SidebarFooter className="p-4 border-t border-border dark:border-[#27272a] flex flex-row items-center justify-between">
        <NavUser />
        <ThemeToggle size={"icon-lg"} />
      </SidebarFooter>
    </Sidebar>
  );
}
