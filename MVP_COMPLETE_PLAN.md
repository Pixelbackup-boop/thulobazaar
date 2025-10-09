# 🚀 ThuLoBazaar - Complete MVP Plan

## Executive Summary

**Current Status**: ~75% Complete ✅
**Estimated Time to MVP**: 3-4 weeks
**Priority**: Complete core user flows and SEO optimization

---

## 📊 PROJECT COMPLETION STATUS

### ✅ COMPLETED FEATURES (75%)

#### 1. Backend Infrastructure (100% ✅)
- [x] Node.js + Express server
- [x] PostgreSQL database with 17 tables
- [x] JWT authentication system
- [x] File upload with Multer
- [x] Security middleware (Helmet, rate limiting, sanitization)
- [x] Winston logging
- [x] Error handling middleware
- [x] 16+ API route files

#### 2. Database Schema (95% ✅)
- [x] **users** - Complete with business/individual fields, verification, suspension
- [x] **ads** - Full schema with promotions, soft delete, slugs, status workflow
- [x] **ad_images** - Image gallery support
- [x] **ad_promotions** - Bump, sticky, urgent, featured tracking
- [x] **ad_reports** - Report system ready
- [x] **categories** - With subcategories (migration 009)
- [x] **locations** - 5-tier hierarchy (7 provinces, 77 districts, 753 municipalities)
- [x] **areas** - Granular location data
- [x] **business_verification_requests** - Business verification workflow
- [x] **individual_verification_requests** - Individual verification
- [x] **business_subscriptions** - Subscription management
- [x] **promotion_pricing** - Ad boost pricing tiers
- [x] **editors** & **editor_permissions** - Editor role system
- [x] **admins** - Admin management
- [x] **admin_activity_logs** - Audit trail
- [x] **contact_messages** - Messaging system (basic)

#### 3. Authentication & User Management (100% ✅)
- [x] User registration/login
- [x] JWT token authentication
- [x] Password hashing (bcrypt)
- [x] Role-based access (user, editor, super_admin)
- [x] Individual vs Business account types
- [x] User profiles with avatar, cover photo, bio
- [x] Seller slugs for SEO-friendly URLs
- [x] Shop slugs for business accounts

#### 4. Ad Management System (90% ✅)
- [x] Post ad with title, description, price
- [x] Image gallery upload
- [x] Category selection (with subcategories)
- [x] Location selection (hierarchical)
- [x] Condition field (new/used)
- [x] Ad slugs for SEO
- [x] View count tracking
- [x] Status workflow (pending → approved/rejected)
- [x] Soft delete with audit trail
- [x] Ad editing capability
- [ ] WhatsApp contact button (90% - need frontend)
- [ ] Click-to-show phone number (90% - need frontend)

#### 5. Editor/Admin System (95% ✅)
- [x] Editor dashboard route
- [x] Pending ads queue
- [x] Approve/reject ads with reason
- [x] Bulk actions (approve, reject, delete, restore)
- [x] User management (suspend, verify)
- [x] Activity logging
- [x] Editor promotion/demotion
- [x] Statistics dashboard API
- [ ] Frontend admin panel UI (partial - EditorDashboard exists)

#### 6. Verification System (95% ✅)
**How It Works:**
- ✅ All users start as **Individual Unverified Sellers** (can post/sell immediately, NO payment needed)
- ✅ **Individual Verification** (Blue Badge): Pay fee + submit ID → Editor approves → Blue checkmark
- ✅ **Business Verification** (Gold Badge): Pay NPR 1,000 + submit license → Editor approves → Gold badge + 30-40% promo discount
- ✅ Verified users **cannot change their name** (locked to ID/business license)
- ✅ Editors can **revoke badges** for policy violations

**Implementation Status:**
- [x] Individual verification requests & document upload
- [x] Business verification requests & document upload
- [x] Editor approval/rejection workflow
- [x] Database structure complete
- [x] Frontend forms (IndividualVerificationForm, BusinessVerificationForm)
- [ ] Payment integration for verification fees (CRITICAL - Week 1)
- [ ] Badge display UI (blue/gold badges) (Week 2)
- [ ] Name lock enforcement (Week 2)
- [ ] Business discount calculation (30-40% off promos) (Week 3)

