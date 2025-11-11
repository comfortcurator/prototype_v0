## Hostinger Shared Node.js Deployment

1. **Upload build**  
   - Compress repo excluding `node_modules`.  
   - Upload via hPanel File Manager to `~/project_v0`.

2. **Node.js app settings**  
   - Application root: `/project_v0/apps/web`.  
   - Build command: `pnpm install --frozen-lockfile && pnpm prisma generate && pnpm build`.  
   - Start command: `pnpm start`.  
   - Node version: 20.

3. **Environment variables**  
   - Add database credentials, Razorpay keys, NextAuth secret.  
   - Expose `NEXT_PUBLIC_` keys only when required (e.g., Google Maps API).

4. **Prisma migrations**  
   - Use SSH console:  
     ```sh
     pnpm --filter web prisma migrate deploy
     pnpm --filter web prisma db seed
     ```

5. **Static assets**  
   - Ensure `apps/web/public` contents deploy automatically via `next build`.  
   - Configure CDN (Hostinger or Cloudflare) for images.

6. **Cron jobs**  
   - Use Hostinger scheduler or external service to POST to `/api/cron/health-check` and `/api/cron/backup-orders`.

7. **Logging & monitoring**  
   - Tail logs via hPanel or ship to Logtail/Sentry.  
   - Health endpoint: `/api/health`.

