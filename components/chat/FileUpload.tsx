"use client";

import { useUploadThing } from "@/lib/uploadthing-client";
import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus, Loader2 } from "lucide-react";
import { useRef, useState } from "react";

type Props = {
  getConversationId: () => Promise<string>;
  onUploadComplete: (documentId: string, name: string) => void;
};

export default function FileUpload({
  getConversationId,
  onUploadComplete,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isPreparing, setIsPreparing] = useState(false);
  const trpc = useTRPC();
  const uploadDocument = useMutation(trpc.document.upload.mutationOptions());

  const { startUpload, isUploading } = useUploadThing("documentUploader", {
    onClientUploadComplete: async (res) => {
      const file = res[0];
      try {
        const conversationId = await getConversationId();

        const result = await uploadDocument.mutateAsync({
          name: file.name,
          fileUrl: file.ufsUrl,
          fileSize: file.size,
          conversationId,
        });
        toast.success(`${file.name} uploaded!`);
        onUploadComplete(result.id, result.name);
      } catch (err) {
        toast.error(
          err instanceof Error ? err.message : "Failed to process document",
        );
      } finally {
        setIsPreparing(false);
      }
    },
    onUploadError: (error) => {
      setIsPreparing(false);
      if (error.message.includes("InvalidFileType")) {
        toast.error("Please upload a PDF file only.");
      } else if (error.message.includes("FileSize")) {
        toast.error("File size exceeds 16MB limit.");
      } else {
        toast.error("Upload failed. Please try again.");
      }
    },
  });

  const isBusy = isUploading || uploadDocument.isPending || isPreparing;

  return (
    <div data-testid="pdf-upload">
      <input
        ref={inputRef}
        type="file"
        accept=".pdf"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            setIsPreparing(true);
            startUpload([file]);
          }
          e.target.value = "";
        }}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={isBusy}
        className="w-8 h-8 min-w-8 p-0 rounded-md bg-transparent text-muted-foreground hover:bg-muted hover:text-foreground flex items-center justify-center transition-colors disabled:opacity-50"
      >
        {isBusy ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <Plus className="w-5 h-5" />
        )}
      </button>
    </div>
  );
}
