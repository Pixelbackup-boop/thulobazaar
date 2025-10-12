tttt

**Status:** 🟢 Active Development - 75% Complete
**Target:** MVP Launch in 3-4 weeks
**Platform:** Web (React + Node.js) → Mobile (React Native) later

---

## 🚨 IMPORTANT: Read This First!

### 🛡️ Development Policy
**⚠️ CRITICAL: DO NOT delete or modify ANYTHING without asking!**

**This includes:**
- ❌ Files (don't delete)
- ❌ Components within files (don't remove)
- ❌ Functions, props, state (don't clean up)
- ❌ Imports, exports (don't remove "unused" ones)
- ❌ Database fields, routes (don't "fix")
- ❌ Comments, TODOs (don't delete)
- ❌ ANYTHING that looks "old" or "unused"

**Why?**
- Plans change → Code updates → Names stay same
- `business_subscription_status` might store verification status now
- "Unused" props may be ready for feature activation
- Commented code may be waiting for payment integration

**Always ask: "What does this do NOW?"**

**Read:** [DEVELOPMENT_POLICY.md](DEVELOPMENT_POLICY.md)

---

## 📚 Documentation Hub

### Essential Guides:
1. **[PROJECT_STATUS.md](PROJECT_STATUS.md)** - Current status, accomplishments, and next steps
2. **[MVP_COMPLETE_PLAN.md](MVP_COMPLETE_PLAN.md)** - Detailed 4-week implementation plan
3. **[MVP_QUICK_SUMMARY.md](MVP_QUICK_SUMMARY.md)** - Quick reference and action items
4. **[MVP_VISUAL_ROADMAP.md](MVP_VISUAL_ROADMAP.md)** - Visual progress charts and roadmap
5. **[VERIFICATION_SYSTEM_EXPLAINED.md](VERIFICATION_SYSTEM_EXPLAINED.md)** - How verification works
6. **[AD_PROMOTION_SYSTEM.md](AD_PROMOTION_SYSTEM.md)** - 🚀 3-tier ad promotion system (Featured/Urgent/Sticky)
7. **[DEVELOPMENT_POLICY.md](DEVELOPMENT_POLICY.md)** - Code preservation rules ⚠️

### Technical Docs:
- `CLEAN_URL_IMPLEMENTATION.md` - SEO-friendly URLs
- `CODE_QUALITY_IMPROVEMENTS.md` - Quality enhancements
- `COMPLETE_REFACTORING_SUMMARY.md` - Refactoring details
- `INDIVIDUAL_VERIFICATION_IMPLEMENTATION.md` - Individual verification
- `MISSING_FEATURES_IMPLEMENTATION_GUIDE.md` - Feature guide
- `PERFORMANCE_OPTIMIZATION_GUIDE.md` - Performance tips
- `SECURITY_MIDDLEWARE_COMPLETE.md` - Security setup
- `UTILITIES_AND_HOOKS_GUIDE.md` - Utils and hooks

---

## 🎯 Quick Start

### For Development:

```bash
# Backend
cd backend
npm install
npm run dev

# Frontend
cd frontend
npm install
npm run dev

# Typesense Search
./typesense-server --data-dir=./typesense-data --api-key=thulobazaar-dev-key --enable-cors

# Database
PGPASSWORD=postgres psql -U elw -d thulobazaar
```

### Tech Stack:
- **Backend:** Node.js, Express, PostgreSQL, JWT, Multer
- **Frontend:** React, Vite, Axios, Leaflet
- **Search:** Typesense
- **Security:** Helmet, rate limiting, input validation
- **Mobile (Later):** React Native

---

## 📊 Current Progress

### ✅ Completed (75%):
- ✅ Complete backend API (17 tables, 16+ routes)
- ✅ Editor/Admin system with approval workflow
- ✅ User authentication & authorization
- ✅ Ad posting, editing, approval system
- ✅ Hierarchical location system (7 provinces, 77 districts, 753+ municipalities)
- ✅ Category system with subcategories
- ✅ Individual & Business verification systems
- ✅ Image upload & gallery
- ✅ Search with Typesense
- ✅ 30+ React components (mobile responsive)
- ✅ Security middleware & validation

### ❌ Missing for MVP (25%):
- ❌ **Payment integration** (eSewa/Khalti) - Week 1 🔴
- ❌ **SEO optimization** (SSR, meta tags) - Week 2 🔴
- ❌ **Real-time messaging** (Socket.io) - Week 3 🔴
- ❌ **Email notifications** - Week 3 🔴
- ❌ **Contact features** (phone reveal, WhatsApp) - Week 2
- ❌ **Badge display** (Blue/Gold verification badges) - Week 2

---

## 🚀 How ThuLoBazaar Works

### User Flow:
1. **Everyone starts as Individual Seller** (FREE, can post/sell immediately)
2. Optional: Get **Blue Badge** (Individual Verification) → Pay fee + submit ID
3. Optional: Get **Gold Badge** (Business Verification) → Pay NPR 1,000 + submit license → Get 30-40% discount on promotions
4. Post ads → Editor approves → Ad goes live
5. Buyers search, filter, contact sellers

### Revenue Model:
1. **Individual Verification** - One-time fee → Blue badge
2. **Business Verification** - NPR 1,000 → Gold badge + 30-40% promo discount
3. **Ad Promotions (3-Tier System):**
   - 🌟 **FEATURED** (NPR 1,000-3,500) - Homepage + Search + Category
   - 🔥 **URGENT** (NPR 500-1,750) - Top of category, quick sales
   - 📌 **STICKY/BUMP** (NPR 100-350) - Stay at top of category
   - **Business discount:** 30-40% off all promotions
   - **See:** [AD_PROMOTION_SYSTEM.md](AD_PROMOTION_SYSTEM.md) for details

---

## 📋 Immediate Priorities

### This Week (Week 1):
1. Sign up for eSewa merchant account
2. Sign up for Khalti merchant account
3. Implement payment gateway integration
4. Test payment flows

### Next 3 Weeks:
- **Week 2:** SEO + Contact features + Badges
- **Week 3:** Messaging + Notifications + Admin polish
- **Week 4:** Testing + Production deployment

---

## 🗂️ Project Structure

```
thulobazaar/
├── backend/
│   ├── server.js              # Main server
│   ├── routes/                # 16+ API routes
│   ├── controllers/           # Business logic
│   ├── models/                # Database models
│   ├── middleware/            # Auth, security, validation
│   ├── migrations/            # SQL migrations
│   └── uploads/               # User uploads
├── frontend/
│   ├── src/
│   │   ├── components/        # 30+ React components
│   │   ├── services/          # API services
│   │   └── styles/            # CSS files
│   └── index.html
└── Documentation (*.md)       # This file and others
```

---

## 🔐 Environment Variables

Required `.env` for backend:

```bash
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/thulobazaar

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRY=7d

# Typesense
TYPESENSE_HOST=localhost
TYPESENSE_PORT=8108
TYPESENSE_API_KEY=your-api-key

# Payment (to be added)
ESEWA_MERCHANT_ID=
ESEWA_SECRET_KEY=
KHALTI_PUBLIC_KEY=
KHALTI_SECRET_KEY=

# Email (to be added)
SMTP_HOST=
SMTP_USER=
SMTP_PASSWORD=
```

---

## 🎯 MVP Success Criteria

**MVP is complete when:**
- ✅ Users can register, post ads, get approved
- ✅ Payment works (eSewa/Khalti)
- ✅ Verification works (Individual/Business)
- ✅ Badges display correctly (Blue/Gold)
- ✅ SEO optimized (Google indexing)
- ✅ Real-time messaging works
- ✅ Notifications sent (email)
- ✅ All critical flows tested
- ✅ Mobile responsive
- ✅ Production deployed

**Target Metrics (Month 1):**
- 500+ users
- 2,000+ ads
- 50+ verified businesses
- NPR 50,000+ revenue

---

## 📞 Support & Issues

- **Questions:** Ask before making changes!
- **Issues:** Document and report
- **Features:** Check MVP plan first
- **Changes:** Read DEVELOPMENT_POLICY.md

---

## 🏗️ Database Schema

**17 Tables:**
- `users` - All user accounts
- `ads` - Classified ads
- `ad_images` - Image gallery
- `ad_promotions` - Ad boosts
- `ad_reports` - User reports
- `categories` - Categories & subcategories
- `locations` - 5-tier location hierarchy
- `areas` - Granular location data
- `individual_verification_requests` - Individual verification
- `business_verification_requests` - Business verification
- `business_subscriptions` - Subscription tracking
- `promotion_pricing` - Pricing tiers
- `contact_messages` - Messaging system
- `editors` & `editor_permissions` - Editor system
- `admins` & `admin_activity_logs` - Admin system

---

## 🎨 Key Features

### User Features:
- ✅ Post ads with images
- ✅ Edit/delete own ads
- ✅ Profile with avatar/cover
- ✅ Shop page for all users
- ✅ Search & filter ads
- ✅ Location-based search
- ⏳ Bookmark/favorite ads
- ⏳ Contact sellers (phone/WhatsApp/chat)
- ⏳ Get verified (Blue/Gold badge)

### Editor Features:
- ✅ Approve/reject ads
- ✅ Bulk actions
- ✅ User management (suspend/verify)
- ✅ Verification approval
- ✅ Activity logging
- ⏳ Payment management
- ⏳ Analytics dashboard

### Admin Features:
- ✅ All editor capabilities
- ⏳ Revenue reports
- ⏳ Site settings
- ⏳ Promotion pricing management

---

## 🚀 Deployment

### Production Checklist:
- [ ] All migrations applied
- [ ] Environment variables configured
- [ ] SSL certificate installed
- [ ] Payment gateways tested
- [ ] Email service configured
- [ ] CDN configured
- [ ] Database backed up
- [ ] Monitoring tools active (Sentry)
- [ ] Load tested

---

## 📈 Roadmap

### MVP (Next 4 weeks):
- Payment integration
- SEO optimization
- Real-time messaging
- Email notifications
- Testing & launch

### v1.1 (1-2 months after MVP):
- Mobile app (React Native)
- Advanced search
- User reviews/ratings
- WhatsApp business integration

### v2.0 (6+ months):
- AI recommendations
- Multi-language (Nepali)
- Seller verification with gov ID
- Escrow payment system

---

## 🔑 Key Insights

1. **Free to Start**: Anyone can sell immediately (no payment barrier)
2. **Optional Verification**: Build trust with Blue/Gold badges
3. **Editor Moderation**: All ads manually reviewed (4h SLA)
4. **Name Lock**: Verified users can't change names
5. **Business Benefits**: 30-40% discount on promotions
6. **One-time Fees**: No subscriptions, pay once for verification

---

## 📖 License

Proprietary - ThuLoBazaar © 2025

---

**Last Updated:** 2025-10-09
**Version:** 0.75 (MVP in progress)
**Next Milestone:** Payment Integration (Week 1)

**Remember:** 🛡️ Always read [DEVELOPMENT_POLICY.md](DEVELOPMENT_POLICY.md) before making changes!
