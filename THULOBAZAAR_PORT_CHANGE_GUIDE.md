# Thulobazaar Monorepo Port Change Guide: 3000 → 3002

**Created:** October 23, 2025
**Purpose:** Change Thulobazaar Next.js monorepo from port 3000 to 3002

---

## 📊 Summary

**Files to Edit:** **2 files (3 lines total)**

This is the EASIER option! The monorepo is well-configured and only needs 2 files edited.

**Recommended New Port:** 3002
**Reason:** Keeps Slashhour at 3000 (industry standard for NestJS), avoids conflict

---

## ✅ Files That Need Changes

### 1. **apps/web/package.json** (Line 6)
**Location:** `/Users/elw/Documents/Web/thulobazaar/monorepo/apps/web/package.json`

**Current:**
```json
"dev": "next dev --turbo -p 3000"
```

**Change to:**
```json
"dev": "next dev --turbo -p 3002"
```

**Why:** This sets the Next.js development server port.

---

### 2. **apps/web/.env.local** (Lines 3 & 6)
**Location:** `/Users/elw/Documents/Web/thulobazaar/monorepo/apps/web/.env.local`

**Current:**
```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
...
NEXTAUTH_URL=http://localhost:3000
```

**Change to:**
```env
NEXT_PUBLIC_SITE_URL=http://localhost:3002
...
NEXTAUTH_URL=http://localhost:3002
```

**Why:**
- `NEXT_PUBLIC_SITE_URL`: Used for canonical URLs and metadata
- `NEXTAUTH_URL`: Required by NextAuth for authentication callbacks

---

## 📝 Files That DON'T Need Changes

### ✓ All timeout values (30000, 300000ms)
**Reason:** These are milliseconds for timeouts, not port numbers
- `timeout: 30000` = 30 seconds
- `maximumAge: 300000` = 5 minutes

### ✓ Backend API URL
**Reason:** Backend stays on port 5000, no changes needed
- `NEXT_PUBLIC_API_URL=http://localhost:5000` ✅ Keep as-is
- `API_URL=http://localhost:5000` ✅ Keep as-is

---

## 🚀 Quick Implementation

### Option 1: Manual Edit (2 files, 3 lines)

**Step 1: Edit package.json**
```bash
code /Users/elw/Documents/Web/thulobazaar/monorepo/apps/web/package.json
# Change line 6: -p 3000 → -p 3002
```

**Step 2: Edit .env.local**
```bash
code /Users/elw/Documents/Web/thulobazaar/monorepo/apps/web/.env.local
# Change line 3: localhost:3000 → localhost:3002
# Change line 6: localhost:3000 → localhost:3002
```

---

### Option 2: One-Command Solution

Run these commands from the monorepo root:

```bash
cd /Users/elw/Documents/Web/thulobazaar/monorepo

# 1. Change dev server port
sed -i '' 's/-p 3000/-p 3002/g' apps/web/package.json

# 2. Change site URL in .env.local
sed -i '' 's/localhost:3000/localhost:3002/g' apps/web/.env.local
```

---

## ✅ Verification

### 1. Verify package.json
```bash
grep "dev.*3002" /Users/elw/Documents/Web/thulobazaar/monorepo/apps/web/package.json
```
**Expected output:**
```
"dev": "next dev --turbo -p 3002",
```

### 2. Verify .env.local
```bash
grep "3002" /Users/elw/Documents/Web/thulobazaar/monorepo/apps/web/.env.local
```
**Expected output:**
```
NEXT_PUBLIC_SITE_URL=http://localhost:3002
NEXTAUTH_URL=http://localhost:3002
```

### 3. Test Next.js
```bash
cd /Users/elw/Documents/Web/thulobazaar/monorepo
npm run dev --workspace=apps/web
```
**Expected output:**
```
▲ Next.js 15.x.x
- Local:        http://localhost:3002
```

### 4. Access Site
```bash
open http://localhost:3002
```

---

## 🔄 After Changes

### Restart Required
After making these changes:

1. **Stop Next.js** (if running)
   ```bash
   lsof -ti:3000 | xargs kill -9
   ```

2. **Restart Next.js**
   ```bash
   cd /Users/elw/Documents/Web/thulobazaar/monorepo
   npm run dev --workspace=apps/web
   ```

3. **Backend stays the same** (still on port 5000)
   ```bash
   cd /Users/elw/Documents/Web/thulobazaar/backend
   npm run dev
   ```

---

## 📦 Full Port Configuration After Change

### Thulobazaar Project (Updated):
- **Port 3002**: Next.js monorepo frontend ✅ Changed
- **Port 5000**: Express.js backend ✅ No change
- **Port 5432**: PostgreSQL database ✅ No change

### Slashhour Project (No Changes):
- **Port 3000**: NestJS API ✅ No conflict anymore!
- **Port 19006**: Expo React Native app (web mode)
- **Port 5432**: PostgreSQL database
- **Port 6379**: Redis

---

## 🎯 Benefits of This Approach

### ✅ Pros:
1. **Fewer files to edit** (2 files vs Slashhour's 2 files)
2. **Slashhour stays on standard port 3000** (common for APIs)
3. **Easy to remember** (Thulobazaar = 3002, sounds like "bazaar")
4. **No mobile app complications** (Slashhour has React Native app)

### ⚠️ Cons:
1. **Non-standard port for Next.js** (3000 is typical)
2. **Need to remember new port** when accessing site

---

## 📋 Complete Checklist

- [ ] Edit `apps/web/package.json` → Change `-p 3000` to `-p 3002`
- [ ] Edit `apps/web/.env.local` line 3 → Change `localhost:3000` to `localhost:3002`
- [ ] Edit `apps/web/.env.local` line 6 → Change `localhost:3000` to `localhost:3002`
- [ ] Stop Next.js on port 3000
- [ ] Start Next.js and verify it's on port 3002
- [ ] Test site: `curl http://localhost:3002`
- [ ] Verify authentication works (NextAuth needs correct URL)

---

## 🚨 Rollback (If Needed)

If you need to revert back to port 3000:

```bash
cd /Users/elw/Documents/Web/thulobazaar/monorepo

# Revert package.json
sed -i '' 's/-p 3002/-p 3000/g' apps/web/package.json

# Revert .env.local
sed -i '' 's/localhost:3002/localhost:3000/g' apps/web/.env.local
```

---

## 🆚 Comparison: Which to Change?

| Aspect | Change Thulobazaar (This) | Change Slashhour |
|--------|--------------------------|------------------|
| **Files to edit** | 2 files, 3 lines | 2 files, 2 lines |
| **Complexity** | Very easy | Very easy |
| **Mobile app impact** | None | Must update React Native app |
| **Standard ports** | Slashhour keeps 3000 ✅ | Thulobazaar keeps 3000 ✅ |
| **Recommended?** | ✅ **YES** | Also good option |

---

## 💡 Recommendation

**Change Thulobazaar to port 3002** because:
1. Just as easy as changing Slashhour
2. Slashhour has a mobile app that connects to the API
3. Port 3000 is more commonly expected for APIs than frontends
4. Thulobazaar is a web-only app (easier to change)

---

**Total files to edit:** **2 files (3 lines)**
**Time required:** **~20 seconds**
**Difficulty:** ⭐ Very Easy

---

**Status:** ✅ Ready to implement
**Recommended:** ✅ This is the better option!