#### 7. Advertising/Promotion System (85% ✅)
- [x] Database schema for promotions
- [x] Bump/sticky/urgent/featured fields on ads
- [x] Expiry tracking for promotions
- [x] Promotion pricing table
- [x] Promotion history tracking
- [x] Business discount structure (30-40% for verified businesses)
- [ ] Payment integration (0% - critical for MVP)
- [ ] Apply business discount in pricing
- [ ] Admin UI for managing promotions

#### 8. Search & Filters (80% ✅)
- [x] Typesense integration
- [x] Full-text search on ads
- [x] Category filtering
- [x] Location filtering (hierarchical)
- [x] LocationSearchInput component
- [x] AdvancedFilters component exists
- [ ] Price range filter (frontend integration)
- [ ] Sort options (newest, price, views)
- [ ] Autocomplete suggestions
- [ ] Faceted search results

#### 9. Business/Shop Features (90% ✅)
**Clarification:** No "Business account" - All users are individual sellers by default!
- [x] All users have shop pages (unverified by default)
- [x] Shop profile fields (name, bio, avatar, cover, contact info)
- [x] Shop slugs (/shop/username ready)
- [x] ShopProfile component exists
- [x] Business verification system (NPR 1,000 → Gold badge)
- [x] Business discount tracking (30-40% on promos)
- [ ] Shop page showing all user's ads
- [ ] Follow/bookmark shop feature
- [ ] Shop analytics for verified businesses

#### 10. Frontend Components (85% ✅)
- [x] Home page
- [x] Browse/SearchResults
- [x] AdDetail page
- [x] PostAd form
- [x] EditAd form
- [x] Profile pages (User, Seller, Shop)
- [x] Dashboard
- [x] EditorDashboard
- [x] AuthModal
- [x] LocationSearchInput
- [x] AdvancedFilters
- [x] ImageUpload
- [x] Maps (Static & Interactive)
- [x] Pagination, Breadcrumb
- [x] Error boundaries & loading states
- [x] PropTypes validation
- [ ] Payment integration UI
- [ ] Real-time messaging UI
- [ ] Notifications UI

#### 11. Location System (95% ✅)
- [x] Complete Nepal hierarchy (7 provinces, 77 districts, 753 municipalities)
- [x] Area/place data for Kathmandu wards 1-7
- [x] Location search API
- [x] LocationSearchInput component
- [ ] Complete area data for remaining Kathmandu wards 8-32
- [ ] Add area data for Lalitpur, Bhaktapur, Pokhara

#### 12. Messaging System (60% ✅)
- [x] contact_messages table with reply support
- [x] Database structure for threads
- [x] Buyer/seller association
- [ ] Real-time chat with Socket.io (0%)
- [ ] Message notifications (0%)
- [ ] Frontend chat UI (0%)

---

## ❌ MISSING FOR MVP (25% Remaining)

### 🔴 CRITICAL - Must Have for MVP

#### 1. Payment Integration (Priority 1) ⏰ 1 week
**Status**: 0% Complete

**Required**:
- [ ] Integrate eSewa payment gateway (primary)
- [ ] Khalti integration (secondary)
- [ ] Payment webhook handlers
- [ ] **Individual verification fee payment flow**
- [ ] **Business verification fee payment flow (NPR 1,000)**
- [ ] Ad promotion payment flow (bump/sticky/urgent/featured)
- [ ] Payment success/failure pages
- [ ] Payment verification and activation
- [ ] Admin payment management UI
- [ ] Invoice generation
- [ ] Refund handling (optional for MVP)

**Files to Create**:
- `backend/routes/payments.js`
- `backend/controllers/paymentController.js`
- `backend/services/esewaService.js`
- `backend/services/khaltiService.js`
- `frontend/src/components/PaymentModal.jsx`
- `frontend/src/components/SubscriptionPlans.jsx`
- `frontend/src/pages/PaymentSuccess.jsx`
- `frontend/src/pages/PaymentFailure.jsx`

#### 2. SEO Optimization (Priority 2) ⏰ 1 week
**Status**: 20% Complete (clean URLs exist)

