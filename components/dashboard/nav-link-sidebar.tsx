import Link from "next/link";
import { SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar";

interface NavSidebarProps {
  href: string;
  pathname: string;
  label: string;
  children: React.ReactNode;
}

export default function NavLinkSidebar({ href, pathname, label, children }: NavSidebarProps) {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={pathname === href}>
        <Link href={href}>
          {children}
          <span>{label}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}