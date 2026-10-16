import Link from "next/link";
import { DropdownMenuGroup, DropdownMenuItem } from "../ui/dropdown-menu";
import { LucideIcon } from "lucide-react";

interface NavUserLinksProps {
  href: string;
  icon: LucideIcon;
  label: string;
}

export default function NavUserLinks({ href, icon: Icon, label }: NavUserLinksProps) {
  return (
    <DropdownMenuGroup>
      <Link href={href}>
        <DropdownMenuItem className="cursor-pointer">
          <Icon />
          {label}
        </DropdownMenuItem>
      </Link>
    </DropdownMenuGroup>
  );
}