**Required**:
- [ ] Server-side rendering setup (Next.js conversion OR pre-rendering)
- [ ] Dynamic meta tags for each ad (title, description, OG tags)
- [ ] Schema.org structured data (Product, Offer, BreadcrumbList)
- [ ] Sitemap generation (ads, categories, shops, locations)
- [ ] Robots.txt configuration
- [ ] Canonical tags
- [ ] Image optimization with alt tags
- [ ] Lazy loading implementation
- [ ] CDN setup for images
- [ ] Page speed optimization

**Files to Modify/Create**:
- Convert to Next.js OR add pre-rendering
- `frontend/src/components/SEO.jsx` (meta tags component)
- `backend/routes/sitemap.js`
- `public/robots.txt`
- Update all ad/shop/category pages with meta tags

#### 3. Real-time Messaging (Priority 3) ⏰ 4-5 days
**Status**: 60% Complete (database ready)

**Required**:
- [ ] Socket.io server setup
- [ ] Real-time message delivery
- [ ] Message notifications (in-app)
- [ ] Chat UI component
- [ ] Message thread view
- [ ] Unread message indicators
- [ ] Email notifications for new messages
- [ ] Message history pagination

**Files to Create**:
- `backend/socket/messageHandler.js`
- `backend/services/socketService.js`
- `frontend/src/components/ChatBox.jsx`
- `frontend/src/components/MessageThread.jsx`
- `frontend/src/components/MessageNotification.jsx`
- `frontend/src/contexts/SocketContext.jsx`

#### 4. Complete Ad Features (Priority 4) ⏰ 3-4 days
**Status**: 90% Complete

**Required**:
- [ ] Click-to-reveal phone number UI
- [ ] WhatsApp contact button (wa.me links)
- [ ] Share ad functionality (social media)
- [ ] Bookmark/favorite ads (backend exists, need frontend)
- [ ] Report ad frontend form
- [ ] Ad view count increment on page view

**Files to Create/Modify**:
- `frontend/src/components/ContactSellerPanel.jsx`
- `frontend/src/components/ShareAdModal.jsx`
- `frontend/src/components/ReportAdModal.jsx`
- `frontend/src/components/FavoriteButton.jsx`
- Update `AdDetail.jsx` to include all contact features

### 🟡 IMPORTANT - Should Have for MVP

#### 5. User Dashboard Features (Priority 5) ⏰ 3 days
**Status**: 70% Complete (Dashboard exists)

**Required**:
- [ ] My Ads management (edit, promote, delete)
- [ ] Saved/Favorite ads list
- [ ] My messages inbox
- [ ] Analytics for business users (views, leads)
- [ ] Verification status tracking
- [ ] Subscription management UI

**Files to Modify/Create**:
- Update `Dashboard.jsx` with all tabs
- `frontend/src/components/MyAds.jsx`
- `frontend/src/components/SavedAds.jsx`
- `frontend/src/components/MyMessages.jsx`
- `frontend/src/components/MyAnalytics.jsx`

#### 6. Complete Admin Panel (Priority 6) ⏰ 2-3 days
**Status**: 80% Complete (routes ready)

**Required**:
- [ ] Complete admin UI for all editor routes
- [ ] Payment/revenue reports
- [ ] User analytics dashboard
- [ ] Category management UI
- [ ] Site settings management
- [ ] Promotion pricing management UI

**Files to Modify/Create**:
- Complete `EditorDashboard.jsx`
- `frontend/src/components/admin/Analytics.jsx`
- `frontend/src/components/admin/PaymentReports.jsx`
- `frontend/src/components/admin/SiteSettings.jsx`
- `frontend/src/components/admin/PromotionPricing.jsx`

#### 7. Notifications System (Priority 7) ⏰ 2-3 days
**Status**: 0% Complete

**Required**:
- [ ] Email notification service setup
- [ ] Notification templates (ad approved, rejected, new message, etc.)
- [ ] In-app notification center
- [ ] Notification preferences
- [ ] SMS notifications (optional - eSewa SMS API)

**Files to Create**:
- `backend/services/emailService.js`
- `backend/services/notificationService.js`
- `backend/templates/email/*.html` (email templates)
- `frontend/src/components/NotificationCenter.jsx`
- `frontend/src/components/NotificationBell.jsx`

