# 📋 COMPREHENSIVE TESTING PLAN
## Thulobazaar Frontend Application
**Date:** October 14, 2025
**Current Coverage:** 2.16%
**Target Coverage:** 80%+

---

## 📊 CURRENT COVERAGE ANALYSIS

### **Well-Tested Components (✅ Keep as Reference):**
- `PostAd.jsx`: **96.41%** coverage ✅
- `usePostAdValidation.js`: **97.26%** coverage ✅
- `formReducer.js`: **98.24%** coverage ✅
- `postAdConstants.js`: **100%** coverage ✅

### **Critical Files with 0% Coverage (🚨 URGENT):**
- `api.js`: **0%** (1,201 lines) - **MISSION CRITICAL**
- `AuthContext.jsx`: **6.09%** - **MISSION CRITICAL**
- `Home.jsx`: **0%** (368 lines)
- `AdDetail.jsx`: **0%** (1,110 lines)
- `SearchResults.jsx`: **0%** (1,043 lines)
- `Header.jsx`: **0%** (495 lines)
- All utility files: **0%**
- All other hooks: **0%**

---

## 🎯 TESTING STRATEGY

### **Phase 1: Critical Infrastructure (Week 1-2)**
**Goal:** Test the foundation that everything depends on
**Target:** api.js, AuthContext, core hooks

### **Phase 2: Core Features (Week 3-4)**
**Goal:** Test main user flows
**Target:** Home, AdDetail, SearchResults

### **Phase 3: User Actions (Week 5-6)**
**Goal:** Test CRUD operations
**Target:** EditAd, Profile, Dashboard

### **Phase 4: Utilities & Edge Cases (Week 7-8)**
**Goal:** Test helper functions and edge cases
**Target:** Utils, error handling, validation

---

## 📝 PHASE 1: CRITICAL INFRASTRUCTURE

### 1.1 ApiService Tests (Priority: URGENT 🔥)
**File:** `src/services/api.test.js` (NEW FILE)
**Methods to Test:** 50+ methods
**Estimated Time:** 3-4 days

#### **Test Categories:**

##### A. HTTP Methods (get, post, put, delete)
```javascript
describe('ApiService - HTTP Methods', () => {
  describe('get()', () => {
    it('should fetch data successfully')
    it('should handle 404 errors')
    it('should handle network errors')
    it('should parse JSON response')
    it('should throw on !success response')
    it('should handle structured errors')
  });
});
```

##### B. Authentication Methods
```javascript
describe('ApiService - Authentication', () => {
  describe('login()', () => {
    it('should login with valid credentials')
    it('should return token on success')
    it('should throw error on invalid credentials')
    it('should handle network timeout')
  });

  describe('register()', () => {
    it('should register new user')
    it('should return user data and token')
    it('should validate email format')
    it('should handle duplicate email error')
  });

  describe('getProfile()', () => {
    it('should fetch user profile with valid token')
    it('should throw error without token')
    it('should handle expired token')
  });

  describe('updateProfile()', () => {
    it('should update user profile')
    it('should validate required fields')
  });

  describe('uploadAvatar()', () => {
    it('should upload image file')
    it('should validate file type')
    it('should handle large files')
  });
});
```

##### C. Ad CRUD Operations
```javascript
describe('ApiService - Ads', () => {
  describe('getAds()', () => {
    it('should fetch all ads')
    it('should filter by search term')
    it('should filter by category')
    it('should filter by location')
    it('should filter by price range')
    it('should sort results')
    it('should handle pagination')
  });

  describe('getAd()', () => {
    it('should fetch single ad by ID')
    it('should throw on invalid ID')
  });

  describe('createAd()', () => {
    it('should create ad with valid data')
    it('should upload images')
    it('should handle custom fields')
    it('should throw without auth token')
  });

  describe('updateAd()', () => {
    it('should update ad')
    it('should validate ownership')
  });

  describe('deleteAd()', () => {
    it('should delete ad')
    it('should verify ownership')
  });

  describe('getUserAds()', () => {
    it('should fetch current user ads')
    it('should include pagination')
  });
});
```

