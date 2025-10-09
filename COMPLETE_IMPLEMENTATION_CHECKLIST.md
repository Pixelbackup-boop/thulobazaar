# ✅ ThuLoBazaar - Complete Implementation Checklist

## 📊 Current Status: 75% Complete

**What's Done:** Backend (100%), Database (95%), Frontend (85%)
**What's Missing:** Payment (0%), SEO (20%), Messaging (60%), Notifications (0%)

**📚 Related Documentation:**
- **[AD_PROMOTION_SYSTEM.md](AD_PROMOTION_SYSTEM.md)** - Complete 3-tier ad promotion system details
- **[PROJECT_STATUS.md](PROJECT_STATUS.md)** - Current project status
- **[VERIFICATION_SYSTEM_EXPLAINED.md](VERIFICATION_SYSTEM_EXPLAINED.md)** - Verification system guide

---

## 🔴 PHASE 1: CRITICAL - Revenue Blockers (Week 1)

### 1.1 Payment Gateway Integration ⚠️ HIGHEST PRIORITY

#### eSewa Integration
- [ ] **Sign up for eSewa merchant account** (Day 1)
  - Visit: https://developer.esewa.com.np/
  - Register business account
  - Get merchant credentials (Merchant ID, Secret Key)
  - Get test environment credentials

- [ ] **Backend - eSewa Service** (Day 1-2)
  - [ ] Create `backend/services/esewaService.js`
  - [ ] Implement `initiatePayment(amount, productId, productName)`
  - [ ] Implement `verifyPayment(oid, refId, amt)`
  - [ ] Implement signature generation/validation
  - [ ] Error handling for payment failures

- [ ] **Backend - Payment Routes** (Day 2)
  - [ ] Create `backend/routes/payments.js`
  - [ ] `POST /api/payments/esewa/initiate` - Start payment
  - [ ] `GET /api/payments/esewa/success` - Success callback
  - [ ] `GET /api/payments/esewa/failure` - Failure callback
  - [ ] `POST /api/payments/esewa/verify` - Verify payment

- [ ] **Database - Payment Transactions** (Day 2)
  ```sql
  CREATE TABLE payment_transactions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    payment_type VARCHAR(50), -- 'individual_verification', 'business_verification', 'ad_promotion'
    payment_gateway VARCHAR(20), -- 'esewa', 'khalti'
    amount DECIMAL(10,2),
    transaction_id VARCHAR(255),
    reference_id VARCHAR(255),
    related_id INTEGER, -- verification_request_id or ad_id
    status VARCHAR(20) DEFAULT 'pending',
    metadata JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    verified_at TIMESTAMP,
    payment_url TEXT
  );
  ```

#### Khalti Integration
- [ ] **Sign up for Khalti merchant account** (Day 3)
  - Visit: https://khalti.com/
  - Register merchant account
  - Get API credentials (Public Key, Secret Key)
  - Get test credentials

- [ ] **Backend - Khalti Service** (Day 3)
  - [ ] Create `backend/services/khaltiService.js`
  - [ ] Implement `initiatePayment(amount, productId, productName, returnUrl)`
  - [ ] Implement `verifyPayment(token, amount)`
  - [ ] Error handling

- [ ] **Backend - Khalti Routes** (Day 3)
  - [ ] `POST /api/payments/khalti/initiate`
  - [ ] `POST /api/payments/khalti/verify`
  - [ ] `GET /api/payments/khalti/success`
  - [ ] `GET /api/payments/khalti/failure`

#### Payment Integration - Verification Fees
- [ ] **Individual Verification Payment** (Day 4)
  - [ ] Add payment step to individual verification flow
  - [ ] Set verification fee amount (e.g., NPR 500)
  - [ ] Create payment before document upload
  - [ ] Only allow document upload after payment verified
  - [ ] Update verification request with payment_transaction_id

- [ ] **Business Verification Payment** (Day 4)
  - [ ] Add payment step to business verification flow
  - [ ] Set fee to NPR 1,000 (already defined in code)
  - [ ] Create payment before document upload
  - [ ] Only allow document upload after payment verified
  - [ ] Update verification request with payment_transaction_id

