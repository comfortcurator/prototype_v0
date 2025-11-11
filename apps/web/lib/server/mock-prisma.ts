/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  mockHealthLogs,
  mockInventorySessions,
  mockNotifications,
  mockOrderItems,
  mockOrders,
  mockPackages,
  mockProperties,
  mockSubscriptionTiers,
  mockSubscriptions,
  mockUsers
} from "@/lib/mock-data";

type AnyArgs = Record<string, any>;

const clone = <T>(value: T): T => structuredClone(value);

let idCounter = 0;
const createId = (prefix: string) => `${prefix}_${Date.now()}_${idCounter++}`;

export class MockPrismaClient {
  private users: any[] = clone(mockUsers);
  private subscriptions: any[] = clone(mockSubscriptions);
  private subscriptionTiers: any[] = clone(mockSubscriptionTiers);
  private properties: any[] = clone(mockProperties);
  private healthLogs: any[] = clone(mockHealthLogs);
  private packages: any[] = clone(mockPackages);
  private inventorySessions: any[] = clone(mockInventorySessions);
  private orders: any[] = clone(mockOrders);
  private orderItems: any[] = clone(mockOrderItems);
  private notifications: any[] = clone(mockNotifications);
  private passwordResetTokens: Array<{
    id: string;
    token: string;
    email: string;
    createdAt: Date;
    expiresAt: Date;
  }> = [];

  user = {
    findUnique: async (args: AnyArgs) => {
      const where = (args?.where ?? {}) as Record<string, any>;
      if (where.email) {
        return this.users.find((user) => user.email === where.email) ?? null;
      }
      if (where.id) {
        return this.users.find((user) => user.id === where.id) ?? null;
      }
      return null;
    },
    findMany: async () => clone(this.users),
    create: async (args: AnyArgs) => {
      const data = args?.data ?? {};
      const newUser = {
        id: createId("user"),
        createdAt: new Date(),
        updatedAt: new Date(),
        ...data
      };
      this.users.push(newUser);
      return clone(newUser);
    },
    update: async (args: AnyArgs) => {
      const where = (args?.where ?? {}) as Record<string, any>;
      const data = args?.data ?? {};
      const target = this.users.find((user) => user.id === where.id);
      if (!target) {
        throw new Error("Mock user not found");
      }
      Object.assign(target, data, { updatedAt: new Date() });
      return clone(target);
    }
  };

