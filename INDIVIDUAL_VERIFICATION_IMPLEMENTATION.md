# Individual Seller Verification System - Implementation Guide

## ✅ Completed
1. Database migration created and run (`006_individual_seller_verification.sql`)
2. Backend API endpoints for user submission (`/api/individual-verification/submit`, `/status`)
3. Backend API endpoints for editors (`/api/admin/individual-verifications`)

## 📋 Remaining Tasks

### 1. Add Verification Request UI to User Dashboard

**Location:** `frontend/src/pages/Dashboard.jsx`

Add a new section for individual sellers to request verification:

```jsx
// Add to Dashboard.jsx, similar to business verification section

{user.account_type === 'individual' && !user.individual_verified && (
  <div style={styles.card.default}>
    <h2>Individual Seller Verification</h2>
    <p>Get verified with a blue badge to build trust with buyers!</p>

    {/* Show status or upload form */}
    {hasVerificationRequest ? (
      // Show request status (pending/rejected with reason)
      <VerificationStatus />
    ) : (
      // Show upload form
      <VerificationForm />
    )}
  </div>
)}
```

**Required fields:**
- ID Document Type (dropdown: Citizenship, Passport, Driving License)
- ID Document Number (text input)
- ID Document Front (file upload)
- ID Document Back (file upload - optional for passport)
- Selfie with ID (file upload)

**API calls:**
- `GET /api/individual-verification/status` - Check if user has pending/rejected request
- `POST /api/individual-verification/submit` - Submit verification with FormData

### 2. Add to Editor Panel

**Location:** `frontend/src/pages/EditorPanel.jsx`

Add a new tab/section:

```jsx
// Add tab for "Individual Verifications"
<button onClick={() => setActiveTab('individual-verifications')}>
  Individual Verifications ({pendingIndividualCount})
</button>

// In content area:
{activeTab === 'individual-verifications' && (
  <IndividualVerificationList />
)}
```

**Features needed:**
- List all pending individual verification requests
- View document images (clickable to view full size)
- Approve button → calls `/api/admin/individual-verifications/:id/approve`
- Reject button with reason textarea → calls `/api/admin/individual-verifications/:id/reject`

### 3. Update SellerProfile to Show Blue Badge

**Location:** `frontend/src/components/SellerProfile.jsx`

Around line 181-195 (where verification badge is shown):

```jsx
{seller.individual_verified && (
  <div style={{
    width: '32px',
    height: '32px',
    borderRadius: borderRadius.full,
    backgroundColor: '#3B82F6', // Blue color
    color: colors.text.inverse,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px'
  }} title="Verified Individual Seller">
    ✓
  </div>
)}
```

Or use a blue badge image similar to golden badge:
```jsx
{seller.individual_verified && (
  <img
    src="/blue-badge.png"
    alt="Verified Individual Seller"
    title="Verified Individual Seller"
    style={{ width: '32px', height: '32px' }}
  />
)}
```

### 4. Create Blue Badge Image

Create `/public/blue-badge.png` - a blue colored version of the golden badge.

### 5. Update SellerCard (Ad Detail Page)

**Location:** `frontend/src/components/ad-detail/SellerCard.jsx`

Around line 68-80, add blue badge for individual sellers:

```jsx
{ad.account_type === 'individual' && ad.individual_verified && (
  <div style={{
    width: '20px',
    height: '20px',
    borderRadius: borderRadius.full,
    backgroundColor: '#3B82F6',
    color: colors.text.inverse,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px'
  }} title="Verified Individual Seller">
    ✓
  </div>
)}
```

### 6. Update Backend Ad Query

**Location:** `backend/server.js` (ad detail endpoint)

Add `individual_verified` to the user fields:

```sql
SELECT
  u.individual_verified,
  u.seller_slug,
  ...
FROM ads a
LEFT JOIN users u ON a.user_id = u.id
WHERE a.slug = $1
```

## API Endpoints Summary

### User Endpoints
- `GET /api/individual-verification/status` - Get user's verification status
- `POST /api/individual-verification/submit` - Submit verification (multipart/form-data)

### Editor Endpoints
- `GET /api/admin/individual-verifications?status=pending` - List requests
- `GET /api/admin/individual-verifications/:id` - View single request
- `POST /api/admin/individual-verifications/:id/approve` - Approve
- `POST /api/admin/individual-verifications/:id/reject` - Reject (body: {reason})

## File Uploads
Documents are stored in: `backend/uploads/individual_verification/`
Access via: `http://localhost:5000/uploads/individual_verification/{filename}`

## Database Tables
- `individual_verification_requests` - Stores all verification requests
- `users.individual_verified` - Boolean flag
- `users.individual_verified_at` - Timestamp
