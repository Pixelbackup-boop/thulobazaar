# 💳 Mock Payment Gateway for Testing Ad Promotions

**Purpose:** Test ad promotion system WITHOUT real payment integration
**Status:** ⚡ For development/testing only
**Replace with:** Real eSewa/Khalti later (Week 1, Days 1-4)

---

## 🎯 Why Use Mock Payment?

**Problem:** You want to test ad promotions NOW, but payment integration isn't done yet.

**Solution:** Mock payment gateway that simulates payment flow:
- ✅ Generates fake transaction IDs
- ✅ Simulates success/failure
- ✅ No real money required
- ✅ Easy to replace with real payment later

**Timeline:**
- 🟢 **NOW:** Use mock payment to test promotions (30 minutes setup)
- 🔴 **Week 1, Days 1-4:** Replace with real eSewa/Khalti

---

## 📋 STEP 1: Create Mock Payment Service (15 min)

**File:** `backend/services/mockPaymentService.js`

```javascript
/**
 * MOCK PAYMENT SERVICE - FOR TESTING ONLY
 * Replace with real eSewa/Khalti integration in production
 */

class MockPaymentService {
  /**
   * Simulate payment initiation
   * Returns a fake payment URL and transaction ID
   */
  initiatePayment({ amount, productName, userId, metadata }) {
    // Generate fake transaction ID
    const transactionId = `MOCK_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    console.log('🎭 MOCK PAYMENT: Initiating payment', {
      transactionId,
      amount,
      productName,
      userId
    });

    return {
      success: true,
      transactionId,
      // Mock payment URL (will show a simple confirmation page)
      paymentUrl: `/mock-payment?txnId=${transactionId}&amount=${amount}&product=${encodeURIComponent(productName)}`,
      amount,
      metadata
    };
  }

  /**
   * Simulate payment verification
   * In real implementation, this would verify with eSewa/Khalti
   */
  async verifyPayment(transactionId, amount) {
    console.log('🎭 MOCK PAYMENT: Verifying payment', { transactionId, amount });

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Mock verification (always success for testing)
    // You can manually test failure by making transactionId start with "FAIL_"
    const isSuccess = !transactionId.startsWith('FAIL_');

    return {
      success: isSuccess,
      transactionId,
      amount,
      status: isSuccess ? 'verified' : 'failed',
      gateway: 'mock',
      verifiedAt: new Date()
    };
  }

  /**
   * Get payment status
   */
  async getPaymentStatus(transactionId) {
    console.log('🎭 MOCK PAYMENT: Getting payment status', { transactionId });

    return {
      transactionId,
      status: 'verified',
      amount: null,
      gateway: 'mock'
    };
  }
}

module.exports = new MockPaymentService();
```

**Create the file:**
```bash
nano backend/services/mockPaymentService.js
# Paste the code above
```

---

## 📋 STEP 2: Create Mock Payment Routes (15 min)

**File:** `backend/routes/mockPayment.js`

```javascript
const express = require('express');
const router = express.Router();
const pool = require('../db');
const mockPaymentService = require('../services/mockPaymentService');
const { authenticateToken } = require('../middleware/auth');

/**
 * MOCK PAYMENT ROUTES - FOR TESTING ONLY
 * Replace with real eSewa/Khalti routes in production
 */

