# Trellis — AI Customer Support SaaS

> A full-stack SaaS platform that lets organizations deploy an AI-powered support widget on any website — with real-time chat, voice calling, RAG-based answers, and a centralized dashboard for bot management.

🔗 **[Live Dashboard → trellis-web-kappa.vercel.app](https://trellis-web-kappa.vercel.app/)**

🤖 **[Live Widget Demo → trellis-widget.vercel.app](https://trellis-widget.vercel.app/?organizationId=org_3DZJSzB9zejhwvPo0VMSPu2Gnik)**

---

## 🚀 Try It Instantly — No Sign-Up Needed

### Dashboard
Visit the [live dashboard](https://trellis-web-kappa.vercel.app/) and sign up with any email — Clerk handles auth instantly.

### Widget Demo
The widget is already live on a test organization:

👉 **[Open Widget Demo](https://trellis-widget.vercel.app/?organizationId=org_3DZJSzB9zejhwvPo0VMSPu2Gnik)**

When the widget opens, enter any name and email — these are used only to track the support session, not as login credentials. The test org has Vapi enabled and a Pro plan active, so voice calling is available too.

---
## 💬 What Can You Ask the Demo Bot?
 
The test organization's knowledge base is loaded with 7 sample documents covering a fictional SaaS product. Here are things you can ask the chatbot (text or voice) right now:
 
**Account & Auth**
- _"How do I reset my password?"_
- _"Can I enable two-factor authentication?"_
- _"How do I change my email address?"_

**Pricing & Billing**
- _"What are your pricing plans?"_
- _"What's included in the Pro plan?"_
- _"How do I get an invoice?"_
- _"Is there an annual discount?"_

**API & Integrations**
- _"How do I authenticate with the API?"_
- _"What are the API rate limits?"_
- _"How do I get my API key?"_

**Getting Started**
- _"How do I create my first project?"_
- _"How do I invite team members?"_

**Troubleshooting**
- _"Why is my data not syncing?"_
- _"The app is running slow, what should I do?"_
> The bot searches these documents in real-time using RAG before every response — it won't guess or hallucinate beyond what's in the knowledge base. If it can't find an answer, it will offer to escalate to a human agent.
 
### 📞 Trying Voice Calling (Vapi)
 
The test org has Vapi enabled on the Pro plan. To try a voice call:
 
1. Open the [widget demo](https://trellis-widget.vercel.app/?organizationId=org_3DZJSzB9zejhwvPo0VMSPu2Gnik)
2. Enter any name and email to start a session
3. Look for the **phone / call icon** inside the widget
4. Click it to start a voice call — the Vapi assistant uses the same knowledge base files, so you can ask all the same questions by voice
---

## What is Trellis?

Trellis is a multi-tenant AI customer support platform. Organizations sign up, upload their knowledge base documents, and get an embeddable widget they can drop into any website with a single `<script>` tag. The AI agent answers questions by searching the knowledge base (RAG), escalates to a human when needed, and resolves conversations automatically.

Built as a portfolio project to showcase:
- Monorepo architecture with Turborepo and pnpm workspaces
- Real-time backend with Convex (no traditional REST API needed)
- RAG pipeline with AI tool calling (search, escalate, resolve)
- Embeddable widget built as a standalone Vite bundle
- Voice AI integration via Vapi
- Multi-tenant SaaS patterns with Clerk Organizations

---

## Features

- **AI Chat Widget** — Embeddable floating chat bubble deployable on any site via a `<script>` tag
- **RAG-Powered Answers** — AI searches uploaded knowledge base files before responding, grounded in org-specific content
- **Voice Calling** — Optional Vapi integration enables voice support calls directly from the widget
- **Conversation Management** — Dashboard shows all conversations per org, with status tracking (unresolved / escalated / resolved)
- **AI Tool Calling** — Agent autonomously calls `searchTool`, `escalateConversationTool`, and `resolveConversationTool` based on conversation context
- **File Management** — Upload and manage knowledge base documents (FAQs, pricing, docs, etc.)
- **Widget Customization** — Configure greeting message, quick-reply suggestions, Vapi assistant ID, and phone number from the dashboard
- **Billing & Plans** — Subscription management with plan-gating (voice calling requires Pro)
- **Multi-Tenant** — Each Clerk organization gets isolated data, settings, and widget configuration
- **Integrations** — Copy-paste embed snippet or React integration code directly from the dashboard

---

## Tech Stack

| Layer | Technology |
|---|---|
| Monorepo | [Turborepo](https://turbo.build/) + pnpm workspaces |
| Dashboard Framework | [Next.js 15](https://nextjs.org/) (App Router) |
| Widget | [Vite](https://vitejs.dev/) (vanilla TypeScript bundle) |
| Language | TypeScript |
| Backend / Realtime | [Convex](https://convex.dev/) (database, functions, real-time sync) |
| Auth & Orgs | [Clerk](https://clerk.com/) (multi-tenant organizations) |
| AI / LLM | Convex AI with tool calling + RAG vector search |
| Voice AI | [Vapi](https://vapi.ai/) |
| Styling | Tailwind CSS v4 |
| UI Components | shadcn/ui + Radix UI (shared `packages/ui`) |
| Deployment | Vercel (dashboard + widget as separate apps) |

---

## Monorepo Architecture

```
trellis/
├── apps/
│   ├── web/                    # Next.js dashboard (org management, conversations, settings)
│   └── embed/                  # Vite widget bundle (the embeddable chat bubble)
│
├── packages/
│   ├── backend/                # Convex backend (schema, functions, AI agent)
│   │   └── convex/
│   │       ├── schema.ts       # DB tables: conversations, contactSessions, secrets, plugins...
│   │       ├── public/         # Public-facing Convex functions (widget API)
│   │       └── system/
│   │           ├── ai/         # RAG pipeline, agent prompt, tool definitions
│   │           └── plugins.ts  # Vapi plugin integration
│   │
│   ├── ui/                     # Shared component library (shadcn/ui + custom AI components)
│   ├── eslint-config/          # Shared ESLint config
│   └── typescript-config/      # Shared tsconfig presets
│
├── turbo.json                  # Turborepo pipeline config
└── pnpm-workspace.yaml
```

### Dashboard modules (`apps/web/modules/`)

| Module | Responsibility |
|---|---|
| `auth` | Clerk auth guards, org selection |
| `dashboard` | Overview and navigation |
| `conversations` | Real-time conversation list and chat viewer |
| `files` | Knowledge base file upload and management |
| `customization` | Widget appearance and greeting settings |
| `plugins` | Vapi API key setup |
| `billing` | Subscription plans and payment |
| `integrations` | Embed snippet and React integration code |

---

## How the Widget Works

1. An organization copies the embed snippet from their dashboard
2. The snippet loads the Vite-bundled `embed.js` with a `data-organization-id` attribute
3. The script injects a floating chat button into the host page
4. On open, it renders an iframe pointing to the widget app, passing the org ID
5. The widget connects to Convex in real-time, creates a contact session, and opens a conversation thread
6. The AI agent processes messages — searching the knowledge base, answering, escalating, or resolving as needed

```html
<!-- Example embed snippet -->
<script
  src="https://trellis-widget.vercel.app/embed.js"
  data-organization-id="YOUR_ORG_ID"
  data-position="bottom-right"
  async
></script>
```

---

## Key Implementation Highlights

**Convex as the entire backend** — No separate Express/Hono server. All database reads, writes, real-time subscriptions, and AI function calls happen through Convex functions, drastically reducing infrastructure complexity.

**RAG with tool calling** — The support agent doesn't answer from its training data. It calls `searchTool` to query the org's knowledge base first, and only responds based on what it finds — keeping answers grounded and org-specific.

**Isolated widget bundle** — The widget is a separate Vite app that compiles to a self-contained JS bundle. It can be embedded on any HTML page, React app, or CMS without any build tooling on the host side.

**Multi-tenant secret management** — Vapi API keys are stored encrypted per organization in Convex, retrieved server-side only, never exposed to the widget client.

**Session-based contacts** — Widget visitors aren't required to have accounts. A lightweight `contactSession` (name + email) is created with a TTL, linking all messages in a conversation without requiring user registration.

---

## Running Locally

### Prerequisites

- Node.js 20+
- pnpm 10+
- A [Convex](https://convex.dev/) account
- A [Clerk](https://clerk.com/) account (with Organizations enabled)

### 1. Clone and install

```bash
git clone https://github.com/jai2826/trellis.git
cd trellis
pnpm install
```

### 2. Set up Convex

```bash
npx convex dev
```

This will prompt you to log in and link/create a Convex project. It auto-generates your `CONVEX_URL`.

### 3. Set up Clerk

1. Create a Clerk application and enable **Organizations**
2. Add `http://localhost:3000` to allowed origins
3. Copy your publishable and secret keys

### 4. Configure environment variables

Create `apps/web/.env.local`:

```env
NEXT_PUBLIC_CONVEX_URL=your_convex_deployment_url
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
```

Create `apps/embed/.env.local`:

```env
VITE_CONVEX_URL=your_convex_deployment_url
VITE_WEB_URL=http://localhost:3000
```

### 5. Start the dev server

```bash
pnpm dev
```

This runs both `apps/web` (dashboard) and `apps/embed` (widget) in parallel via Turborepo.

---

## Author

Built by **Jai Lakhmani** · [LinkedIn](https://www.linkedin.com/in/jai-lakhmani/) · [GitHub](https://github.com/jai2826)

> 📬 jailakhmani12345@gmail.com