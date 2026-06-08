"use client";

import { useUploadThing } from "@/lib/uploadthing";
import { processDocument } from "@/actions/document";
import { toast } from "sonner";
import { Plus, Loader2 } from "lucide-react";
import { useRef } from "react";

type Props = {
  onUploadComplete: (documentId: string, name: string) => void;
};

export default function FileUpload({ onUploadComplete }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const { startUpload, isUploading } = useUploadThing("documentUploader", {
    onClientUploadComplete: async (res) => {
      const file = res[0];
      try {
        const result = await processDocument({
          name: file.name,
          fileUrl: file.ufsUrl,
          fileSize: file.size,
        });

        if ("error" in result) {
          toast.error(result.error);
          return;
        }

        toast.success(`${file.name} uploaded!`);
        onUploadComplete(result.data.id, result.data.name);
      } catch (err) {
        toast.error(
          err instanceof Error ? err.message : "Failed to process document",
        );
      }
    },
    onUploadError: (error) => {
      if (error.message.includes("InvalidFileType")) {
        toast.error("Please upload a PDF file only.");
      } else if (error.message.includes("FileSize")) {
        toast.error("File size exceeds 16MB limit.");
      } else {
        toast.error("Upload failed. Please try again.");
      }
    },
  });

  return (
    <div data-testid="pdf-upload">
      <input
        ref={inputRef}
        type="file"
        accept=".pdf"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) startUpload([file]);
          e.target.value = "";
        }}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={isUploading}
        className="w-8 h-8 min-w-8 p-0 rounded-md bg-transparent text-muted-foreground hover:bg-muted hover:text-foreground flex items-center justify-center transition-colors disabled:opacity-50"
      >
        {isUploading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <Plus className="w-5 h-5" />
        )}
      </button>
    </div>
  );
}