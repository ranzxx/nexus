# Nexus

An AI-powered chatbot platform that lets you upload PDF documents and chat with your data using Retrieval-Augmented Generation (RAG) — built as a production-grade SaaS with authentication, subscriptions, and testing.

![CI](https://github.com/ranzxx/nexus/actions/workflows/ci.yml/badge.svg)

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-pgvector-4169E1?style=flat-square&logo=postgresql&logoColor=white)](https://www.postgresql.org)
[![Groq](https://img.shields.io/badge/Groq-LLM-F55036?style=flat-square)](https://groq.com)
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
Next.js App
 ↓
Cohere Embeddings
 ↓
PostgreSQL + pgvector
 ↓
Relevant Context
 ↓
Groq LLM
 ↓
Response
```

---

## Highlights

- Built a complete RAG pipeline from scratch
- Implemented semantic search using pgvector
- Integrated subscription billing with Stripe
- Added CI/CD and automated testing with Playwright + Vitest
- Deployed production-ready SaaS on Vercel

---

## Features

- AI chat powered by Groq LLMs (llama-3.1-8b for Free, llama-3.3-70b for Pro)
- PDF upload and processing with text extraction
- Retrieval-Augmented Generation (RAG) — chat with your documents
- Semantic search using Cohere embeddings + pgvector
- Conversation history with rename and delete
- Authentication with Better Auth
- Stripe subscription (Free and Pro plans)
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
| Styling | Tailwind CSS + shadcn/ui |
| Database | PostgreSQL + pgvector (Docker locally, Neon in production) |
| ORM | Drizzle ORM |
| Auth | Better Auth |
| AI | Groq + Vercel AI SDK v6 |
| Embeddings | Cohere |
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
GROQ_API_KEY=
COHERE_API_KEY=

# File Storage
UPLOADTHING_TOKEN=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRO_PRICE_ID=

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

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## RAG Architecture

```
PDF Upload
     │
     ▼
Text Extraction (unpdf)
     │
     ▼
Chunking (500 words/chunk)
     │
     ▼
Cohere Embeddings (embed-english-v3.0)
     │
     ▼
Store in PostgreSQL + pgvector
     │
     ▼
User sends question
     │
     ▼
Embed question with Cohere
     │
     ▼
Vector similarity search (<=> operator)
     │
     ▼
Top 5 relevant chunks → Groq LLM
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
| AI Model | llama-3.1-8b | llama-3.3-70b |
| Price | $0 | $9/month |

---

## Challenges Solved

- Implemented vector similarity search with pgvector
- Built document ingestion and chunking pipeline
- Solved PDF extraction issues in serverless environments
- Managed conversation persistence and streaming responses
- Integrated authentication and subscription management

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
├── (app)/          → authenticated app (chat, settings, upgrade)
├── (marketing)/    → landing page
├── (auth)/         → login, register
└── api/            → chat, webhook, uploadthing routes

components/
├── chat/           → ChatInterface, ChatMessage, FileUpload
├── dashboard/      → AppSidebar, ConversationItem, NavUser
└── marketing/      → Navbar, ThemeToggle

actions/            → Server Actions (conversation, document, stripe)
db/                 → Drizzle schema and client
lib/                → auth, stripe, rag, uploadthing
__tests__/          → Vitest unit tests
e2e/                → Playwright E2E tests
```

---

## License

MIT