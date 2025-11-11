## Automation & Notification Workflows

- **Health checks**  
  - Cron endpoint: `/api/cron/health-check`  
  - Evaluates latest `HealthLog` per property; if no update for 3 days, writes new `orange` log and queues notifications.  
  - Extend with inventory threshold logic once consumption telemetry is wired.

- **Backup package triggers**  
  - Cron endpoint: `/api/cron/backup-orders`  
  - Looks up active subscriptions with automation-enabled tiers and enqueues backup package notifications.  
  - Future: call `checkoutAction` to auto-create orders when stock drops below MOQ.

- **Notifications**  
  - Stored in `Notification` table with JSON payload.  
  - Delivered via email (SendGrid), SMS (Twilio/Kaleyra), and in-app feed (`/notifications`).  
  - Add background processor (Upstash/BullMQ) to retry sends and record delivery metrics.

- **Queues & scheduling**  
  - Recommended: Upstash Q (serverless) or Redis + BullMQ worker on Hostinger VPS.  
  - Each job idempotent; store dedupe keys in Redis to avoid duplicate triggers.  
  - Use GitHub Actions scheduled jobs or cron-job.org to hit cron endpoints for shared hosting deployments.

- **Observability**  
  - Log automation results via `logger`.  
  - Emit OpenTelemetry spans once instrumentation is configured (`apps/web/lib/server/logger.ts` baseline).