### 🟢 NICE TO HAVE - Can Add After MVP

#### 8. Advanced Search Features
- [ ] Nearby/radius search
- [ ] Save search functionality
- [ ] Search history
- [ ] Search alerts (notify when new ads match criteria)

#### 9. Social Features
- [ ] User reviews/ratings
- [ ] Seller reputation score
- [ ] Follow sellers
- [ ] Share to social media

#### 10. Mobile Optimization
- [ ] PWA setup
- [ ] Push notifications
- [ ] Offline support
- [ ] App-like experience

---

## 📅 MVP IMPLEMENTATION ROADMAP

### Week 1: Payment Integration & Critical Features
**Days 1-2**: eSewa Integration
- Set up eSewa merchant account
- Implement payment gateway API
- Create payment webhook handlers
- Test payment flow

**Days 3-4**: Khalti Integration & Payment UI
- Khalti API integration
- Payment modal components
- Subscription plans UI
- Ad promotion payment flow

**Days 5-7**: Payment Admin & Testing
- Admin payment management
- Invoice generation
- Refund handling
- End-to-end payment testing

### Week 2: SEO & Frontend Completion
**Days 1-3**: SEO Setup
- Set up server-side rendering (Next.js migration OR pre-rendering)
- Implement dynamic meta tags
- Add Schema.org structured data
- Generate sitemaps

**Days 4-5**: Ad Features Completion
- Click-to-reveal phone
- WhatsApp button
- Share functionality
- Bookmark/favorite UI
- Report ad UI

**Days 6-7**: User Dashboard
- Complete My Ads tab
- Saved ads functionality
- Basic analytics

### Week 3: Messaging & Admin
**Days 1-3**: Real-time Messaging
- Socket.io setup
- Chat UI implementation
- Message notifications
- Email notifications for messages

**Days 4-5**: Admin Panel Completion
- Complete editor UI
- Payment reports
- Analytics dashboard
- Site settings

**Days 6-7**: Notifications
- Email service setup
- Notification templates
- In-app notifications

### Week 4: Testing & Launch Prep
**Days 1-2**: Complete Area Data
- Finish Kathmandu wards 8-32
- Add Lalitpur, Bhaktapur areas
- Add Pokhara areas

**Days 3-5**: Testing & Bug Fixes
- End-to-end testing
- Mobile responsiveness
- Browser compatibility
- Performance optimization
- Security audit

**Days 6-7**: Deployment & Launch
- Set up production environment
- Configure CDN
- Database optimization
- Final deployment
- Monitor and fix issues

---

## 🗂️ IMPLEMENTATION DETAILS

### Phase 1: Payment Integration (Week 1)

#### eSewa Integration Steps:
```javascript
// backend/services/esewaService.js
class EsewaService {
  initiatePayment(amount, productId, productName) {
    // Create eSewa payment form data
    // Return payment URL
  }

  verifyPayment(oid, refId, amt) {
    // Verify payment with eSewa API
    // Update database
  }
}

// backend/routes/payments.js
router.post('/esewa/initiate', authenticateToken, async (req, res) => {
  // Initiate eSewa payment for subscription or ad boost
});

router.get('/esewa/success', async (req, res) => {
  // Handle eSewa success callback
  // Verify payment and activate subscription/promotion
});

router.get('/esewa/failure', async (req, res) => {
  // Handle payment failure
});
```

#### Khalti Integration Steps:
```javascript
// backend/services/khaltiService.js
class KhaltiService {
  initiatePayment(amount, productId, productName) {
    // Khalti payment initiation
  }

  verifyPayment(token, amount) {
    // Verify with Khalti API
  }
}
```

#### Database Changes Needed:
```sql
-- Add payment transactions table
CREATE TABLE payment_transactions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  payment_type VARCHAR(50), -- 'subscription', 'ad_boost'
  payment_gateway VARCHAR(20), -- 'esewa', 'khalti'
  amount DECIMAL(10,2),
  transaction_id VARCHAR(255),
  reference_id VARCHAR(255),
  status VARCHAR(20) DEFAULT 'pending',
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  verified_at TIMESTAMP
);
```

### Phase 2: SEO Optimization (Week 2)

