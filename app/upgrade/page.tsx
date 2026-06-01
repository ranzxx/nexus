import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { createCheckoutSession } from "@/actions/stripe";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function UpgradePage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (session?.user.plan === "pro") redirect("/chat");

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <Link
        href="/chat"
        className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border bg-background px-3 py-2 text-sm font-medium text-muted-foreground shadow-sm transition-colors hover:bg-muted hover:text-foreground sm:left-6 sm:top-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Link>
      <div className="text-center mb-12">
        <h1 className="text-3xl font-semibold mb-2">Upgrade to pro</h1>
        <p className="text-muted-foreground">unlock the full power of Nexus</p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Free */}
        <div className="border border-border rounded-xl p-6 space-y-6">
          <div>
            <div className="text-xs bg-muted text-muted-foreground px-3 py-1 rounded-full inline-block mb-4">
              free
            </div>
            <div className="text-3xl font-medium mb-1">
              $0{" "}
              <span className="text-sm text-muted-foreground font-normal">
                /month
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              get started for free
            </p>
          </div>
          <ul className="space-y-2">
            {[
              "5 document uploads/day",
              "10 conversations max",
              "RAG document chat",
              "llama-3.1-8b model",
            ].map((f) => (
              <li
                key={f}
                className="text-sm text-muted-foreground flex items-center gap-2"
              >
                <span className="text-foreground">✓</span> {f}
              </li>
            ))}
            {[
              "Priority model",
              "Conversation search",
              "Export conversations",
            ].map((f) => (
              <li
                key={f}
                className="text-sm text-muted-foreground/40 flex items-center gap-2"
              >
                <span>✕</span> {f}
              </li>
            ))}
          </ul>
          <Button variant="outline" className="w-full" disabled>
            current plan
          </Button>
        </div>

        {/* Pro */}
        <div className="border-2 border-foreground rounded-xl p-6 space-y-6">
          <div>
            <div className="text-xs bg-foreground text-background px-3 py-1 rounded-full inline-block mb-4">
              pro
            </div>
            <div className="text-3xl font-medium mb-1">
              $9{" "}
              <span className="text-sm text-muted-foreground font-normal">
                /month
              </span>
            </div>
            <p className="text-sm text-muted-foreground">for power users</p>
          </div>
          <ul className="space-y-2">
            {[
              "Unlimited document uploads",
              "Unlimited conversations",
              "RAG document chat",
              "llama-3.3-70b model (faster & smarter)",
              "Conversation search",
              "Export conversations",
            ].map((f) => (
              <li
                key={f}
                className="text-sm text-muted-foreground flex items-center gap-2"
              >
                <span className="text-foreground">✓</span> {f}
              </li>
            ))}
          </ul>
          <form action={createCheckoutSession}>
            <Button type="submit" className="w-full">
              upgrade to pro — $9/month
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
