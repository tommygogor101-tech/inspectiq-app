# InspectIQ — Complete Product Specification
**Version:** 1.0 (MVP)
**Owner:** Tommy Damir
**Last Updated:** April 2026

---

## OVERVIEW

InspectIQ is an AI-powered building inspection report platform for Australian inspectors. Subscription SaaS — inspectors pay monthly, get a mobile + web app that writes reports for them using AI photo/video analysis and voice input.

**Core promise:** *"Finish your report before you leave the job site."*

**Pricing:**
- Solo: $89/month
- Small Team (2-5): $179/month
- Company (6-20): $299/month
- Enterprise (20+): Custom / $799+/month

**Competitors:** Spectora ($99/mo, US-focused, no AU standards), Formitize ($80/mo, no AI, generic)

---

## TECH STACK

- **Frontend:** Next.js 14 (React) — web app + PWA for mobile
- **Mobile:** React Native (iOS + Android) — Phase 2
- **Backend:** Next.js API routes + Supabase (Postgres + Auth + Storage)
- **AI:** Claude claude-sonnet-4-6 Vision (photo analysis) + Whisper (voice transcription)
- **Payments:** Stripe (subscriptions + per-job client payments)
- **PDF:** React-PDF or Puppeteer
- **Email:** Resend
- **Hosting:** Vercel

---

## FEATURES — MVP (v1.0)

### 1. Authentication & Onboarding
- Sign up with email or Google
- On signup: select state (NSW/VIC/QLD/WA/SA/TAS/ACT/NT)
- Enter licence number, company name, logo upload
- Choose plan (solo/team/company)
- Stripe billing setup

### 2. Dashboard
- Upcoming jobs (today, this week)
- Recent reports (status: draft / pending payment / delivered)
- Quick stats: jobs this month, revenue, avg report time
- Quick actions: New Job, New Report

### 3. Scheduling
- Create job: property address, client name/email/phone, inspection type, date/time, fee
- Inspection types: Pre-purchase (Building + Pest), Building Only, Pest Only, Stage Inspection, Dilapidation Report
- Online booking page (shareable link — agents/clients can self-book)
- Google Calendar sync
- Automated confirmations + reminders (SMS via Twilio, email via Resend)
- Multi-inspector calendar view (team plans)

### 4. Client Agreement System
- Default agreement template (AS4349 compliant, state-specific clauses auto-inserted)
- Inspector can customise: company name, cancellation policy, liability cap, add clauses
- Multiple templates (pre-purchase vs stage vs dilapidation)
- Client gets link to sign digitally before inspection
- Signed PDF auto-attached to job
- Inspection can't proceed until signed

### 5. In-Field Report Writing (THE CORE)

#### Photo/Video AI
- Upload photos from phone camera roll or take in-app
- Each photo: AI analyses and returns:
  - Defect type detected
  - Severity (Minor / Major / Safety Hazard)
  - Suggested report description
  - Relevant AS4349/NCC/BCA code
  - Recommended action
- Inspector can accept, edit, or reject AI suggestion
- Photos auto-tagged with timestamp + GPS location
- Videos: AI extracts key frames + generates observations

#### Voice-to-Report
- Press and hold mic button, speak observations
- AI transcribes + categorises into correct report section
- e.g. "cracked tile in ensuite bathroom, water damage visible" → goes to Section D7 Bathrooms, Major Defect

#### AI Assistant (On-Site Chat)
- Chat interface while inspecting
- Ask: "What AS4349 code applies to a failing retaining wall?"
- Ask: "I found active termites — what do I need to include in the report?"
- AI proactively flags: "You haven't added anything for the roof space yet"

#### Report Sections (AS4349 compliant)
Built-in template structure for each report type:

