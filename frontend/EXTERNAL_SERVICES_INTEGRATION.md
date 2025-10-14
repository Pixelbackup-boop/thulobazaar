# External Services Integration Guide

This document explains the integration of **Sentry Error Tracking** and **Google Analytics 4** in the Thulobazaar frontend application.

## Table of Contents

1. [Overview](#overview)
2. [Sentry Error Tracking](#sentry-error-tracking)
3. [Google Analytics 4](#google-analytics-4)
4. [Setup Instructions](#setup-instructions)
5. [Configuration](#configuration)
6. [Usage Examples](#usage-examples)
7. [Testing](#testing)
8. [Privacy Considerations](#privacy-considerations)

---

## Overview

The application now includes production-ready monitoring and analytics:

### ✅ Sentry Error Tracking
- **Purpose**: Real-time error monitoring and debugging
- **Features**: Stack traces, session replay, performance monitoring, breadcrumbs
- **Integration**: Automatic error capture from ErrorBoundary, logger, and unhandled exceptions

### ✅ Google Analytics 4
- **Purpose**: Web analytics and Core Web Vitals tracking
- **Features**: Page views, custom events, user interactions, performance metrics
- **Integration**: Automatic Web Vitals tracking (LCP, FID, CLS, FCP, TTFB)

Both integrations are **optional** and **privacy-first** by design.

---

## Sentry Error Tracking

### What is Sentry?

Sentry is an error tracking and performance monitoring platform that helps you:
- **Debug faster**: See full stack traces and user context for every error
- **Reproduce issues**: Session replay shows exactly what users did before errors
- **Monitor performance**: Track slow API calls and rendering issues
- **Prioritize fixes**: See which errors affect the most users

### Features Integrated

#### 1. Automatic Error Capture
- **React Error Boundary**: Catches component rendering errors
- **Logger Integration**: All `logger.error()` and `logger.warn()` calls sent to Sentry
- **Unhandled Exceptions**: Global error handler catches all unhandled errors
- **Promise Rejections**: Catches unhandled promise rejections

#### 2. Performance Monitoring
- **Browser Tracing**: Tracks page load and navigation performance
- **API Call Tracking**: Monitors fetch/XHR request duration
- **Custom Transactions**: Measure specific operations

#### 3. Session Replay
- **Visual Debugging**: See user sessions leading up to errors
- **Privacy-First**: All text is masked, all media is blocked
- **Smart Sampling**:
  - 10% of normal sessions recorded
  - 100% of sessions with errors recorded

#### 4. Context & Breadcrumbs
- **User Context**: Track user ID, email (automatically added)
- **Breadcrumbs**: Navigation, clicks, console logs
- **Tags**: Environment, release version, custom tags

### File Structure

```
src/
├── utils/
│   └── sentry.js           # Sentry initialization and utilities
├── main.jsx                # Sentry initialization on app start
├── components/common/
│   └── ErrorBoundary.jsx   # Integrated with Sentry
└── utils/
    └── logger.js           # Auto-sends errors/warnings to Sentry
```

### Integration Points

#### src/main.jsx
```javascript
import { initSentry } from './utils/sentry.js'

// Initialize error tracking
initSentry();
```

#### src/components/common/ErrorBoundary.jsx
```javascript
componentDidCatch(error, errorInfo) {
  // Automatically sends to Sentry
  const { captureException } = require('../../utils/sentry');
  captureException(error, {
    componentStack: errorInfo.componentStack
  });
}
```

#### src/utils/logger.js
```javascript
// All errors and warnings automatically sent to Sentry
logger.error('API call failed', error);
logger.warn('Slow performance detected');
```

---

## Google Analytics 4

### What is Google Analytics 4?

GA4 is Google's latest analytics platform that provides:
- **User Journey Tracking**: See how users navigate your site
- **Event-Based Model**: Flexible tracking of any user interaction
- **Core Web Vitals**: Automatic performance metrics
- **Privacy Controls**: GDPR-compliant with IP anonymization

### Features Integrated

#### 1. Automatic Core Web Vitals Tracking
The performance monitor automatically sends these metrics to GA:

| Metric | What It Measures | Good | Needs Improvement | Poor |
|--------|------------------|------|-------------------|------|
| **LCP** (Largest Contentful Paint) | Loading performance | ≤2.5s | ≤4.0s | >4.0s |
| **FID** (First Input Delay) | Interactivity | ≤100ms | ≤300ms | >300ms |
| **CLS** (Cumulative Layout Shift) | Visual stability | ≤0.1 | ≤0.25 | >0.25 |
| **FCP** (First Contentful Paint) | Perceived load speed | ≤1.8s | ≤3.0s | >3.0s |
| **TTFB** (Time to First Byte) | Server response | ≤800ms | ≤1.8s | >1.8s |

Each metric is sent with a **rating** (good/needs-improvement/poor) for easy analysis.

#### 2. Custom Event Tracking
Pre-configured events for common actions:

```javascript
import { trackAdView, trackSearch, trackAdPost } from './utils/analytics'

// Track ad view
trackAdView(adId, adTitle);

// Track search
trackSearch('laptop', 'Electronics', 'Kathmandu');

// Track ad posting
trackAdPost(true, 'Electronics');
```

#### 3. User Interaction Tracking
```javascript
import { trackUserInteraction } from './utils/analytics'

// Track button clicks, form submissions, etc.
trackUserInteraction('click', 'Button', 'Contact Seller', 1);
```

#### 4. Page View Tracking
```javascript
import { trackPageView } from './utils/analytics'

// Automatically track SPA navigation
trackPageView('/ad/laptop-for-sale-123');
```

### File Structure

```
src/
├── utils/
│   ├── analytics.js        # Google Analytics 4 integration
│   └── performance.js      # Auto-sends Web Vitals to GA
└── main.jsx                # GA initialization on app start
```

### Available Functions

| Function | Purpose | Example |
|----------|---------|---------|
| `trackPageView(path)` | Track page navigation | `trackPageView('/search')` |
| `trackEvent(name, params)` | Custom event | `trackEvent('purchase', { value: 100 })` |
| `trackAdView(adId, title)` | Ad view | `trackAdView(123, 'Laptop')` |
| `trackSearch(term, category, location)` | Search | `trackSearch('phone', 'Electronics', 'KTM')` |
| `trackAdPost(success, category, error)` | Ad posting | `trackAdPost(true, 'Electronics')` |
| `trackLogin(method)` | User login | `trackLogin('email')` |
| `trackSignup(method)` | User signup | `trackSignup('google')` |
| `trackUserInteraction(action, category, label, value)` | Interactions | `trackUserInteraction('click', 'Button', 'CTA', 1)` |
| `setUserProperties(userId, props)` | User context | `setUserProperties(123, { role: 'seller' })` |

---

## Setup Instructions

### 1. Create Sentry Account (Free Tier Available)

1. Go to [sentry.io](https://sentry.io)
2. Sign up for a free account
3. Create a new project:
   - Platform: **React**
   - Alert frequency: **On every new issue**
4. Copy your **DSN** (Data Source Name)
   - Format: `https://[key]@[org].ingest.sentry.io/[project]`

### 2. Create Google Analytics 4 Property

1. Go to [Google Analytics](https://analytics.google.com)
2. Create a new **GA4 Property**:
   - Property name: "Thulobazaar"
   - Timezone: Asia/Kathmandu
   - Currency: Nepali Rupee (NPR)
3. Create a **Web Data Stream**:
   - Website URL: https://thulobazaar.com.np
   - Stream name: "Thulobazaar Frontend"
4. Copy your **Measurement ID**:
   - Format: `G-XXXXXXXXXX`

### 3. Configure Environment Variables

Create or update `.env.local` in the frontend directory:

```bash
# Sentry Configuration
VITE_SENTRY_DSN=https://your-key@your-org.ingest.sentry.io/your-project-id
VITE_SENTRY_ENVIRONMENT=development
VITE_SENTRY_TRACES_SAMPLE_RATE=1.0
VITE_SENTRY_REPLAYS_SESSION_SAMPLE_RATE=0.1
VITE_SENTRY_REPLAYS_ON_ERROR_SAMPLE_RATE=1.0

# Google Analytics 4
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

### 4. Production Configuration

For production (`.env.production`):

```bash
# Sentry - Production Settings
VITE_SENTRY_DSN=https://your-production-key@your-org.ingest.sentry.io/your-project-id
VITE_SENTRY_ENVIRONMENT=production
VITE_SENTRY_TRACES_SAMPLE_RATE=0.2          # Sample 20% of transactions
VITE_SENTRY_REPLAYS_SESSION_SAMPLE_RATE=0.1  # Record 10% of sessions
VITE_SENTRY_REPLAYS_ON_ERROR_SAMPLE_RATE=1.0 # Record 100% of error sessions

# Google Analytics 4 - Production
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

### 5. Install & Verify

```bash
# Install dependencies (already done)
npm install

# Build to verify no errors
npm run build

# Run development server
npm run dev
```

---

## Configuration

### Environment Variables Reference

#### Sentry Configuration

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `VITE_SENTRY_DSN` | No* | `''` | Sentry Data Source Name. *Required to enable Sentry |
| `VITE_SENTRY_ENVIRONMENT` | No | `'development'` | Environment name (dev/staging/prod) |
| `VITE_SENTRY_TRACES_SAMPLE_RATE` | No | `1.0` | % of transactions to track (0.0-1.0) |
| `VITE_SENTRY_REPLAYS_SESSION_SAMPLE_RATE` | No | `0.1` | % of normal sessions to record (0.0-1.0) |
| `VITE_SENTRY_REPLAYS_ON_ERROR_SAMPLE_RATE` | No | `1.0` | % of error sessions to record (0.0-1.0) |

#### Google Analytics Configuration

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `VITE_GA_MEASUREMENT_ID` | No* | `''` | GA4 Measurement ID. *Required to enable GA |
| `VITE_ENABLE_ANALYTICS` | No | `true` | Master switch for analytics (true/false) |

### Disabling Services

To disable services in development:

```bash
# .env.local
VITE_SENTRY_DSN=                    # Leave empty to disable Sentry
VITE_ENABLE_ANALYTICS=false         # Disable Google Analytics
```

---

## Usage Examples

### Sentry Usage

#### Manual Error Reporting
```javascript
import { captureException, captureMessage } from './utils/sentry';

try {
  // Your code
  riskyOperation();
} catch (error) {
  captureException(error, {
    tags: { operation: 'payment' },
    extra: { userId: 123, amount: 1000 }
  });
}
```

#### Manual Messages
```javascript
import { captureMessage } from './utils/sentry';

captureMessage('Payment webhook received', 'info', {
  tags: { source: 'stripe' },
  extra: { webhookId: 'wh_123' }
});
```

#### Setting User Context
```javascript
import { setUser } from './utils/sentry';

// After user login
setUser({
  id: user.id,
  email: user.email,
  username: user.username
});

// After logout
setUser(null);
```

#### Adding Breadcrumbs
```javascript
import { addBreadcrumb } from './utils/sentry';

addBreadcrumb({
  category: 'payment',
  message: 'User initiated payment',
  level: 'info',
  data: { amount: 1000, method: 'khalti' }
});
```

### Google Analytics Usage

#### Track Custom Events
```javascript
import { trackEvent } from './utils/analytics';

// Simple event
trackEvent('button_click', { button_name: 'subscribe' });

// E-commerce event
trackEvent('purchase', {
  transaction_id: 'T12345',
  value: 5000,
  currency: 'NPR',
  items: [{ item_id: 'AD123', item_name: 'Laptop' }]
});
```

#### Track Ad Interactions
```javascript
import { trackAdView, trackUserInteraction } from './utils/analytics';

// When user views an ad
trackAdView(ad.id, ad.title);

// When user contacts seller
trackUserInteraction('click', 'Contact', 'Send Message', ad.id);
```

#### Track User Authentication
```javascript
import { trackLogin, trackSignup } from './utils/analytics';

// After successful login
trackLogin('email');  // or 'google', 'facebook'

// After successful signup
trackSignup('email');
```

#### Set User Properties (Non-PII Only)
```javascript
import { setUserProperties } from './utils/analytics';

setUserProperties(user.id, {
  user_role: 'seller',
  account_age_days: 30,
  verification_status: 'verified'
});
```

### Automatic Tracking

These happen automatically without any code:

✅ **Error Tracking**: All errors caught by ErrorBoundary or logger
✅ **Web Vitals**: LCP, FID, CLS, FCP, TTFB sent to Google Analytics
✅ **Performance**: Slow renders and API calls tracked in Sentry
✅ **Navigation**: Page views (if integrated with router)

---

## Testing

### 1. Test Sentry Integration

#### Test Error Boundary
Add a test button that throws an error:

```javascript
// In any component
<button onClick={() => { throw new Error('Test error for Sentry'); }}>
  Test Error Tracking
</button>
```

**Expected Result:**
- Error caught by ErrorBoundary
- Error appears in Sentry dashboard within seconds
- Session replay available (if enabled)

#### Test Logger Integration
```javascript
import logger from './utils/logger';

// This will automatically send to Sentry
logger.error('Test error from logger', new Error('Test'));
logger.warn('Test warning from logger');
```

**Expected Result:**
- Error and warning appear in Sentry Issues
- Full context (URL, user agent, timestamp) included

#### Check Sentry Dashboard
1. Go to [sentry.io](https://sentry.io)
2. Navigate to your project
3. Check **Issues** tab for captured errors
4. Check **Performance** tab for transactions
5. Check **Replays** tab for session recordings

### 2. Test Google Analytics Integration

#### Check Real-Time Reports
1. Go to [Google Analytics](https://analytics.google.com)
2. Navigate to **Reports** → **Realtime**
3. Visit your app in another tab
4. Should see:
   - Active users (you)
   - Page views
   - Events firing

#### Check Web Vitals
1. Navigate several pages in your app
2. Wait 3-5 minutes
3. In GA4: **Reports** → **Engagement** → **Events**
4. Look for events: `LCP`, `FID`, `CLS`, `FCP`, `TTFB`
5. Each should have `metric_rating` (good/needs-improvement/poor)

#### Test Custom Events
```javascript
import { trackEvent } from './utils/analytics';

// Fire a test event
trackEvent('test_event', {
  test_parameter: 'test_value',
  timestamp: new Date().toISOString()
});
```

**Check in GA4:**
- **Reports** → **Engagement** → **Events**
- Look for `test_event` in the list
- Click to see parameters

### 3. Development Console Testing

With `VITE_ENABLE_DEBUG_LOGS=true`:

```javascript
// Open browser console
console.log(window.performanceMonitor.getWebVitalsSummary());
console.log(window.logger.getHistory());

// Check if Sentry is initialized
console.log(window.Sentry);

// Check if GA is initialized
console.log(window.gtag);
console.log(window.dataLayer);
```

---

## Privacy Considerations

### Sentry Privacy

✅ **Session Replay Privacy**
- `maskAllText: true` - All text is masked with asterisks
- `blockAllMedia: true` - Images, videos, audio blocked
- Only UI interactions and layout visible

✅ **Error Filtering**
- Non-critical errors filtered (ResizeObserver, etc.)
- Browser extension errors ignored
- Stack traces cleaned of sensitive data

✅ **User Data**
- Only user ID, email, username stored
- No passwords, tokens, or sensitive fields
- Compliant with GDPR/CCPA

### Google Analytics Privacy

✅ **IP Anonymization**
- `anonymize_ip: true` - IP addresses anonymized
- Required for GDPR compliance

✅ **User Properties**
- Only non-PII data stored (role, status, counts)
- No personal identifiers (names, emails, phones)

✅ **Cookie Consent**
- **TODO**: Add cookie consent banner for EU users
- GA should only initialize after consent

---

## Troubleshooting

### Sentry Not Capturing Errors

**Check:**
1. Is `VITE_SENTRY_DSN` set in `.env.local`?
2. Is the DSN valid (copy from Sentry dashboard)?
3. Check browser console for Sentry initialization message
4. Check Sentry dashboard **Settings** → **Client Keys** → ensure DSN is active

**Debug:**
```javascript
// In browser console
console.log(window.Sentry);  // Should be an object
window.Sentry.captureMessage('Test message');  // Should appear in dashboard
```

### Google Analytics Not Tracking

**Check:**
1. Is `VITE_GA_MEASUREMENT_ID` set correctly (format: `G-XXXXXXXXXX`)?
2. Is `VITE_ENABLE_ANALYTICS=true`?
3. Check browser console for GA initialization message
4. Check Network tab for requests to `google-analytics.com`
5. Are you using an ad blocker? (Disable for testing)

**Debug:**
```javascript
// In browser console
console.log(window.gtag);      // Should be a function
console.log(window.dataLayer);  // Should be an array
window.gtag('event', 'test_event', { test: true });
```

### Web Vitals Not Appearing in GA

**Common Issues:**
- Web Vitals only fire after user interactions (LCP, FID)
- Some metrics need full page load (CLS)
- GA4 real-time reports may have 1-2 minute delay
- Check **Reports** → **Engagement** → **Events** for Web Vital events

### Build Errors

If build fails with Sentry/GA errors:

```bash
# Clear cache and rebuild
rm -rf node_modules/.vite
npm run build
```

---

## Performance Impact

### Sentry
- **Bundle Size**: ~50KB gzipped
- **Initialization**: <100ms
- **Runtime**: Negligible (<1ms per event)
- **Network**: Only on errors (minimal in production)

### Google Analytics
- **Bundle Size**: ~45KB gzipped (loaded async)
- **Initialization**: ~50ms
- **Runtime**: <1ms per event
- **Network**: Batched requests every 10 seconds

**Total Impact**: <100KB, <150ms initialization, negligible runtime impact

---

## Cost

### Sentry Pricing
- **Free Tier**: 5,000 errors/month, 50 replays/month
- **Team Tier**: $26/month - 50,000 errors/month, unlimited replays
- **Business**: Custom pricing

**Recommendation**: Start with free tier, upgrade if needed

### Google Analytics 4
- **Completely Free** - No limits on events or users
- Google's standard analytics product

---

## Next Steps

### Recommended Actions

1. **Set Up Services**
   - Create Sentry account → Get DSN
   - Create GA4 property → Get Measurement ID
   - Add to `.env.local`

2. **Test Locally**
   - Trigger test errors
   - Check Sentry dashboard
   - Check GA real-time reports

3. **Configure Production**
   - Add production DSN/Measurement ID
   - Lower Sentry sample rates (20% traces, 10% replays)
   - Verify privacy settings

4. **Monitor & Iterate**
   - Check Sentry Issues daily
   - Review GA reports weekly
   - Adjust sampling rates based on volume

### Future Enhancements

- [ ] Add cookie consent banner (GDPR compliance)
- [ ] Set up Sentry alerts (email/Slack on errors)
- [ ] Configure GA custom dimensions
- [ ] Add source maps to Sentry for better debugging
- [ ] Set up Sentry releases for deployment tracking

---

## Resources

### Documentation
- **Sentry React Docs**: https://docs.sentry.io/platforms/javascript/guides/react/
- **GA4 Developer Guide**: https://developers.google.com/analytics/devguides/collection/ga4
- **Web Vitals**: https://web.dev/vitals/

### Support
- **Sentry Support**: support@sentry.io
- **GA4 Community**: https://support.google.com/analytics/community

---

## Summary

✅ **Sentry**: Automatic error tracking with session replay
✅ **Google Analytics**: Web analytics with Core Web Vitals
✅ **Privacy-First**: IP anonymization, text masking, PII protection
✅ **Zero Config**: Works out of the box with `.env` variables
✅ **Production Ready**: Optimized sampling, minimal performance impact

**You're all set!** 🎉

Add your DSN and Measurement ID to `.env.local` and start monitoring your app.
