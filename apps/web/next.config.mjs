const securityHeaders = [
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "base-uri 'self'",
      "script-src 'self' https://checkout.razorpay.com https://js.stripe.com",
      [
        "connect-src",
        "'self'",
        "https://checkout.razorpay.com",
        "https://api.razorpay.com",
        "https://api.stripe.com",
        "wss://*.pusher.com",
        "https://*.pusher.com",
        "wss://*.ably.io",
        "https://*.ably.io"
      ].join(" "),
      "img-src 'self' https: data:",
      "style-src 'self' 'unsafe-inline'",
      "font-src 'self' https://fonts.gstatic.com",
      "frame-src https://api.razorpay.com https://checkout.razorpay.com https://js.stripe.com https://pay.stripe.com",
      "upgrade-insecure-requests"
    ].join("; ")
  }
];

const config = {
  reactStrictMode: true,
  compress: true,
  poweredByHeader: false,
  experimental: {
    serverActions: {},
    optimizePackageImports: [
      "@project_v0/ui",
      "@project_v0/schemas",
      "@project_v0/utils"
    ]
  },
  modularizeImports: {
    "lucide-react": {
      transform: "lucide-react/dist/esm/icons/{{member}}",
      skipDefaultConversion: true
    }
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "**.airbnbstatic.com" },
      { protocol: "https", hostname: "images.razorpay.com" },
      { protocol: "https", hostname: "storage.googleapis.com" },
      { protocol: "https", hostname: "images.unsplash.com" }
    ]
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders
      },
      {
        source: "/:all*(js|css|svg|png|jpg|jpeg|gif|webp|ico|woff2)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" }
        ]
      },
      {
        source: "/api/(.*)",
        headers: [{ key: "Cache-Control", value: "private, no-store" }]
      }
    ];
  }
};

export default config;

