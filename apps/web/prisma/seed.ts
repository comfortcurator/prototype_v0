import {
  PrismaClient,
  Role,
  PackageType,
  PropertyStatus,
  PaymentStatus
} from "@prisma/client";
import { hash } from "argon2";

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await hash("Admin@1234");
  const hostPassword = await hash("Host@1234");

  const [admin, host] = await Promise.all([
    prisma.user.upsert({
      where: { email: "admin@projectv0.in" },
      update: {},
      create: {
        email: "admin@projectv0.in",
        phone: "+919999999999",
        name: "Admin Marcus",
        passwordHash: adminPassword,
        role: Role.admin
      }
    }),
    prisma.user.upsert({
      where: { email: "host@projectv0.in" },
      update: {},
      create: {
        email: "host@projectv0.in",
        phone: "+918888888888",
        name: "Host Aurelius",
        passwordHash: hostPassword,
        role: Role.host
      }
    })
  ]);

  const [tea, towel, toothbrush] = await prisma.$transaction([
    prisma.item.upsert({
      where: { id: "seed-item-tea" },
      update: {},
      create: {
        id: "seed-item-tea",
        name: "Darjeeling Gold Tea Sachets",
        description: "Handpicked first flush sachets from heritage estates.",
        unitPrice: 299,
        moq: 6,
        imageUrl:
          "https://images.unsplash.com/photo-1483695028939-5bb13f8648b0?auto=format&fit=crop&w=900&q=80"
      }
    }),
    prisma.item.upsert({
      where: { id: "seed-item-towel" },
      update: {},
      create: {
        id: "seed-item-towel",
        name: "Mulmul Bath Towel",
        description: "Lightweight organic cotton towel crafted in Tamil Nadu.",
        unitPrice: 599,
        moq: 4,
        imageUrl:
          "https://images.unsplash.com/photo-1562157873-818bc0726f3c?auto=format&fit=crop&w=900&q=80"
      }
    }),
    prisma.item.upsert({
      where: { id: "seed-item-toothbrush" },
      update: {},
      create: {
        id: "seed-item-toothbrush",
        name: "Sandalwood Toothbrush",
        description: "Biodegradable bamboo toothbrush with Ayurvedic bristles.",
        unitPrice: 49,
        moq: 10,
        imageUrl:
          "https://images.unsplash.com/photo-1587502537104-c50e237f32f8?auto=format&fit=crop&w=900&q=80"
      }
    })
  ]);

  const essentialsKit = await prisma.package.upsert({
    where: { id: "seed-package-essentials" },
    update: {},
    create: {
      id: "seed-package-essentials",
      name: "Essentials Kit",
      type: PackageType.standard,
      basePrice: 4999,
      description: "Curated toiletries and amenities set for premium Indian guests.",
      ownerId: admin.id,
      items: {
        create: [
          { itemId: tea.id, quantity: 10 },
          { itemId: towel.id, quantity: 6 },
          { itemId: toothbrush.id, quantity: 12 }
        ]
      }
    }
  });

  const premiumTier = await prisma.subscriptionTier.upsert({
    where: { id: "seed-tier-premium" },
    update: {},
    create: {
      id: "seed-tier-premium",
      name: "Premium Automation",
      price: 6999,
      features: {
        automation: true,
        includes: [
          "Automatic cleaning scheduling",
          "Inventory threshold ordering",
          "Dedicated Marcus concierge"
        ]
      }
    }
  });

  const property = await prisma.property.upsert({
    where: { id: "seed-property-aurelius" },
    update: {},
    create: {
      id: "seed-property-aurelius",
      userId: host.id,
      name: "Aurelius Villa Goa",
      airbnbListingId: "airbnb-123456",
      addressLine1: "Beachfront Lane, Candolim",
      city: "Goa",
      state: "Goa",
      latitude: 15.5189,
      longitude: 73.7633,
      imageUrl:
        "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1400&q=80",
      description:
        "Luxury sea-facing villa curated for Marcus hosts. Includes private plunge pool and full concierge coverage.",
      status: PropertyStatus.green,
      backupPackageId: essentialsKit.id,
      healthLogs: {
        create: [
          {
            status: PropertyStatus.green,
            reason: "Automated inspection complete"
          }
        ]
      }
    }
  });

  await prisma.subscription.upsert({
    where: { id: "seed-subscription-premium" },
    update: {},
    create: {
      id: "seed-subscription-premium",
      propertyId: property.id,
      tierId: premiumTier.id,
      isActive: true
    }
  });

  await prisma.order.upsert({
    where: { razorpayOrderId: "seed-rzp-order" },
    update: {},
    create: {
      id: "seed-order-1",
      propertyId: property.id,
      packageId: essentialsKit.id,
      userId: host.id,
      totalAmount: 4999,
      paymentStatus: PaymentStatus.paid,
      razorpayOrderId: "seed-rzp-order",
      razorpayPaymentId: "seed-rzp-payment",
      items: {
        create: [
          {
            itemId: towel.id,
            quantity: 6,
            unitPrice: 599,
            name: towel.name
          }
        ]
      }
    }
  });

  await prisma.notification.create({
    data: {
      userId: host.id,
      channel: "email",
      content: {
        title: "Welcome to project_v0",
        message: "Automation is live for Aurelius Villa Goa."
      },
      status: "queued"
    }
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });

