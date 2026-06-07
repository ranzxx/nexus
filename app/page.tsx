import Link from "next/link";
import {
  ArrowRight,
  FileText,
  Lock,
  MessageSquare,
  Search,
  Zap,
} from "lucide-react";

import { Button } from "@/components/ui/button";

const features = [
  {
    icon: FileText,
    title: "PDF Upload",
    description: "Upload documents and make them searchable with AI.",
  },
  {
    icon: Search,
    title: "RAG Retrieval",
    description: "Get answers grounded in your uploaded documents.",
  },
  {
    icon: MessageSquare,
    title: "Conversation History",
    description: "Continue previous chats without losing context.",
  },
  {
    icon: Lock,
    title: "Secure Authentication",
    description: "Protected user accounts and private conversations.",
  },
  {
    icon: Zap,
    title: "Fast AI Responses",
    description: "Built with modern AI tooling for responsive chat.",
  },
];

const steps = [
  "Upload your PDF",
  "Ask natural questions",
  "Get context-aware answers",
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#09090b] text-white">
      <header className="border-b border-zinc-800">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link href="/" className="text-xl font-semibold">
            Nexus
          </Link>

          <div className="hidden items-center gap-8 text-sm text-zinc-400 md:flex">
            <a href="#features" className="hover:text-white">
              Features
            </a>
            <a href="#how-it-works" className="hover:text-white">
              How it works
            </a>
            <Link href="/upgrade" className="hover:text-white">
              Pricing
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Button asChild variant="ghost" className="hidden md:inline-flex">
              <Link href="/login">Sign in</Link>
            </Button>

            <Button asChild>
              <Link href="/register">Get started</Link>
            </Button>
          </div>
        </nav>
      </header>

      <section className="mx-auto flex max-w-7xl flex-col items-center px-6 py-24 text-center">
        <div className="mb-6 rounded-full border border-zinc-800 bg-zinc-900 px-4 py-1.5 text-sm text-zinc-400">
          Built with RAG, PostgreSQL, pgvector, and AI SDK
        </div>

        <h1 className="max-w-4xl text-4xl font-semibold tracking-tight md:text-6xl">
          Turn PDFs into intelligent conversations
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-400">
          Nexus helps you upload documents, ask questions, and get context-aware
          answers powered by retrieval augmented generation.
        </p>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg">
            <Link href="/chat">
              Start chatting
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>

          <Button asChild size="lg" variant="outline">
            <Link href="/upgrade">View pricing</Link>
          </Button>
        </div>

        <div className="mt-16 w-full max-w-5xl overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 shadow-2xl">
          <div className="flex h-10 items-center gap-2 border-b border-zinc-800 px-4">
            <span className="h-3 w-3 rounded-full bg-zinc-700" />
            <span className="h-3 w-3 rounded-full bg-zinc-700" />
            <span className="h-3 w-3 rounded-full bg-zinc-700" />
          </div>

          <div className="grid min-h-90 md:grid-cols-[260px_1fr]">
            <aside className="hidden border-r border-zinc-800 bg-zinc-900/40 p-6 md:block">
              <div className="mb-8 h-8 w-32 rounded bg-zinc-800" />
              <div className="space-y-3">
                <div className="h-10 rounded-lg bg-zinc-800" />
                <div className="h-10 rounded-lg bg-zinc-800/60" />
                <div className="h-10 rounded-lg bg-zinc-800/60" />
              </div>
            </aside>

            <div className="flex flex-col justify-between p-6">
              <div className="space-y-6">
                <div className="max-w-xl rounded-xl border border-zinc-800 bg-zinc-900 p-4 text-left">
                  <div className="mb-3 h-4 w-40 rounded bg-zinc-700" />
                  <div className="h-3 w-full rounded bg-zinc-800" />
                </div>

                <div className="ml-auto max-w-xl rounded-xl border border-blue-500/40 bg-blue-500/10 p-4 text-left">
                  <div className="mb-3 h-4 w-52 rounded bg-blue-300/40" />
                  <div className="h-3 w-full rounded bg-blue-300/30" />
                </div>
              </div>

              <div className="mt-10 rounded-xl border border-zinc-800 bg-zinc-900 p-4 text-left text-sm text-zinc-400">
                Ask Nexus anything about your uploaded PDF...
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="mx-auto max-w-7xl px-6 py-20">
        <div className="text-center">
          <h2 className="text-3xl font-semibold">Powerful capabilities</h2>
          <p className="mt-3 text-zinc-400">
            Everything you need to interact with your documents.
          </p>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6"
            >
              <feature.icon className="mb-5 h-5 w-5 text-blue-400" />
              <h3 className="font-medium">{feature.title}</h3>
              <p className="mt-2 text-sm leading-6 text-zinc-400">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section id="how-it-works" className="mx-auto max-w-5xl px-6 py-20">
        <div className="text-center">
          <h2 className="text-3xl font-semibold">How it works</h2>
          <p className="mt-3 text-zinc-400">
            From document upload to grounded answers in seconds.
          </p>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {steps.map((step, index) => (
            <div
              key={step}
              className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6"
            >
              <div className="mb-5 flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-sm font-semibold text-white">
                {index + 1}
              </div>
              <h3 className="font-medium">{step}</h3>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-24 text-center">
        <h2 className="text-3xl font-semibold">
          Ready to chat with your documents?
        </h2>
        <p className="mt-3 text-zinc-400">
          Start using Nexus and turn static PDFs into useful conversations.
        </p>

        <Button asChild size="lg" className="mt-8">
          <Link href="/chat">Start chatting</Link>
        </Button>
      </section>

      <footer className="border-t border-zinc-800">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-8 text-sm text-zinc-500 md:flex-row md:items-center md:justify-between">
          <p className="font-medium text-zinc-300">Nexus</p>
          <p>© 2026 Nexus AI. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
