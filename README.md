# InspectIQ — AI-Powered Building Inspection Software

Australian building inspection report platform with AI photo analysis, voice-to-report, AS4349 compliance, and subscription billing.

**Core promise:** *"Finish your report before you leave the job site."*

## Features (v1.0 MVP)

- 📸 **AI Photo Analysis** — Upload photos, AI identifies defects, severity, AS code, recommendation
- 🎤 **Voice-to-Report** — Speak observations, AI fills the right report section
- 🤖 **On-site AI Assistant** — Chat with AI about NCC/BCA/AS4349 standards
- 📋 **AS4349 Compliant Reports** — All 8 report types, all 8 Australian states
- 💳 **Report Lock + Payments** — Stripe-powered, report unlocks after client pays
- 📅 **Scheduling** — Online booking, Google Calendar sync, automated reminders
- 📄 **Client Agreements** — Digital signing, state-specific legal text
- 👥 **Team Management** — Admin, inspector, subcontractor roles
- 💰 **Invoicing** — Auto-generated, GST included, Xero integration

## Pricing

| Plan | Price | Inspectors |
|------|-------|------------|
| Solo | $89/mo | 1 |
| Small Team | $179/mo | 2-5 |
| Company | $299/mo | 6-20 |
| Enterprise | $799/mo | 20+ |

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database:** Supabase (PostgreSQL + Auth + Storage)
- **Payments:** Stripe
- **AI:** Anthropic Claude (photo analysis + assistant)
- **Voice:** OpenAI Whisper (transcription)
- **PDF:** @react-pdf/renderer
- **Email:** Resend
- **Hosting:** Vercel

## Getting Started

### 1. Clone and install

```bash
git clone <repo>
cd inspectiq-app
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env.local
```

Fill in:
- Supabase project URL + keys (create at supabase.com)
- Stripe keys (create at stripe.com)
- Anthropic API key (for photo AI)

### 3. Set up Supabase

Create a new Supabase project, then run the migration:

```bash
# Using Supabase CLI
supabase db push supabase/migrations/001_initial_schema.sql
```

Or paste the SQL directly in the Supabase dashboard SQL editor.

### 4. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Routes

| Route | Description |
|-------|-------------|
| `/` | Marketing homepage |
| `/auth/signup` | 3-step signup (account → business → plan) |
| `/auth/login` | Login page |
| `/dashboard` | Main dashboard |
| `/jobs` | Job list |
| `/jobs/new` | Create new job |
| `/jobs/[id]` | Job detail |
| `/reports/[id]` | Report writing (AI-powered) |
| `/portal/[jobId]` | Client portal (pay + download) |

## Report Types

- Pre-Purchase Standard (Building + Pest) — AS4349.1 + AS4349.3
- Building Inspection Only — AS4349.1
- Timber Pest Only — AS4349.3
- Stage Inspection (Frame/Lock-up/Fixing/PC)
- Dilapidation Report

## Australian Standards Covered

- AS4349.0, AS4349.1, AS4349.3
- NCC 2022 + 2025 / BCA
- AS3660 (Termite management)
- AS1926 (Pool barriers)
- State-specific acts for all 8 states/territories

## Deployment (Vercel)

```bash
npm run build
vercel deploy
```

Add environment variables in Vercel dashboard.

---

Built by Tommy Damir · Inspectify Building Inspections
