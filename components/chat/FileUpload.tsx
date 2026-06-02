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
            "bg-transparent text-[#a1a1aa] hover:text-white hover:bg-white/10 border-none w-9 h-9 p-0 focus-within:ring-0 outline-none flex items-center justify-center rounded-lg transition-colors",
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
          toast.error(error.message);
        }}
      />
    </div>
  );
}
