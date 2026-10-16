import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/marketing/navbar";

// ─── Data ────────────────────────────────────────────────────────────────────

const features = [
  {
    index: "01",
    title: "PDF Upload",
    description:
      "Upload PDFs up to 10 MB. Text is extracted and processed in the background.",
  },
  {
    index: "02",
    title: "Semantic Retrieval",
    description:
      "Embeddings and pgvector find the passages most relevant to your question.",
  },
  {
    index: "03",
    title: "Chat With Your Documents",
    description:
      "Answers are generated from the retrieved passages. Conversations are saved.",
  },
  {
    index: "04",
    title: "Multiple Documents per Chat",
    description:
      "Attach several PDFs to one conversation and ask across all of them.",
  },
];

const pipeline = [
  {
    index: "01",
    title: "Ingestion",
    description: "Upload a PDF; processing runs in the background.",
    tag: "INGEST ASYNC",
  },
  {
    index: "02",
    title: "Indexing",
    description: "Text is split into 500-word chunks and embedded.",
    tag: "500 WORDS/CHUNK",
  },
  {
    index: "03",
    title: "Retrieval",
    description: "Your question is matched against stored chunks with pgvector (top 5).",
    tag: "PGVECTOR TOP-5",
  },
  {
    index: "04",
    title: "Generation",
    description: "An LLM via OpenRouter answers using the retrieved context.",
    tag: "OPENROUTER LLM",
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#0A0A0A] text-[#E5E2E1]">
      <Navbar />

      {/* ── Hero ── */}
      <section
        id="hero"
        className="relative w-full border-b border-[#27272A] overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-8 py-24 md:py-32 flex flex-col items-start gap-6">
          {/* eyebrow */}
          <div className="flex items-center gap-2 border border-[#27272A] px-4 py-1 bg-[#121212]">
            <span className="font-mono text-[11px] tracking-widest text-[#FAFAFA] uppercase">
              RAG-Powered PDF Q&amp;A
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-semibold tracking-tight text-[#FAFAFA] max-w-5xl leading-none">
            Turn static PDFs into intelligent conversations.
          </h1>

          <p className="text-lg text-[#A1A1AA] max-w-2xl leading-relaxed">
            Upload PDFs, ask questions in plain language, and get answers
            grounded in your documents.
          </p>

          <div className="flex flex-wrap items-center gap-4 mt-2">
            <Link
              href="/register"
              className="bg-[#EDEDED] text-[#141313] font-mono text-xs px-10 py-4 uppercase tracking-widest hover:bg-white transition-colors"
            >
              Get started
            </Link>
            <Link
              href="/upgrade"
              className="text-[#A1A1AA] hover:text-[#FAFAFA] font-mono text-xs px-4 py-4 uppercase tracking-widest transition-colors"
            >
              View pricing →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Hero Visual Split-Pane ── */}
      <section className="w-full border-b border-[#27272A] bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 border border-[#27272A] bg-[#121212]">

            {/* Left — Document pane */}
            <div className="p-8 border-b lg:border-b-0 lg:border-r border-[#27272A] flex flex-col justify-between">
              {/* Tab bar */}
              <div className="flex items-center justify-between pb-4 border-b border-[#27272A] mb-4">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[11px] text-white bg-[#1C1B1B] border border-[#27272A] px-2.5 py-1 flex items-center gap-1.5 tracking-wider">
                    <span className="w-1.5 h-1.5 bg-white inline-block" />
                    report.pdf
                  </span>
                  <span className="font-mono text-[11px] text-[#A1A1AA] border border-transparent px-2.5 py-1 hover:border-[#27272A] transition-colors tracking-wider cursor-pointer">
                    research.pdf
                  </span>
                </div>
                <span className="font-mono text-[11px] text-[#A1A1AA] tracking-widest">[DOCS]</span>
              </div>

              {/* Content */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-[#FAFAFA]">
                  Document Ingestion &amp; Processing
                </h3>
                <p className="text-[#A1A1AA] leading-relaxed text-sm">
                  Uploaded documents are split into manageable 500-word
                  passages. Text passages are indexed to enable retrieval
                  across the files in this conversation.
                </p>
                <div className="text-[#FAFAFA] bg-[#1C1B1B] p-4 border border-[#27272A]">
                  <span className="font-mono text-[10px] text-[#A1A1AA] uppercase block mb-2 tracking-widest">
                    [UP TO 500 WORDS]
                  </span>
                  <p className="font-[family-name:var(--font-newsreader)] text-sm text-[#FAFAFA] leading-relaxed italic">
                    &ldquo;Text passages are indexed to enable retrieval across
                    the files in this conversation.&rdquo;
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="pt-4 border-t border-[#27272A] flex items-center justify-between text-[#A1A1AA] font-mono text-[10px] tracking-widest mt-6">
                <span className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-[#EDEDED] inline-block" />
                  EMBEDDED · COHERE V3
                </span>
                <span className="text-[#FAFAFA]">INDEXED</span>
              </div>
            </div>

            {/* Right — Chat pane */}
            <div className="p-8 flex flex-col justify-between bg-[#0A0A0A]">
              <div className="flex items-center justify-between pb-4 border-b border-[#27272A] mb-6">
                <span className="font-mono text-[11px] text-[#A1A1AA] uppercase tracking-widest">
                  [CONVERSATION]
                </span>
              </div>

              <div className="space-y-6 py-4 flex-1">
                <div className="border border-[#27272A] p-4 bg-[#121212]">
                  <span className="font-mono text-[10px] text-[#A1A1AA] uppercase block mb-1 tracking-widest">
                    USER QUERY
                  </span>
                  <p className="text-sm text-[#FAFAFA]">
                    How are uploaded documents handled for search?
                  </p>
                </div>
                <div className="border border-[#27272A] p-4 bg-[#1C1B1B]">
                  <span className="font-mono text-[10px] text-[#A1A1AA] uppercase block mb-1 tracking-widest">
                    NEXUS AI
                  </span>
                  <p className="text-sm text-[#FAFAFA] leading-relaxed">
                    Uploaded files are divided into 500-word passages and
                    indexed so you can ask questions across your documents.
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-[#27272A]">
                <div className="border border-[#27272A] p-3 bg-[#121212] flex items-center justify-between text-[#A1A1AA]">
                  <span className="font-mono text-[11px] tracking-wider">
                    Ask a follow-up question...
                  </span>
                  <span className="text-[#FAFAFA] bg-[#27272A] px-2 py-1 font-mono text-[10px] uppercase tracking-widest">
                    ENTER
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section
        id="features"
        className="w-full border-b border-[#27272A] bg-[#0A0A0A] py-16"
      >
        <div className="max-w-7xl mx-auto px-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 pb-6 border-b border-[#27272A]">
            <div>
              <span className="font-mono text-[11px] text-[#A1A1AA] uppercase block mb-2 tracking-widest">
                [CAPABILITIES]
              </span>
              <h2 className="text-3xl font-semibold text-[#FAFAFA]">
                Everything you need to ask questions about your PDFs.
              </h2>
            </div>
          </div>

          {/* Feature rows */}
          <div className="border-t border-[#27272A]">
            {features.map((f) => (
              <div
                key={f.index}
                className="grid grid-cols-1 md:grid-cols-12 py-8 border-b border-[#27272A] items-center hover:bg-[#121212] transition-colors px-4"
              >
                <div className="md:col-span-2 font-mono text-[11px] text-[#A1A1AA] tracking-widest mb-2 md:mb-0">
                  [{f.index}]
                </div>
                <div className="md:col-span-4 text-[#FAFAFA] font-medium text-[18px] leading-6 mb-1 md:mb-0">
                  {f.title}
                </div>
                <div className="md:col-span-5 text-sm text-[#A1A1AA] leading-relaxed">
                  {f.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Technical Pipeline ── */}
      <section
        id="how-it-works"
        className="w-full border-b border-[#27272A] bg-[#0A0A0A] py-24"
      >
        <div className="max-w-7xl mx-auto px-8">
          <div className="mb-16 pb-6 border-b border-[#27272A]">
            <span className="font-mono text-[11px] text-[#A1A1AA] uppercase block mb-2 tracking-widest">
              [ARCHITECTURE]
            </span>
            <h2 className="text-3xl font-semibold text-[#FAFAFA]">
              The Technical Pipeline
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 border border-[#27272A] bg-[#121212]">
            {pipeline.map((step, i) => (
              <div
                key={step.index}
                className={`p-8 flex flex-col justify-between ${
                  i < pipeline.length - 1
                    ? "border-b md:border-b-0 md:border-r border-[#27272A]"
                    : ""
                }`}
              >
                <div>
                  <div className="font-mono text-[11px] text-[#A1A1AA] mb-4 tracking-widest">
                    [{step.index}]
                  </div>
                  <h3 className="text-[18px] font-semibold text-[#FAFAFA] mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-[#A1A1AA] leading-relaxed">
                    {step.description}
                  </p>
                </div>
                <div className="mt-8 pt-4 border-t border-[#27272A] font-mono text-[11px] text-[#FAFAFA] uppercase tracking-widest">
                  {step.tag}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section
        id="pricing"
        className="w-full border-b border-[#27272A] bg-[#0A0A0A] py-24"
      >
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="font-mono text-[11px] text-[#A1A1AA] uppercase block mb-2 tracking-widest">
              [TRANSPARENT PRICING]
            </span>
            <h2 className="text-3xl font-semibold text-[#FAFAFA]">
              Simple, honest pricing.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 border border-[#27272A] max-w-4xl mx-auto bg-[#121212]">
            {/* Free */}
            <div className="p-10 border-b md:border-b-0 md:border-r border-[#27272A] flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-6">
                  <span className="text-[18px] font-semibold text-[#FAFAFA]">
                    Free
                  </span>
                  <span className="font-mono text-[11px] text-[#A1A1AA] tracking-widest">
                    [TIER_01]
                  </span>
                </div>
                <div className="mb-8">
                  <span className="text-4xl font-semibold text-[#FAFAFA]">
                    $0
                  </span>
                  <span className="text-[#A1A1AA] text-sm ml-1">/month</span>
                </div>
                <ul className="space-y-4 text-sm text-[#A1A1AA] mb-8">
                  <li className="flex items-center gap-2">
                    <span className="text-[#FAFAFA] font-mono text-[11px]">[+]</span>
                    5 document uploads / day
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-[#FAFAFA] font-mono text-[11px]">[+]</span>
                    10 conversations
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-[#FAFAFA] font-mono text-[11px]">[+]</span>
                    RAG document chat
                  </li>
                </ul>
              </div>
              <Link
                href="/register"
                className="w-full border border-[#27272A] text-[#FAFAFA] hover:bg-[#27272A] font-mono text-[11px] py-3 text-center uppercase tracking-widest transition-colors block"
              >
                Get started free
              </Link>
            </div>

            {/* Pro */}
            <div className="p-10 flex flex-col justify-between bg-[#141313]">
              <div>
                <div className="flex justify-between items-center mb-6">
                  <span className="text-[18px] font-semibold text-[#FAFAFA]">
                    Pro
                  </span>
                  <span className="font-mono text-[11px] text-[#A1A1AA] tracking-widest">
                    [TIER_02]
                  </span>
                </div>
                <div className="mb-8">
                  <span className="text-4xl font-semibold text-[#FAFAFA]">
                    $9
                  </span>
                  <span className="text-[#A1A1AA] text-sm ml-1">/month</span>
                </div>
                <ul className="space-y-4 text-sm text-[#A1A1AA] mb-8">
                  <li className="flex items-center gap-2">
                    <span className="text-[#FAFAFA] font-mono text-[11px]">[+]</span>
                    Unlimited document uploads
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-[#FAFAFA] font-mono text-[11px]">[+]</span>
                    Unlimited conversations
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-[#FAFAFA] font-mono text-[11px]">[+]</span>
                    Larger AI model
                  </li>
                </ul>
              </div>
              <Link
                href="/upgrade"
                className="w-full bg-[#EDEDED] text-[#141313] hover:bg-white font-mono text-[11px] py-3 text-center uppercase tracking-widest transition-colors block"
              >
                Upgrade to Pro
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="w-full bg-[#0A0A0A] py-24 text-center">
        <div className="max-w-4xl mx-auto px-8 flex flex-col items-center gap-6">
          <span className="font-mono text-[11px] text-[#A1A1AA] uppercase tracking-widest">
            [INITIALIZE SESSION]
          </span>
          <h2 className="text-4xl md:text-5xl font-semibold text-[#FAFAFA] tracking-tight">
            Ready to chat with your documents?
          </h2>
          <p className="text-lg text-[#A1A1AA] max-w-xl leading-relaxed">
            Upload a PDF and start asking questions.
          </p>
          <div className="mt-4">
            <Link
              href="/register"
              className="bg-[#EDEDED] text-[#141313] font-mono text-xs px-10 py-4 uppercase tracking-widest hover:bg-white transition-colors inline-block"
            >
              Get started
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="w-full bg-[#0E0E0E] border-t border-[#27272A] py-10">
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Image
              src="/logo/nexus.svg"
              alt="Nexus"
              width={16}
              height={16}
            />
            <span className="font-semibold text-sm text-[#FAFAFA] tracking-tight">
              NEXUS
            </span>
          </div>
          <p className="text-sm text-[#A1A1AA]">
            © 2026 Nexus AI. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}
