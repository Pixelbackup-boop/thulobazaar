# Google Maps Integration Setup Guide (Hybrid - Cost-Optimized)

## Overview
This implementation uses a **HYBRID APPROACH** to minimize Google Maps API costs:
- 🏪 **Shop Owners**: Use interactive MapEditor to set precise location (one-time cost)
- 👥 **Visitors**: See address + FREE Google Maps links (zero cost)

## Features Implemented
- ✅ Interactive map editor with draggable markers (for shop owners only)
- ✅ Address search with autocomplete
- ✅ Reverse geocoding (coordinates → address)
- ✅ Current location detection
- ✅ Database storage of coordinates and addresses
- ✅ Shop owner can edit location via "Set Location" button
- ✅ **Visitors see address + FREE links** (no embedded maps = no API cost!)
- ✅ "Get Directions" and "View on Map" buttons (100% FREE)

## Step 1: Get Google Maps API Key

### 1.1 Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Enter project name (e.g., "Thulobazaar")
4. Click "Create"

### 1.2 Enable Required APIs
Enable these 3 APIs for your project:

1. **Maps JavaScript API**
   - Go to: APIs & Services → Library
   - Search for "Maps JavaScript API"
   - Click "Enable"

2. **Geocoding API**
   - Go to: APIs & Services → Library
   - Search for "Geocoding API"
   - Click "Enable"

3. **Places API**
   - Go to: APIs & Services → Library
   - Search for "Places API"
   - Click "Enable"

### 1.3 Create API Key
1. Go to: APIs & Services → Credentials
2. Click "Create Credentials" → "API Key"
3. Copy the API key (starts with `AIza...`)

### 1.4 Restrict API Key (IMPORTANT for Security)
1. Click on your newly created API key
2. Under "Application restrictions":
   - Select "HTTP referrers (web sites)"
   - Add these referrers:
     - `localhost:5173/*` (for development)
     - `localhost:3000/*` (if using different port)
     - `yourdomain.com/*` (for production)
     - `www.yourdomain.com/*` (for production with www)

3. Under "API restrictions":
   - Select "Restrict key"
   - Select only these APIs:
     ☑ Maps JavaScript API
     ☑ Geocoding API
     ☑ Places API

4. Click "Save"

## Step 2: Configure Your Application

### 2.1 Add API Key to Frontend
1. Open `/frontend/.env` file
2. Replace `YOUR_API_KEY_HERE` with your actual API key:
   ```
   VITE_GOOGLE_MAPS_API_KEY=AIzaSyC-xxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

### 2.2 Restart Development Server
```bash
cd frontend
npm run dev
```
**Important:** You MUST restart the server after adding the API key!

## Step 3: Test the Integration

### 3.1 Access Shop Profile
1. Login as a business account owner
2. Navigate to your shop profile: `http://localhost:5173/en/shop/your-shop-slug`
3. Scroll to the "Shop Location" section in the left sidebar

### 3.2 Set Shop Location
1. Click the "Set Location" or "Edit" button
2. You should see an interactive map with search bar
3. Try these methods to set location:
   - **Search**: Type address (e.g., "Thamel, Kathmandu") and press Enter
   - **Click**: Click anywhere on the map to place marker
   - **Drag**: Drag the marker to adjust position
   - **Current Location**: Click "Current Location" button to auto-detect

4. Once location is set, click "Save Location"

### 3.3 View as Visitor
1. Logout or open in incognito mode
2. Visit the shop profile
3. You should see:
   - The saved address with pin icon
   - **Two FREE buttons**:
     - "Get Directions" - Opens Google Maps with navigation
     - "View on Map" - Opens location in Google Maps
   - **NO embedded map** (this saves API costs!)

## Cost Breakdown (Hybrid Approach)

### What Costs Money vs. What's FREE

| Feature | Who Uses It | When | Cost |
|---------|------------|------|------|
| MapEditor (set location) | Shop Owner | Once per shop | **~$0.03** |
| View shop as visitor | Any visitor | Every page view | **$0.00** ✅ |
| Click "Get Directions" | Any visitor | Unlimited clicks | **$0.00** ✅ |
| Click "View on Map" | Any visitor | Unlimited clicks | **$0.00** ✅ |
| Edit existing location | Shop Owner | Occasional | **~$0.03** |

### Real-World Cost Example

**Scenario**: 500 shops, 50,000 monthly visitors

| Action | Calculation | Cost |
|--------|-------------|------|
| Initial setup (500 shops) | 500 × $0.03 | **$15.00** (one-time) |
| Monthly visitor views | 50,000 × $0 | **$0.00** |
| Direction button clicks | 10,000 × $0 | **$0.00** |
| **Total Monthly Cost** | After initial setup | **~$0** |

**You stay well within the $200/month FREE tier!**

### Why This Approach is Cost-Effective

1. **Shop Owner Sets Location Once**: ~$0.03 per shop (one-time)
2. **Visitors See FREE Links**: No embedded maps = no API calls
3. **Google Maps Links Are Always FREE**: Unlimited usage
4. **Scalable**: Even with 100,000 visitors, cost remains $0/month

## Database Schema

The following columns were added to the `users` table:

