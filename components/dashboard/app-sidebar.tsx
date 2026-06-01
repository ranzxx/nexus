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
import NavLinkSidebar from "./nav-link-sidebar";

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
  }, [pathname]);

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <Link href="/dashboard" className="font-semibold text-lg">
          Nexus
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <NavLinkSidebar href="/chat" label="New chat" pathname="/chat">
                <PlusCircleIcon />
              </NavLinkSidebar>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {conversations.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>Recent Chats</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {conversations.slice(0, 10).map((conv) => (
                  <SidebarMenuItem key={conv.id}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === `/chat/${conv.id}`}
                    >
                      <Link href={`/chat/${conv.id}`}>
                        <span className="truncate text-xs">{conv.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter className="p-4 flex flex-row items-center">
        <NavUser />
        <ThemeToggle size={"icon-lg"} />
      </SidebarFooter>
    </Sidebar>
  );
}