#### Payment Integration - Ad Promotions (3-Tier System)
- [ ] **Ad Promotion Payment** (Day 5)
  - [ ] **Define 3-tier promotion pricing:**
    ```javascript
    // See AD_PROMOTION_SYSTEM.md for complete details
    const PROMOTION_PRICES = {
      // TIER 1: Featured (Homepage + Search + Category - Highest Visibility)
      featured: {
        regular: { 3: 1000, 7: 2000, 15: 3500 },
        business: { 3: 600, 7: 1200, 15: 2100 } // 40% discount
      },
      // TIER 2: Urgent Sale (Top of Category, above Sticky - Quick Sales)
      urgent: {
        regular: { 3: 500, 7: 1000, 15: 1750 },
        business: { 3: 300, 7: 600, 15: 1050 } // 40% discount
      },
      // TIER 3: Sticky/Bump (Top of Category, below Urgent - Standard)
      sticky: {
        regular: { 3: 100, 7: 200, 15: 350 },
        business: { 3: 70, 7: 140, 15: 245 } // 30% discount
      }
    };
    ```
  - [ ] **Promotion Tier Descriptions:**
    - **🌟 FEATURED:** Show on homepage, search page, and category (max visibility)
    - **🔥 URGENT:** Top of subcategory, above sticky (for quick sales)
    - **📌 STICKY/BUMP:** Stay at top of subcategory, below urgent (standard promo)
  - [ ] Create promotion payment flow for all 3 tiers
  - [ ] Apply 30-40% discount for verified businesses
  - [ ] Activate promotion after payment verified
  - [ ] Set expiry dates for promotions (3, 7, or 15 days)

#### Frontend - Payment UI
- [ ] **Payment Components** (Day 6)
  - [ ] Create `frontend/src/components/PaymentModal.jsx`
    - [ ] Gateway selection (eSewa/Khalti)
    - [ ] Amount display
    - [ ] Terms & conditions
    - [ ] Loading states
  - [ ] Create `frontend/src/components/payment/EsewaButton.jsx`
  - [ ] Create `frontend/src/components/payment/KhaltiButton.jsx`
  - [ ] Create `frontend/src/pages/PaymentSuccess.jsx`
  - [ ] Create `frontend/src/pages/PaymentFailure.jsx`

- [ ] **Integrate Payment into Verification** (Day 6)
  - [ ] Update `IndividualVerificationForm.jsx` - Add payment step
  - [ ] Update `BusinessVerificationForm.jsx` - Add payment step
  - [ ] Show payment modal before document upload
  - [ ] Verify payment completion before showing upload form

- [ ] **Integrate Payment into Ad Promotions** (Day 7)
  - [ ] Create `frontend/src/components/PromoteAdModal.jsx`
  - [ ] **Show 3-tier promotion options:**
    - [ ] 🌟 FEATURED (Homepage + Search + Category) - Highest price
    - [ ] 🔥 URGENT (Top of category, above sticky) - Mid price
    - [ ] 📌 STICKY/BUMP (Top of category, standard) - Lowest price
  - [ ] Display duration options (3/7/15 days)
  - [ ] Display prices with business discount if applicable (30-40% off)
  - [ ] Show savings for verified businesses
  - [ ] Payment flow for ad promotion (eSewa/Khalti)
  - [ ] Badge preview for each tier
  - [ ] **See `AD_PROMOTION_SYSTEM.md` for complete implementation details**

#### Testing & Documentation
- [ ] **Test Payment Flows** (Day 7)
  - [ ] Test eSewa payment (sandbox)
  - [ ] Test Khalti payment (sandbox)
  - [ ] Test individual verification payment
  - [ ] Test business verification payment
  - [ ] Test ad promotion payment
  - [ ] Test payment failures
  - [ ] Test with real money (small amounts)

- [ ] **Payment Documentation**
  - [ ] Document payment flow
  - [ ] API documentation
  - [ ] Error codes and handling

---

## 🟡 PHASE 2: SEO & User Features (Week 2)

### 2.1 SEO Optimization ⚠️ CRITICAL FOR TRAFFIC