  passwordResetToken = {
    create: async (args: AnyArgs) => {
      const data = args?.data ?? {};
      const record = {
        id: createId("reset"),
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 1000 * 60 * 15),
        ...data
      };
      this.passwordResetTokens.push(record);
      return clone(record);
    },
    findUnique: async (args: AnyArgs) => {
      const token = args?.where?.token;
      if (!token) return null;
      return this.passwordResetTokens.find((entry) => entry.token === token) ?? null;
    },
    delete: async (args: AnyArgs) => {
      const id = args?.where?.id;
      if (!id) return null;
      const index = this.passwordResetTokens.findIndex((entry) => entry.id === id);
      if (index >= 0) {
        const [removed] = this.passwordResetTokens.splice(index, 1);
        return removed;
      }
      return null;
    }
  };

  property = {
    findMany: async (args: AnyArgs = {}) => {
      const where = (args.where ?? {}) as Record<string, any>;
      let data = this.properties;
      if (where.userId) {
        data = data.filter((property) => property.userId === where.userId);
      }
      if (where.id) {
        data = data.filter((property) => property.id === where.id);
      }
      return clone(
        data.map((property) => ({
          ...property,
          subscriptions: property.subscriptions ?? this.subscriptions.filter((sub) => sub.propertyId === property.id),
          healthLogs: this.healthLogs
            .filter((log) => log.propertyId === property.id)
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        }))
      );
    },
    findFirst: async (args: AnyArgs) => {
      const where = (args?.where ?? {}) as Record<string, any>;
      const result = await this.property.findMany({ where });
      return result[0] ?? null;
    },
    create: async (args: AnyArgs) => {
      const data = args?.data ?? {};
      const property = {
        id: createId("property"),
        createdAt: new Date(),
        updatedAt: new Date(),
        ...data,
        subscriptions: [],
        healthLogs: []
      };
      this.properties.push(property);
      return clone(property);
    }
  };

  subscription = {
    findMany: async (args: AnyArgs = {}) => {
      const where = (args.where ?? {}) as Record<string, any>;
      let data = this.subscriptions;
      if (where?.propertyId) {
        data = data.filter((sub) => sub.propertyId === where.propertyId);
      }
      return clone(
        data.map((sub) => ({
          ...sub,
          tier: this.subscriptionTiers.find((tier) => tier.id === sub.tierId) ?? this.subscriptionTiers[0]
        }))
      );
    }
  };

  subscriptionTier = {
    findMany: async () => clone(this.subscriptionTiers)
  };

  inventorySession = {
    findMany: async () => clone(this.inventorySessions)
  };

  package = {
    findMany: async () => clone(this.packages)
  };

  healthLog = {
    create: async (args: AnyArgs) => {
      const data = args?.data ?? {};
      const entry = {
        id: createId("health"),
        createdAt: new Date(),
        ...data
      };
      this.healthLogs.push(entry);
      return clone(entry);
    }
  };

  notification = {
    findMany: async (args: AnyArgs = {}) => {
      const where = (args.where ?? {}) as Record<string, any>;
      let data = this.notifications;
      if (where?.userId) {
        data = data.filter((notification) => notification.userId === where.userId);
      }
      return clone(data);
    },
    create: async (args: AnyArgs) => {
      const data = args?.data ?? {};
      const notification = {
        id: createId("notification"),
        createdAt: new Date(),
        readAt: null,
        ...data
      };
      this.notifications.push(notification);
      return clone(notification);
    }
  };

  order = {
    findMany: async (args: AnyArgs = {}) => {
      const where = (args.where ?? {}) as Record<string, any>;
      let data = this.orders;
      if (where?.userId) {
        data = data.filter((order) => order.userId === where.userId);
      }
      if (where?.propertyId) {
        data = data.filter((order) => order.propertyId === where.propertyId);
      }
      const include = (args?.include ?? {}) as Record<string, any>;
      return clone(
        data.map((order) => ({
          ...order,
          property:
            include.property === true
              ? this.properties.find((property) => property.id === order.propertyId)
              : undefined,
          items:
            include.items === true
              ? this.orderItems.filter((item) => item.orderId === order.id)
              : undefined
        }))
      );
    },
    create: async (args: AnyArgs) => {
      const data = args?.data ?? {};
      const order = {
        id: createId("order"),
        createdAt: new Date(),
        updatedAt: new Date(),
        ...data
      };
      this.orders.push(order);
      return clone(order);
    },
    update: async (args: AnyArgs) => {
      const where = args?.where ?? {};
      const data = args?.data ?? {};
      const order = this.orders.find((entry) => entry.id === where.id);
      if (!order) {
        return null;
      }
      Object.assign(order, data, { updatedAt: new Date() });
      return clone(order);
    },
    updateMany: async (args: AnyArgs) => {
      const where = args?.where ?? {};
      const data = args?.data ?? {};
      const targets = this.orders.filter((order) => {
        if (where.razorpayOrderId) {
          return order.razorpayOrderId === where.razorpayOrderId;
        }
        if (where.id) {
          return order.id === where.id;
        }
        return false;
      });
      targets.forEach((order) => Object.assign(order, data, { updatedAt: new Date() }));
      return { count: targets.length };
    }
  };

  orderItem = {
    createMany: async (args: AnyArgs) => {
      const data: Array<Record<string, unknown>> = args?.data ?? [];
      const created = data.map((item) => {
        const entry = {
          id: createId("orderItem"),
          ...item
        };
        this.orderItems.push(entry);
        return entry;
      });
      return { count: created.length };
    }
  };

  automationLog = {
    create: async (args: AnyArgs) => {
      return args?.data ?? null;
    }
  };

  $queryRaw = async () => 1;

  $transaction = async (operations: Array<unknown>) => {
    const results = [];
    for (const operation of operations) {
      if (typeof operation === "function") {
        results.push(await operation());
      } else {
        results.push(await operation);
      }
    }
    return results;
  };
}

export const createMockPrismaClient = () => new MockPrismaClient();

