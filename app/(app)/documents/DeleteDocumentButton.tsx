'use client'

import { deleteDocument } from "@/actions/document";
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
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface DeleteDocumentButtonProps {
    id: string
}

export default function DeleteDocumentButton({ id }: DeleteDocumentButtonProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  async function handleDelete() {
    setLoading(true);
    try {
        await deleteDocument(id);
        toast.success('document deleted');
        router.refresh()
    } catch {
        toast.error("failed to delete");
        setLoading(false);
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm" disabled={loading}>
          delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>delete this document?</AlertDialogTitle>
          <AlertDialogDescription>
            This will delete the document and all its data. This action cannot
            be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>
            yes, delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