#### Meta Tags & Structured Data
- [ ] **Install Dependencies**
  ```bash
  cd frontend
  npm install react-helmet-async
  npm install react-snap # For pre-rendering
  ```

- [ ] **SEO Component** (Day 1)
  - [ ] Create `frontend/src/components/SEO.jsx`
  ```jsx
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
      <link rel="canonical" href={url} />
    </Helmet>
  );
  ```

- [ ] **Add SEO to All Pages** (Day 1-2)
  - [ ] `Home.jsx` - Site meta
  - [ ] `AdDetail.jsx` - Product schema
  - [ ] `SearchResults.jsx` - Listing schema
  - [ ] `ShopProfile.jsx` - LocalBusiness schema
  - [ ] `SellerProfile.jsx` - Person schema
  - [ ] Category pages - Category meta

- [ ] **Schema.org Structured Data** (Day 2)
  - [ ] Product schema for ads
  ```jsx
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
        "priceCurrency": "NPR"
      }
    })}
  </script>
  ```
  - [ ] LocalBusiness schema for shops
  - [ ] BreadcrumbList schema for navigation

#### Sitemap & Robots.txt
- [ ] **Sitemap Generation** (Day 2)
  - [ ] Create `backend/routes/sitemap.js`
  - [ ] Generate XML sitemap for:
    - [ ] All approved ads
    - [ ] All categories
    - [ ] All locations
    - [ ] All verified shops
  - [ ] Update daily
  - [ ] Route: `GET /sitemap.xml`

- [ ] **Robots.txt** (Day 2)
  - [ ] Create `frontend/public/robots.txt`
  ```
  User-agent: *
  Allow: /
  Disallow: /dashboard
  Disallow: /admin
  Sitemap: https://thulobazaar.com.np/sitemap.xml
  ```

#### Pre-rendering / SSR
- [ ] **Option 1: React Snap (Simpler)** (Day 3)
  - [ ] Configure react-snap in package.json
  - [ ] Pre-render static pages
  - [ ] Deploy pre-rendered pages

- [ ] **Option 2: Next.js Migration (Better)** (Day 3-4)
  - [ ] Install Next.js
  - [ ] Migrate pages gradually
  - [ ] Use getServerSideProps for dynamic pages
  - [ ] Use getStaticProps for static pages
  - [ ] Configure routes

#### Image Optimization
- [ ] **Image SEO** (Day 3)
  - [ ] Add alt attributes to all images
  - [ ] Implement lazy loading (already done?)
  - [ ] Optimize image sizes
  - [ ] Set up CDN for images

### 2.2 Contact & Interaction Features

#### Click-to-Reveal Phone Number
- [ ] **Backend - Phone Reveal Tracking** (Day 4)
  ```javascript
  // Track when phone number is revealed
  router.post('/api/ads/:id/reveal-phone', async (req, res) => {
    await pool.query(`
      INSERT INTO phone_reveals (ad_id, user_id, ip_address)
      VALUES ($1, $2, $3)
    `, [adId, userId, ip]);
  });
  ```

- [ ] **Frontend - Phone Reveal Component** (Day 4)
  - [ ] Create `frontend/src/components/PhoneReveal.jsx`
  ```jsx
  const [revealed, setRevealed] = useState(false);

  const revealPhone = async () => {
    await api.post(`/ads/${adId}/reveal-phone`);
    setRevealed(true);
  };

  return revealed ? (
    <a href={`tel:${phone}`}>{phone}</a>
  ) : (
    <button onClick={revealPhone}>Click to show phone</button>
  );
  ```
  - [ ] Integrate into `AdDetail.jsx`

