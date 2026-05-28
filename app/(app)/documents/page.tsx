import { getDocuments } from "@/actions/document";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import DeleteDocumentButton from "./DeleteDocumentButton";

export default async function DocumentsPage() {
  const documents = await getDocuments();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Documents</h1>
        <Button asChild>
          <Link href="/documents/new">Upload Document</Link>
        </Button>
      </div>

      {documents.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-border rounded-xl">
          <p className="text-sm text-muted-foreground mb-4">no documents yet</p>
          <Button asChild>
            <Link href="/documents/new">upload your first document</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {documents.map((doc) => (
            <Card key={doc.id}>
              <CardHeader>
                <CardTitle className="text-sm truncate">{doc.name}</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  {(doc.fileSize / 1024 / 1024).toFixed(2)} MB
                </span>
                <div className="flex gap-2">
                  <Button asChild size="sm" variant="outline">
                    <Link href={`/chat?documentId=${doc.id}`}>chat</Link>
                  </Button>
                  <DeleteDocumentButton id={doc.id} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
