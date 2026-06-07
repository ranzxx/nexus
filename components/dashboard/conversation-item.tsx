"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { MoreHorizontal, Trash2, Pencil } from "lucide-react";
import {
  deleteConversation,
  updateConversationTitle,
} from "@/actions/conversation";
import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Props = {
  id: string;
  title: string;
  isActive: boolean;
  onDelete: (id: string) => void;
  onRename: (id: string, title: string) => void;
};

export default function ConversationItem({
  id,
  title,
  isActive,
  onDelete,
  onRename,
}: Props) {
  const router = useRouter();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [renameOpen, setRenameOpen] = useState<boolean>(false);
  const [renameValue, setRenameValue] = useState(title);


  async function handleDelete() {
    await deleteConversation(id);
    onDelete(id);
    if (isActive) router.push("/chat");
  }

  async function handleRename() {
    if (!renameValue.trim()) return;
    await updateConversationTitle(id, renameValue.trim());
    onRename(id, renameValue.trim());
    setRenameOpen(false);
  }

  return (
    <>
      <SidebarMenuItem className="group/item">
        <SidebarMenuButton
          asChild
          isActive={isActive}
          className="text-muted-foreground dark:text-[#a1a1aa] hover:text-foreground dark:hover:text-white hover:bg-muted dark:hover:bg-zinc-800/50 data-[active=true]:text-foreground dark:data-[active=true]:text-white data-[active=true]:border-l-2 data-[active=true]:border-blue-500 data-[active=true]:bg-transparent data-[active=true]:rounded-none rounded-md transition-all duration-200 h-9 px-3"
        >
          <Link
            href={`/chat/${id}`}
            className="flex w-full items-center justify-between gap-2"
          >
            <span className="min-w-0 truncate text-sm">{title}</span>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  aria-label="Conversation actions"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  className="shrink-0 cursor-pointer rounded p-1 opacity-0 transition-opacity hover:bg-muted dark:hover:bg-zinc-800/50 group-hover/item:opacity-100"
                >
                  <MoreHorizontal size={14} />
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent side="right" align="start">
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => {
                    setRenameValue(title);
                    setRenameOpen(true);
                  }}
                >
                  <Pencil size={14} className="mr-2" />
                  Rename
                </DropdownMenuItem>

                <DropdownMenuItem
                  className="cursor-pointer text-destructive focus:text-destructive"
                  onSelect={(e) => {
                    e.preventDefault();
                    setDeleteOpen(true);
                  }}
                >
                  <Trash2 size={14} className="mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>

      <Dialog open={renameOpen} onOpenChange={setRenameOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename conversation</DialogTitle>
          </DialogHeader>
          <Input
            value={renameValue}
            onChange={(e) => setRenameValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleRename()}
            placeholder="conversation name"
            autoFocus
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setRenameOpen(false)}>
              cancel
            </Button>
            <Button onClick={handleRename}>save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete chat?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This conversation will be
              permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} variant={"destructive"}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
