# Security & Compliance Notes

- **Authentication**
  - NextAuth with JWT sessions, Argon2id password hashing.
  - Admin-only areas gated via `assertRole` on the server and App Router layouts.

- **Secrets**
  - Keep secrets in `.env.local` (excluded from git), production via Hostinger env manager or Doppler.
  - `env.ts` throws for missing critical variables.

- **Transport**
  - Enforce HTTPS on Hostinger Nginx reverse proxy; enable HSTS `max-age=31536000`.

- **Content Security Policy**
  - Defined in `apps/web/proxy.ts`, allowing Razorpay checkout and static assets only.

- **Rate limiting**
  - Recommended: Upstash Redis + `@upstash/ratelimit` in middleware for login + API endpoints.

- **Payments**
  - Razorpay orders created server-side; webhook verifies HMAC signature and updates orders atomically.

- **Data protection**
  - PostgreSQL with daily backups; future: enable row-level encryption for sensitive PII.
  - Notifications + automation logs stored for audit trails.

- **Compliance**
  - GST invoice support planned via order metadata; ensure retention for 8 years.
  - Provide data deletion endpoint for GDPR on user request.

- **Observability**
  - Add Sentry or similar for error tracking; integrate OpenTelemetry as milestone M9 deliverable.

