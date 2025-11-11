# Vercel Deployment Guide

This project is structured as a Turborepo-style monorepo. The only runtime app we deploy to Vercel is `apps/web`. Follow the checklist below for a clean release.

## 1. Build Command & Settings
- **Root directory**: repository root.
- **Install command**: `pnpm install`.
- **Build command**: `pnpm web:build` (runs Prisma generate + `next build`).
- **Output directory**: `.next`.

### Required Environment Variables
| Variable | Purpose |
| --- | --- |
| `DATABASE_URL`, `DIRECT_URL` | PostgreSQL (Supabase) primary & pooling URLs |
| `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` | Supabase project credentials (service key required for migrations & realtime) |
| `NEXTAUTH_SECRET`, `NEXTAUTH_URL` | NextAuth session signing & canonical URL |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Maps rendering on host dashboards |
| `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET`, `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Marketplace payments |
| `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET` | Stripe checkout fallback |
| `REALTIME_PROVIDER_URL`, `REALTIME_PROVIDER_KEY` | WebSocket provider (Upstash/Pusher/etc) |
| `LOG_LEVEL`, `SENTRY_DSN`, `VERCEL_ANALYTICS_ID` | Observability (optional but recommended) |

## 2. Prisma & Database
1. Provision the production database (Supabase/Neon).
2. Run migrations locally: `pnpm db:migrate`.
3. Deploy migrations remotely: `pnpm db:deploy` (or via CI).
4. Seed if required: `pnpm db:seed`.
5. Vercel build automatically runs `prisma generate` via `postinstall`.

## 3. Observability & Security
- `apps/web/next.config.ts` sets CSP and cache headers. Update the allow-list when adding new providers (e.g. Stripe JS, WebSocket endpoints).
- `apps/web/instrumentation.ts` wires pino logs; connect to Sentry/Logtail via env variables.
- Add webhook URLs for Razorpay & Stripe in their dashboards pointing to `/api/orders/webhook` and `/api/stripe/webhook` (when implemented).

## 4. Real-time & Stripe Integration Notes
- `apps/web/lib/server/realtime.ts` exposes an event hub. Replace with Pusher/Ably client in production.
- `apps/web/lib/server/stripe.ts` memoises the Stripe client; only requires you to set env keys.
- Update Cache-Control headers in `next.config.ts` if your realtime strategy changes.

## 5. Smoke Tests Before Deploy
```bash
pnpm install
pnpm lint
pnpm test
pnpm build
pnpm --filter web prisma
pnpm --filter web dev --port 3001   # Optional: vercel dev
```

Everything should pass without warnings before pushing a release branch. Commit only the necessary source/config/docs/lockfiles—no generated artifacts, no local `.env` files.
# Vercel Deployment Runbook

## Build Command
- Build: `pnpm --filter web build`
- Install: `pnpm install --frozen-lockfile`
- Output: Next.js (no static exports required)

## Required Environment Variables
Set these inside the Vercel project:

| Variable | Description |
| --- | --- |
| `DATABASE_URL` | Prisma connection string (use pooled connection) |
| `DIRECT_URL` | Non-pooled connection (optional, recommended for migrations) |
| `NEXTAUTH_SECRET` | Generated secret for NextAuth session encryption |
| `NEXTAUTH_URL` | Production URL (e.g. `https://projectv0.vercel.app`) |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Google OAuth credentials |
| `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` | Razorpay Standard Checkout credentials |
| `RAZORPAY_WEBHOOK_SECRET` | Signature secret for webhook validation |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Public Razorpay key |
| `STRIPE_SECRET_KEY` | Stripe secret key (standard account) |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key |
| `SUPABASE_URL` / `SUPABASE_ANON_KEY` / `SUPABASE_SERVICE_ROLE_KEY` | Supabase project credentials (anon for client, service key for migrations/realtime) |
| `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase credentials exposed to the browser |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Google Maps JavaScript API key |
| `SENTRY_DSN` | Optional: error reporting |

## Runtime Settings
- Node.js 20
- `NEXT_RUNTIME` defaults to Node serverless; Stripe/Razorpay require Node runtime.
- Add optional `VERCEL_ANALYTICS_ID` once logging provider is selected.

## Prisma Migrations
1. Run `pnpm db:migrate` locally or via CI before deploying.
2. On production deploys, Vercel build command executes `pnpm --filter web build`. Ensure `postinstall` runs `prisma generate` (handled automatically) and call `pnpm db:deploy` manually (via GitHub Actions or CLI) after schema changes.

## Testing Gate
- `pnpm --filter web lint`
- `pnpm --filter web test`
- `pnpm --filter web build`

Automate in CI before triggering `vercel deploy`.

## Observability
- `apps/web/instrumentation.ts` registers Pino logging for startup events.
- Forward logs via Vercel Log Drains or host-managed collectors (Grafana Cloud / Logtail).

## CI/CD Pipeline (GitHub Actions)
- **Repository access**
  - Connect the GitHub repo to the Vercel project or generate a Vercel deploy token.
  - Store `VERCEL_TOKEN`, `VERCEL_ORG_ID`, and `VERCEL_PROJECT_ID` as repository secrets.
- **Supabase & database configuration**
  - Store `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `DATABASE_URL`, and `DIRECT_URL` as GitHub secrets.
- **Workflow template**

```
name: CI
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
        with:
          version: 9
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm --filter web lint
      - run: pnpm --filter web test
      - run: pnpm --filter web build
  deploy:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
        with:
          version: 9
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - name: Deploy to Vercel
        run: npx vercel deploy --prod --yes --token "$VERCEL_TOKEN"
        env:
          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
          VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
          VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}
```

- **Manual migrations**
  - Run `pnpm db:deploy` against Supabase (either locally or via an additional workflow step) before production deploys to keep the schema in sync.

## Realtime + Stripe Checklist
- Supabase Realtime is wired via `apps/web/lib/server/realtime.ts` and `apps/web/hooks/use-realtime-channel.ts`. Ensure broadcast replication is enabled in Supabase dashboard.
- Extend CSP in `apps/web/next.config.ts` if additional external domains are required.
- Stripe remains optional; wire checkout/session creation via `apps/web/lib/server/stripe.ts` and add webhook route before enabling live cards.


