# ⚠️ PORT CONFLICT WARNING

**Created:** October 23, 2025
**Issue:** Both Thulobazaar and Slashhour projects use port 3000

---

## 🔴 Port Conflict Detected

### Projects Using Port 3000:

1. **Thulobazaar Monorepo** (Next.js)
   - Location: `/Users/elw/Documents/Web/thulobazaar/monorepo`
   - Config: `apps/web/package.json` line 6
   - Command: `"dev": "next dev --turbo -p 3000"`
   - **Port: 3000** (explicitly configured)

2. **Slashhour API** (NestJS)
   - Location: `/Users/elw/Documents/Test/Slashhour/slashhour-api`
   - Config: `src/main.ts` line 72
   - Code: `const port = process.env.PORT || 3000;`
   - **Port: 3000** (default fallback)

---

## ⚡ Impact

**You cannot run both projects simultaneously** without changing one of the ports.

If you try to start both:
- ❌ The second project will fail with "EADDRINUSE: address already in use"
- ❌ Or it will silently fail to bind to the port
- ❌ You'll get port conflicts and unexpected behavior

---

## ✅ Solutions

### Option 1: Change Slashhour API Port (Recommended)

**Pros:** Keeps Thulobazaar on standard port 3000
**Cons:** Need to update API calls in Slashhour app

Create `.env` file in `/Users/elw/Documents/Test/Slashhour/slashhour-api/`:

```bash
PORT=3001
```

Then start Slashhour API:
```bash
cd /Users/elw/Documents/Test/Slashhour/slashhour-api
npm run start:dev
```

**Access:**
- Slashhour API: http://localhost:3001/api/v1
- Slashhour Swagger: http://localhost:3001/api/docs

**Note:** You'll need to update the API base URL in `slashhour-app` to point to port 3001.

---

### Option 2: Change Thulobazaar Monorepo Port

**Pros:** Keeps Slashhour on standard port
**Cons:** Less common for Next.js

Edit `/Users/elw/Documents/Web/thulobazaar/monorepo/apps/web/package.json`:

```json
{
  "scripts": {
    "dev": "next dev --turbo -p 3002"
  }
}
```

**Access:**
- Thulobazaar: http://localhost:3002

---

### Option 3: Use Environment Variable for Next.js

Create `.env.local` in `/Users/elw/Documents/Web/thulobazaar/monorepo/apps/web/`:

```bash
PORT=3002
```

Update `package.json`:
```json
{
  "scripts": {
    "dev": "next dev --turbo -p ${PORT:-3000}"
  }
}
```

---

## 📊 Current Port Usage

### Thulobazaar Project:
- **Port 3000**: Next.js monorepo frontend ⚠️ CONFLICT
- **Port 5000**: Express.js backend (no conflict)

### Slashhour Project:
- **Port 3000**: NestJS API ⚠️ CONFLICT
- **Port 19006**: Expo React Native app (web mode) - no conflict

---

## 🚀 Recommended Setup

### If Working on Thulobazaar:
```bash
# Terminal 1: Backend (Express)
cd /Users/elw/Documents/Web/thulobazaar/backend
npm run dev
# Running on: http://localhost:5000

# Terminal 2: Frontend (Next.js)
cd /Users/elw/Documents/Web/thulobazaar/monorepo
npm run dev --workspace=apps/web
# Running on: http://localhost:3000
```

### If Working on Slashhour:
```bash
# Option 1: Change Slashhour to port 3001
echo "PORT=3001" > /Users/elw/Documents/Test/Slashhour/slashhour-api/.env

# Terminal 1: API (NestJS)
cd /Users/elw/Documents/Test/Slashhour/slashhour-api
npm run start:dev
# Running on: http://localhost:3001

# Terminal 2: App (Expo)
cd /Users/elw/Documents/Test/Slashhour/slashhour-app
npm run web
# Running on: http://localhost:19006
```

### If Working on Both:
```bash
# Thulobazaar on 3000, Slashhour API on 3001

# Terminal 1: Thulobazaar Backend
cd /Users/elw/Documents/Web/thulobazaar/backend
npm run dev

# Terminal 2: Thulobazaar Frontend
cd /Users/elw/Documents/Web/thulobazaar/monorepo
npm run dev --workspace=apps/web

# Terminal 3: Slashhour API (with PORT=3001)
cd /Users/elw/Documents/Test/Slashhour/slashhour-api
PORT=3001 npm run start:dev

# Terminal 4: Slashhour App
cd /Users/elw/Documents/Test/Slashhour/slashhour-app
npm run web
```

**Access URLs:**
- Thulobazaar: http://localhost:3000
- Thulobazaar API: http://localhost:5000
- Slashhour API: http://localhost:3001
- Slashhour App: http://localhost:19006

---

## 📝 Quick Fix Summary

**Easiest solution:** Add `PORT=3001` to Slashhour API's `.env` file:

```bash
echo "PORT=3001" > /Users/elw/Documents/Test/Slashhour/slashhour-api/.env
```

Then update the API base URL in your Slashhour app to use port 3001.

---

## ⚙️ Alternative: Use Docker

If you frequently switch between projects, consider using Docker to isolate port configurations:

```yaml
# docker-compose.yml for Slashhour
services:
  api:
    ports:
      - "3001:3000"  # Map container 3000 to host 3001
```

This way, the container uses 3000 internally, but exposes 3001 on your host machine.

---

**Status:** ⚠️ Port conflict detected and documented
**Action Required:** Choose one of the solutions above before running both projects simultaneously