#### Option 1: Next.js Migration (Recommended)
- Gradually migrate React components to Next.js
- Use `getServerSideProps` for dynamic ad pages
- Use `getStaticProps` for category/location pages

#### Option 2: Pre-rendering (Faster)
- Use React Helmet for meta tags
- Implement server-side rendering for critical pages
- Use Puppeteer/Rendertron for pre-rendering

#### Meta Tags Implementation:
```jsx
// frontend/src/components/SEO.jsx
import { Helmet } from 'react-helmet-async';

export const SEO = ({ title, description, image, url, type = 'website' }) => (
  <Helmet>
    <title>{title} | ThuLoBazaar</title>
    <meta name="description" content={description} />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:image" content={image} />
    <meta property="og:url" content={url} />
    <meta property="og:type" content={type} />
    <meta name="twitter:card" content="summary_large_image" />
  </Helmet>
);

// In AdDetail.jsx
<SEO
  title={ad.title}
  description={ad.description.substring(0, 160)}
  image={ad.images[0]}
  url={`https://thulobazaar.com.np/ad/${ad.id}-${ad.slug}`}
  type="product"
/>
```

#### Schema.org Structured Data:
```jsx
// In AdDetail.jsx
<Helmet>
  <script type="application/ld+json">
    {JSON.stringify({
      "@context": "https://schema.org/",
      "@type": "Product",
      "name": ad.title,
      "image": ad.images,
      "description": ad.description,
      "offers": {
        "@type": "Offer",
        "price": ad.price,
        "priceCurrency": "NPR",
        "availability": "https://schema.org/InStock",
        "seller": {
          "@type": "Person",
          "name": ad.seller_name
        }
      }
    })}
  </script>
</Helmet>
```

### Phase 3: Real-time Messaging (Week 3)

#### Socket.io Setup:
```javascript
// backend/socket/messageHandler.js
const socketIO = require('socket.io');

function initializeSocket(server) {
  const io = socketIO(server, {
    cors: { origin: process.env.FRONTEND_URL }
  });

  io.on('connection', (socket) => {
    // Join user room
    socket.on('join', (userId) => {
      socket.join(`user_${userId}`);
    });

    // Send message
    socket.on('send_message', async (data) => {
      // Save to database
      const message = await saveMessage(data);

      // Emit to recipient
      io.to(`user_${data.recipientId}`).emit('new_message', message);
    });
  });

  return io;
}
```

#### Frontend Chat Component:
```jsx
// frontend/src/components/ChatBox.jsx
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

export const ChatBox = ({ adId, sellerId }) => {
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io(API_URL);
    newSocket.emit('join', user.id);

    newSocket.on('new_message', (message) => {
      setMessages(prev => [...prev, message]);
    });

    setSocket(newSocket);

    return () => newSocket.close();
  }, []);

  const sendMessage = (text) => {
    socket.emit('send_message', {
      adId,
      recipientId: sellerId,
      text
    });
  };

  return (
    <div className="chat-box">
      {/* Chat UI */}
    </div>
  );
};
```

---

## 🎯 MVP FEATURE CHECKLIST

### Core User Flows (Must Work Perfectly)

#### 1. Guest User Flow ✅
- [x] Browse ads without login
- [x] Search and filter ads
- [x] View ad details
- [ ] Must see: Click to reveal phone (prompt login)
- [ ] Must see: Contact seller (prompt login)

#### 2. Individual User Flow
- [x] Register account
- [x] Login
- [x] Post ad
- [x] Wait for approval (4h SLA)
- [ ] Get email notification when approved
- [ ] Edit approved ad
- [ ] View my ads dashboard
- [ ] Receive messages from buyers
- [ ] Reply to messages
- [ ] Bookmark favorite ads
- [ ] Share ads

#### 3. Business Verification Flow (Optional for sellers)
- [x] User registers as individual seller (default)
- [x] User posts ads and builds reputation
- [ ] User decides to get **Business Verification** (Gold Badge)
- [ ] User pays **NPR 1,000** verification fee (eSewa/Khalti)
- [x] User submits business license/PAN card documents
- [x] Wait for editor manual verification
- [x] If approved → Get **Gold Badge** + business name displayed
- [ ] Get **30-40% discount** on ad promotions
- [x] Post ads (now shows gold badge)
- [ ] Access business analytics
- [ ] Pay discounted rates for ad promotions (bump/sticky/urgent)

#### 4. Editor Flow ✅
- [x] Login to editor panel
- [x] View pending ads queue
- [x] Approve/reject/edit ads
- [x] Bulk actions
- [x] Verify businesses manually
- [x] Suspend users
- [x] View activity logs

#### 5. Admin Flow
- [x] All editor capabilities
- [ ] View payment/revenue reports
- [ ] Manage promotion pricing
- [ ] Manage editors
- [ ] View analytics dashboard
- [ ] Site settings

---

## 🔧 TECHNICAL REQUIREMENTS

### Environment Setup Needed:

#### Production Requirements:
1. **Domain & SSL**
   - thulobazaar.com.np domain
   - SSL certificate (Let's Encrypt)

2. **Payment Gateway Accounts**
   - eSewa merchant account
   - Khalti merchant account
   - Bank account for settlements

3. **Server Infrastructure**
   - VPS or cloud hosting (AWS, DigitalOcean, Linode)
   - PostgreSQL database (managed or self-hosted)
   - Redis for caching & Socket.io
   - Typesense instance
   - CDN for images (AWS S3 + CloudFront, or DigitalOcean Spaces)

4. **Email Service**
   - SMTP service (SendGrid, AWS SES, or Mailgun)
   - Email templates

5. **Monitoring**
   - Error tracking (Sentry)
   - Uptime monitoring
   - Performance monitoring

### Current .env Variables Needed:
```bash
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/thulobazaar

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRY=7d