// Initiate mock payment
router.post('/initiate', authenticateToken, async (req, res) => {
  try {
    const { amount, paymentType, relatedId, metadata } = req.body;
    const userId = req.user.userId;

    // Validate amount
    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Invalid amount'
      });
    }

    // Generate product name
    const productName = metadata?.promotionType
      ? `Ad Promotion - ${metadata.promotionType}`
      : 'ThuLoBazaar Payment';

    // Initiate mock payment
    const paymentResult = mockPaymentService.initiatePayment({
      amount,
      productName,
      userId,
      metadata
    });

    // Save to payment_transactions table
    const result = await pool.query(
      `INSERT INTO payment_transactions (
        user_id, payment_type, payment_gateway, amount,
        transaction_id, reference_id, related_id,
        status, metadata, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, CURRENT_TIMESTAMP)
      RETURNING id, transaction_id`,
      [
        userId,
        paymentType,
        'mock',
        amount,
        paymentResult.transactionId,
        paymentResult.transactionId,
        relatedId,
        'pending',
        JSON.stringify(metadata)
      ]
    );

    res.json({
      success: true,
      paymentTransactionId: result.rows[0].id,
      transactionId: paymentResult.transactionId,
      paymentUrl: paymentResult.paymentUrl,
      amount: paymentResult.amount,
      message: '🎭 MOCK PAYMENT: Use the payment URL to simulate payment'
    });

  } catch (error) {
    console.error('Mock payment initiation error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Mock payment success callback
router.get('/success', async (req, res) => {
  try {
    const { txnId, amount } = req.query;

    if (!txnId) {
      return res.status(400).json({ success: false, error: 'Missing transaction ID' });
    }

    // Verify payment
    const verificationResult = await mockPaymentService.verifyPayment(txnId, parseFloat(amount));

    if (!verificationResult.success) {
      return res.redirect(`/payment-failed?txnId=${txnId}`);
    }

    // Update payment transaction status
    await pool.query(
      `UPDATE payment_transactions
       SET status = 'verified',
           verified_at = CURRENT_TIMESTAMP
       WHERE transaction_id = $1`,
      [txnId]
    );

    // Get payment details
    const paymentResult = await pool.query(
      `SELECT id, user_id, payment_type, related_id, metadata
       FROM payment_transactions
       WHERE transaction_id = $1`,
      [txnId]
    );

    if (paymentResult.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Payment not found' });
    }

    const payment = paymentResult.rows[0];

    // If it's a promotion payment, activate the promotion
    if (payment.payment_type === 'ad_promotion') {
      const metadata = payment.metadata;
      const promotionService = require('../services/promotionService');

      await promotionService.activatePromotion(
        metadata.adId,
        payment.user_id,
        metadata.promotionType,
        metadata.durationDays,
        parseFloat(amount),
        txnId
      );
    }

    res.json({
      success: true,
      message: '🎭 MOCK PAYMENT: Payment verified successfully!',
      transactionId: txnId,
      amount: parseFloat(amount),
      paymentType: payment.payment_type
    });

  } catch (error) {
    console.error('Mock payment success error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Mock payment failure callback
router.get('/failure', async (req, res) => {
  try {
    const { txnId } = req.query;

    // Update payment status to failed
    await pool.query(
      `UPDATE payment_transactions
       SET status = 'failed'
       WHERE transaction_id = $1`,
      [txnId]
    );

    res.json({
      success: false,
      message: '🎭 MOCK PAYMENT: Payment failed!',
      transactionId: txnId
    });

  } catch (error) {
    console.error('Mock payment failure error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Verify payment status
router.post('/verify', authenticateToken, async (req, res) => {
  try {
    const { transactionId, amount } = req.body;

    const result = await mockPaymentService.verifyPayment(transactionId, amount);

    res.json({
      success: result.success,
      transactionId: result.transactionId,
      amount: result.amount,
      status: result.status
    });

  } catch (error) {
    console.error('Mock payment verification error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
```

**Create the file:**
```bash
nano backend/routes/mockPayment.js
# Paste the code above
```

---

## 📋 STEP 3: Register Routes in server.js

**File:** `backend/server.js`

**Add these lines:**
```javascript
// Mock Payment Routes (FOR TESTING ONLY - Remove in production)
const mockPaymentRoutes = require('./routes/mockPayment');
app.use('/api/mock-payment', mockPaymentRoutes);

console.log('🎭 MOCK PAYMENT: Routes registered at /api/mock-payment');
console.log('⚠️  WARNING: This is for testing only. Replace with real payment gateway.');
```

---

## 📋 STEP 4: Create payment_transactions Table (If not exists)

**Run this SQL:**
```sql
-- Create payment_transactions table
CREATE TABLE IF NOT EXISTS payment_transactions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    payment_type VARCHAR(50), -- 'individual_verification', 'business_verification', 'ad_promotion'
    payment_gateway VARCHAR(20), -- 'mock', 'esewa', 'khalti'
    amount DECIMAL(10,2),
    transaction_id VARCHAR(255),
    reference_id VARCHAR(255),
    related_id INTEGER, -- verification_request_id or ad_id
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'verified', 'failed'
    metadata JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    verified_at TIMESTAMP,
    payment_url TEXT
);

CREATE INDEX IF NOT EXISTS idx_payment_transactions_user_id ON payment_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_txn_id ON payment_transactions(transaction_id);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_status ON payment_transactions(status);
```

**Run it:**
```bash
PGPASSWORD=postgres psql -U elw -d thulobazaar -c "
CREATE TABLE IF NOT EXISTS payment_transactions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    payment_type VARCHAR(50),
    payment_gateway VARCHAR(20),
    amount DECIMAL(10,2),
    transaction_id VARCHAR(255),
    reference_id VARCHAR(255),
    related_id INTEGER,
    status VARCHAR(20) DEFAULT 'pending',
    metadata JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    verified_at TIMESTAMP,
    payment_url TEXT
);
"
```

---

## 📋 STEP 5: Frontend - Mock Payment Integration

**File:** `frontend/src/services/api.js`

**Add these functions:**
```javascript
// Mock Payment API (FOR TESTING ONLY)
export const mockPaymentAPI = {
  // Initiate payment
  initiatePayment: async (paymentData) => {
    const response = await axios.post('/api/mock-payment/initiate', paymentData);
    return response.data;
  },

  // Verify payment
  verifyPayment: async (transactionId, amount) => {
    const response = await axios.post('/api/mock-payment/verify', {
      transactionId,
      amount
    });
    return response.data;
  },

  // Simulate payment success (for testing)
  simulateSuccess: async (transactionId, amount) => {
    const response = await axios.get('/api/mock-payment/success', {
      params: { txnId: transactionId, amount }
    });
    return response.data;
  },

  // Simulate payment failure (for testing)
  simulateFailure: async (transactionId) => {
    const response = await axios.get('/api/mock-payment/failure', {
      params: { txnId: transactionId }
    });
    return response.data;
  }
};
```

---

## 📋 STEP 6: Frontend - Mock Payment Modal

**File:** `frontend/src/components/MockPaymentModal.jsx`

```jsx
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import '../styles/MockPaymentModal.css';

const MockPaymentModal = ({ amount, productName, transactionId, onSuccess, onFailure, onClose }) => {
  const [processing, setProcessing] = useState(false);

  const handleSuccess = async () => {
    setProcessing(true);
    try {
      await onSuccess(transactionId, amount);
    } catch (error) {
      console.error('Payment success error:', error);
      alert('Error processing payment');
    } finally {
      setProcessing(false);
    }
  };

  const handleFailure = async () => {
    setProcessing(true);
    try {
      await onFailure(transactionId);
    } catch (error) {
      console.error('Payment failure error:', error);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content mock-payment-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>🎭 Mock Payment Gateway</h2>
          <button onClick={onClose} className="close-btn">&times;</button>
        </div>

        <div className="mock-payment-body">
          <div className="payment-info">
            <p className="warning-text">
              ⚠️ This is a MOCK payment for testing only!
            </p>

            <div className="payment-details">
              <div className="detail-row">
                <span className="label">Product:</span>
                <span className="value">{productName}</span>
              </div>
              <div className="detail-row">
                <span className="label">Amount:</span>
                <span className="value amount">NPR {amount.toFixed(2)}</span>
              </div>
              <div className="detail-row">
                <span className="label">Transaction ID:</span>
                <span className="value txn-id">{transactionId}</span>
              </div>
            </div>
          </div>

          <div className="payment-actions">
            <p className="instruction">
              Choose an outcome to simulate:
            </p>

            <button
              onClick={handleSuccess}
              disabled={processing}
              className="btn btn-success"
            >
              ✅ Simulate Success
            </button>

            <button
              onClick={handleFailure}
              disabled={processing}
              className="btn btn-danger"
            >
              ❌ Simulate Failure
            </button>

            <button
              onClick={onClose}
              disabled={processing}
              className="btn btn-secondary"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

MockPaymentModal.propTypes = {
  amount: PropTypes.number.isRequired,
  productName: PropTypes.string.isRequired,
  transactionId: PropTypes.string.isRequired,
  onSuccess: PropTypes.func.isRequired,
  onFailure: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired
};

export default MockPaymentModal;
```

**CSS:** `frontend/src/styles/MockPaymentModal.css`

```css
.mock-payment-modal {
  max-width: 500px;
  background: white;
  border-radius: 12px;
  padding: 0;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.2);
}

.mock-payment-modal .modal-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px;
  border-radius: 12px 12px 0 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.mock-payment-modal .modal-header h2 {
  margin: 0;
  font-size: 20px;
}

.mock-payment-modal .close-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  font-size: 28px;
  cursor: pointer;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}

.mock-payment-modal .close-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.mock-payment-body {
  padding: 24px;
}

.warning-text {
  background: #fff3cd;
  border: 1px solid #ffc107;
  color: #856404;
  padding: 12px;
  border-radius: 6px;
  margin-bottom: 20px;
  text-align: center;
  font-weight: 500;
}

.payment-details {
  background: #f8f9fa;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 24px;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #dee2e6;
}

.detail-row:last-child {
  border-bottom: none;
}

.detail-row .label {
  font-weight: 600;
  color: #6c757d;
}

.detail-row .value {
  color: #212529;
}

.detail-row .value.amount {
  font-size: 20px;
  font-weight: bold;
  color: #28a745;
}

.detail-row .value.txn-id {
  font-family: monospace;
  font-size: 11px;
  color: #6c757d;
}

.payment-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.payment-actions .instruction {
  text-align: center;
  color: #6c757d;
  margin-bottom: 8px;
}

.payment-actions .btn {
  padding: 12px 24px;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.payment-actions .btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.payment-actions .btn-success {
  background: #28a745;
  color: white;
}

.payment-actions .btn-success:hover:not(:disabled) {
  background: #218838;
}

.payment-actions .btn-danger {
  background: #dc3545;
  color: white;
}

.payment-actions .btn-danger:hover:not(:disabled) {
  background: #c82333;
}

.payment-actions .btn-secondary {
  background: #6c757d;
  color: white;
}

.payment-actions .btn-secondary:hover:not(:disabled) {
  background: #5a6268;
}
```

---

## 📋 STEP 7: Test the Flow

### Test Promotion Purchase Flow:

**1. Start servers:**
```bash
# Terminal 1: Backend
cd backend && npm run dev

# Terminal 2: Frontend
cd frontend && npm run dev
```

**2. Test with Postman/curl:**

**Initiate Payment:**
```bash
curl -X POST http://localhost:3000/api/mock-payment/initiate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "amount": 1000,
    "paymentType": "ad_promotion",
    "relatedId": 1,
    "metadata": {
      "adId": 1,
      "promotionType": "featured",
      "durationDays": 7
    }
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "paymentTransactionId": 1,
  "transactionId": "MOCK_1234567890_abc123",
  "paymentUrl": "/mock-payment?txnId=MOCK_1234567890_abc123&amount=1000&product=Ad%20Promotion%20-%20featured",
  "amount": 1000,
  "message": "🎭 MOCK PAYMENT: Use the payment URL to simulate payment"
}
```

**Simulate Success:**
```bash
curl "http://localhost:3000/api/mock-payment/success?txnId=MOCK_1234567890_abc123&amount=1000"
```

**Expected Result:**
- ✅ Payment marked as verified
- ✅ Promotion activated on ad
- ✅ Ad has `is_featured = true`

**3. Verify in database:**
```bash
PGPASSWORD=postgres psql -U elw -d thulobazaar -c "
SELECT * FROM payment_transactions ORDER BY created_at DESC LIMIT 1;
"

PGPASSWORD=postgres psql -U elw -d thulobazaar -c "
SELECT id, title, is_featured, featured_expires_at FROM ads WHERE id = 1;
"
```

---

## 🔄 How to Replace with Real Payment Later

**When you're ready to implement real eSewa/Khalti (Week 1, Days 1-4):**

### Step 1: Keep the same interface
Your `promotionService.js` doesn't change!

### Step 2: Replace payment service
```javascript
// OLD: const mockPaymentService = require('../services/mockPaymentService');
// NEW: const esewaService = require('../services/esewaService');
// NEW: const khaltiService = require('../services/khaltiService');
```

### Step 3: Update routes
```javascript
// In backend/routes/promotions.js
// Change from:
const mockPaymentService = require('../services/mockPaymentService');

// To:
const esewaService = require('../services/esewaService');
const khaltiService = require('../services/khaltiService');
```

### Step 4: Remove mock routes
```javascript
// In server.js, remove:
// app.use('/api/mock-payment', mockPaymentRoutes);

// Add:
app.use('/api/payment', paymentRoutes); // Real payment routes
```

### Step 5: Update frontend
```javascript
// In PromoteAdModal.jsx
// Change from:
import { mockPaymentAPI } from '../services/api';

// To:
import { paymentAPI } from '../services/api';
```

**That's it!** The promotion logic stays the same.

---

## ✅ Testing Checklist

- [ ] Mock payment initiates successfully
- [ ] Transaction ID generated
- [ ] Payment saved to database
- [ ] Success callback activates promotion
- [ ] Badge appears on ad
- [ ] Promoted ad appears at top of category
- [ ] Expiry date set correctly
- [ ] Failure callback works
- [ ] Payment history shows transaction

---

## 📊 Quick Commands

```bash
# Create files
touch backend/services/mockPaymentService.js
touch backend/routes/mockPayment.js
touch frontend/src/components/MockPaymentModal.jsx
touch frontend/src/styles/MockPaymentModal.css

# Test payment initiation
curl -X POST http://localhost:3000/api/mock-payment/initiate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"amount":1000,"paymentType":"ad_promotion","relatedId":1,"metadata":{"adId":1,"promotionType":"featured","durationDays":7}}'

# Check database
PGPASSWORD=postgres psql -U elw -d thulobazaar -c "SELECT * FROM payment_transactions;"
```

---

## 💡 Pro Tips

1. **Use different transaction IDs** - Each test should generate new ID
2. **Test failure too** - Use `FAIL_` prefix in transaction ID
3. **Check expiry dates** - Verify dates are calculated correctly
4. **Test all 3 tiers** - Featured, Urgent, Sticky
5. **Test business discount** - Verify prices differ for verified businesses

---

**Ready to test? Start with Step 1! 🚀**

**Total Setup Time:** ~30 minutes
**Total Test Time:** ~15 minutes

**You can test the entire promotion system TODAY without waiting for real payment integration!**
