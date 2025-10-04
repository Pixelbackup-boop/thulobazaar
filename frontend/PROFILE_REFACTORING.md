# Profile.jsx Refactoring Guide

## ✅ Components Created

All sub-components have been created in `src/components/profile/`:

1. **ProfileHeader.jsx** (140 lines) - Cover photo & avatar display with upload overlays
2. **ProfileEditForm.jsx** (140 lines) - Edit form with name, bio, phone, location
3. **ProfileStats.jsx** (75 lines) - Statistics cards (total ads, active ads, views, etc.)
4. **ImageCropperModal.jsx** (95 lines) - Image cropping modal using react-easy-crop

**Total for sub-components:** ~450 lines

## 📊 Before & After

**Before:**
- 1 file: Profile.jsx (980 lines)
- All logic in one place
- Hard to maintain

**After:**
- Main file: Profile.jsx (~350 lines) - State management & orchestration
- 4 sub-components: (~450 lines) - Reusable UI components
- **Total:** ~800 lines (18% reduction)
- Much more maintainable and testable

---

## 🔧 How to Integrate

### Step 1: Import Components

At the top of `Profile.jsx`, add:

```jsx
import { styles, colors, spacing, typography } from '../styles/theme';
import ProfileHeader from './profile/ProfileHeader';
import ProfileEditForm from './profile/ProfileEditForm';
import ProfileStats from './profile/ProfileStats';
import ImageCropperModal from './profile/ImageCropperModal';
```

### Step 2: Replace Cover/Avatar Section

**Find this section** (around line 300-500 in original):
```jsx
{/* Cover Photo Section */}
<div style={{ position: 'relative', marginBottom: '80px' }}>
  {/* ... lots of inline styles ... */}
</div>
```

**Replace with:**
```jsx
<ProfileHeader
  profile={profile}
  onAvatarClick={() => avatarInputRef.current?.click()}
  onCoverClick={() => coverInputRef.current?.click()}
  uploadingAvatar={uploadingAvatar}
  uploadingCover={uploadingCover}
/>
```

### Step 3: Replace Profile Info Section

**Find this section** (around line 500-600):
```jsx
{/* Profile Info */}
<div style={{ marginLeft: '240px', paddingTop: '20px' }}>
  <h1>{profile?.name}</h1>
  {/* ... */}
</div>
```

**Replace with:**
```jsx
<div style={{ marginLeft: '240px', paddingTop: spacing.xl }}>
  <h1 style={styles.heading.h1}>{profile?.name}</h1>
  <p style={{ color: colors.text.secondary, marginBottom: spacing.md }}>
    {profile?.bio || 'No bio yet'}
  </p>
  <div style={{ display: 'flex', gap: spacing.lg, color: colors.text.secondary }}>
    {profile?.location_name && <span>📍 {profile.location_name}</span>}
    {profile?.phone && <span>📞 {profile.phone}</span>}
    {profile?.email && <span>📧 {profile.email}</span>}
  </div>
</div>
```

### Step 4: Add ProfileStats

**After the profile info section, add:**
```jsx
<ProfileStats profile={profile} />
```

### Step 5: Replace Edit Form

**Find the edit form section** (around line 600-800):
```jsx
{/* Edit Form */}
<div style={{ ... }}>
  <h2>Edit Profile</h2>
  <form>
    {/* ... lots of form fields ... */}
  </form>
</div>
```

**Replace with:**
```jsx
<ProfileEditForm
  formData={formData}
  locations={locations}
  onChange={handleInputChange}
  onSave={handleSave}
  onCancel={() => {
    setFormData({
      name: profile?.name || '',
      bio: profile?.bio || '',
      phone: profile?.phone || '',
      locationId: profile?.location_id || ''
    });
    setUnsavedChanges(false);
  }}
  saving={saving}
  unsavedChanges={unsavedChanges}
/>
```

### Step 6: Replace Image Cropper Modal

**Find the cropper modal** (around line 800-950):
```jsx
{cropperModal.isOpen && (
  <div style={{ /* modal overlay */ }}>
    <Cropper ... />
  </div>
)}
```

**Replace with:**
```jsx
<ImageCropperModal
  isOpen={cropperModal.isOpen}
  imageSrc={cropperModal.imageSrc}
  type={cropperModal.type}
  onCropComplete={handleCropComplete}
  onCancel={() => setCropperModal({ isOpen: false, type: null, imageSrc: null })}
/>
```

---

## 📝 Complete Example - Refactored Profile.jsx Structure