##### D. Categories & Locations
```javascript
describe('ApiService - Categories & Locations', () => {
  describe('getCategories()', () => {
    it('should fetch categories')
    it('should include subcategories when requested')
  });

  describe('getLocationHierarchy()', () => {
    it('should fetch all locations in one call')
    it('should return hierarchical structure')
  });

  describe('searchLocations()', () => {
    it('should search with query string')
    it('should limit results')
    it('should return empty on short query')
  });
});
```

##### E. Admin Operations
```javascript
describe('ApiService - Admin', () => {
  describe('getAdminStats()', () => {
    it('should fetch stats with editor token')
    it('should throw without token')
  });

  describe('updateAdStatus()', () => {
    it('should approve ad')
    it('should reject ad with reason')
  });

  // ... more admin tests
});
```

##### F. Error Handling
```javascript
describe('ApiService - Error Handling', () => {
  it('should handle network errors gracefully')
  it('should handle timeout errors')
  it('should parse structured errors correctly')
  it('should include error details (type, title, suggestion)')
  it('should log errors in development')
  it('should NOT log in production')
});
```

**Mock Setup:**
```javascript
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import ApiService from '../services/api';

// Mock fetch globally
global.fetch = vi.fn();

beforeEach(() => {
  fetch.mockClear();
  localStorage.clear();
});

// Example test
it('should fetch categories successfully', async () => {
  const mockCategories = [
    { id: 1, name: 'Electronics', icon: '📱' },
    { id: 2, name: 'Vehicles', icon: '🚗' }
  ];

  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => ({
      success: true,
      data: mockCategories
    })
  });

  const result = await ApiService.getCategories();

  expect(result).toEqual(mockCategories);
  expect(fetch).toHaveBeenCalledWith('http://localhost:5000/api/categories');
});
```

---

### 1.2 AuthContext Tests (Priority: URGENT 🔥)
**File:** `src/context/AuthContext.test.jsx` (NEW FILE)
**Estimated Time:** 1 day

#### **Test Categories:**

```javascript
describe('AuthContext', () => {
  describe('AuthProvider', () => {
    it('should provide auth context to children')
    it('should initialize with loading=true')
    it('should check for existing token on mount')
    it('should verify token with API on mount')
    it('should clear invalid tokens')
  });

  describe('login()', () => {
    it('should login successfully')
    it('should store token in localStorage')
    it('should fetch and store user profile')
    it('should update user state')
    it('should handle login errors')
  });

  describe('register()', () => {
    it('should register new user')
    it('should store token and profile')
    it('should update user state')
  });

  describe('logout()', () => {
    it('should clear localStorage')
    it('should clear user state')
    it('should clear editor tokens')
  });

  describe('useAuth hook', () => {
    it('should throw when used outside AuthProvider')
    it('should return auth state')
    it('should return isAuthenticated = true when user exists')
    it('should return isAdmin = true for super_admin role')
  });
});
```

---

### 1.3 Core Hooks Tests (Priority: HIGH 🔥)
**Files:** Various `*.test.js` files in `src/hooks/`
**Estimated Time:** 2 days

#### **useApi.js**
```javascript
describe('useApi', () => {
  it('should fetch data immediately when immediate=true')
  it('should not fetch when immediate=false')
  it('should set loading state')
  it('should handle successful response')
  it('should handle error response')
  it('should expose refetch function')
  it('should cancel request on unmount')
});
```

#### **useDebounce.js**
```javascript
describe('useDebounce', () => {
  it('should debounce value changes')
  it('should wait for delay before updating')
  it('should reset timer on new changes')
  it('should return immediate value on first render')
});
```

#### **useFormTemplate.js**
```javascript
describe('useFormTemplate', () => {
  it('should return electronics template for category 1')
  it('should return vehicles template for category 3')
  it('should return null for unknown category')
  it('should include validation function')
  it('should include field definitions')
  it('should include getInitialValues function')
});
```

#### **useLocalStorage.js**
```javascript
describe('useLocalStorage', () => {
  it('should read from localStorage on mount')
  it('should write to localStorage on change')
  it('should handle JSON serialization')
  it('should handle parse errors gracefully')
  it('should sync across tabs')
});
```

---

## 📝 PHASE 2: CORE FEATURES

