# Verification System - End-to-End Testing Guide

**Last Updated:** 2025-10-22
**Purpose:** Step-by-step guide to test the complete verification flow

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Test Accounts](#test-accounts)
3. [Individual Verification Flow](#individual-verification-flow)
4. [Business Verification Flow](#business-verification-flow)
5. [Editor Approval Flow](#editor-approval-flow)
6. [Badge Display Testing](#badge-display-testing)
7. [Edge Cases & Error Scenarios](#edge-cases--error-scenarios)
8. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Services Running ✅
- [ ] Frontend: `http://localhost:5173`
- [ ] Backend: `http://localhost:5000`
- [ ] PostgreSQL database
- [ ] Typesense (optional, for search)

### Database Setup
```bash
# Check users table has verification columns
PGPASSWORD=postgres psql -U postgres -d thulobazaar -c "\d users"

# Expected columns:
# - business_verification_status VARCHAR(20)
# - individual_verified BOOLEAN
# - account_type VARCHAR(20)
```

### Badge Images
```bash
# Verify badge images exist
ls -la /Users/elw/Documents/Web/thulobazaar/frontend/public/*badge.png

# Should see:
# - golden-badge.png (for business verified)
# - blue-badge.png (for individual verified)
```

---

## Test Accounts

### 1. Regular User Account (For Testing)
**Purpose:** Test verification application process

**Registration:**
1. Go to http://localhost:5173/en
2. Click "Sign Up"
3. Register new account:
   - Email: `testuser1@verification.test`
   - Password: `Test123!`
   - Full Name: `Test User One`
   - Phone: `9841234567`

**Expected:** Account created successfully

---

### 2. Editor Account (For Approval)
**Purpose:** Approve/reject verification requests

**Check if editor exists:**
```bash
PGPASSWORD=postgres psql -U postgres -d thulobazaar -c "SELECT id, email, full_name, role FROM users WHERE role = 'editor' LIMIT 1;"
```

**If no editor exists, create one:**
```bash
# Create editor account via SQL
PGPASSWORD=postgres psql -U postgres -d thulobazaar -c "
INSERT INTO users (email, password_hash, full_name, phone, role, is_active, created_at, seller_slug)
VALUES (
  'editor@thulobazaar.com',
  '\$2b\$10\$...',  -- Use proper bcrypt hash
  'Test Editor',
  '9841111111',
  'editor',
  true,
  NOW(),
  'test-editor'
) RETURNING id, email, role;
"
```

**Or use existing editor:**
- Check `/backend/migrations/003_editor_system.sql` for created editors
- Default password: Check migration file

**Editor Login:**
1. Go to http://localhost:5173/en/editor
2. Login with editor credentials

---

## Individual Verification Flow

### Step 1: Login as Regular User
1. Login to http://localhost:5173/en
2. Use `testuser1@verification.test` / `Test123!`

### Step 2: Navigate to Dashboard
1. Click on your name/avatar (top right)
2. Select "Dashboard"
3. Should see: http://localhost:5173/en/dashboard

### Step 3: Apply for Individual Verification
1. Look for "Individual Verification" banner
2. Click "Get Verified" or "Apply for Verification"
3. Fill in verification form:
   - **ID Type:** National ID / Citizenship / Passport
   - **ID Number:** `123-456-789-0`
   - **Upload ID:** Upload a test image (JPG/PNG)
   - **Full Name (as on ID):** `Test User One`
   - **Date of Birth:** `1990-01-01`
   - **Selfie with ID:** Upload another test image

### Step 4: Submit Application
1. Click "Submit Application"
2. **Expected:** Success message
3. **Expected:** Dashboard now shows "Verification Pending" status

### Step 5: Verify Database
```bash
PGPASSWORD=postgres psql -U postgres -d thulobazaar -c "
SELECT id, user_id, full_name, id_type, status, created_at
FROM individual_verification_requests
ORDER BY created_at DESC LIMIT 1;
"
```

**Expected Output:**
- status: `'pending'`
- created_at: recent timestamp

---

## Business Verification Flow

### Step 1: Register New Business Account
**Why new account?** Individual-verified users can't apply for business verification

1. Register another account:
   - Email: `business@verification.test`
   - Password: `Test123!`
   - Full Name: `Test Business Owner`
   - Phone: `9847777777`

### Step 2: Navigate to Dashboard
1. Login and go to Dashboard
2. Look for "Business Verification" section

### Step 3: View Verification Info
1. Click "Get Business Verified" button
2. Should see:
   - **Verification Fee:** NPR 1,000
   - **Benefits:**
     - Golden verified badge
     - 30-40% discount on ad promotions
     - Priority support
     - Business profile page
   - **Required Documents:**
     - Business registration certificate
     - Tax registration (PAN)
     - Government-issued business license

### Step 4: Fill Business Verification Form
1. Click "Apply Now"
2. Fill in form:
   - **Business Name:** `Test Shop Nepal`
   - **Business Category:** `Electronics`
   - **Business Description:** `We sell quality electronics in Kathmandu`
   - **Business Website:** `https://testshop.com.np` (optional)
   - **Business Phone:** `01-4444444`
   - **Business Address:** `Thamel, Kathmandu`
   - **Upload License:** Upload test PDF or image
   - **Payment Reference:** `KHALTI-1234567890` (fake for testing)
   - **Payment Amount:** `1000`

### Step 5: Submit Application
1. Click "Submit Application"
2. **Expected:** Success message
3. **Expected:** Dashboard shows "Business Verification Pending"

### Step 6: Verify Database
```bash
PGPASSWORD=postgres psql -U postgres -d thulobazaar -c "
SELECT id, user_id, business_name, business_category, status, payment_reference, created_at
FROM business_verification_requests
ORDER BY created_at DESC LIMIT 1;
"
```

**Expected Output:**
- status: `'pending'`
- business_name: `'Test Shop Nepal'`

---

## Editor Approval Flow

### Step 1: Login as Editor
1. Go to http://localhost:5173/en/editor
2. Login with editor credentials

### Step 2: Navigate to Verification Requests
1. Should see Editor Dashboard
2. Click on "Business Verifications" tab
3. **Expected:** See pending business verification request

### Step 3: Review Business Request
**Information Displayed:**
- ID
- User (name + email)
- Business Name
- Category
- Payment Reference
- Submission Date
- Uploaded Documents (click to view)

**Actions:**
- ✓ Approve button
- ✗ Reject button

### Step 4: Approve Business Verification
1. Click "✓ Approve" button
2. **Expected:** Success message
3. **Expected:** Request disappears from pending list (or status changes)

### Step 5: Verify Database Update
```bash
PGPASSWORD=postgres psql -U postgres -d thulobazaar -c "
SELECT
  bvr.id, bvr.business_name, bvr.status, bvr.reviewed_at,
  u.business_verification_status, u.business_name as user_business_name
FROM business_verification_requests bvr
JOIN users u ON bvr.user_id = u.id
WHERE bvr.business_name = 'Test Shop Nepal';
"
```

**Expected Output:**
- bvr.status: `'approved'`
- u.business_verification_status: `'approved'`
- u.business_name: `'Test Shop Nepal'`
- bvr.reviewed_at: recent timestamp

### Step 6: Approve Individual Verification
1. Click on "Individual Verifications" tab
2. Find the pending individual verification
3. Click "✓ Approve"
4. **Expected:** Success message

### Step 7: Verify Individual in Database
```bash
PGPASSWORD=postgres psql -U postgres -d thulobazaar -c "
SELECT
  ivr.id, ivr.full_name, ivr.status, ivr.reviewed_at,
  u.individual_verified
FROM individual_verification_requests ivr
JOIN users u ON ivr.user_id = u.id
WHERE ivr.full_name = 'Test User One';
"
```

**Expected Output:**
- ivr.status: `'approved'`
- u.individual_verified: `true`

---

## Badge Display Testing

### Test 1: Business Verified Badge (Golden)

**Account:** `business@verification.test`

1. Login as business user
2. Post a test ad:
   - Go to "Post Ad"
   - Fill in basic info
   - Submit

3. **Check Badge Display on:**

**Homepage** http://localhost:5173/en
- [ ] Ad card shows seller name + golden badge (16px)

**All Ads** http://localhost:5173/en/all-ads
- [ ] Ad card shows seller name + golden badge (16px)

**Search** http://localhost:5173/en/search
- [ ] Search result shows "Seller: [name]" + golden badge (16px)

**Ad Detail** http://localhost:5173/en/ad/[slug]
- [ ] Seller card shows business name + golden badge (20px)
- [ ] Shows "Verified Business Account" text
- [ ] Seller name is clickable (links to shop page)

**Seller Profile** http://localhost:5173/en/shop/[shop-slug]
- [ ] Profile avatar has golden border
- [ ] Shows golden badge next to name (32px)
- [ ] Shows "Verified Business Account" text

**Hover Tooltip:**
- [ ] Hover over badge → shows "Verified Business Account"

---

### Test 2: Individual Verified Badge (Blue)

**Account:** `testuser1@verification.test`

1. Login as individual user
2. Post a test ad

3. **Check Badge Display on:**

**Homepage**
- [ ] Ad card shows seller name + blue badge (16px)

**All Ads**
- [ ] Ad card shows seller name + blue badge (16px)

**Search**
- [ ] Search result shows "Seller: [name]" + blue badge (16px)

**Ad Detail**
- [ ] Seller card shows seller name + blue badge (20px)
- [ ] Shows "Verified Individual Seller" text
- [ ] Seller name is clickable (links to seller page)

**Seller Profile** http://localhost:5173/en/seller/[seller-slug]
- [ ] Profile avatar has blue border
- [ ] Shows blue badge next to name (32px)
- [ ] Shows "Verified Individual Seller" text

**Hover Tooltip:**
- [ ] Hover over badge → shows "Verified Individual Seller"

---

### Test 3: No Badge (Unverified)

**Create unverified account:**
1. Register: `unverified@test.com`
2. Post an ad

3. **Check Badge Display:**
- [ ] Homepage - No badge shown
- [ ] All Ads - No badge shown
- [ ] Search - No badge shown
- [ ] Ad Detail - No badge, shows "Seller" text
- [ ] Seller Profile - Gray avatar border, no badge

---

## Edge Cases & Error Scenarios

### Case 1: Duplicate Application
**Test:** Try to apply for verification twice

1. Login as already-pending user
2. Try to apply again
3. **Expected:** Error message
   - "You already have a pending verification request"

### Case 2: Already Verified
**Test:** Try to apply when already verified

1. Login as verified user
2. Try to apply for verification
3. **Expected:** Error message or form disabled
   - "Your account is already verified"

### Case 3: Rejection Flow
1. Submit a verification request
2. Editor rejects with reason: "Invalid document"
3. **Expected:**
   - User sees rejection reason in dashboard
   - status: `'rejected'`
   - User can reapply

### Case 4: Missing Documents
1. Try to submit without uploading file
2. **Expected:** Validation error
   - "Business license document is required"
   - "ID document is required"

### Case 5: Invalid File Types
1. Try to upload .txt or .exe file
2. **Expected:** Error
   - "Only .png, .jpg, .jpeg and .pdf files are allowed"

### Case 6: File Size Too Large
1. Try to upload > 5MB file
2. **Expected:** Error
   - "File size must be less than 5MB"

---

## Troubleshooting

### Issue: Badges not showing
**Check:**
1. Is backend returning verification fields?
```bash
curl http://localhost:5000/api/ads?limit=1 | python3 -m json.tool | grep -A2 verification
```
2. Are badge images accessible?
```bash
curl -I http://localhost:5173/golden-badge.png
curl -I http://localhost:5173/blue-badge.png
```
3. Browser console errors?
   - Open DevTools → Console
   - Look for 404 errors or component errors

### Issue: Verification form not showing
**Check:**
1. User is logged in?
2. User already has pending/approved status?
3. Check Dashboard component loaded:
   - F12 → Console → Check for React errors

### Issue: Editor can't approve
**Check:**
1. Editor is logged in with correct role?
```bash
PGPASSWORD=postgres psql -U postgres -d thulobazaar -c "
SELECT id, email, role FROM users WHERE email = 'editor@thulobazaar.com';
"
```
2. Editor has editorToken in localStorage?
   - F12 → Application → Local Storage
   - Look for `editorToken`

### Issue: Database not updating
**Check:**
1. Database connection working?
```bash
PGPASSWORD=postgres psql -U postgres -d thulobazaar -c "SELECT NOW();"
```
2. Check backend logs for SQL errors
3. Verify migrations ran:
```bash
ls /Users/elw/Documents/Web/thulobazaar/backend/migrations/
```

---

## Success Criteria

✅ **Individual Verification:**
- [ ] User can submit application
- [ ] Editor can see pending request
- [ ] Editor can approve/reject
- [ ] Database updates correctly
- [ ] Blue badge appears on all pages
- [ ] Hover tooltip works

✅ **Business Verification:**
- [ ] User can submit application with documents
- [ ] Editor can view documents
- [ ] Editor can approve/reject
- [ ] Database updates correctly
- [ ] Golden badge appears on all pages
- [ ] Business name shows instead of user name
- [ ] Hover tooltip works

✅ **Badge Priority:**
- [ ] Business verification takes precedence over individual
- [ ] If user has both, only golden badge shows

✅ **Error Handling:**
- [ ] Duplicate applications prevented
- [ ] Invalid files rejected
- [ ] Missing fields validated
- [ ] Clear error messages shown

---

## Quick Test Commands

```bash
# Check all verification requests
PGPASSWORD=postgres psql -U postgres -d thulobazaar -c "
SELECT 'Business' as type, id, user_id, business_name as name, status, created_at
FROM business_verification_requests
UNION ALL
SELECT 'Individual' as type, id, user_id, full_name as name, status, created_at
FROM individual_verification_requests
ORDER BY created_at DESC;
"

# Check all verified users
PGPASSWORD=postgres psql -U postgres -d thulobazaar -c "
SELECT id, email, full_name,
  business_verification_status,
  individual_verified,
  account_type
FROM users
WHERE business_verification_status = 'approved' OR individual_verified = true;
"

# Reset verification for testing
PGPASSWORD=postgres psql -U postgres -d thulobazaar -c "
UPDATE users
SET business_verification_status = NULL, individual_verified = false
WHERE email = 'testuser1@verification.test';

DELETE FROM individual_verification_requests WHERE user_id = (
  SELECT id FROM users WHERE email = 'testuser1@verification.test'
);
"
```

---

**Testing Duration:** ~30-45 minutes for complete flow
**Recommended:** Test both verification types to ensure full coverage

**Happy Testing! 🧪**