**Pre-Purchase Standard (Building + Pest):**
- Cover page
- Terms, scope, definitions
- Property details (auto-filled from booking)
- Accessibility & obstructions
- Section D: Property Report (safety hazards, major defects by area, minor defects)
- Section E: Timber Pest Report (termites, fungal decay, moisture, conducive conditions)
- Section F: Conclusion
- Section G: Important notes
- Section H: Additional recommendations
- Section I: Photo annexures
- Section J: Certification (auto-filled with inspector licence + signature)

**Stage Inspection:**
- Frame / Lock-up / Fixing / Practical Completion checklists
- Compliance against approved plans
- Certificate of compliance output

**Dilapidation Report:**
- Pre-construction condition survey
- Post-construction comparison (AI compares before/after photos)
- Multi-party delivery (builder + owner + council)

### 6. Report Editing & Finalisation
- Full report preview (WYSIWYG)
- Real-time AI editing: type instruction → AI rewrites section
- Inspector reviews all AI-generated content before finalising
- Mark report as complete → triggers payment request

### 7. Payments (Report Lock)
- Client receives email/SMS with payment link
- Report is locked until payment received
- Stripe checkout (card, Apple Pay, Google Pay)
- Once paid: report unlocks, client downloads PDF
- Invoice auto-generated + attached
- Payment recorded in dashboard

### 8. PDF Generation
- Professional branded PDF
- Company logo + colours
- Inspector name, licence number, signature
- All photos embedded with location/timestamp
- AS4349 compliant format
- State-specific legal disclaimers

### 9. Client Portal
- Single link (no login required)
- Client sees: appointment details, agreement, invoice, report (locked until paid)
- Pay here, download here
- Mobile-friendly

### 10. Invoicing
- Auto-generated from job details
- Customisable line items (add-ons: granny flat, pool, pest only, etc.)
- GST included
- Xero integration (sync invoices)
- Overdue reminders

### 11. Team & Company Management
- Invite inspectors (full-time or subcontractor)
- Role-based permissions:
  - Company Admin: everything
  - Full-time Inspector: own jobs + reports
  - Subcontractor: own jobs only
  - Office Staff: scheduling + invoicing only
- Hierarchy: Company → Regional Admin → Team Leader → Inspector
- QA review workflow (admin reviews report before it goes to client)
- Company-wide branding on all reports

### 12. Australian Standards Engine
- State selected on signup → correct standards loaded
- All 8 states/territories covered
- Standards database:
  - AS4349.0, AS4349.1, AS4349.3
  - NCC 2022 + 2025
  - BCA (embedded in NCC)
  - AS3660 (termite management)
  - AS1926 (pool barriers)
  - State-specific building acts + registration requirements
- AI references correct standard for each defect automatically

---

## FUTURE FEATURES (Post-MVP)

- Native iOS + Android apps
- Xero real-time sync
- Offline mode with auto-sync
- Repair Request Builder (for real estate agents)
- Inspector marketplace (clients find inspectors)
- Other industries (pool safety, fire safety, food safety)
- White-label for large companies
- API for third-party integrations
- Review collection (automated post-inspection requests)
- Business analytics dashboard

---

## DATABASE SCHEMA (Key Tables)

- users (id, email, name, licence_no, state, company_id, role)
- companies (id, name, logo, plan, stripe_customer_id)
- jobs (id, company_id, inspector_id, client_name, client_email, address, type, date, fee, status)
- reports (id, job_id, status, data_json, pdf_url)
- photos (id, report_id, url, ai_analysis, location, timestamp)
- agreements (id, job_id, template_id, signed_at, signature_url)
- invoices (id, job_id, amount, status, stripe_payment_intent)
- subscriptions (id, company_id, plan, stripe_subscription_id, status)

---

## MVP BUILD ORDER

1. Project setup (Next.js + Supabase + Tailwind)
2. Auth (email + Google, onboarding flow)
3. Dashboard skeleton
4. Job creation + scheduling
5. Report template engine (AS4349 structure)
6. Photo upload + AI analysis
7. Voice-to-report
8. Report editor + AI editing
9. PDF generation
10. Client portal + Stripe payment
11. Agreement system
12. Team management
13. Invoicing + Xero

---
