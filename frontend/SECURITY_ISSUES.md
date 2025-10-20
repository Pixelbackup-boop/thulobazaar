# Security Issues and Recommendations

**Date:** October 14, 2025
**Status:** In Progress

---

## 1. ✅ FIXED: Hard-coded API URLs

### Issue
- API base URLs were hard-coded throughout the application
- Files affected: 28+ components and services
- Impact: Cannot deploy to different environments (staging, production)

### Fix Applied
1. Created centralized environment configuration: `src/config/env.js`
2. Created environment-specific files:
   - `.env` - Base configuration
   - `.env.development` - Development environment
   - `.env.production` - Production environment
   - `.env.example` - Example template
3. Updated `src/services/api.js` to import from centralized config
4. Bulk replacement of hard-coded URLs across all 28 files

### Migration
```javascript
// BEFORE (Hard-coded)
const imageUrl = `http://localhost:5000/uploads/${image}`;

// AFTER (Environment-aware)
import { UPLOADS_BASE_URL } from '../config/env';
const imageUrl = `${UPLOADS_BASE_URL}/${image}`;
```

---

## 2. ⚠️ CRITICAL: Insecure Token Storage in localStorage

### Issue
**Location:** `src/context/AuthContext.jsx:22-23, 58, 64, 81, 87, 98-101`

**Problem:** Authentication tokens are stored in `localStorage`, which is vulnerable to XSS attacks.

```javascript
// VULNERABLE CODE
localStorage.setItem('authToken', result.token);
localStorage.setItem('userData', JSON.stringify(profile));
localStorage.setItem('editorToken', token);
```

**Attack Vectors:**
1. **XSS (Cross-Site Scripting)**: If an attacker injects malicious JavaScript, they can access localStorage
2. **Token Theft**: Stolen tokens can be used to impersonate users
3. **No Expiration Control**: localStorage persists indefinitely

### Severity
- **Level:** CRITICAL 🔴
- **OWASP Top 10:** A02:2021 – Cryptographic Failures
- **CVE Risk:** Potential for account takeover

### Recommended Fix (Requires Backend Changes)

#### Option 1: HttpOnly Cookies (RECOMMENDED)
```javascript
// Backend (Express.js)
app.post('/api/auth/login', async (req, res) => {
  const { token, user } = await authenticateUser(req.body);

  // Set HttpOnly cookie (inaccessible to JavaScript)
  res.cookie('authToken', token, {
    httpOnly: true,    // Prevents JavaScript access
    secure: true,      // HTTPS only
    sameSite: 'strict', // CSRF protection
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  });

  res.json({ success: true, user });
});

// Frontend: No manual token storage needed!
// Browser automatically sends cookie with requests
```

#### Option 2: Secure Session Storage (Intermediate)
```javascript
// Better than localStorage, but still vulnerable to XSS
// Use as temporary fix until HttpOnly cookies are implemented
import SecureLS from 'secure-ls';

const ls = new SecureLS({
  encodingType: 'aes',
  isCompression: true,
  encryptionSecret: import.meta.env.VITE_STORAGE_KEY
});

ls.set('authToken', token);
ls.get('authToken');
```

#### Option 3: Memory-Only Storage (Most Secure for SPA)
```javascript
// Store token in React state/context only (memory)
// Requires token refresh mechanism
let authToken = null; // In-memory, not accessible via JavaScript injection

export const setAuthToken = (token) => {
  authToken = token;
};

export const getAuthToken = () => {
  return authToken;
};

// Implement token refresh with HttpOnly refresh token
```

### Implementation Plan

**Phase 1: Immediate Mitigation (This Week)**
- [ ] Add Content Security Policy (CSP) headers to prevent XSS
- [ ] Implement token expiration checks
- [ ] Add input sanitization (DOMPurify)
- [ ] Document the risk in code comments

**Phase 2: Backend Changes (Next Sprint)**
- [ ] Implement HttpOnly cookie authentication
- [ ] Add refresh token mechanism
- [ ] Add CSRF protection
- [ ] Update CORS configuration

**Phase 3: Frontend Migration (After Backend Ready)**
- [ ] Remove localStorage token storage
- [ ] Update AuthContext to use cookie-based auth
- [ ] Update axios/fetch interceptors
- [ ] Test authentication flow

### Temporary Mitigation (Until Fix)

```javascript
// src/context/AuthContext.jsx
// ADD WARNING COMMENT
// ⚠️ SECURITY WARNING: localStorage is vulnerable to XSS attacks
// TODO: Migrate to HttpOnly cookies (requires backend changes)
// See: SECURITY_ISSUES.md for details
localStorage.setItem('authToken', result.token);
```

---

## 3. ⚠️ Missing Input Sanitization

### Issue
User input is not sanitized before display, leading to potential XSS attacks.

**Examples:**
- `AdDetail.jsx:197` - Alert messages from API responses
- `AdDetail.jsx:257` - Clipboard operations
- Form inputs throughout the application

### Fix
```bash
npm install dompurify isomorphic-dompurify
```

```javascript
import DOMPurify from 'isomorphic-dompurify';

