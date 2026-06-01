"use client";

import { UploadButton } from "@uploadthing/react";
import type { OurFileRouter } from "@/lib/uploadthing";
import { processDocument } from "@/actions/document";
import { toast } from "sonner";

type Props = {
  onUploadComplete: (documentId: string) => void;
};

export default function FileUpload({ onUploadComplete }: Props) {
  return (
    <UploadButton<OurFileRouter, "documentUploader">
      endpoint="documentUploader"
      appearance={{
        button:
          "bg-transparent border border-border text-muted-foreground hover:bg-muted text-xs px-3 py-1.5 rounded-md h-auto",
        allowedContent: "hidden",
      }}
      content={{ button: "attach PDF" }}
      onClientUploadComplete={async (res) => {
        const file = res[0];
        const doc = await processDocument({
          name: file.name,
          fileUrl: file.ufsUrl,
          fileSize: file.size,
        });
        toast.success(`${file.name} uploaded!`);
        onUploadComplete(doc.id);
      }}
      onUploadError={(error) => {
        toast.error(error.message);
      }}
    />
  );
}