### 2.1 Home Component Tests (Priority: HIGH 🔥)
**File:** `src/components/Home.test.jsx` (NEW FILE)
**Estimated Time:** 1 day

```javascript
describe('Home', () => {
  it('should render header and search bar')
  it('should fetch and display categories')
  it('should fetch and display featured ads')
  it('should handle loading state')
  it('should handle error state')
  it('should navigate to search on form submit')
  it('should navigate to PostAd when authenticated')
  it('should show auth modal when not authenticated')
  it('should handle category click')
  it('should search on Enter key')
});
```

---

### 2.2 AdDetail Component Tests (Priority: HIGH 🔥)
**File:** `src/components/AdDetail.test.jsx` (NEW FILE)
**Estimated Time:** 2 days

```javascript
describe('AdDetail', () => {
  it('should fetch and display ad details')
  it('should extract ad ID from SEO slug')
  it('should display image gallery')
  it('should display seller card')
  it('should reveal phone number on click')
  it('should open contact modal when authenticated')
  it('should show auth modal when not authenticated')
  it('should submit contact form')
  it('should handle report ad')
  it('should display related ads')
  it('should navigate to related ad on click')
  it('should show promote button for ad owner')
  it('should hide promote button for non-owners')
  it('should handle share functionality')
  it('should copy link to clipboard')
  it('should add ad to recently viewed')
  it('should handle loading state')
  it('should handle error state')
  it('should handle missing ad')
});
```

---

### 2.3 SearchResults Component Tests (Priority: MEDIUM)
**File:** `src/components/SearchResults.test.jsx` (NEW FILE)
**Estimated Time:** 1.5 days

```javascript
describe('SearchResults', () => {
  it('should fetch ads with search params')
  it('should display search results')
  it('should handle empty results')
  it('should apply filters')
  it('should handle sort options')
  it('should handle pagination')
  it('should update URL on filter change')
  it('should clear filters')
});
```

---

### 2.4 Header Component Tests (Priority: MEDIUM)
**File:** `src/components/Header.test.jsx` (NEW FILE)
**Estimated Time:** 1 day

```javascript
describe('Header', () => {
  it('should render logo and navigation')
  it('should show login button when not authenticated')
  it('should show user menu when authenticated')
  it('should open auth modal on login click')
  it('should handle logout')
  it('should navigate to post ad')
  it('should display user name')
  it('should handle mobile menu')
});
```

---

## 📝 PHASE 3: USER ACTIONS

### 3.1 EditAd Component Tests (Priority: MEDIUM)
**File:** `src/components/EditAd.test.jsx` (NEW FILE)
**Estimated Time:** 1.5 days

```javascript
describe('EditAd', () => {
  it('should fetch and pre-fill ad data')
  it('should update ad on submit')
  it('should validate form fields')
  it('should handle image upload')
  it('should handle image removal')
  it('should handle category change')
  it('should handle location change')
  it('should verify ownership')
  it('should redirect if not owner')
});
```

---

### 3.2 Profile Component Tests (Priority: MEDIUM)
**File:** `src/components/Profile.test.jsx` (NEW FILE)
**Estimated Time:** 1 day

```javascript
describe('Profile', () => {
  it('should display user profile')
  it('should display user stats')
  it('should fetch user ads')
  it('should edit profile')
  it('should upload avatar')
  it('should upload cover photo')
  it('should handle verification')
});
```

---

### 3.3 Dashboard Component Tests (Priority: MEDIUM)
**File:** `src/components/Dashboard.test.jsx` (NEW FILE)
**Estimated Time:** 1 day

```javascript
describe('Dashboard', () => {
  it('should display user stats')
  it('should display user ads')
  it('should filter ads by status')
  it('should edit ad')
  it('should delete ad')
  it('should promote ad')
  it('should view messages')
});
```

---

## 📝 PHASE 4: UTILITIES & EDGE CASES

### 4.1 Utility Functions Tests
**Files:** Various `*.test.js` files in `src/utils/`
**Estimated Time:** 2 days

#### **urlUtils.js**
```javascript
describe('urlUtils', () => {
  it('should generate SEO-friendly URLs')
  it('should extract ad ID from URL')
  it('should generate browse URLs')
  it('should generate slug from text')
});
```