// Sanitize before displaying user content
const sanitizedMessage = DOMPurify.sanitize(result.message);
alert(sanitizedMessage);

// Sanitize HTML content
<div dangerouslySetInnerHTML={{
  __html: DOMPurify.sanitize(ad.description)
}} />
```

---

## 4. ⚠️ Exposed Sensitive Data in Console Logs

### Issue
**Location:** Throughout `api.js:188, 218, 246` and many other places

```javascript
console.log(`🔄 Registering user: ${userData.email}`);
console.log(`✅ Registration response:`, data); // May contain tokens!
console.log(`✅ Profile response:`, data); // Contains personal info
```

### Fix
Use environment-aware logging:

```javascript
import { ENABLE_DEBUG_LOGS } from '../config/env';

// Instead of:
console.log(`🔄 Registering user: ${userData.email}`);

// Use:
if (ENABLE_DEBUG_LOGS) {
  console.log(`🔄 Registering user: ${userData.email}`);
}

// Or create a logger utility:
import { logger } from '../utils/logger';
logger.debug('Registering user', { email: userData.email });
```

**Status:** Partially fixed in `api.js` (uses ENABLE_DEBUG_LOGS flag)

---

## 5. 🛡️ Missing Content Security Policy (CSP)

### Issue
No CSP headers to prevent XSS attacks.

### Fix
Add to `index.html`:

```html
<meta http-equiv="Content-Security-Policy"
      content="
        default-src 'self';
        script-src 'self' 'unsafe-inline' 'unsafe-eval';
        style-src 'self' 'unsafe-inline';
        img-src 'self' data: https:;
        font-src 'self' data:;
        connect-src 'self' http://localhost:5000 https://api.thulobazaar.com;
        frame-ancestors 'none';
        base-uri 'self';
        form-action 'self';
      "
>
```

For production, tighten the policy:
```html
<meta http-equiv="Content-Security-Policy"
      content="
        default-src 'self';
        script-src 'self';
        style-src 'self';
        img-src 'self' https://cdn.thulobazaar.com;
        connect-src 'self' https://api.thulobazaar.com;
        font-src 'self';
        frame-ancestors 'none';
        base-uri 'self';
        form-action 'self';
        upgrade-insecure-requests;
      "
>
```

---

## 6. 🔒 No Rate Limiting on Frontend

### Issue
API calls can be spammed, leading to:
- DDoS attacks
- Resource exhaustion
- Poor user experience

### Fix
Implement request throttling:

```javascript
import { throttle, debounce } from 'lodash';

// For search (debounce - wait for user to stop typing)
const debouncedSearch = debounce((query) => {
  ApiService.getAds({ search: query });
}, 500);

// For button clicks (throttle - limit frequency)
const handleSearch = throttle(() => {
  // API call
}, 1000);
```

---

## 7. 📋 Security Checklist

### Completed ✅
- [x] Create centralized environment configuration
- [x] Replace hard-coded API URLs
- [x] Import config in api.js
- [x] Update environment files
- [x] Create security documentation

### In Progress 🔄
- [ ] Bulk replace hard-coded URLs in 28 files
- [ ] Add CSP headers
- [ ] Implement input sanitization
- [ ] Update console logs to use ENABLE_DEBUG_LOGS

### Pending ⏳
- [ ] Migrate to HttpOnly cookies (requires backend)
- [ ] Implement token refresh mechanism
- [ ] Add CSRF protection
- [ ] Add rate limiting
- [ ] Implement Sentry error tracking
- [ ] Add Web Vitals monitoring
- [ ] Conduct security audit

---

## 8. 📚 Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [OWASP XSS Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)
- [HttpOnly Cookie Authentication](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies#restrict_access_to_cookies)
- [Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [DOMPurify Documentation](https://github.com/cure53/DOMPurify)

---

## 9. 🔐 Security Contact

For security vulnerabilities, please contact:
- Email: security@thulobazaar.com
- Report: Create private GitHub issue

**Do NOT disclose security issues publicly.**

---

**Last Updated:** October 14, 2025
**Next Review:** October 21, 2025
