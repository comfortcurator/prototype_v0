## Managed PostgreSQL Setup (Supabase/Neon India Region)

1. **Provision database**
   - Create project in Supabase or Neon and select India (Mumbai/Bangalore) region.
   - Enable automated backups and point-in-time recovery.
   - Restrict network access to Hostinger VPS/shared IPs; enable SSL enforcement.

2. **Roles & access**
   - Create service role for Prisma (`projectv0_service`) with limited privileges.
   - Create reporting role for analytics exports with read-only permissions.
   - Rotate passwords quarterly and store in Doppler / Hostinger secret manager.

3. **Connection pooling**
   - Enable PgBouncer (Supabase) or Neon pooling; configure `DIRECT_URL` for migration tasks.
   - Update environment variables:
     - `DATABASE_URL` → pooled connection string.
     - `DIRECT_URL` → primary connection string (no pooling) for `prisma migrate`.

4. **Migrations workflow**
   - Local: `pnpm db:migrate` to create dev migrations.
   - CI: `pnpm db:generate` to ensure Prisma Client matches schema.
   - Production deploy: `pnpm db:deploy` via Hostinger SSH, followed by `pnpm db:seed`.

5. **Monitoring & alerts**
   - Enable slow query logs (>200ms) and wire into Grafana/LokI.
   - Set up usage alerts (storage, connections) and daily health check hitting `/api/health`.

6. **Security & compliance**
   - Enforce TLS connections, disable public schema writes for non-service roles.
   - Tag data columns containing PII; configure retention policies.
   - Document recovery procedure in `docs/ops/postmortems/backup-playbook.md`.

