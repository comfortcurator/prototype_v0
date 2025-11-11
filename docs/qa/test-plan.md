# Test Plan Overview

## Unit Tests
- Utilities (`packages/utils`) via Vitest.
- Schema validation via Zod (coming milestones) with happy-path + failure cases.
- Server helpers (automation rules, env) using mocked Prisma.

## Integration Tests
- API routes (`/api/orders/create`, `/api/cron/*`) with `supertest` + test DB.
- NextAuth credential flow using `next-test-api-route-handler`.
- Prisma database migrations executed in CI using `pnpm db:migrate`.

## E2E Tests
- Playwright suites:
  - Host login -> register property -> view dashboard map.
  - Marketplace add-to-cart -> Razorpay order stub.
  - Admin login -> view analytics -> manage packages.
- Use MSW to stub Razorpay + Google Maps network calls.

## Automation
- GitHub Actions CI executes lint, typecheck, unit tests, and Playwright e2e (headed via xvfb).
- Scheduled CI job hits `/api/cron/health-check` to validate automation endpoints.

## Manual QA
- Pre-launch UAT script for concierge ops and host stakeholders.
- Accessibility audits via Lighthouse + axe-core.
- Performance budgets: LCP < 2.5s on Moto G4 (4G), Start render < 1.2s on broadband.

