import { prisma } from "./db";
import { logger } from "./logger";

const THRESHOLD_ORANGE_DAYS = 3;

export async function evaluatePropertyHealth() {
  const properties = await prisma.property.findMany({
    include: {
      healthLogs: {
        orderBy: { createdAt: "desc" },
        take: 1
      },
      subscriptions: {
        where: { isActive: true },
        include: { tier: true }
      }
    }
  });

  for (const property of properties) {
    const latestLog = property.healthLogs[0];
    const lastUpdated = latestLog?.createdAt ?? new Date(0);
    const daysSinceUpdate =
      (Date.now() - lastUpdated.getTime()) / (1000 * 60 * 60 * 24);

    if (daysSinceUpdate > THRESHOLD_ORANGE_DAYS) {
      await prisma.healthLog.create({
        data: {
          propertyId: property.id,
          status: "orange",
          reason: `No concierge update in ${Math.round(daysSinceUpdate)} days`
        }
      });
      await prisma.notification.create({
        data: {
          userId: property.userId,
          channel: "email",
          content: {
            type: "health-warning",
            message: `${property.name} needs concierge attention.`
          }
        }
      });
    }
  }
  logger.info("Health evaluation cycle complete");
}

export async function triggerBackupOrders() {
  const subscriptions = await prisma.subscription.findMany({
    where: { isActive: true },
    include: {
      property: {
        include: {
          backupPackage: true
        }
      },
      tier: true
    }
  });

  for (const subscription of subscriptions) {
    if (!subscription.property.backupPackage) continue;
    const hasAutomation =
      (subscription.tier.features as { automation?: boolean })?.automation ?? false;
    if (!hasAutomation) continue;
    await prisma.notification.create({
      data: {
        userId: subscription.property.userId,
        channel: "email",
        content: {
          type: "automation-trigger",
          message: `Backup package ${subscription.property.backupPackage.name} queued for ${
            subscription.property.name
          }.`
        }
      }
    });
  }
  logger.info("Backup package automation sweep complete");
}

