"use client";

import { useRouter } from "next/navigation";
import { UploadButton } from "@uploadthing/react";
import type { OurFileRouter } from "@/lib/uploadthing";
import { processDocument } from "@/actions/document";
import { toast } from "sonner";

export default function NewDocumentPage() {
  const router = useRouter();

  return (
    <div className="max-w-md">
      <h1 className="text-2xl font-semibold mb-6">Upload Document</h1>
      <div className="border border-dashed border-border rounded-xl p-12 flex flex-col items-center justify-center">
        <p className="text-sm text-muted-foreground mb-6">
          Upload a PDF to start chatting with it
        </p>
        <UploadButton<OurFileRouter, "documentUploader">
          endpoint="documentUploader"
          onClientUploadComplete={async (res) => {
            const file = res[0];
            await processDocument({
              name: file.name,
              fileUrl: file.ufsUrl,
              fileSize: file.size,
            });
            toast.success("document processed!");
            router.push("/documents");
          }}
          onUploadError={(error) => {
            toast.error(error.message);
          }}
        />
      </div>
    </div>
  );
}
