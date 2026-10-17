import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { createCheckoutSession } from "@/actions/stripe";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const freeFeatures = [
  "5 PDF uploads per day",
  "Up to 10 conversations",
  "Maximum PDF size: 10 MB",
  "Standard AI model",
  "PDF Q&A with retrieval",
];

const proFeatures = [
  "Unlimited PDF uploads",
  "Unlimited conversations",
  "Maximum PDF size: 10 MB",
  "Larger AI model",
  "PDF Q&A with retrieval",
];

function FeatureList({ features }: { features: string[] }) {
  return (
    <ul className="space-y-3">
      {features.map((feature, index) => (
        <li
          key={feature}
          className="flex items-start gap-3 text-sm leading-6 text-[#D4D4D8]"
        >
          <span className="font-mono text-xs text-[#A1A1AA]">
            {String(index + 1).padStart(2, "0")}.
          </span>
          <span>{feature}</span>
        </li>
      ))}
    </ul>
  );
}

export default async function UpgradePage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const isLoggedIn = Boolean(session);
  const isPro = session?.user.plan === "pro";

  return (
    <main className="min-h-screen bg-[#0A0A0A] px-5 py-12 text-[#FAFAFA] sm:px-8 lg:px-12">
      <div className="mx-auto w-full max-w-5xl">
        <Link
          href={isLoggedIn ? "/chat" : "/"}
          className="mb-8 inline-block font-mono text-xs uppercase tracking-[0.16em] text-[#A1A1AA] transition-colors hover:text-[#FAFAFA]"
        >
          ← {isLoggedIn ? "Back to chat" : "Back to Nexus"}
        </Link>

        <header className="mb-10 border-b border-[#27272A] pb-8 sm:mb-12">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Simple pricing. Clear limits.
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-[#A1A1AA] sm:text-base">
            Chat with your PDFs and upgrade when you need more capacity.
          </p>
        </header>

        <section
          aria-label="Available plans"
          className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6"
        >
          <article className="flex min-w-0 flex-col border border-[#3F3F46] bg-[#121212] p-5 sm:p-6">
            <div className="border-b border-[#27272A] pb-5">
              <h2 className="text-xl font-semibold">Free</h2>
              <p className="mt-1 text-sm text-[#A1A1AA]">For getting started</p>
            </div>

            <div className="py-6">
              <p className="text-4xl font-semibold tracking-tight">$0</p>
              <p className="mt-1 text-sm text-[#A1A1AA]">per month</p>
            </div>

            <div className="flex-1 border-t border-[#27272A] pt-5">
              <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.14em] text-[#A1A1AA]">
                What&apos;s included
              </p>
              <FeatureList features={freeFeatures} />
            </div>

            <div className="mt-8 border-t border-[#27272A] pt-5">
              {isLoggedIn && !isPro ? (
                <Button
                  variant="outline"
                  className="h-11 w-full rounded-none border-[#3F3F46] bg-transparent text-[#A1A1AA]"
                  disabled
                >
                  Current plan
                </Button>
              ) : isPro ? (
                <Link
                  href="/chat"
                  className="flex h-11 w-full items-center justify-center border border-[#3F3F46] text-sm transition-colors hover:bg-[#1C1C1C]"
                >
                  Go to Nexus
                </Link>
              ) : (
                <Link
                  href="/register"
                  className="flex h-11 w-full items-center justify-center border border-[#3F3F46] text-sm transition-colors hover:bg-[#1C1C1C]"
                >
                  Get started free
                </Link>
              )}
            </div>
          </article>

          <article className="flex min-w-0 flex-col border border-[#52525B] bg-[#121212] p-5 sm:p-6">
            <div className="border-b border-[#27272A] pb-5">
              <h2 className="text-xl font-semibold">Pro</h2>
              <p className="mt-1 text-sm text-[#A1A1AA]">For more capacity</p>
            </div>

            <div className="py-6">
              <p className="text-4xl font-semibold tracking-tight">$9</p>
              <p className="mt-1 text-sm text-[#A1A1AA]">per month</p>
            </div>

            <div className="flex-1 border-t border-[#27272A] pt-5">
              <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.14em] text-[#A1A1AA]">
                What&apos;s included
              </p>
              <FeatureList features={proFeatures} />
            </div>

            <div className="mt-8 border-t border-[#27272A] pt-5">
              {isPro ? (
                <Button
                  variant="outline"
                  className="h-11 w-full rounded-none border-[#3F3F46] bg-transparent text-[#A1A1AA]"
                  disabled
                >
                  Current plan
                </Button>
              ) : isLoggedIn ? (
                <form action={createCheckoutSession}>
                  <Button
                    type="submit"
                    className="h-11 w-full rounded-none bg-[#FAFAFA] text-[#0A0A0A] hover:bg-[#E4E4E7]"
                  >
                    Upgrade to Pro
                    <span aria-hidden="true" className="ml-2">
                      →
                    </span>
                  </Button>
                </form>
              ) : (
                <Link
                  href="/register"
                  className="flex h-11 w-full items-center justify-center bg-[#FAFAFA] text-sm font-medium text-[#0A0A0A] transition-colors hover:bg-[#E4E4E7]"
                >
                  Create account to upgrade
                  <span aria-hidden="true" className="ml-2">
                    →
                  </span>
                </Link>
              )}
            </div>
          </article>
        </section>
      </div>
    </main>
  );
}