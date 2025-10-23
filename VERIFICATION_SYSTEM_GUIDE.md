# Verification System Guide

**Last Updated:** 2025-10-22
**Purpose:** Complete guide to using the verification system constants and enums

---

## 📚 Table of Contents

1. [Overview](#overview)
2. [Backend Constants](#backend-constants)
3. [Frontend TypeScript Enums](#frontend-typescript-enums)
4. [Reusable Components](#reusable-components)
5. [Usage Examples](#usage-examples)
6. [Migration Guide](#migration-guide)
7. [Best Practices](#best-practices)

---

## Overview

The verification system uses **centralized constants and enums** to prevent typos and ensure type safety across the application.

### Benefits

✅ **Type Safety** - TypeScript enums prevent invalid values
✅ **Consistency** - Single source of truth
✅ **Maintainability** - Easy to update verification logic
✅ **Fewer Bugs** - No more `'verified'` vs `'approved'` issues
✅ **Reusability** - Shared helper functions

---

## Backend Constants

### File Location
```
/backend/constants/verificationStatus.js
```

### Constants

#### Business Verification Status
```javascript
const { BUSINESS_VERIFICATION_STATUS } = require('../constants/verificationStatus');

// Values
BUSINESS_VERIFICATION_STATUS.PENDING   // 'pending'
BUSINESS_VERIFICATION_STATUS.APPROVED  // 'approved'
BUSINESS_VERIFICATION_STATUS.REJECTED  // 'rejected'
BUSINESS_VERIFICATION_STATUS.NULL      // null
```

#### Individual Verification Status
```javascript
const { INDIVIDUAL_VERIFICATION_STATUS } = require('../constants/verificationStatus');

// Values
INDIVIDUAL_VERIFICATION_STATUS.VERIFIED      // true
INDIVIDUAL_VERIFICATION_STATUS.NOT_VERIFIED  // false
```

#### Account Types
```javascript
const { ACCOUNT_TYPE } = require('../constants/verificationStatus');

// Values
ACCOUNT_TYPE.INDIVIDUAL  // 'individual'
ACCOUNT_TYPE.BUSINESS    // 'business'
```

#### Ad Status
```javascript
const { AD_STATUS } = require('../constants/verificationStatus');

// Values
AD_STATUS.PENDING   // 'pending'
AD_STATUS.APPROVED  // 'approved'
AD_STATUS.REJECTED  // 'rejected'
```

### Helper Functions

```javascript
const {
  isBusinessVerified,
  isIndividualVerified,
  getVerificationDisplayText,
  getVerificationBadgeType
} = require('../constants/verificationStatus');

// Check if business is verified
if (isBusinessVerified(user.business_verification_status)) {
  // User has golden badge
}

// Check if individual is verified
if (isIndividualVerified(user.individual_verified)) {
  // User has blue badge
}

// Get display text
const text = getVerificationDisplayText(
  user.business_verification_status,
  user.individual_verified
);
// Returns: "Verified Business Account" | "Verified Individual Seller" | "Seller"

// Get badge type
const badgeType = getVerificationBadgeType(
  user.business_verification_status,
  user.individual_verified
);
// Returns: 'golden' | 'blue' | null
```

---

## Frontend TypeScript Enums

### File Location
```
/frontend/src/constants/verificationStatus.ts
```

### Enums

#### Business Verification Status
```typescript
import { BusinessVerificationStatus } from '../constants/verificationStatus.ts';

// Values
BusinessVerificationStatus.PENDING   // 'pending'
BusinessVerificationStatus.APPROVED  // 'approved'
BusinessVerificationStatus.REJECTED  // 'rejected'
```

#### Account Type
```typescript
import { AccountType } from '../constants/verificationStatus.ts';

// Values
AccountType.INDIVIDUAL  // 'individual'
AccountType.BUSINESS    // 'business'
```

#### Badge Type
```typescript
import { BadgeType } from '../constants/verificationStatus.ts';

// Values
BadgeType.GOLDEN  // 'golden'
BadgeType.BLUE    // 'blue'
```

### TypeScript Types

```typescript
import {
  BusinessVerificationStatusType,
  IndividualVerifiedType,
  UserVerification,
  AdWithVerification
} from '../constants/verificationStatus.ts';

// Use in component props
interface Props {
  verification: UserVerification;
}

// Use in type definitions
type VerificationStatus = BusinessVerificationStatusType;
```

### Helper Functions

```typescript
import {
  isBusinessVerified,
  isIndividualVerified,
  getVerificationDisplayText,
  getVerificationBadgeType,
  getVerificationBadgeImagePath,
  getVerificationBadgeAltText,
  getVerificationBadgeTitle
} from '../constants/verificationStatus.ts';

// Check verification
if (isBusinessVerified(ad.business_verification_status)) {
  // Show golden badge
}

// Get badge image path
const imagePath = getVerificationBadgeImagePath(
  ad.business_verification_status,
  ad.individual_verified
);
// Returns: '/golden-badge.png' | '/blue-badge.png' | null

// Get alt text
const altText = getVerificationBadgeAltText(
  ad.business_verification_status,
  ad.individual_verified
);
// Returns: 'Verified Business' | 'Verified Seller' | null

// Get title (tooltip)
const title = getVerificationBadgeTitle(
  ad.business_verification_status,
  ad.individual_verified
);
// Returns: 'Verified Business Account' | 'Verified Individual Seller' | 'Seller'
```

---

## Reusable Components

### VerificationBadge Component

#### File Location
```
/frontend/src/components/common/VerificationBadge.jsx
```

#### Usage

```jsx
import VerificationBadge from './common/VerificationBadge';

function MyComponent({ ad }) {
  return (
    <div>
      <span>{ad.seller_name}</span>
      <VerificationBadge
        businessVerificationStatus={ad.business_verification_status}
        individualVerified={ad.individual_verified}
        size={16}
      />
    </div>
  );
}
```

#### Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `businessVerificationStatus` | `string \| null` | Yes | - | Business verification status |
| `individualVerified` | `boolean` | Yes | - | Individual verification status |
| `size` | `number` | No | `16` | Badge size in pixels |
| `style` | `object` | No | `{}` | Additional inline styles |

#### Component Behavior

- Returns `null` if user is not verified (no badge shown)
- Shows golden badge if `business_verification_status === 'approved'`
- Shows blue badge if `individual_verified === true` (and not business verified)
- Includes hover tooltip automatically

---

## Usage Examples

### Backend Example

#### Before (Hardcoded Strings) ❌
```javascript
// DON'T DO THIS
if (user.business_verification_status === 'approved') {
  // Typo risk: 'approoved', 'verified', 'approve'
}

if (ad.status === 'approved') {
  // Inconsistent
}
```

#### After (Using Constants) ✅
```javascript
const { BUSINESS_VERIFICATION_STATUS, isBusinessVerified } = require('../constants/verificationStatus');

// Correct - Type-safe
if (isBusinessVerified(user.business_verification_status)) {
  // No typo risk
}

// Or use the constant directly
if (user.business_verification_status === BUSINESS_VERIFICATION_STATUS.APPROVED) {
  // Also correct
}
```

### Frontend Example

#### Before (Hardcoded Strings) ❌
```jsx
// DON'T DO THIS
{ad.business_verification_status === 'approved' && (
  <img src="/golden-badge.png" alt="Verified Business" title="Verified Business Account" style={{ width: '16px', height: '16px' }} />
)}
{ad.individual_verified && ad.business_verification_status !== 'approved' && (
  <img src="/blue-badge.png" alt="Verified Seller" title="Verified Individual Seller" style={{ width: '16px', height: '16px' }} />
)}
```

#### After (Using VerificationBadge Component) ✅
```jsx
import VerificationBadge from './common/VerificationBadge';

// Correct - Clean and reusable
<VerificationBadge
  businessVerificationStatus={ad.business_verification_status}
  individualVerified={ad.individual_verified}
  size={16}
/>
```

### PropTypes Example

#### Before (Weak Typing) ❌
```javascript
AdCard.propTypes = {
  ad: PropTypes.shape({
    business_verification_status: PropTypes.string,  // Too loose
    individual_verified: PropTypes.bool
  })
};
```

#### After (Strong Typing) ✅
```javascript
import { BusinessVerificationStatus } from '../constants/verificationStatus.ts';

AdCard.propTypes = {
  ad: PropTypes.shape({
    business_verification_status: PropTypes.oneOf([
      BusinessVerificationStatus.PENDING,
      BusinessVerificationStatus.APPROVED,
      BusinessVerificationStatus.REJECTED,
      null
    ]),  // Type-safe
    individual_verified: PropTypes.bool
  })
};
```

---

## Migration Guide

### Step 1: Update Backend Files

1. Import constants:
```javascript
const { BUSINESS_VERIFICATION_STATUS, isBusinessVerified } = require('../constants/verificationStatus');
```

2. Replace hardcoded strings:
```javascript
// Before
if (user.business_verification_status === 'approved') { }

// After
if (isBusinessVerified(user.business_verification_status)) { }
```

### Step 2: Update Frontend Components

1. Import VerificationBadge:
```jsx
import VerificationBadge from './common/VerificationBadge';
```

2. Replace badge rendering:
```jsx
// Before
{ad.business_verification_status === 'approved' && (
  <img src="/golden-badge.png" ... />
)}

// After
<VerificationBadge
  businessVerificationStatus={ad.business_verification_status}
  individualVerified={ad.individual_verified}
/>
```

3. Update PropTypes:
```javascript
import { BusinessVerificationStatus } from '../constants/verificationStatus.ts';

business_verification_status: PropTypes.oneOf([
  BusinessVerificationStatus.PENDING,
  BusinessVerificationStatus.APPROVED,
  BusinessVerificationStatus.REJECTED,
  null
])
```

---

## Best Practices

### ✅ DO

- **Use helper functions** for checks: `isBusinessVerified(status)`
- **Use VerificationBadge component** for consistency
- **Use enums in PropTypes** for type safety
- **Import only what you need** to reduce bundle size
- **Document any new verification logic** in this guide

### ❌ DON'T

- **Don't hardcode strings** like `'approved'`, `'pending'`
- **Don't duplicate badge rendering logic** - use VerificationBadge component
- **Don't use loose PropTypes** - use enum values
- **Don't create custom verification checks** - use helper functions

---

## Database Schema Reference

### Users Table
```sql
business_verification_status VARCHAR(20)  -- 'pending', 'approved', 'rejected', NULL
individual_verified BOOLEAN               -- true, false
account_type VARCHAR(20)                  -- 'individual', 'business'
```

### Ads Table
```sql
status VARCHAR(20)  -- 'pending', 'approved', 'rejected'
```

---

## Testing

### Unit Test Example
```javascript
const { isBusinessVerified, getVerificationDisplayText } = require('../constants/verificationStatus');

describe('Verification Helpers', () => {
  it('should identify verified business', () => {
    expect(isBusinessVerified('approved')).toBe(true);
    expect(isBusinessVerified('pending')).toBe(false);
    expect(isBusinessVerified(null)).toBe(false);
  });

  it('should return correct display text', () => {
    expect(getVerificationDisplayText('approved', false)).toBe('Verified Business Account');
    expect(getVerificationDisplayText(null, true)).toBe('Verified Individual Seller');
    expect(getVerificationDisplayText(null, false)).toBe('Seller');
  });
});
```

---

## Troubleshooting

### Issue: Badge not showing
**Check:**
1. Is `business_verification_status` or `individual_verified` being passed correctly?
2. Is the API returning these fields?
3. Are badge image files present in `/frontend/public/`?

### Issue: TypeScript errors
**Solution:** Import types from the constants file:
```typescript
import { BusinessVerificationStatusType } from '../constants/verificationStatus.ts';
```

### Issue: PropTypes warnings
**Solution:** Use enum values instead of strings:
```javascript
import { BusinessVerificationStatus } from '../constants/verificationStatus.ts';

PropTypes.oneOf([
  BusinessVerificationStatus.APPROVED,
  BusinessVerificationStatus.PENDING,
  BusinessVerificationStatus.REJECTED,
  null
])
```

---

## Future Enhancements

- [ ] Add verification expiry dates
- [ ] Add verification levels (Basic, Premium, Enterprise)
- [ ] Add verification progress tracking
- [ ] Add automated verification workflows

---

**Questions?** Check `/monorepo/DEBUG_PATTERNS.md` for common issues and solutions.
