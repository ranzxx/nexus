# Nexus

An AI-powered chatbot platform that lets you upload PDF documents and chat with your data using Retrieval-Augmented Generation (RAG) — built as a production-grade SaaS with type-safe APIs, async job processing, and full observability.

![CI](https://github.com/ranzxx/nexus/actions/workflows/ci.yml/badge.svg)

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![tRPC](https://img.shields.io/badge/tRPC-v11-2596BE?style=flat-square&logo=trpc&logoColor=white)](https://trpc.io)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-pgvector-4169E1?style=flat-square&logo=postgresql&logoColor=white)](https://www.postgresql.org)
[![Inngest](https://img.shields.io/badge/Inngest-Background%20Jobs-5D5FEF?style=flat-square)](https://inngest.com)
[![Sentry](https://img.shields.io/badge/Sentry-Error%20Tracking-362D59?style=flat-square&logo=sentry&logoColor=white)](https://sentry.io)
[![Stripe](https://img.shields.io/badge/Stripe-Subscriptions-635BFF?style=flat-square&logo=stripe&logoColor=white)](https://stripe.com)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=flat-square&logo=docker&logoColor=white)](https://www.docker.com)
[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=flat-square&logo=vercel)](https://vercel.com)

🔗 **Live Demo**: [chatwithnexus.vercel.app](https://chatwithnexus.vercel.app)

---

## Screenshots

| Chat Interface | Pricing Page |
|---|---|
| ![Chat Interface](./public/screenshots/chat.avif) | ![Pricing Page](./public/screenshots/pricing.avif) |

---

## Architecture

```
User
↓
Next.js App (tRPC — type-safe API layer)
↓
Document Upload → Inngest (async background job)
↓ ↓
Cohere Embeddings PDF Extraction + Chunking
↓ ↓
PostgreSQL + pgvector (HNSW index)
↓
Relevant Context
↓
OpenRouter LLM (with automatic model fallback)
↓
Streamed Response

Errors & Logs → Sentry + Pino (structured logging)
```


---

## Highlights

- Built a complete RAG pipeline from scratch, migrated to a type-safe tRPC API layer
- Implemented semantic search using pgvector with HNSW indexing for fast retrieval
- Offloaded PDF parsing and embedding generation to async background jobs (Inngest) to avoid serverless timeouts
- Integrated production observability: error tracking (Sentry) and structured logging (Pino)
- Multi-model LLM fallback via OpenRouter — automatically retries with backup models if the primary is rate-limited
- Integrated subscription billing with Stripe
- Added CI/CD and automated testing with Playwright + Vitest
- Deployed production-ready SaaS on Vercel

---

## Features

- Type-safe API layer built with tRPC v11
- AI chat powered by OpenRouter (multi-model routing with automatic fallback)
- PDF upload and processing with async text extraction (Inngest background jobs)
- Retrieval-Augmented Generation (RAG) — chat with your documents
- Semantic search using Cohere embeddings + pgvector (HNSW indexed)
- Conversation history with rename and delete
- Authentication with Better Auth
- Stripe subscription (Free and Pro plans)
- Rate limiting per user plan (Upstash Redis)
- Production error tracking (Sentry) and structured logging (Pino)
- Docker support for local development
- Unit tests with Vitest
- End-to-end tests with Playwright
- CI/CD with GitHub Actions

---

## Tech Stack

| Category | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| API Layer | tRPC v11 |
| Styling | Tailwind CSS + shadcn/ui |
| Database | PostgreSQL + pgvector (Docker locally, Neon in production) |
| ORM | Drizzle ORM |
| Auth | Better Auth |
| AI | OpenRouter (multi-model fallback) + Vercel AI SDK v6 |
| Embeddings | Cohere |
| Background Jobs | Inngest |
| Rate Limiting | Upstash Redis |
| Error Tracking | Sentry |
| Logging | Pino |
| File Storage | Uploadthing |
| Payments | Stripe |
| Infrastructure | Docker + Docker Compose |
| Testing | Vitest + Playwright |
| Deployment | Vercel |

---

## Getting Started

### Prerequisites

- Node.js 20+
- Docker (for local PostgreSQL + pgvector)

### 1. Clone the repository

```bash
git clone https://github.com/ranzxx/nexus.git
cd nexus
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

```bash
cp .env.example .env.local
```

Fill in your `.env.local`:

```env
# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/nexus_dev

# Auth
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=http://localhost:3000

# AI
OPENROUTER_API_KEY=
COHERE_API_KEY=

# File Storage
UPLOADTHING_TOKEN=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRO_PRICE_ID=

# Sentry
NEXT_PUBLIC_SENTRY_DSN=
SENTRY_DSN=
SENTRY_AUTH_TOKEN=

# Upstash Redis (rate limiting)
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

# Inngest 
INNGEST_EVENT_KEY=
INNGEST_SIGNING_KEY=

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Start PostgreSQL with pgvector

```bash
docker compose up -d
```

### 5. Enable pgvector extension

```bash
docker compose exec postgres psql -U postgres -d nexus_dev -c "CREATE EXTENSION IF NOT EXISTS vector;"
```

### 6. Push database schema

```bash
npm run db:push
```

### 7. Run the development server

Nexus uses Inngest for async document processing, so local development requires two processes running side by side:

```bash
# Terminal 1
npm run dev

# Terminal 2
npx inngest-cli@latest dev
```

Open [http://localhost:3000](http://localhost:3000). Inngest's local dashboard is available at [http://localhost:8288](http://localhost:8288).

---

## RAG Architecture

```
PDF Upload
│
▼
tRPC mutation → insert document record → trigger Inngest event
│
▼
Inngest background job:
│
├─ Text Extraction (unpdf)
├─ Chunking (500 words/chunk)
├─ Cohere Embeddings (embed-english-v3.0)
└─ Store in PostgreSQL + pgvector (HNSW index)
│
▼
User sends question
│
▼
Embed question with Cohere
│
▼
Vector similarity search (<=> operator, HNSW indexed)
│
▼
Top 5 relevant chunks → OpenRouter LLM (with fallback models)
│
▼
Streamed response
```


---

## Pricing

| Feature | Free | Pro |
|---|---|---|
| Document uploads | 5/day | Unlimited |
| Conversations | 10 max | Unlimited |
| RAG document chat | ✓ | ✓ |
| Price | $0 | $9/month |

---

## Challenges Solved

- Implemented vector similarity search with pgvector, tuned with HNSW indexing for faster retrieval
- Migrated manual REST-style API routes to a type-safe tRPC API layer
- Offloaded PDF parsing and embedding generation to async background jobs (Inngest) to avoid serverless function timeouts on large files
- Built automatic LLM fallback across multiple models to handle upstream rate limits gracefully
- Solved PDF extraction issues in serverless environments
- Managed conversation persistence and streaming responses
- Integrated authentication and subscription management
- Added production observability (Sentry error tracking + Pino structured logging)

---

## Testing

```bash
# Unit tests
npm run test

# Unit tests watch mode
npm run test:ui

# E2E tests (requires dev server running)
npm run test:e2e

# E2E tests with UI
npm run test:e2e:ui
```

---

## Docker

```bash
# Start PostgreSQL for development
docker compose up -d

# Build production image
docker build -t nexus .

# Run production container
docker run -p 3000:3000 --env-file .env.local nexus
```

---

## Project Structure

```
app/
├── (app)/ → authenticated app (chat, settings, upgrade)
├── (marketing)/ → landing page
├── (auth)/ → login, register
└── api/ → chat, inngest, webhook, uploadthing routes

trpc/
├── init.ts → tRPC context, middleware, error handling
├── routers/ → document router (chat stays as a Route Handler for SSE streaming)
├── client.tsx → client-side provider
└── server.tsx → server-side caller

inngest/
├── client.ts → Inngest client
└── functions/ → background job definitions (document processing)

components/
├── chat/ → ChatInterface, ChatMessage, FileUpload
├── dashboard/ → AppSidebar, ConversationItem, NavUser
└── marketing/ → Navbar, ThemeToggle

db/ → Drizzle schema and client
lib/ → auth, stripe, rag, uploadthing, logger
tests/ → Vitest unit tests
e2e/ → Playwright E2E tests
```

---

## License

MIT