# Slashhour Port Change Guide: 3000 → 3001

**Created:** October 23, 2025
**Purpose:** Step-by-step guide to change Slashhour API from port 3000 to 3001

---

## 📊 Summary

**Files to Edit:** **2 files only!**

The good news: Slashhour is already configured to use environment variables, so you only need to edit **2 files** to switch from port 3000 to 3001.

---

## ✅ Files That Need Changes

### 1. **slashhour-api/.env** (REQUIRED)
**Location:** `/Users/elw/Documents/Test/Slashhour/slashhour-api/.env`
**Line:** 3

**Current:**
```env
PORT=3000
```

**Change to:**
```env
PORT=3001
```

**Why:** This is the main configuration for the NestJS API server port.

---

### 2. **slashhour-app/src/utils/constants.ts** (REQUIRED)
**Location:** `/Users/elw/Documents/Test/Slashhour/slashhour-app/src/utils/constants.ts`
**Line:** 7

**Current:**
```typescript
export const API_BASE_URL = __DEV__
  ? 'http://192.168.1.153:3000/api/v1'  // Use local IP for mobile testing
  : 'https://api.slashhour.com/v1';
```

**Change to:**
```typescript
export const API_BASE_URL = __DEV__
  ? 'http://192.168.1.153:3001/api/v1'  // Use local IP for mobile testing
  : 'https://api.slashhour.com/v1';
```

**Why:** This is the API base URL used by the React Native app to connect to the backend.

---

## 📝 Files That DON'T Need Changes

### ✓ slashhour-api/src/main.ts
**Reason:** Already uses `process.env.PORT`, which reads from .env
```typescript
const port = process.env.PORT || 3000;  // ← Reads from .env
```

### ✓ slashhour-api/src/upload/upload.service.ts
**Reason:** Already uses ConfigService, which reads from .env
```typescript
const port = this.configService.get('PORT', 3000);  // ← Reads from .env
```

### ✓ .claude/settings.local.json
**Reason:** These are just saved curl commands for testing - optional to update
**Note:** You can update these later if you use them frequently

### ✓ All other timeout/interval values (30000, 3000ms)
**Reason:** These are milliseconds for timeouts, not port numbers
- `sessionTrackingIntervalMillis: 30000` = 30 seconds
- `setTimeout(..., 3000)` = 3 second delay
- These are NOT port numbers!

---

## 🚀 Quick Implementation

### Option 1: Manual Edit (2 files)

**Step 1: Edit API .env file**
```bash
# Open in your editor
code /Users/elw/Documents/Test/Slashhour/slashhour-api/.env

# Or use sed to replace
sed -i '' 's/PORT=3000/PORT=3001/g' /Users/elw/Documents/Test/Slashhour/slashhour-api/.env
```

**Step 2: Edit app constants file**
```bash
# Open in your editor
code /Users/elw/Documents/Test/Slashhour/slashhour-app/src/utils/constants.ts

# Or use sed to replace
sed -i '' 's/192.168.1.153:3000/192.168.1.153:3001/g' /Users/elw/Documents/Test/Slashhour/slashhour-app/src/utils/constants.ts
```

---

### Option 2: One-Command Solution

Run these two commands:

```bash
# Change API port in .env
sed -i '' 's/PORT=3000/PORT=3001/g' /Users/elw/Documents/Test/Slashhour/slashhour-api/.env

# Change API URL in app constants
sed -i '' 's/192.168.1.153:3000/192.168.1.153:3001/g' /Users/elw/Documents/Test/Slashhour/slashhour-app/src/utils/constants.ts
```

---

## ✅ Verification

### 1. Verify .env file
```bash
grep "PORT=" /Users/elw/Documents/Test/Slashhour/slashhour-api/.env
```
**Expected output:**
```
PORT=3001
```

### 2. Verify constants file
```bash
grep "192.168.1.153:" /Users/elw/Documents/Test/Slashhour/slashhour-app/src/utils/constants.ts
```
**Expected output:**
```
  ? 'http://192.168.1.153:3001/api/v1'  // Use local IP for mobile testing
```

### 3. Test API
```bash
cd /Users/elw/Documents/Test/Slashhour/slashhour-api
npm run start:dev
```
**Expected output:**
```
🚀 Slashhour API is running!
📍 URL: http://localhost:3001/api/v1
📚 Swagger Docs: http://localhost:3001/api/docs
```

### 4. Access API
```bash
curl http://localhost:3001/api/v1
# or
open http://localhost:3001/api/docs
```

---

## 🔄 After Changes

### Restart Required
After making these changes, you need to:

1. **Stop the API** (if running)
   ```bash
   lsof -ti:3000 | xargs kill -9
   ```

2. **Restart the API**
   ```bash
   cd /Users/elw/Documents/Test/Slashhour/slashhour-api
   npm run start:dev
   ```

3. **Restart the App** (if running)
   ```bash
   cd /Users/elw/Documents/Test/Slashhour/slashhour-app
   npm run web
   ```

---

## 📦 Full Port Configuration After Change

### Slashhour Project:
- **Port 3001**: NestJS API ✅ Changed
- **Port 19006**: Expo React Native app (web mode) - no change needed
- **Port 5432**: PostgreSQL database - no change needed
- **Port 6379**: Redis - no change needed

### Thulobazaar Project:
- **Port 3000**: Next.js monorepo frontend ✅ Available now!
- **Port 5000**: Express.js backend - no conflict

---

## 🎯 Optional: Update Claude Settings

If you use the Claude saved commands in `.claude/settings.local.json`, you can update those too (optional):

**File:** `/Users/elw/Documents/Test/Slashhour/.claude/settings.local.json`

Replace all instances of `localhost:3000` with `localhost:3001`:
```bash
sed -i '' 's/localhost:3000/localhost:3001/g' /Users/elw/Documents/Test/Slashhour/.claude/settings.local.json
```

---

## 📋 Complete Checklist

- [ ] Edit `slashhour-api/.env` → Change `PORT=3000` to `PORT=3001`
- [ ] Edit `slashhour-app/src/utils/constants.ts` → Change `:3000/` to `:3001/`
- [ ] Stop any running API on port 3000
- [ ] Start API and verify it's on port 3001
- [ ] Test API connection: `curl http://localhost:3001/api/v1`
- [ ] (Optional) Update `.claude/settings.local.json` curl commands

---

## 🚨 Rollback (If Needed)

If you need to revert back to port 3000:

```bash
# Revert .env
sed -i '' 's/PORT=3001/PORT=3000/g' /Users/elw/Documents/Test/Slashhour/slashhour-api/.env

# Revert constants
sed -i '' 's/192.168.1.153:3001/192.168.1.153:3000/g' /Users/elw/Documents/Test/Slashhour/slashhour-app/src/utils/constants.ts
```

---

## 💡 Why So Few Files?

Slashhour is properly architected with:
1. **Environment variables** (`.env`) for configuration
2. **Centralized constants** file for API URLs
3. **ConfigService** pattern in NestJS

This means the port is defined **once** in the `.env` file, and everything else references it through environment variables!

---

**Total files to edit:** **2 files**
**Time required:** **~30 seconds**
**Difficulty:** ⭐ Very Easy

---

**Status:** ✅ Ready to implement
**Impact:** Low - only 2 files need changes
**Risk:** Very low - easy to rollback
