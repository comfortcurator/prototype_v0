## UAT Checklist

- [ ] Host journey: onboard, add property, view health timeline, receive notification.
- [ ] Marketplace flow: add bundle + items, assign property, receive Razorpay order id.
- [ ] Admin analytics: confirm revenue chart loads, tier counts match DB seeded data.
- [ ] Automated cron endpoints: `/api/cron/health-check`, `/api/cron/backup-orders` return 200.
- [ ] Accessibility: tab navigation across dashboard, map, marketplace, forms.
- [ ] Mobile responsive: Landing hero, dashboard map, cart drawer.
- [ ] PWA install prompt tested on Android Chrome.
- [ ] Error tracking: Sentry or chosen tool receiving test exception.
- [ ] Security smoke tests: invalid OTP, rate limit stub, admin route unauthorized access.

