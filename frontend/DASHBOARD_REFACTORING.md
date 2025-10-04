# Dashboard.jsx Refactoring Guide

## ✅ Components Created

All sub-components have been created in `src/components/dashboard/`:

1. **DashboardStats.jsx** (90 lines) - Statistics cards with counts
2. **DashboardAdCard.jsx** (200 lines) - Individual ad card with actions
3. **DashboardFilters.jsx** (70 lines) - Filter buttons (All, Active, Pending, Rejected)

**Total for sub-components:** ~360 lines

## 📊 Before & After

**Before:**
- 1 file: Dashboard.jsx (898 lines)
- All logic in one place
- Hard to maintain

**After:**
- Main file: Dashboard.jsx (~450 lines) - State management & orchestration
- 3 sub-components: (~360 lines) - Reusable UI components
- **Total:** ~810 lines (10% reduction + better organization)
- Much more maintainable and testable

---

## 🔧 How to Integrate

### Step 1: Import Components

At the top of `Dashboard.jsx`, add:

```jsx
import { styles, colors, spacing, typography } from '../styles/theme';
import DashboardStats from './dashboard/DashboardStats';
import DashboardAdCard from './dashboard/DashboardAdCard';
import DashboardFilters from './dashboard/DashboardFilters';
```

### Step 2: Replace Stats Section

**Find this section** (around line 100-200):
```jsx
{/* Stats Cards */}
<div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
  <div style={{ /* card styles */ }}>
    {/* Total ads stat */}
  </div>
  {/* ... more stat cards ... */}
</div>
```

**Replace with:**
```jsx
<DashboardStats stats={{
  total: ads.length,
  active: ads.filter(ad => ad.status === 'approved').length,
  pending: ads.filter(ad => ad.status === 'pending').length,
  rejected: ads.filter(ad => ad.status === 'rejected').length,
  totalViews: ads.reduce((sum, ad) => sum + (ad.view_count || 0), 0)
}} />
```

### Step 3: Add Filter Buttons

**Find the filter/tab section** (around line 250-300):
```jsx
{/* Filter Buttons */}
<div style={{ display: 'flex', gap: '10px' }}>
  <button onClick={() => setFilter('all')}>All</button>
  <button onClick={() => setFilter('active')}>Active</button>
  {/* ... more buttons ... */}
</div>
```

**Replace with:**
```jsx
<DashboardFilters
  currentFilter={currentFilter}
  onFilterChange={setCurrentFilter}
/>
```

### Step 4: Replace Ad Cards Loop

**Find the ads list section** (around line 400-700):
```jsx
{filteredAds.map(ad => (
  <div key={ad.id} style={{ /* card styles */ }}>
    <img src={...} />
    <h3>{ad.title}</h3>
    {/* ... lots of inline code ... */}
    <button onClick={() => handleEdit(ad.id)}>Edit</button>
    <button onClick={() => handleDelete(ad.id)}>Delete</button>
  </div>
))}
```

**Replace with:**
```jsx
{filteredAds.map(ad => (
  <DashboardAdCard
    key={ad.id}
    ad={ad}
    onEdit={handleEdit}
    onDelete={handleDelete}
  />
))}
```

---

## 📝 Complete Example - Refactored Dashboard.jsx Structure

```jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import ApiService from '../services/api';
import Header from './Header';
import { styles, colors, spacing } from '../styles/theme';

// Import new components
import DashboardStats from './dashboard/DashboardStats';
import DashboardAdCard from './dashboard/DashboardAdCard';
import DashboardFilters from './dashboard/DashboardFilters';

function Dashboard() {
  const { user, isAuthenticated } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();

  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentFilter, setCurrentFilter] = useState('all');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate(`/${language}`);
      return;
    }
    fetchMyAds();
  }, [isAuthenticated]);

  const fetchMyAds = async () => {
    try {
      setLoading(true);
      const data = await ApiService.getMyAds();
      setAds(data);
    } catch (error) {
      console.error('Error fetching ads:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (adId) => {
    navigate(`/${language}/edit-ad/${adId}`);
  };

  const handleDelete = async (adId) => {
    if (!confirm('Are you sure you want to delete this ad?')) return;

    try {
      await ApiService.deleteAd(adId);
      setAds(ads.filter(ad => ad.id !== adId));
      alert('Ad deleted successfully');
    } catch (error) {
      console.error('Error deleting ad:', error);
      alert('Failed to delete ad');
    }
  };

  // Filter ads based on current filter
  const filteredAds = ads.filter(ad => {
    if (currentFilter === 'all') return true;
    if (currentFilter === 'active') return ad.status === 'approved';
    if (currentFilter === 'pending') return ad.status === 'pending';
    if (currentFilter === 'rejected') return ad.status === 'rejected';
    return true;
  });

  if (loading) {
    return <div style={{ textAlign: 'center', padding: spacing['3xl'] }}>Loading...</div>;
  }

  return (
    <div>
      <Header />

      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: spacing['3xl']
      }}>
        {/* Page Header */}
        <div style={{ marginBottom: spacing['2xl'] }}>
          <h1 style={styles.heading.h1}>My Dashboard</h1>
          <p style={{ color: colors.text.secondary }}>
            Manage your ads and track performance
          </p>
        </div>

        {/* Statistics */}
        <DashboardStats stats={{
          total: ads.length,
          active: ads.filter(ad => ad.status === 'approved').length,
          pending: ads.filter(ad => ad.status === 'pending').length,
          rejected: ads.filter(ad => ad.status === 'rejected').length,
          totalViews: ads.reduce((sum, ad) => sum + (ad.view_count || 0), 0)
        }} />

        {/* Quick Actions */}
        <div style={{ marginBottom: spacing.xl }}>
          <button
            onClick={() => navigate(`/${language}/post-ad`)}
            style={styles.button.primary}
          >
            ➕ Post New Ad
          </button>
        </div>

        {/* Filters */}
        <DashboardFilters
          currentFilter={currentFilter}
          onFilterChange={setCurrentFilter}
        />

        {/* Ads List */}
        <div>
          <h2 style={styles.heading.h2}>
            {currentFilter === 'all' ? 'All Ads' :
             currentFilter === 'active' ? 'Active Ads' :
             currentFilter === 'pending' ? 'Pending Ads' : 'Rejected Ads'}
            ({filteredAds.length})
          </h2>

          {filteredAds.length === 0 ? (
            <div style={{
              ...styles.card.flat,
              textAlign: 'center',
              padding: spacing['3xl']
            }}>
              <div style={{ fontSize: '64px', marginBottom: spacing.lg }}>📭</div>
              <h3>No ads found</h3>
              <p style={{ color: colors.text.secondary, marginBottom: spacing.xl }}>
                {currentFilter === 'all'
                  ? "You haven't posted any ads yet"
                  : `You don't have any ${currentFilter} ads`}
              </p>
              <button
                onClick={() => navigate(`/${language}/post-ad`)}
                style={styles.button.primary}
              >
                Post Your First Ad
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.lg }}>
              {filteredAds.map(ad => (
                <DashboardAdCard
                  key={ad.id}
                  ad={ad}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
```

---

## 🎯 Key Benefits

### 1. **Reusable Components**
- `DashboardAdCard` can be used in Profile, Search results, etc.
- `DashboardStats` can be reused in admin panel
- `DashboardFilters` is a generic filter component

### 2. **Easier Testing**
- Each component can be tested independently
- Mock data easily for testing
- Isolated bug fixes

### 3. **Better Performance**
- Smaller components re-render efficiently
- Can add `React.memo` to prevent unnecessary renders
- Better code splitting

### 4. **Consistent Styling**
- All components use theme system
- Easy to update colors/spacing globally
- Professional, consistent look

---

## ✅ Integration Checklist

- [ ] Backup original `Dashboard.jsx`
- [ ] Import all dashboard components
- [ ] Replace stats section with `DashboardStats`
- [ ] Add `DashboardFilters` component
- [ ] Replace ad cards with `DashboardAdCard`
- [ ] Update all inline styles to use theme
- [ ] Test functionality:
  - [ ] View ads
  - [ ] Filter ads (all, active, pending, rejected)
  - [ ] Edit ad
  - [ ] Delete ad
  - [ ] Post new ad button
  - [ ] Stats calculation
  - [ ] Empty state

---

## 🔍 Testing Scenarios

1. **Stats Display:**
   - Verify counts are correct
   - Check total views calculation
   - Test with 0 ads

2. **Filtering:**
   - Switch between filters
   - Verify correct ads shown
   - Check count updates

3. **Ad Actions:**
   - Edit ad (navigate to edit page)
   - Delete ad (confirm dialog)
   - View ad (navigate to detail)

4. **Empty States:**
   - No ads at all
   - No ads in specific filter

---

## 📦 Files Created

```
src/components/dashboard/
├── DashboardStats.jsx      (90 lines)  ✅
├── DashboardAdCard.jsx     (200 lines) ✅
└── DashboardFilters.jsx    (70 lines)  ✅
```

**Status:** All components created and ready to integrate! 🎉

---

## 🚀 Next Steps

1. ✅ Profile.jsx components created
2. ✅ Dashboard.jsx components created
3. ⏭️ Integrate Profile.jsx components
4. ⏭️ Integrate Dashboard.jsx components
5. SearchResults.jsx refactoring
6. EditorDashboard.jsx refactoring
7. AdminPanel.jsx refactoring

---

## 💡 Tips

- Start with one component at a time
- Test after each integration
- Use the theme system consistently
- Keep components small and focused
- Add PropTypes or TypeScript for better type safety

Happy refactoring! 🎨
