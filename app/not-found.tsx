import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="max-w-md text-center">
        <p className="text-sm font-medium text-muted-foreground">404</p>
 
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground">
          Page not found
        </h1>

        <p className="mt-3 text-muted-foreground">
          The page you are looking for does not exist or has been moved.
        </p>

        <Button asChild className="mt-6">
          <Link href="/chat">Back to chat</Link>
        </Button>
      </div>
    </main>
  );
}