#### WhatsApp Contact Button
- [ ] **WhatsApp Deep Link** (Day 4)
  - [ ] Create `frontend/src/components/WhatsAppButton.jsx`
  ```jsx
  const whatsappUrl = `https://wa.me/${phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Hi, I'm interested in: ${adTitle}`)}`;

  return (
    <a href={whatsappUrl} target="_blank" className="whatsapp-btn">
      <i className="fab fa-whatsapp"></i> WhatsApp
    </a>
  );
  ```
  - [ ] Integrate into `AdDetail.jsx`
  - [ ] Add to `ShopProfile.jsx`

#### Share Functionality
- [ ] **Share Button** (Day 5)
  - [ ] Create `frontend/src/components/ShareButton.jsx`
  - [ ] Web Share API implementation
  ```jsx
  const share = async () => {
    if (navigator.share) {
      await navigator.share({
        title: ad.title,
        text: ad.description,
        url: window.location.href
      });
    } else {
      // Fallback: copy to clipboard
    }
  };
  ```
  - [ ] Social media share links (Facebook, Twitter)
  - [ ] Copy link to clipboard

#### Bookmark/Favorite Ads
- [ ] **Backend - Favorites** (Day 5)
  ```sql
  CREATE TABLE favorites (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    ad_id INTEGER REFERENCES ads(id),
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, ad_id)
  );
  ```
  - [ ] `POST /api/favorites/:adId` - Add to favorites
  - [ ] `DELETE /api/favorites/:adId` - Remove from favorites
  - [ ] `GET /api/favorites` - Get user's favorites

- [ ] **Frontend - Favorite Button** (Day 5)
  - [ ] Create `frontend/src/components/FavoriteButton.jsx`
  - [ ] Heart icon with toggle
  - [ ] Integrate into `AdCard.jsx`
  - [ ] Integrate into `AdDetail.jsx`
  - [ ] Show favorites list in Dashboard

### 2.3 Verification Badge Display

#### Badge Components
- [ ] **Badge UI Components** (Day 6)
  - [ ] Create `frontend/src/components/VerificationBadge.jsx`
  ```jsx
  export const VerificationBadge = ({ type }) => {
    if (type === 'individual') {
      return (
        <span className="badge badge-blue">
          <i className="fas fa-check-circle"></i> Verified Seller
        </span>
      );
    }
    if (type === 'business') {
      return (
        <span className="badge badge-gold">
          <i className="fas fa-certificate"></i> Verified Business
        </span>
      );
    }
    return null;
  };
  ```

- [ ] **Badge Styling** (Day 6)
  ```css
  .badge {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
  }

  .badge-blue {
    background: #1DA1F2;
    color: white;
  }

  .badge-gold {
    background: linear-gradient(135deg, #FFD700, #FFA500);
    color: #000;
  }
  ```

- [ ] **Integrate Badges** (Day 6-7)
  - [ ] Show in `AdDetail.jsx` (seller info)
  - [ ] Show in `AdCard.jsx` (ad listings)
  - [ ] Show in `SearchResults.jsx`
  - [ ] Show in `ShopProfile.jsx` (prominent)
  - [ ] Show in `SellerProfile.jsx`
  - [ ] Show in `Header.jsx` (user menu)

### 2.4 Name Lock Enforcement

- [ ] **Frontend - Name Lock** (Day 7)
  - [ ] Update `Profile.jsx` edit form
  ```jsx
  const isNameLocked = user.individual_verified ||
                       user.business_verification_status === 'approved';

  <input
    type="text"
    value={isNameLocked ? user.verified_seller_name || user.business_name : name}
    disabled={isNameLocked}
    className={isNameLocked ? 'locked-field' : ''}
  />
  {isNameLocked && (
    <p className="help-text">
      <i className="fas fa-lock"></i> Name locked (Verified)
    </p>
  )}
  ```

- [ ] **Backend - Name Lock** (Day 7)
  - [ ] Add validation to profile update route
  ```javascript
  if (user.individual_verified || user.business_verification_status === 'approved') {
    if (req.body.full_name && req.body.full_name !== user.verified_seller_name) {
      return res.status(400).json({
        error: 'Cannot change name while verified'
      });
    }
  }
  ```

---

## 🟠 PHASE 3: Communication & Notifications (Week 3)

### 3.1 Real-time Messaging System

#### Socket.io Setup
- [ ] **Install Dependencies** (Day 1)
  ```bash
  npm install socket.io      # Backend
  npm install socket.io-client   # Frontend
  ```

- [ ] **Backend - Socket Server** (Day 1)
  - [ ] Create `backend/socket/index.js`
  ```javascript
  const socketIO = require('socket.io');

  function initializeSocket(server) {
    const io = socketIO(server, {
      cors: { origin: process.env.FRONTEND_URL }
    });

    io.on('connection', (socket) => {
      socket.on('join', (userId) => {
        socket.join(`user_${userId}`);
      });

      socket.on('send_message', async (data) => {
        const message = await saveMessage(data);
        io.to(`user_${data.recipientId}`).emit('new_message', message);
      });
    });

    return io;
  }
  ```
  - [ ] Initialize in `server.js`

#### Message Database Schema
- [ ] **Update Messages Table** (Day 1)
  ```sql
  -- contact_messages table already exists, just add indexes
  CREATE INDEX idx_messages_thread ON contact_messages(ad_id, seller_id, buyer_id);
  CREATE INDEX idx_messages_unread ON contact_messages(seller_id, is_read) WHERE is_read = false;
  ```

#### Backend Message Routes
- [ ] **Message API** (Day 2)
  - [ ] `GET /api/messages` - Get user's messages
  - [ ] `GET /api/messages/threads` - Get message threads
  - [ ] `GET /api/messages/thread/:adId/:otherUserId` - Get specific thread
  - [ ] `POST /api/messages` - Send message (also via socket)
  - [ ] `PUT /api/messages/:id/read` - Mark as read
  - [ ] `GET /api/messages/unread-count` - Unread count

#### Frontend - Chat Components
- [ ] **Chat UI** (Day 3-4)
  - [ ] Create `frontend/src/contexts/SocketContext.jsx`
  - [ ] Create `frontend/src/components/chat/ChatBox.jsx`
  - [ ] Create `frontend/src/components/chat/MessageThread.jsx`
  - [ ] Create `frontend/src/components/chat/MessageList.jsx`
  - [ ] Create `frontend/src/components/chat/MessageInput.jsx`
  - [ ] Create `frontend/src/components/chat/ChatNotification.jsx`

- [ ] **Integrate Chat** (Day 4-5)
  - [ ] Add "Message Seller" button in `AdDetail.jsx`
  - [ ] Add messages tab in `Dashboard.jsx`
  - [ ] Show unread count in Header
  - [ ] Real-time message updates
  - [ ] Typing indicators (optional)

### 3.2 Email Notification System

#### Email Service Setup
- [ ] **Choose Email Service** (Day 5)
  - Option 1: SendGrid
  - Option 2: AWS SES
  - Option 3: Mailgun
  - [ ] Sign up and get API key

- [ ] **Install Nodemailer** (Day 5)
  ```bash
  npm install nodemailer
  ```

- [ ] **Email Service** (Day 5)
  - [ ] Create `backend/services/emailService.js`
  ```javascript
  const nodemailer = require('nodemailer');

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD
    }
  });

  async function sendEmail({ to, subject, html }) {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html
    });
  }
  ```

#### Email Templates
- [ ] **Create Templates** (Day 6)
  - [ ] `backend/templates/email/welcome.html`
  - [ ] `backend/templates/email/ad-approved.html`
  - [ ] `backend/templates/email/ad-rejected.html`
  - [ ] `backend/templates/email/verification-approved.html`
  - [ ] `backend/templates/email/verification-rejected.html`
  - [ ] `backend/templates/email/new-message.html`
  - [ ] `backend/templates/email/payment-receipt.html`

#### Email Notifications Implementation
- [ ] **Trigger Emails** (Day 6)
  - [ ] Ad approved → Email to poster
  - [ ] Ad rejected → Email to poster with reason
  - [ ] Verification approved → Email to user
  - [ ] Verification rejected → Email with reason
  - [ ] New message → Email to recipient
  - [ ] Payment success → Receipt email
  - [ ] Ad expires soon → Reminder email

### 3.3 In-App Notifications

- [ ] **Notifications Table** (Day 7)
  ```sql
  CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    type VARCHAR(50), -- 'ad_approved', 'new_message', 'verification_approved', etc.
    title VARCHAR(255),
    message TEXT,
    link VARCHAR(255),
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW()
  );
  ```

- [ ] **Notification API** (Day 7)
  - [ ] `GET /api/notifications` - Get user notifications
  - [ ] `PUT /api/notifications/:id/read` - Mark as read
  - [ ] `PUT /api/notifications/read-all` - Mark all as read
  - [ ] `GET /api/notifications/unread-count` - Unread count

- [ ] **Frontend - Notification Center** (Day 7)
  - [ ] Create `frontend/src/components/NotificationBell.jsx`
  - [ ] Create `frontend/src/components/NotificationDropdown.jsx`
  - [ ] Add to Header
  - [ ] Show unread count badge
  - [ ] Real-time updates via Socket.io

---

## 🟢 PHASE 4: Admin Panel & Business Features (Week 3-4)

### 4.1 Complete Admin Panel UI

#### Editor Dashboard Enhancements
- [ ] **Verification Queue** (Day 1)
  - [ ] Create `frontend/src/components/admin/VerificationQueue.jsx`
  - [ ] Show individual verification requests
  - [ ] Show business verification requests
  - [ ] View submitted documents
  - [ ] Approve/Reject with reason
  - [ ] Activity logs

- [ ] **Payment Management** (Day 2)
  - [ ] Create `frontend/src/components/admin/PaymentReports.jsx`
  - [ ] List all transactions
  - [ ] Filter by type, status, date
  - [ ] Export to CSV
  - [ ] Revenue summary

- [ ] **Analytics Dashboard** (Day 2)
  - [ ] Create `frontend/src/components/admin/Analytics.jsx`
  - [ ] Total users, ads, revenue charts
  - [ ] Growth trends
  - [ ] Top categories
  - [ ] Top locations
  - [ ] Editor performance metrics

#### Site Settings
- [ ] **Settings Management** (Day 3)
  - [ ] Create `frontend/src/components/admin/SiteSettings.jsx`
  - [ ] Verification fees configuration
  - [ ] Promotion pricing management
  - [ ] Site-wide announcements
  - [ ] Maintenance mode toggle

### 4.2 Business Discount Implementation

- [ ] **Discount Calculation** (Day 3)
  - [ ] Create `backend/services/pricingService.js`
  ```javascript
  function getPromotionPrice(promotionType, userType) {
    const basePrice = PRICES[promotionType];
    if (userType === 'business_verified') {
      return basePrice * 0.65; // 35% discount
    }
    return basePrice;
  }
  ```

- [ ] **Apply Discounts** (Day 3)
  - [ ] Check if user is business verified
  - [ ] Calculate discounted price
  - [ ] Show savings in UI
  - [ ] Apply to payment amount

### 4.3 User Dashboard Completion

- [ ] **My Ads Tab** (Day 4)
  - [ ] Create `frontend/src/components/dashboard/MyAds.jsx`
  - [ ] List user's ads
  - [ ] Edit/Delete actions
  - [ ] Promote button (opens payment modal)
  - [ ] View analytics per ad

- [ ] **Saved Ads Tab** (Day 4)
  - [ ] Create `frontend/src/components/dashboard/SavedAds.jsx`
  - [ ] List favorited ads
  - [ ] Remove from favorites
  - [ ] Quick contact seller

- [ ] **Messages Tab** (Day 4)
  - [ ] Already created in messaging section
  - [ ] Integrate into dashboard

- [ ] **Analytics Tab (For Verified Business)** (Day 5)
  - [ ] Create `frontend/src/components/dashboard/MyAnalytics.jsx`
  - [ ] Ad views over time
  - [ ] Phone reveals count
  - [ ] Messages received
  - [ ] Top performing ads

---

## 🔵 PHASE 5: Final Polish & Testing (Week 4)

### 5.1 Complete Location Data

- [ ] **Kathmandu Wards 8-32** (Day 1)
  - [ ] Add area data for wards 8-32
  - [ ] 3-4 areas per ward
  - [ ] Update migration 012

- [ ] **Lalitpur Areas** (Day 1)
  - [ ] Add popular areas in Lalitpur Metropolitan City
  - [ ] Patan, Jhamsikhel, Sanepa, Pulchowk, etc.

- [ ] **Bhaktapur Areas** (Day 1)
  - [ ] Add popular areas in Bhaktapur Municipality
  - [ ] Durbar Square, Surya Binayak, etc.

- [ ] **Pokhara Areas** (Day 1)
  - [ ] Add popular areas in Pokhara Metropolitan City
  - [ ] Lakeside, Baidam, Chipledhunga, etc.

### 5.2 Report Ad Feature

- [ ] **Report System** (Day 2)
  ```sql
  -- ad_reports table already exists
  -- Just need frontend integration
  ```

- [ ] **Frontend - Report Modal** (Day 2)
  - [ ] Create `frontend/src/components/ReportAdModal.jsx`
  - [ ] Report reasons (spam, scam, inappropriate, etc.)
  - [ ] Description field
  - [ ] Submit report
  - [ ] Integrate into `AdDetail.jsx`

- [ ] **Admin - Reports Management** (Day 2)
  - [ ] View all reports
  - [ ] Take action on reported ads
  - [ ] Ban users if needed

### 5.3 Testing & Bug Fixes

#### Functional Testing (Day 3-5)
- [ ] **User Flow Testing**
  - [ ] User registration/login
  - [ ] Post ad → Approval → Goes live
  - [ ] Individual verification (with payment)
  - [ ] Business verification (with payment)
  - [ ] Ad promotion (with payment)
  - [ ] Search and filters
  - [ ] Contact seller (phone, WhatsApp, chat)
  - [ ] Bookmark ads
  - [ ] Share ads

- [ ] **Editor Flow Testing**
  - [ ] Login to editor panel
  - [ ] Approve/reject ads
  - [ ] Verify individual/business requests
  - [ ] View analytics
  - [ ] Bulk actions

- [ ] **Payment Testing**
  - [ ] eSewa payment (test & production)
  - [ ] Khalti payment (test & production)
  - [ ] Payment failures
  - [ ] Refund scenarios

#### Performance Testing (Day 4)
- [ ] Load testing (100+ concurrent users)
- [ ] Database query optimization
- [ ] Image loading performance
- [ ] Search performance (Typesense)
- [ ] Page load times (< 3s target)

#### Security Testing (Day 4)
- [ ] SQL injection prevention
- [ ] XSS protection
- [ ] CSRF protection
- [ ] Authentication bypass attempts
- [ ] Authorization checks
- [ ] Rate limiting effectiveness
- [ ] File upload security

#### Browser/Device Testing (Day 5)
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile browsers (iOS Safari, Chrome Mobile)
- [ ] Responsive design (320px to 1920px)

### 5.4 Production Preparation

#### Environment Setup (Day 6)
- [ ] **Domain & SSL**
  - [ ] Configure domain (thulobazaar.com.np)
  - [ ] Install SSL certificate (Let's Encrypt)
  - [ ] Set up HTTPS redirect

- [ ] **Server Setup**
  - [ ] VPS/Cloud hosting provisioned
  - [ ] Node.js installed
  - [ ] PostgreSQL configured
  - [ ] Redis installed
  - [ ] Typesense running
  - [ ] Nginx reverse proxy

- [ ] **CDN Setup**
  - [ ] CloudFlare or AWS CloudFront
  - [ ] Configure image serving
  - [ ] Set caching rules

#### Database (Day 6)
- [ ] Apply all migrations in order
- [ ] Create database backups (daily automated)
- [ ] Set up connection pooling
- [ ] Configure read replicas (if needed)

#### Environment Variables (Day 6)
```bash
# Production .env
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://...
JWT_SECRET=<strong-secret>
ESEWA_MERCHANT_ID=...
ESEWA_SECRET_KEY=...
KHALTI_PUBLIC_KEY=...
KHALTI_SECRET_KEY=...
SMTP_HOST=...
SMTP_USER=...
SMTP_PASSWORD=...
EMAIL_FROM=noreply@thulobazaar.com.np
FRONTEND_URL=https://thulobazaar.com.np
TYPESENSE_HOST=...
TYPESENSE_API_KEY=...
```

#### Monitoring (Day 7)
- [ ] **Error Tracking**
  - [ ] Set up Sentry
  - [ ] Configure error alerts

- [ ] **Uptime Monitoring**
  - [ ] Set up UptimeRobot or Pingdom
  - [ ] Configure downtime alerts

- [ ] **Analytics**
  - [ ] Google Analytics
  - [ ] Track key events (signups, ads posted, payments)

#### Deployment (Day 7)
- [ ] **Backend Deployment**
  - [ ] Build production bundle
  - [ ] Deploy to server
  - [ ] Set up PM2 or systemd
  - [ ] Configure auto-restart

- [ ] **Frontend Deployment**
  - [ ] Build production bundle
  - [ ] Deploy to CDN or server
  - [ ] Configure Nginx

- [ ] **Final Checks**
  - [ ] Test all critical flows
  - [ ] Verify payments work
  - [ ] Check email delivery
  - [ ] Test real-time features
  - [ ] Monitor error logs

---

## 📊 SUMMARY - What You Need to Do

### Week 1: Payment Integration (CRITICAL)
**Days 1-2:** eSewa + Khalti setup and backend
**Days 3-4:** Verification payment flows
**Days 5-6:** Ad promotion payments + Frontend UI
**Day 7:** Testing

### Week 2: SEO + Features
**Days 1-3:** SEO (meta tags, schema, sitemap, SSR)
**Days 4-5:** Contact features (phone, WhatsApp, share, favorites)
**Days 6-7:** Badges + Name lock

### Week 3: Communication
**Days 1-5:** Real-time messaging (Socket.io + UI)
**Days 5-7:** Email notifications + In-app notifications

### Week 4: Polish + Launch
**Days 1-2:** Complete location data + Report feature
**Days 3-5:** Testing (functional, performance, security)
**Days 6-7:** Production setup + Deployment

---

## 🎯 MUST HAVE vs NICE TO HAVE

### ✅ MUST HAVE for MVP Launch:
1. ✅ Payment integration (eSewa/Khalti) - CRITICAL
2. ✅ SEO optimization (meta tags, sitemap, SSR) - CRITICAL
3. ✅ Contact features (phone reveal, WhatsApp) - CRITICAL
4. ✅ Badges display (blue/gold) - CRITICAL
5. ✅ Name lock enforcement - CRITICAL
6. ✅ Basic messaging system - HIGH
7. ✅ Email notifications (key events) - HIGH
8. ✅ Favorite ads - HIGH
9. ✅ Share functionality - MEDIUM
10. ✅ Production deployment - CRITICAL

### 🟡 NICE TO HAVE (Can Add After MVP):
- Advanced analytics
- Saved searches
- Email alerts for new matching ads
- User reviews/ratings
- Seller reputation score
- Push notifications (PWA)
- Mobile app (React Native)

---

## 📋 QUICK DAILY CHECKLIST

Use this to track your daily progress:

**Week 1 - Payment:**
- [ ] Day 1: eSewa signup + backend service
- [ ] Day 2: eSewa routes + payment DB
- [ ] Day 3: Khalti signup + backend service
- [ ] Day 4: Verification payment flows
- [ ] Day 5: Ad promotion payments
- [ ] Day 6: Frontend payment UI
- [ ] Day 7: Testing all payments

**Week 2 - SEO + Features:**
- [ ] Day 1: SEO component + meta tags
- [ ] Day 2: Schema.org + sitemap
- [ ] Day 3: SSR/pre-rendering setup
- [ ] Day 4: Phone reveal + WhatsApp buttons
- [ ] Day 5: Share + Favorites
- [ ] Day 6: Badge components + styling
- [ ] Day 7: Name lock enforcement

**Week 3 - Communication:**
- [ ] Day 1: Socket.io setup
- [ ] Day 2: Message API routes
- [ ] Day 3-4: Chat UI components
- [ ] Day 5: Email service setup
- [ ] Day 6: Email templates + triggers
- [ ] Day 7: In-app notifications

**Week 4 - Launch:**
- [ ] Day 1: Complete location data
- [ ] Day 2: Report ad feature
- [ ] Day 3-5: Testing everything
- [ ] Day 6: Production setup
- [ ] Day 7: Deploy + Monitor

---

**Total Estimate:** 4 weeks (28 days) of focused work
**Current Progress:** 75% → Target: 100% MVP Ready
**Next Action:** Start with eSewa merchant account signup TODAY!

🚀 **Let's build this!**
