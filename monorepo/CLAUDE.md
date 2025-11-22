# ThuluBazaar - Essential Reference

## 🎯 Quick Info
**Stack:** Next.js 15 + Express + PostgreSQL + Prisma
**Ports:** 3333 (web), 5000 (api)
**DB:** thulobazaar @ localhost:5432 (user: elw, pass: postgres)

## 📁 Paths
```
/Users/elw/Documents/Web/thulobazaar/
├── monorepo/           # Next.js (port 3333)
│   ├── apps/web/
│   └── packages/       # types, api-client, database
└── backend/            # Express (port 5000)
```

## 🚀 Commands

### Start
```bash
# Frontend
cd /Users/elw/Documents/Web/thulobazaar/monorepo && npm run dev:web

# Backend
cd /Users/elw/Documents/Web/thulobazaar/backend && npm run dev
```

### Cache Issues (Code not updating?)
```bash
cd /Users/elw/Documents/Web/thulobazaar/monorepo
rm -rf .turbo packages/*/dist packages/*/.turbo apps/web/.next
cd packages/types && npm run build
cd ../api-client && npm run build
```

### Database
```bash
# Connect
PGPASSWORD=postgres psql -U elw -d thulobazaar

# Prisma
npx prisma generate
```

### Fix Ports
```bash
lsof -ti:3333 | xargs kill -9  # Frontend
lsof -ti:5000 | xargs kill -9  # Backend
```

## ⚠️ Critical Rules

### 1. ALWAYS Transform DB ↔ API
```typescript
// ❌ WRONG
res.json(dbUser);  // snake_case fields!

// ✅ CORRECT
import { transformDbUserToApi } from '@thulobazaar/types';
res.json(transformDbUserToApi(dbUser));
```

### 2. Prisma Gotchas
```typescript
// ❌ NEVER mix include + select
prisma.users.findMany({
  include: { ads: true },
  select: { id: true }  // ERROR!
})

// ❌ NEVER orderBy in nested select

// ❌ Categories children relation
include: { categories: true }  // WRONG! This is parent

// ✅ CORRECT
include: { other_categories: true }  // Children
```

### 3. Safe Property Access
```typescript
// ❌ WRONG
const id = req.user.sub;

// ✅ CORRECT
console.log('🔍', req.user);  // Check first!
const id = req.user?.id || null;
```

### 4. Type Safety
```typescript
// ❌ WRONG
let arr = [];  // Inferred as never[]

// ✅ CORRECT
let arr: string[] = [];

// ✅ Type DB queries
const result = await pool.query<DbUser>('SELECT...');
```

## 🗄️ Database

**Tables:** users, ads, categories, locations
**Key:** Business verified = `business_verification_status IN ('approved', 'verified')`
**Relations:** Categories use `other_categories` for children
**Shop URLs:** Custom in `custom_shop_slug`, fallback to `businessName-userId`

## 🔑 Auth

- **Users:** `/api/auth/login` → localStorage `token`
- **Editors/Admins:** `/api/editor/auth/login` → `editorToken`
- **Contexts:** `UserAuthContext`, `StaffAuthContext`

## 🐛 Common Issues

| Issue | Fix |
|-------|-----|
| Code not updating | Clear cache (see above) |
| Prisma errors | `npx prisma generate` |
| Port in use | `lsof -ti:PORT \| xargs kill -9` |
| 404 on new route | Restart backend |
| Shop URL not working | Check `custom_shop_slug` first |

## 🎨 Key Files

- Auth: `apps/web/src/lib/auth.ts`
- API: `packages/api-client/src/index.ts`
- Types: `packages/types/src/index.ts`
- Schema: `packages/database/prisma/schema.prisma`

## 🎯 Workflow

1. Add types to `packages/types` if needed
2. Create backend endpoint
3. Add API client method
4. **Build packages:** `npm run build` in each
5. Create frontend component
6. **Clear cache** if changes don't apply

## 📝 Latest Features

✅ Custom shop URLs (editable, availability check)
✅ Business/individual verification
✅ Ad promotion system
✅ Editor dashboard
✅ Dynamic ad forms

## 🚫 Never Do

- Pass DB data directly to frontend without transforming
- Mix `include` + `select` in Prisma
- Access nested properties without `?.`
- Skip cache clear when code doesn't update
- Use `any` without reason