```jsx
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import ApiService from '../services/api';
import Header from './Header';
import { styles, colors, spacing } from '../styles/theme';

// Import new components
import ProfileHeader from './profile/ProfileHeader';
import ProfileEditForm from './profile/ProfileEditForm';
import ProfileStats from './profile/ProfileStats';
import ImageCropperModal from './profile/ImageCropperModal';

function Profile() {
  // ... all your existing state ...

  // ... all your existing functions ...

  return (
    <div>
      <Header />

      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: spacing['3xl']
      }}>
        {/* Profile Header with Cover & Avatar */}
        <ProfileHeader
          profile={profile}
          onAvatarClick={() => avatarInputRef.current?.click()}
          onCoverClick={() => coverInputRef.current?.click()}
          uploadingAvatar={uploadingAvatar}
          uploadingCover={uploadingCover}
        />

        {/* Profile Info */}
        <div style={{ marginLeft: '240px', paddingTop: spacing.xl, marginBottom: spacing['2xl'] }}>
          <h1 style={styles.heading.h1}>{profile?.name}</h1>
          <p style={{ color: colors.text.secondary, marginBottom: spacing.md }}>
            {profile?.bio || 'No bio yet'}
          </p>
          <div style={{ display: 'flex', gap: spacing.lg, color: colors.text.secondary, fontSize: '14px' }}>
            {profile?.location_name && <span>📍 {profile.location_name}</span>}
            {profile?.phone && <span>📞 {profile.phone}</span>}
            {profile?.email && <span>📧 {profile.email}</span>}
          </div>
        </div>

        {/* Stats Cards */}
        <ProfileStats profile={profile} />

        {/* Edit Form */}
        <ProfileEditForm
          formData={formData}
          locations={locations}
          onChange={handleInputChange}
          onSave={handleSave}
          onCancel={handleCancel}
          saving={saving}
          unsavedChanges={unsavedChanges}
        />

        {/* Hidden file inputs */}
        <input
          ref={avatarInputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleAvatarSelect}
        />
        <input
          ref={coverInputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleCoverSelect}
        />
      </div>

      {/* Image Cropper Modal */}
      <ImageCropperModal
        isOpen={cropperModal.isOpen}
        imageSrc={cropperModal.imageSrc}
        type={cropperModal.type}
        onCropComplete={handleCropComplete}
        onCancel={() => setCropperModal({ isOpen: false, type: null, imageSrc: null })}
      />

      {/* Success/Error Messages */}
      {successMessage && (
        <div style={{
          ...styles.alert.success,
          position: 'fixed',
          top: spacing.xl,
          right: spacing.xl,
          zIndex: 1000
        }}>
          {successMessage}
        </div>
      )}
    </div>
  );
}

export default Profile;
```

---

## 🎯 Key Benefits

### 1. **Modularity**
- Each component has a single responsibility
- Easy to test individually
- Reusable in other parts of the app

### 2. **Maintainability**
- Changes to UI are isolated
- Easy to find and fix bugs
- Clear component boundaries

### 3. **Consistency**
- Uses theme system throughout
- Consistent styling
- Easy to update globally

### 4. **Performance**
- Smaller components re-render less
- Can add React.memo easily
- Better code splitting

---

## ✅ Checklist for Integration

- [ ] Backup original `Profile.jsx` (done: `Profile.backup.jsx`)
- [ ] Import all sub-components
- [ ] Replace cover/avatar section with `ProfileHeader`
- [ ] Add `ProfileStats` component
- [ ] Replace edit form with `ProfileEditForm`
- [ ] Replace cropper modal with `ImageCropperModal`
- [ ] Update all inline styles to use theme
- [ ] Test all functionality:
  - [ ] Avatar upload
  - [ ] Cover photo upload
  - [ ] Profile editing
  - [ ] Image cropping
  - [ ] Form validation
  - [ ] Save/cancel buttons

---

## 🔍 Testing

After integration, test these scenarios:

1. **Avatar Upload:**
   - Click avatar
   - Select image
   - Crop image
   - Verify upload

2. **Cover Photo Upload:**
   - Click cover
   - Select image
   - Crop image
   - Verify upload

3. **Profile Edit:**
   - Change name, bio, phone, location
   - Save changes
   - Verify persistence
   - Test cancel button

4. **Validation:**
   - Try empty name (should fail)
   - Try bio over 500 chars (should truncate)
   - Try invalid phone format

---

## 🚀 Next Steps

Once Profile.jsx is refactored:
1. ✅ Profile.jsx refactored
2. ⏭️ Dashboard.jsx refactoring (next)
3. SearchResults.jsx refactoring
4. EditorDashboard.jsx refactoring
5. AdminPanel.jsx refactoring

---

## 📦 Files Created

```
src/components/profile/
├── ProfileHeader.jsx          (140 lines) ✅
├── ProfileEditForm.jsx        (140 lines) ✅
├── ProfileStats.jsx           (75 lines)  ✅
└── ImageCropperModal.jsx      (95 lines)  ✅
```

**Status:** All components created and ready to integrate! 🎉
