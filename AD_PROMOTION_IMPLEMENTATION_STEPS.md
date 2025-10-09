# 🚀 Ad Promotion System - Step-by-Step Implementation Guide

**Priority:** Week 1, Days 5-7 (After payment gateway integration)
**Estimated Time:** 3 days
**Dependencies:** Payment system (eSewa/Khalti) must be working first

---

## 📋 PHASE 1: Backend Implementation (Day 1)

### Step 1: Create Promotion Service
**File:** `backend/services/promotionService.js`

**Tasks:**
- [ ] Create the service file
- [ ] Implement `getPromotionPrice(type, duration, accountType)` function
- [ ] Implement `activatePromotion(adId, type, durationDays)` function
- [ ] Implement `deactivateExpiredPromotions()` function
- [ ] Implement `getUserPromotions(userId)` function

**Code to implement:**
```javascript
const pool = require('../db');

class PromotionService {
  // Get pricing from database
  async getPromotionPrice(promotionType, durationDays, accountType) {
    const result = await pool.query(
      `SELECT price, discount_percentage
       FROM promotion_pricing
       WHERE promotion_type = $1
       AND duration_days = $2
       AND account_type = $3
       AND is_active = true`,
      [promotionType, durationDays, accountType]
    );

    if (result.rows.length === 0) {
      throw new Error('Pricing not found');
    }

    return result.rows[0];
  }

  // Calculate price with discount
  calculatePrice(basePrice, accountType) {
    if (accountType === 'business') {
      const discount = promotionType === 'sticky' ? 0.30 : 0.40;
      return basePrice * (1 - discount);
    }
    return basePrice;
  }

  // Activate promotion after payment
  async activatePromotion(adId, userId, promotionType, durationDays, pricePaid, paymentRef) {
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      // Calculate expiry
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + durationDays);

      // Update ads table
      const fieldMap = {
        featured: { flag: 'is_featured', expiry: 'featured_expires_at' },
        urgent: { flag: 'is_urgent', expiry: 'urgent_expires_at' },
        sticky: { flag: 'is_sticky', expiry: 'sticky_expires_at' },
        bump_up: { flag: 'is_bumped', expiry: 'bump_expires_at' }
      };

      const fields = fieldMap[promotionType];

      await client.query(
        `UPDATE ads
         SET ${fields.flag} = TRUE,
             ${fields.expiry} = $1,
             total_promotions = total_promotions + 1,
             last_promoted_at = CURRENT_TIMESTAMP
         WHERE id = $2`,
        [expiresAt, adId]
      );

      // Insert promotion record
      const accountType = await this.getUserAccountType(userId, client);

      await client.query(
        `INSERT INTO ad_promotions (
          ad_id, user_id, promotion_type, duration_days,
          price_paid, account_type, payment_reference,
          starts_at, expires_at, is_active
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP, $8, TRUE)`,
        [adId, userId, promotionType, durationDays, pricePaid, accountType, paymentRef, expiresAt]
      );

      await client.query('COMMIT');

      return { success: true, expiresAt };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  // Get user's account type
  async getUserAccountType(userId, client = pool) {
    const result = await client.query(
      `SELECT
        CASE
          WHEN business_verification_status = 'approved' THEN 'business'
          ELSE 'individual'
        END as account_type
       FROM users WHERE id = $1`,
      [userId]
    );
    return result.rows[0].account_type;
  }

  // Get user's promotion history
  async getUserPromotions(userId) {
    const result = await pool.query(
      `SELECT
        p.id, p.ad_id, p.promotion_type, p.duration_days,
        p.price_paid, p.starts_at, p.expires_at, p.is_active,
        a.title as ad_title, a.slug as ad_slug
       FROM ad_promotions p
       JOIN ads a ON p.ad_id = a.id
       WHERE p.user_id = $1
       ORDER BY p.created_at DESC`,
      [userId]
    );
    return result.rows;
  }

  // Deactivate expired promotions (call from cron)
  async deactivateExpiredPromotions() {
    return await pool.query(`SELECT expire_old_promotions()`);
  }
}

module.exports = new PromotionService();
```

