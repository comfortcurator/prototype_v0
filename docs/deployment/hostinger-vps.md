## Hostinger VPS (Docker) Deployment

1. **Server prep**
   - `sudo apt update && sudo apt upgrade`
   - Install Docker + Docker Compose plugin.
   - Create non-root user with sudo privileges.

2. **Repo setup**
   - `git clone` repository into `/opt/project_v0`.
   - Copy `.env.example` to `.env.production` and fill secrets.

3. **Docker compose**
   - Use root `docker-compose.yml`.
   - Start stack: `docker compose up -d`.
   - Logs: `docker compose logs -f web`.

4. **Reverse proxy**
   - Install Nginx.
   - Configure server block to proxy `443 -> localhost:3000`.
   - Obtain TLS cert via `certbot --nginx`.

5. **Database**
   - Prefer managed Postgres (Supabase/Neon).  
   - Set `DATABASE_URL` and `DIRECT_URL` accordingly.

6. **Migrations & seed**
   - `docker compose exec web pnpm --filter web prisma migrate deploy`
   - `docker compose exec web pnpm --filter web prisma db seed`

7. **Background workers**
   - Optional dedicated worker container for queues (BullMQ).  
   - Use systemd timers or GitHub Actions cron to hit automation endpoints.

8. **Backups**
   - Schedule Postgres snapshots.  
   - Sync `.env.production` and uploads to secure storage.

9. **Scaling**
   - Add `replicas` or scale container count.  
   - Use load balancer + sticky sessions if moving away from stateless JWT.