| Column | Type | Description |
|--------|------|-------------|
| `latitude` | DECIMAL(10,8) | Latitude coordinate (-90 to 90) |
| `longitude` | DECIMAL(11,8) | Longitude coordinate (-180 to 180) |
| `formatted_address` | TEXT | Human-readable address from geocoding |

## API Endpoints

### Get Shop Profile
```
GET /api/shop/:slug
```
Returns shop data including `latitude`, `longitude`, and `formatted_address`.

### Update Shop Location
```
PUT /api/shop/:slug/location
Authorization: Bearer <token>

Body:
{
  "latitude": 27.7172,
  "longitude": 85.3240,
  "formatted_address": "Thamel, Kathmandu 44600, Nepal"
}
```

## Component Architecture

### MapEditor Component
- **Location**: `/frontend/src/components/MapEditor.jsx`
- **Purpose**: Provides interactive map interface for shop owners
- **Features**:
  - Draggable marker
  - Address search with autocomplete
  - Reverse geocoding
  - Current location detection
  - Works with environment variable for API key

### ShopProfile Component
- **Location**: `/frontend/src/components/ShopProfile.jsx`
- **Updates**:
  - Added MapEditor integration for shop owners
  - Added location state management
  - Added "Set Location"/"Edit" button (owners only)
  - **Visitors see**: Address + FREE Google Maps links (no embedded map)
  - Two action buttons: "Get Directions" and "View on Map"

## Cost Optimization Tips

### Free Tier Limits (Google Maps)
- **Monthly Free**: $200 credit
- **Maps JavaScript API**: 28,000 loads/month free
- **Geocoding API**: 40,000 requests/month free
- **Places API**: 17,000 requests/month free

### Best Practices to Stay Within Free Tier
1. **Cache Results**: Store address-coordinate pairs in database
2. **Limit Updates**: Don't reload map on every component render
3. **Use Static Maps API**: For shop listings (cheaper than interactive maps)
4. **Lazy Load**: Only load maps when user scrolls to location section
5. **Set Quotas**: Set daily quotas in Google Cloud Console to prevent unexpected charges

### Monitor Usage
1. Go to Google Cloud Console → APIs & Services → Dashboard
2. Click on each API to see usage graphs
3. Set up billing alerts (recommended: alert at $50, $100, $150)

## Troubleshooting

### Map Not Loading
**Problem**: Map shows "Loading map..." forever

**Solutions**:
1. Check API key is correct in `.env` file
2. Verify you've enabled all 3 required APIs
3. Check browser console for errors
4. Ensure development server was restarted after adding API key

### "Google Maps API key not configured" Error
**Problem**: Error message appears instead of map

**Solution**:
- Add `VITE_GOOGLE_MAPS_API_KEY` to `/frontend/.env` file
- Restart development server: `npm run dev`

### "This page can't load Google Maps correctly"
**Problem**: Gray map with error overlay

**Solutions**:
1. Check if billing is enabled on your Google Cloud project
2. Verify API key restrictions aren't blocking your domain
3. Check if all 3 APIs are enabled

### Location Not Saving
**Problem**: Click "Save Location" but location doesn't persist

**Solutions**:
1. Check browser console for API errors
2. Verify user is logged in and owns the shop
3. Check backend logs for database errors
4. Ensure database migration was run successfully

### Search Not Working (Nepal)
**Problem**: Address search doesn't find locations in Nepal

**Solution**:
- MapEditor is configured with `componentRestrictions: { country: 'np' }`
- If searching outside Nepal, remove this restriction in `MapEditor.jsx` line 79

## Security Checklist

- ✅ API key restricted to specific domains
- ✅ API key restricted to only required APIs
- ✅ API key NOT committed to version control (.env is gitignored)
- ✅ Backend validates user ownership before saving location
- ✅ Backend validates coordinate ranges (-90 to 90, -180 to 180)
- ✅ HTTPS recommended for production

## Next Steps

### Optional Enhancements
1. **Area/Radius Display**: Show service area circle around shop
2. **Multiple Locations**: Support for chains with multiple branches
3. **Opening Hours**: Integrate business hours with map
4. **Route Planning**: Calculate distance from user's location
5. **Nearby Shops**: Show other verified shops on map
6. **Street View**: Add Google Street View integration

### Production Deployment
1. Add production domain to API key restrictions
2. Set up billing alerts in Google Cloud Console
3. Monitor API usage regularly
4. Consider using environment-specific API keys (dev vs prod)

## Support

If you encounter issues:
1. Check this documentation first
2. Review browser console for errors
3. Check backend logs: `tail -100 backend.log`
4. Verify database migration ran successfully
5. Test with a fresh API key if all else fails

## Files Modified/Created

### Frontend
- ✅ `/frontend/src/components/MapEditor.jsx` (NEW)
- ✅ `/frontend/src/components/ShopProfile.jsx` (UPDATED)
- ✅ `/frontend/.env` (CREATED)
- ✅ `/frontend/.env.example` (CREATED)

### Backend
- ✅ `/backend/migrations/011_add_coordinates_to_users.sql` (NEW)
- ✅ `/backend/routes/profiles.js` (UPDATED - added location endpoint)

### Documentation
- ✅ `/GOOGLE_MAPS_SETUP.md` (THIS FILE)
