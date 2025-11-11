# Technology Decisions

## Frontend
- **Framework:** Next.js 16 with App Router, Server Actions, Cache Components.
- **Language:** TypeScript (strict mode).
- **Styling:** Tailwind CSS + shadcn/ui component library; custom theme tokens for premium aesthetic.
- **State/Data:** TanStack Query for client-side caching; Server Actions for mutations; React Context for global UI state.
- **Maps:** Google Maps JavaScript API with Places Autocomplete for Airbnb search aid.
- **Realtime:** Supabase Realtime (broadcast channels) for live inventory and order updates; default hooks refresh server components automatically.
- **Charts:** Recharts for dashboards; fallback to Chart.js for advanced needs.
- **Forms/Validation:** React Hook Form + Zod resolver.
- **Internationalization:** next-intl with EN-IN default locale.
- **Testing:** Playwright (E2E), Testing Library (components), Vitest (unit).

## Backend
- **Runtime:** Next.js Edge/serverless hybrid; Node.js 20 baseline.
- **Database:** Supabase Postgres (Mumbai) with Prisma ORM and row-level security policies.
- **Caching/Queue:** Redis (Upstash) for queues, cache tags, and rate limiting; Supabase Realtime for fan-out.
- **Auth:** NextAuth.js with Credentials (email/password) and Google OAuth; Argon2id hashing.
- **Payments:** Razorpay Orders API + webhook pipeline (PayPal upgrade path scaffolded); GST invoice generation via internal service.
- **Notifications:** SendGrid for email, Twilio/Kaleyra for SMS, Firebase Cloud Messaging for push roadmap.
- **File Storage:** S3-compatible (AWS Mumbai or Cloudflare R2) for property images and receipts.

## DevOps & Tooling
- **Package Manager:** pnpm with workspace support.
- **Monorepo:** Turborepo for caching and task orchestration.
- **CI/CD:** GitHub Actions (lint, test, build, deploy triggers) with Vercel preview deployments.
- **Observability:** Sentry (errors), OpenTelemetry traces to Grafana Cloud, Logtail for logs.
- **Infrastructure as Code:** Terraform modules for DB/queues in future milestone.
- **Secrets:** Doppler (preferred) or Hostinger env manager; local `.env.local` for dev.

## Non-Functional Considerations
- **Performance:** Use Next.js cache directives, route segment-level suspense, and image optimization.
- **Security:** CSP headers, HTTPS everywhere, rate limiting with Upstash, audit logging.
- **Compliance:** GST-ready invoice fields, data residency in India, data deletion workflows.
- **Scalability:** Horizontal app scaling via Hostinger VPS + load balancer; DB connection pooling via PgBouncer or Prisma Accelerate.


