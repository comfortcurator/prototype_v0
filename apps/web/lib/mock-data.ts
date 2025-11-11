const now = new Date();

export const mockUsers = [
  {
    id: "user_demo",
    email: "demo@projectv0.in",
    passwordHash:
      "$argon2id$v=19$m=65536,t=3,p=4$K6y2TRd6mJ2wIbwJK2JZiA$5gzBL47BguQc3ao6Uwz2XG0R2EOQv2rqwT98Vq6uCTE",
    name: "Demo Host",
    role: "host" as const,
    createdAt: now,
    updatedAt: now
  }
];

export const mockSubscriptionTiers = [
  {
    id: "tier_elite",
    name: "Elite Concierge",
    description: "Full-stack automation and concierge orchestration.",
    pricePerMonth: 45000,
    features: { includes: ["Inventory orchestration", "24/7 concierge", "Revenue AI"] },
    createdAt: now,
    updatedAt: now
  }
];

export const mockSubscriptions = [
  {
    id: "sub_demo",
    userId: "user_demo",
    propertyId: "prop_demo",
    tierId: "tier_elite",
    tier: mockSubscriptionTiers[0],
    isActive: true,
    startedAt: now,
    createdAt: now,
    updatedAt: now
  }
];

export const mockHealthLogs = [
  {
    id: "health_demo",
    propertyId: "prop_demo",
    status: "green" as const,
    reason: "All automations stable. Concierge on standby.",
    createdAt: now
  }
];

export const mockProperties = [
  {
    id: "prop_demo",
    userId: "user_demo",
    name: "Aurelius Villa",
    description: "Flagship Goa villa with Marcus Aurelius concierge elevation.",
    imageUrl:
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1300&q=80",
    city: "Goa",
    state: "Goa",
    status: "green" as const,
    latitude: 15.4909,
    longitude: 73.8278,
    createdAt: now,
    updatedAt: now,
    subscriptions: mockSubscriptions,
    healthLogs: mockHealthLogs
  }
];

export const mockPackages = [
  {
    id: "pkg_elite",
    name: "Elite Turnover Kit",
    description: "Inventory, amenity refills, and concierge personalization bundle.",
    price: 18999,
    createdAt: now,
    updatedAt: now
  }
];

export const mockInventorySessions = [
  {
    id: "inventory_demo",
    propertyId: "prop_demo",
    status: "completed" as const,
    startedAt: now,
    completedAt: now,
    itemsReplenished: 18
  }
];

export const mockOrders = [
  {
    id: "order_demo",
    propertyId: "prop_demo",
    userId: "user_demo",
    totalAmount: 18999,
    paymentStatus: "paid" as const,
    razorpayOrderId: "order_demo_123",
    createdAt: now,
    updatedAt: now
  }
];

export const mockNotifications = [
  {
    id: "notif_demo",
    userId: "user_demo",
    title: "Inventory restocked",
    message: "Elite Turnover Kit delivered and concierge briefed.",
    createdAt: now,
    readAt: null
  }
];

export const mockOrderItems = [
  {
    id: "order_item_demo",
    orderId: "order_demo",
    name: "Elite Turnover Kit",
    quantity: 1,
    unitPrice: 18999
  }
];