#### **seoUtils.js**
```javascript
describe('seoUtils', () => {
  it('should generate Bikroy-style URLs')
  it('should get category slug')
  it('should format location for SEO')
});
```

#### **dateUtils.js**
```javascript
describe('dateUtils', () => {
  it('should format relative dates')
  it('should format timestamps')
  it('should handle invalid dates')
});
```

#### **formValidation.js**
```javascript
describe('formValidation', () => {
  it('should validate email')
  it('should validate phone number')
  it('should validate price')
  it('should validate text length')
});
```

---

## 🛠️ TESTING UTILITIES & HELPERS

### **Create Test Utilities File**
**File:** `src/test/testUtils.jsx`

```javascript
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { LanguageProvider } from '../context/LanguageContext';

// Wrapper with all providers
export function renderWithProviders(ui, options = {}) {
  const {
    authValue = null,
    languageValue = 'en',
    ...renderOptions
  } = options;

  function Wrapper({ children }) {
    return (
      <BrowserRouter>
        <AuthProvider value={authValue}>
          <LanguageProvider value={{ language: languageValue }}>
            {children}
          </LanguageProvider>
        </AuthProvider>
      </BrowserRouter>
    );
  }

  return render(ui, { wrapper: Wrapper, ...renderOptions });
}

// Mock API responses
export const mockApiResponses = {
  categories: [
    { id: 1, name: 'Electronics', icon: '📱' },
    { id: 2, name: 'Vehicles', icon: '🚗' }
  ],
  ads: [
    {
      id: 1,
      title: 'Test Ad',
      price: 1000,
      location_name: 'Kathmandu'
    }
  ]
};

// Mock user
export const mockUser = {
  id: 1,
  name: 'Test User',
  email: 'test@test.com',
  phone: '9800000000'
};
```

---

## 📊 COVERAGE TARGETS BY PHASE

### Phase 1: Critical Infrastructure
- **Before:** 2.16%
- **After Phase 1:** ~25%
- **Files:** api.js, AuthContext, hooks

### Phase 2: Core Features
- **After Phase 2:** ~45%
- **Files:** Home, AdDetail, SearchResults, Header

### Phase 3: User Actions
- **After Phase 3:** ~65%
- **Files:** EditAd, Profile, Dashboard

### Phase 4: Utilities
- **After Phase 4:** ~80%+
- **Files:** All utils, edge cases

---

## 🔄 CONTINUOUS TESTING WORKFLOW

### **Pre-Commit Hooks**
```bash
# package.json
{
  "husky": {
    "pre-commit": "npm run test:related"
  }
}
```

### **CI/CD Integration**
```yaml
# .github/workflows/test.yml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - run: npm install
      - run: npm run test:coverage
      - run: npm run test:coverage -- --threshold=80
```

---

## 📈 METRICS TO TRACK

1. **Overall Coverage:** Target 80%+
2. **Critical Files:** Target 90%+ for api.js, AuthContext
3. **Test Execution Time:** Keep under 30 seconds
4. **Test Reliability:** 0 flaky tests
5. **New Code Coverage:** 100% for new features

---

## 🎯 SUCCESS CRITERIA

### **Phase 1 Complete:**
- ✅ api.js coverage > 90%
- ✅ AuthContext coverage > 90%
- ✅ All hooks covered > 80%
- ✅ 0 test failures

### **Phase 2 Complete:**
- ✅ Home, AdDetail, SearchResults > 80%
- ✅ Overall coverage > 45%

### **Phase 3 Complete:**
- ✅ EditAd, Profile, Dashboard > 75%
- ✅ Overall coverage > 65%

### **Phase 4 Complete:**
- ✅ All utils covered > 85%
- ✅ Overall coverage > 80%
- ✅ Documentation updated

---

## 📝 NEXT STEPS

1. **Start with api.test.js** (Most Critical)
2. **Write AuthContext tests** (Second Most Critical)
3. **Add tests for each new feature** (Going Forward)
4. **Set up pre-commit hooks** (Prevent regression)
5. **Monitor coverage in CI/CD** (Continuous Improvement)

---

**Last Updated:** October 14, 2025
**Next Review:** October 21, 2025