**Estimated time:** 2 hours

---

### Step 2: Create Promotion Routes
**File:** `backend/routes/promotions.js`

**Tasks:**
- [ ] Create the routes file
- [ ] Add route: `GET /api/promotions/pricing` - Get pricing table
- [ ] Add route: `POST /api/promotions/purchase` - Purchase promotion (with payment)
- [ ] Add route: `GET /api/promotions/my-promotions` - User's promotion history
- [ ] Add route: `GET /api/promotions/ad/:adId` - Get ad's active promotions
- [ ] Add authentication middleware

**Code to implement:**
```javascript
const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const promotionService = require('../services/promotionService');
const pool = require('../db');

// Get all promotion pricing
router.get('/pricing', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT promotion_type, duration_days, account_type, price, discount_percentage
       FROM promotion_pricing
       WHERE is_active = true
       ORDER BY
         CASE promotion_type
           WHEN 'featured' THEN 1
           WHEN 'urgent' THEN 2
           WHEN 'sticky' THEN 3
           WHEN 'bump_up' THEN 4
         END,
         duration_days,
         account_type`
    );

    res.json({
      success: true,
      pricing: result.rows
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get pricing for specific promotion
router.get('/pricing/:type/:duration', authenticateToken, async (req, res) => {
  try {
    const { type, duration } = req.params;
    const userId = req.user.userId;

    // Get user account type
    const accountType = await promotionService.getUserAccountType(userId);

    // Get pricing
    const pricing = await promotionService.getPromotionPrice(type, parseInt(duration), accountType);

    res.json({
      success: true,
      promotionType: type,
      duration: parseInt(duration),
      accountType,
      price: pricing.price,
      discount: pricing.discount_percentage
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Purchase promotion (initiates payment)
router.post('/purchase', authenticateToken, async (req, res) => {
  try {
    const { adId, promotionType, durationDays, paymentGateway } = req.body;
    const userId = req.user.userId;

    // Validate ad ownership
    const adResult = await pool.query(
      'SELECT user_id FROM ads WHERE id = $1',
      [adId]
    );

    if (adResult.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Ad not found' });
    }

    if (adResult.rows[0].user_id !== userId) {
      return res.status(403).json({ success: false, error: 'Not your ad' });
    }

    // Get account type and pricing
    const accountType = await promotionService.getUserAccountType(userId);
    const pricing = await promotionService.getPromotionPrice(promotionType, durationDays, accountType);

    // Create payment transaction
    // (This integrates with your payment system from Week 1, Days 1-4)
    const paymentData = {
      userId,
      amount: pricing.price,
      paymentType: 'ad_promotion',
      relatedId: adId,
      metadata: {
        promotionType,
        durationDays,
        adId
      }
    };

    // Return payment initiation data
    // Frontend will redirect to eSewa/Khalti
    res.json({
      success: true,
      requiresPayment: true,
      amount: pricing.price,
      promotionType,
      durationDays,
      paymentData
    });

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Activate promotion after payment verified
// (Called by payment success callback)
router.post('/activate', authenticateToken, async (req, res) => {
  try {
    const { adId, promotionType, durationDays, paymentTransactionId } = req.body;
    const userId = req.user.userId;

    // Verify payment was successful
    const paymentResult = await pool.query(
      `SELECT amount, status FROM payment_transactions WHERE id = $1 AND user_id = $2`,
      [paymentTransactionId, userId]
    );

    if (paymentResult.rows.length === 0 || paymentResult.rows[0].status !== 'verified') {
      return res.status(400).json({ success: false, error: 'Payment not verified' });
    }

    // Activate promotion
    const result = await promotionService.activatePromotion(
      adId,
      userId,
      promotionType,
      durationDays,
      paymentResult.rows[0].amount,
      paymentTransactionId
    );

    res.json({
      success: true,
      message: 'Promotion activated successfully',
      expiresAt: result.expiresAt
    });

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get user's promotion history
router.get('/my-promotions', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const promotions = await promotionService.getUserPromotions(userId);

    res.json({
      success: true,
      promotions
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get ad's active promotions
router.get('/ad/:adId', async (req, res) => {
  try {
    const { adId } = req.params;

    const result = await pool.query(
      `SELECT
        is_featured, featured_expires_at,
        is_urgent, urgent_expires_at,
        is_sticky, sticky_expires_at,
        is_bumped, bump_expires_at
       FROM ads WHERE id = $1`,
      [adId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Ad not found' });
    }

    res.json({
      success: true,
      promotions: result.rows[0]
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
```

**Register in `server.js`:**
```javascript
const promotionRoutes = require('./routes/promotions');
app.use('/api/promotions', promotionRoutes);
```

**Estimated time:** 2 hours

---

### Step 3: Update Search/Listing Queries
**Files to update:**
- `backend/routes/ads.js`
- `backend/routes/search.js`

**Tasks:**
- [ ] Update category listing query to sort by promotion tier
- [ ] Update search results query to show promoted ads first
- [ ] Add featured ads endpoint for homepage

**Code to add to ads.js:**
```javascript
// Get ads with promotion sorting
router.get('/category/:categoryId', async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    const result = await pool.query(
      `SELECT
        a.*,
        u.full_name as seller_name,
        u.business_verification_status,
        u.individual_verified,
        c.name as category_name,
        l.name as location_name,
        -- Promotion flags
        a.is_featured,
        a.is_urgent,
        a.is_sticky
       FROM ads a
       JOIN users u ON a.user_id = u.id
       JOIN categories c ON a.category_id = c.id
       LEFT JOIN locations l ON a.location_id = l.id
       WHERE a.category_id = $1
       AND a.status = 'approved'
       AND a.deleted_at IS NULL
       ORDER BY
         -- Sort by promotion tier
         CASE
           WHEN a.is_featured = TRUE AND a.featured_expires_at > NOW() THEN 1
           WHEN a.is_urgent = TRUE AND a.urgent_expires_at > NOW() THEN 2
           WHEN a.is_sticky = TRUE AND a.sticky_expires_at > NOW() THEN 3
           ELSE 4
         END,
         -- Within same tier, newest first
         a.created_at DESC
       LIMIT $2 OFFSET $3`,
      [categoryId, limit, offset]
    );

    res.json({
      success: true,
      ads: result.rows,
      page: parseInt(page),
      limit: parseInt(limit)
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get featured ads for homepage
router.get('/featured', async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const result = await pool.query(
      `SELECT
        a.*,
        u.full_name as seller_name,
        u.business_verification_status,
        c.name as category_name,
        l.name as location_name
       FROM ads a
       JOIN users u ON a.user_id = u.id
       JOIN categories c ON a.category_id = c.id
       LEFT JOIN locations l ON a.location_id = l.id
       WHERE a.is_featured = TRUE
       AND a.featured_expires_at > NOW()
       AND a.status = 'approved'
       AND a.deleted_at IS NULL
       ORDER BY a.created_at DESC
       LIMIT $1`,
      [limit]
    );

    res.json({
      success: true,
      featuredAds: result.rows
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
```

**Estimated time:** 1 hour

---

## 📋 PHASE 2: Frontend Components (Day 2)

### Step 4: Create Promotion Badge Component
**File:** `frontend/src/components/PromotionBadge.jsx`

**Tasks:**
- [ ] Create component file
- [ ] Handle all 3 promotion types
- [ ] Add proper styling classes

**Code:**
```jsx
import React from 'react';
import PropTypes from 'prop-types';
import '../styles/PromotionBadge.css';

const PromotionBadge = ({ ad, size = 'medium' }) => {
  // Check if promotions are active
  const now = new Date();

  const isFeatured = ad.is_featured && new Date(ad.featured_expires_at) > now;
  const isUrgent = ad.is_urgent && new Date(ad.urgent_expires_at) > now;
  const isSticky = ad.is_sticky && new Date(ad.sticky_expires_at) > now;

  // Priority: Featured > Urgent > Sticky (show highest tier only)
  if (isFeatured) {
    return (
      <span className={`promotion-badge badge-featured badge-${size}`}>
        <span className="badge-icon">🌟</span>
        <span className="badge-text">FEATURED</span>
      </span>
    );
  }

  if (isUrgent) {
    return (
      <span className={`promotion-badge badge-urgent badge-${size}`}>
        <span className="badge-icon">🔥</span>
        <span className="badge-text">URGENT</span>
      </span>
    );
  }

  if (isSticky) {
    return (
      <span className={`promotion-badge badge-sticky badge-${size}`}>
        <span className="badge-icon">📌</span>
        <span className="badge-text">PROMOTED</span>
      </span>
    );
  }

  return null;
};

PromotionBadge.propTypes = {
  ad: PropTypes.shape({
    is_featured: PropTypes.bool,
    featured_expires_at: PropTypes.string,
    is_urgent: PropTypes.bool,
    urgent_expires_at: PropTypes.string,
    is_sticky: PropTypes.bool,
    sticky_expires_at: PropTypes.string
  }).isRequired,
  size: PropTypes.oneOf(['small', 'medium', 'large'])
};

export default PromotionBadge;
```

**Estimated time:** 30 minutes

---

### Step 5: Create Promotion Badge CSS
**File:** `frontend/src/styles/PromotionBadge.css`

**Tasks:**
- [ ] Create CSS file
- [ ] Style all 3 badge types
- [ ] Add animations for urgent badge

**Code:**
```css
/* Base badge styling */
.promotion-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  border-radius: 20px;
  font-weight: 600;
  text-transform: uppercase;
  white-space: nowrap;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

/* Size variations */
.badge-small {
  padding: 3px 8px;
  font-size: 10px;
}

.badge-medium {
  padding: 6px 12px;
  font-size: 12px;
}

.badge-large {
  padding: 8px 16px;
  font-size: 14px;
}

/* Featured badge */
.badge-featured {
  background: linear-gradient(135deg, #FFD700, #FFA500);
  color: #000;
  box-shadow: 0 2px 12px rgba(255, 215, 0, 0.5);
}

/* Urgent badge with pulse animation */
.badge-urgent {
  background: linear-gradient(135deg, #FF4444, #CC0000);
  color: white;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.02);
  }
}

/* Sticky badge */
.badge-sticky {
  background: linear-gradient(135deg, #4A90E2, #357ABD);
  color: white;
}

/* Badge icon */
.badge-icon {
  font-size: 1.1em;
  line-height: 1;
}

/* Ad card highlighting when promoted */
.ad-card.promoted-featured {
  border: 3px solid #FFD700;
  box-shadow: 0 4px 16px rgba(255, 215, 0, 0.3);
}

.ad-card.promoted-urgent {
  border: 2px solid #FF4444;
  box-shadow: 0 2px 12px rgba(255, 68, 68, 0.2);
}

.ad-card.promoted-sticky {
  border: 2px solid #4A90E2;
  background: rgba(74, 144, 226, 0.02);
}
```

**Estimated time:** 30 minutes

---

### Step 6: Create Promote Ad Modal
**File:** `frontend/src/components/PromoteAdModal.jsx`

**Tasks:**
- [ ] Create modal component
- [ ] Fetch pricing from API
- [ ] Show 3 promotion tiers
- [ ] Handle duration selection
- [ ] Show business discount if applicable
- [ ] Integrate with payment

**Code:** (See next message for full component - it's long)

**Estimated time:** 3 hours

---

## 📋 PHASE 3: UI Integration (Day 2-3)

### Step 7: Update AdCard Component
**File:** `frontend/src/components/AdCard.jsx`

**Tasks:**
- [ ] Import PromotionBadge
- [ ] Add badge to ad card
- [ ] Add promotion styling class

**Code to add:**
```jsx
import PromotionBadge from './PromotionBadge';

// Inside AdCard component, add:
<div className="ad-card-header">
  <PromotionBadge ad={ad} size="small" />
</div>
```

**Estimated time:** 15 minutes

---

### Step 8: Update AdDetail Component
**File:** `frontend/src/components/AdDetail.jsx`

**Tasks:**
- [ ] Import PromotionBadge
- [ ] Show badge if promoted
- [ ] Add "Promote This Ad" button (for ad owner)

**Code to add:**
```jsx
import PromotionBadge from './PromotionBadge';

// Show badge
<PromotionBadge ad={ad} size="large" />

// Show promote button (if owner)
{isOwner && (
  <button
    onClick={() => setShowPromoteModal(true)}
    className="btn btn-promote"
  >
    🚀 Promote This Ad
  </button>
)}

{showPromoteModal && (
  <PromoteAdModal
    adId={ad.id}
    onClose={() => setShowPromoteModal(false)}
    onSuccess={() => {
      setShowPromoteModal(false);
      // Reload ad data
    }}
  />
)}
```

**Estimated time:** 30 minutes

---

## 📋 PHASE 4: Testing & Polish (Day 3)

### Step 9: Testing Checklist
- [ ] Test promotion activation
- [ ] Test badge display on all ad types
- [ ] Test sorting order (featured > urgent > sticky > regular)
- [ ] Test business discount calculation
- [ ] Test payment integration
- [ ] Test expiry (manually set expires_at to past)
- [ ] Test promotion history view
- [ ] Test mobile responsiveness

**Estimated time:** 2 hours

---

### Step 10: Setup Cron Job for Auto-Expiry
**File:** `backend/cron/expirePromotions.js` (create new file)

**Code:**
```javascript
const pool = require('../db');

async function expirePromotions() {
  try {
    console.log('Running promotion expiry check...');
    await pool.query('SELECT expire_old_promotions()');
    console.log('Promotion expiry check completed');
  } catch (error) {
    console.error('Error expiring promotions:', error);
  }
}

// Run every hour
setInterval(expirePromotions, 60 * 60 * 1000);

// Run on startup
expirePromotions();

module.exports = expirePromotions;
```

**Add to `server.js`:**
```javascript
// Start cron jobs
require('./cron/expirePromotions');
```

**Estimated time:** 30 minutes

---

## 📊 Total Time Estimate

| Phase | Tasks | Time |
|-------|-------|------|
| **Phase 1: Backend** | Steps 1-3 | 5 hours |
| **Phase 2: Frontend Components** | Steps 4-6 | 4 hours |
| **Phase 3: UI Integration** | Steps 7-8 | 45 minutes |
| **Phase 4: Testing** | Steps 9-10 | 2.5 hours |
| **TOTAL** | 10 steps | **~12 hours** |

**Realistic timeline:** 2-3 days of focused work

---

## ✅ Success Criteria

**You'll know it's working when:**
1. ✅ Pricing API returns correct prices with business discount
2. ✅ Promotion purchase creates payment transaction
3. ✅ After payment, promotion activates on ad
4. ✅ Badges show correctly on ads
5. ✅ Promoted ads appear at top of category listings
6. ✅ Featured ads show on homepage
7. ✅ Promotions auto-expire after duration
8. ✅ Users see their promotion history

---

## 🎯 Quick Start Command

**Start implementing NOW:**
```bash
# 1. Create backend service
touch backend/services/promotionService.js

# 2. Create backend routes
touch backend/routes/promotions.js

# 3. Create frontend components
touch frontend/src/components/PromotionBadge.jsx
touch frontend/src/components/PromoteAdModal.jsx
touch frontend/src/styles/PromotionBadge.css

# 4. Start coding!
```

---

## 📚 Reference Documents

- **[AD_PROMOTION_SYSTEM.md](AD_PROMOTION_SYSTEM.md)** - Complete system documentation
- **[COMPLETE_IMPLEMENTATION_CHECKLIST.md](COMPLETE_IMPLEMENTATION_CHECKLIST.md)** - Full MVP checklist

---

**Ready to implement? Start with Step 1! 🚀**
