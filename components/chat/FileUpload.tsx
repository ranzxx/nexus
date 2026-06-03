"use client";

import { UploadButton } from "@uploadthing/react";
import type { OurFileRouter } from "@/lib/uploadthing";
import { processDocument } from "@/actions/document";
import { toast } from "sonner";
import { Plus } from "lucide-react";

type Props = {
  onUploadComplete: (documentId: string) => void;
};

export default function FileUpload({ onUploadComplete }: Props) {
  return (
    <div data-testid="pdf-upload">
      <UploadButton<OurFileRouter, "documentUploader">
        endpoint="documentUploader"
        appearance={{
          button:
            "!w-8 !h-8 !min-w-8 !max-w-8 !p-0 rounded-md !bg-transparent !text-muted-foreground hover:!bg-muted hover:!text-foreground flex items-center justify-center transition-colors",
          allowedContent: "hidden",
        }}
        content={{ button: <Plus className="w-5 h-5" /> }}
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
          switch (true) {
            case error.message.includes("InvalidFileType"):
              toast.error("Please upload a PDF file only.");
              break;
            case error.message.includes("FileSize"):
              toast.error("File size exceeds 16MB limit.");
              break;
            default:
              toast.error("Upload failed. Please try again.");
          }
        }}
      />
    </div>
  );
}