# File Upload
UPLOAD_PATH=/uploads
MAX_FILE_SIZE=5242880

# Typesense
TYPESENSE_HOST=localhost
TYPESENSE_PORT=8108
TYPESENSE_API_KEY=your-api-key

# Payment Gateways
ESEWA_MERCHANT_ID=
ESEWA_SECRET_KEY=
ESEWA_SUCCESS_URL=
ESEWA_FAILURE_URL=

KHALTI_PUBLIC_KEY=
KHALTI_SECRET_KEY=
KHALTI_WEBHOOK_SECRET=

# Email
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASSWORD=
EMAIL_FROM=

# Frontend URL
FRONTEND_URL=http://localhost:5173

# Socket.io
SOCKET_PORT=3001
```

---

## 📈 PERFORMANCE TARGETS

### MVP Performance Goals:
- **Page Load Time**: < 3s (4G connection)
- **Time to Interactive**: < 5s
- **Search Response**: < 500ms
- **Image Load**: < 2s (with lazy loading)
- **Database Queries**: < 200ms average
- **API Response**: < 300ms average

### Optimization Strategies:
1. **Database**:
   - All indexes are in place ✅
   - Connection pooling configured
   - Query optimization
   - Read replicas for scaling

2. **Frontend**:
   - Code splitting
   - Lazy loading images ✅
   - Minimize bundle size
   - Cache API responses

3. **CDN**:
   - Serve images from CDN
   - Static asset caching
   - Gzip/Brotli compression

4. **Caching**:
   - Redis for hot data
   - Browser caching headers
   - API response caching

---

## 🧪 TESTING CHECKLIST

### Before MVP Launch:

#### Functional Testing:
- [ ] User registration/login
- [ ] Post ad flow (individual)
- [ ] Post ad flow (business)
- [ ] Editor approval workflow
- [ ] Payment flow (eSewa)
- [ ] Payment flow (Khalti)
- [ ] Search and filters
- [ ] Messaging system
- [ ] Notifications
- [ ] Mobile responsiveness

#### Security Testing:
- [ ] SQL injection prevention
- [ ] XSS protection
- [ ] CSRF tokens
- [ ] Rate limiting
- [ ] Input validation
- [ ] Authentication bypass attempts
- [ ] Authorization checks

#### Performance Testing:
- [ ] Load testing (500 concurrent users)
- [ ] Database performance
- [ ] Image loading
- [ ] Search performance
- [ ] API response times

#### Browser Testing:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile browsers (iOS Safari, Chrome Mobile)

---

## 🚀 DEPLOYMENT PLAN

### Pre-Launch Checklist:
- [ ] Apply all database migrations
- [ ] Configure production environment variables
- [ ] Set up SSL certificate
- [ ] Configure payment gateways
- [ ] Set up email service
- [ ] Configure CDN for images
- [ ] Set up Redis
- [ ] Set up Typesense cluster
- [ ] Configure backups (daily DB dumps)
- [ ] Set up monitoring (Sentry, uptime)
- [ ] Create admin account
- [ ] Create initial editor accounts
- [ ] Test all critical flows in staging

### Launch Day:
1. Final database backup
2. Deploy backend to production
3. Deploy frontend to production
4. Verify all services are running
5. Test critical flows
6. Monitor error logs
7. Be ready for hotfixes

### Post-Launch (First Week):
- Monitor performance metrics
- Fix critical bugs immediately
- Gather user feedback
- Plan iteration 2 features

---

## 📝 IMMEDIATE NEXT STEPS

### This Week (Priority Order):

1. **Day 1-2**: Payment Integration Research
   - Sign up for eSewa merchant account
   - Sign up for Khalti merchant account
   - Read API documentation
   - Set up test credentials

2. **Day 3-4**: Payment Backend Implementation
   - Create payment routes
   - Implement eSewa service
   - Implement Khalti service
   - Test payment webhooks

3. **Day 5-7**: Payment Frontend & Testing
   - Create payment UI components
   - Integrate with backend
   - End-to-end payment testing

### Next Week:
- SEO setup (meta tags, structured data)
- Complete ad contact features
- Real-time messaging implementation

---

## 💰 ESTIMATED COSTS (Monthly)

### Infrastructure:
- **VPS/Cloud**: $20-50/month (DigitalOcean, Linode)
- **Database**: $15-30/month (managed PostgreSQL)
- **CDN**: $5-20/month (based on traffic)
- **Redis**: $10-20/month (managed Redis)
- **Email Service**: $10-15/month (SendGrid starter)
- **SSL**: $0 (Let's Encrypt)
- **Domain**: $15/year

**Total**: ~$60-135/month for MVP

### Payment Gateway Fees:
- **eSewa**: 2-3% transaction fee
- **Khalti**: 3.5-4% transaction fee

---

## 🎓 LEARNING RESOURCES

### For Missing Features:

#### Payment Integration:
- eSewa API Docs: https://developer.esewa.com.np/
- Khalti API Docs: https://docs.khalti.com/

#### SEO & SSR:
- Next.js Docs: https://nextjs.org/docs
- React Helmet: https://github.com/nfl/react-helmet

#### Real-time:
- Socket.io Docs: https://socket.io/docs/
- Socket.io with React: https://socket.io/how-to/use-with-react

#### Email:
- Nodemailer: https://nodemailer.com/
- Email Templates: https://github.com/forwardemail/email-templates

---

## ✅ SUCCESS METRICS (Post-MVP)

### Month 1 Goals:
- 100+ registered users
- 500+ posted ads
- 50+ business accounts
- 1,000+ daily page views
- 5+ successful subscriptions

### Month 3 Goals:
- 1,000+ users
- 5,000+ ads
- 200+ businesses
- 10,000+ daily page views
- Revenue: $500+/month

### Month 6 Goals:
- 10,000+ users
- 50,000+ ads
- 1,000+ businesses
- 100,000+ daily page views
- Revenue: $2,000+/month

---

## 🔄 POST-MVP ROADMAP

### Version 1.1 (1-2 months after MVP):
- Mobile app (React Native)
- Advanced search (nearby, saved searches)
- User reviews/ratings
- WhatsApp business integration
- SMS notifications

### Version 1.2 (3-4 months):
- Multiple images per ad (done) + video support
- Live chat with typing indicators
- Advanced analytics for businesses
- API for third-party integrations
- Affiliate/referral system

### Version 2.0 (6+ months):
- AI-powered ad recommendations
- Fraud detection system
- Multi-language support (Nepali)
- Seller verification with government ID
- Escrow payment system (for safety)

---

**Document Version**: 1.0
**Last Updated**: 2025-10-09
**Status**: Ready for Implementation
**Next Review**: Weekly during development
