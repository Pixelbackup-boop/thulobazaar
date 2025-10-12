# Area-Based Location Filter Implementation

**Date:** October 11, 2025
**Status:** ✅ Complete

## Overview

Implemented an advanced area-based location filtering system for the classified ads platform, supporting a 5-level location hierarchy: **Province → District → Municipality → Ward → Area** (e.g., Bagmati Province → Kathmandu District → Kathmandu Metropolitan → Ward 1 → Thamel).

The system combines:
- 🔍 Autocomplete search for quick area finding
- ⭐ Popular areas for one-click selection
- 🗂️ Full hierarchical browser for exploration
- 🏷️ Active filter chips for easy management
- 📊 Real-time listing counts on each location

## Architecture

### Database Layer

#### 1. Areas Table (`migrations/019_create_areas_with_wards.sql`)

```sql
CREATE TABLE areas (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  name_np VARCHAR(255),                    -- Nepali name
  municipality_id INTEGER NOT NULL,        -- Links to locations table
  ward_number INTEGER,                     -- Ward within municipality
  area_type VARCHAR(50) DEFAULT 'neighborhood',
  latitude NUMERIC(10,8),
  longitude NUMERIC(11,8),
  is_popular BOOLEAN DEFAULT false,
  listing_count INTEGER DEFAULT 0,         -- Cached count of active ads
  search_terms TEXT,                       -- Additional search keywords
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

**Key Features:**
- Full-text search index using PostgreSQL's `to_tsvector()`
- GIN index for efficient text search
- Triggers to auto-update `updated_at`
- Function `update_area_listing_counts()` to sync counts

#### 2. Areas Full Hierarchy View

```sql
CREATE VIEW areas_full_hierarchy AS
SELECT
  a.id as area_id,
  a.name as area_name,
  a.ward_number,
  m.name as municipality_name,
  d.name as district_name,
  p.name as province_name,
  a.name || ', Ward ' || a.ward_number || ', ' || m.name as display_text
FROM areas a
JOIN locations m ON a.municipality_id = m.id
JOIN locations d ON m.parent_id = d.id
JOIN locations p ON d.parent_id = p.id;
```

Provides instant access to full location path for display and filtering.

#### 3. Sample Data (`migrations/020_populate_kathmandu_areas.sql`)

Populated **39 real areas** across Kathmandu Valley:
- **Kathmandu Metropolitan**: 28 areas (Thamel, Naxal, Lazimpat, Durbarmarg, Baneshwor, etc.)
- **Lalitpur Metropolitan**: 7 areas (Lagankhel, Pulchowk, Jhamsikhel, etc.)
- **Bhaktapur Municipality**: 4 areas (Durbar Square, Suryabinayak, etc.)

Each area includes:
- English and Nepali names
- Precise GPS coordinates
- Ward number
- Popularity flag
- Search terms for better discoverability

---

## Backend API Layer

### API Endpoints (`backend/routes/areas.js`)

#### 1. **GET /api/areas/search**
Autocomplete search with intelligent ranking.

**Parameters:**
- `q` (string, required): Search query (min 2 characters)
- `limit` (integer, optional): Max results (default: 10)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Thamel",
      "name_np": "ठमेल",
      "ward_number": 1,
      "municipality_name": "Kathmandu Metropolitan City",
      "district_name": "Kathmandu",
      "province_name": "Bagmati Province",
      "display_text": "Thamel, Ward 1, Kathmandu Metropolitan City, Kathmandu",
      "listing_count": 156,
      "is_popular": true
    }
  ],
  "query": "thamel"
}
```

**Ranking:** Popular areas first, then by listing count, then alphabetically.

#### 2. **GET /api/areas/popular**
Get popular areas for quick selection.

**Parameters:**
- `municipality_id` (integer, optional): Filter by municipality
- `limit` (integer, optional): Max results (default: 10)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Thamel",
      "ward_number": 1,
      "municipality_name": "Kathmandu Metropolitan City",
      "listing_count": 156
    }
  ]
}
```

#### 3. **GET /api/areas/by-location**
Get areas by municipality and/or ward.

**Parameters:**
- `municipality_id` (integer, required)
- `ward` (integer, optional)

#### 4. **GET /api/areas/hierarchy**
Get full location hierarchy with nested counts.

**Parameters:**
- `province_id` (integer, optional): Get details for specific province

**Response (without province_id):**
```json
{
  "success": true,
  "data": [
    {
      "id": 3,
      "name": "Bagmati Province",
      "district_count": 13,
      "municipality_count": 119,
      "area_count": 39,
      "ad_count": 450
    }
  ]
}
```

**Response (with province_id):**
Returns full nested structure: Province → Districts → Municipalities → Wards → Areas

#### 5. **GET /api/areas/wards**
Get wards for a municipality with their areas.

**Parameters:**
- `municipality_id` (integer, required)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "ward_number": 1,
      "area_count": 3,
      "total_listings": 245,
      "areas": [
        {
          "id": 1,
          "name": "Thamel",
          "listing_count": 156,
          "is_popular": true
        }
      ]
    }
  ]
}
```

---

## Frontend Components Layer

### Component Architecture

```
SearchFiltersPanel (Main Container)
├── AreaSearchInput (Autocomplete search)
├── ActiveLocationFilters (Selected areas chips)
├── PopularAreas (Quick selection)
└── LocationHierarchyBrowser (Full hierarchy)
```

### 1. **AreaSearchInput.jsx**
Autocomplete search component with debouncing.

**Features:**
- 300ms debounce for API calls
- Shows full location path in results
- Filters out already-selected areas
- Click-outside to close dropdown
- Loading indicator
- No results message

**Props:**
- `selectedAreas`: Array of currently selected areas
- `onAreaSelect`: Callback when area is selected

### 2. **ActiveLocationFilters.jsx**
Displays selected areas as removable chips.

**Features:**
- Pill-style chips with remove button
- Shows popular badge (⭐) for popular areas
- "Clear All" button
- Hover effects for better UX
- Auto-hides when no areas selected

**Props:**
- `selectedAreas`: Array of selected areas
- `onRemoveArea`: Callback to remove specific area
- `onClearAll`: Callback to clear all areas

### 3. **PopularAreas.jsx**
Quick-access component for popular areas.

**Features:**
- Collapsible section
- Shows listing counts
- Marks already-selected areas as disabled
- Checkmark (✓) on selected items
- Auto-fetches popular areas on mount
- Optional municipality filtering

**Props:**
- `selectedAreas`: Array of selected areas
- `onAreaSelect`: Callback when area is selected
- `municipalityId`: Optional filter by municipality

### 4. **LocationHierarchyBrowser.jsx**
Full 5-level hierarchical browser with multi-select.

**Features:**
- Expandable accordion structure
- Province → District → Municipality → Ward → Area drill-down
- Checkboxes for area selection
- Shows listing counts at each level
- Lazy-loads province details on expansion
- Popular badge (⭐) for popular areas
- Loading states during data fetch

**Props:**
- `selectedAreas`: Array of selected areas
- `onAreaSelect`: Callback when area is selected/deselected

### 5. **SearchFiltersPanel.jsx** (Updated)
Main filter panel with backward compatibility.

**New Props:**
- `enableAreaFiltering` (boolean): Feature flag to enable new system
- `onAreasChange`: Callback with array of selected areas

**Behavior:**
- When `enableAreaFiltering = false`: Shows old radio-button location filter
- When `enableAreaFiltering = true`: Shows new area-based multi-select system
- Maintains full backward compatibility with existing code

---

## Usage Examples

### Basic Usage (Current - Backward Compatible)

```jsx
<SearchFiltersPanel
  categories={categories}
  locations={locations}
  selectedCategory={selectedCategoryId}
  selectedLocation={selectedLocationId}
  priceRange={{ min: '', max: '' }}
  condition=""
  onCategoryChange={handleCategoryChange}
  onLocationChange={handleLocationChange}
  onPriceRangeChange={handlePriceChange}
  onConditionChange={handleConditionChange}
  onClearFilters={handleClearFilters}
/>
```

### New Area-Based Filtering

```jsx
<SearchFiltersPanel
  categories={categories}
  locations={locations}
  selectedCategory={selectedCategoryId}
  selectedLocation={selectedLocationId}
  priceRange={{ min: '', max: '' }}
  condition=""
  onCategoryChange={handleCategoryChange}
  onLocationChange={handleLocationChange}
  onPriceRangeChange={handlePriceChange}
  onConditionChange={handleConditionChange}
  onClearFilters={handleClearFilters}
  // NEW: Enable area-based filtering
  enableAreaFiltering={true}
  onAreasChange={(selectedAreas) => {
    // selectedAreas is an array of area objects
    console.log('Selected areas:', selectedAreas);
    // Update your search filters with area IDs
    const areaIds = selectedAreas.map(a => a.id);
    // Send to backend: ?area_ids=1,2,3
  }}
/>
```

---

## Database Queries

### Get All Areas with Full Hierarchy

```sql
SELECT * FROM areas_full_hierarchy
WHERE area_name ILIKE '%thamel%'
ORDER BY is_popular DESC, listing_count DESC;
```

### Update Listing Counts

```sql
SELECT update_area_listing_counts();
```

This should be run periodically (e.g., via cron job) or triggered when ads are approved/deleted.

---

## Performance Considerations

### Optimizations Implemented

1. **GIN Indexes**: Full-text search on area names
2. **Pattern Indexes**: `text_pattern_ops` for ILIKE queries
3. **View Materialization**: Consider materializing `areas_full_hierarchy` if performance becomes an issue
4. **Cached Counts**: `listing_count` column avoids expensive JOINs
5. **Debounced Search**: 300ms debounce reduces API calls
6. **Lazy Loading**: Province details loaded only on expansion

### Recommended Improvements

1. **Materialized View**: If hierarchy queries become slow:
   ```sql
   CREATE MATERIALIZED VIEW areas_full_hierarchy_mv AS
   SELECT * FROM areas_full_hierarchy;
   CREATE INDEX ON areas_full_hierarchy_mv (area_id);
   REFRESH MATERIALIZED VIEW areas_full_hierarchy_mv;
   ```

2. **Caching Layer**: Add Redis caching for:
   - Popular areas list (5 min TTL)
   - Hierarchy structure (15 min TTL)
   - Search results (1 min TTL)

3. **Listing Count Updates**:
   - Add trigger on `ads` table to auto-update `areas.listing_count`
   - Or run scheduled job every hour: `SELECT update_area_listing_counts();`

---

## Backend Search Integration

### Add Area Filtering to Ads Search

Update `/backend/routes/ads.js` or your ads search endpoint:

```javascript
// In your search endpoint
router.get('/api/ads/search', async (req, res) => {
  const { area_ids } = req.query; // "1,2,3"

  let query = 'SELECT * FROM ads WHERE status = $1';
  const params = ['approved'];

  if (area_ids) {
    const ids = area_ids.split(',').map(id => parseInt(id));
    query += ' AND area_id = ANY($2)';
    params.push(ids);
  }

  // ... rest of your search logic
});
```

---

## Migration Path

### Phase 1: Setup (✅ Complete)
- ✅ Create `areas` table
- ✅ Populate with Kathmandu Valley data
- ✅ Create API endpoints
- ✅ Build frontend components

### Phase 2: Integration (In Progress)
- ⏳ Add `area_id` filtering to ads search endpoint
- ⏳ Enable `enableAreaFiltering` flag in SearchFiltersPanel
- ⏳ Test end-to-end filtering
- ⏳ Verify listing counts are accurate

### Phase 3: Data Population (Future)
- ⏳ Populate remaining Nepal locations
- ⏳ Add ward-level data for all municipalities
- ⏳ Bulk import areas from OpenStreetMap
- ⏳ Set up automated listing count updates

### Phase 4: Production (Future)
- ⏳ Add monitoring/logging
- ⏳ Implement caching layer
- ⏳ Performance testing with large datasets
- ⏳ Gradual rollout with A/B testing

---

## Files Created/Modified

### Backend Files

1. **`/backend/migrations/019_create_areas_with_wards.sql`**
   - Creates `areas` table with ward support
   - Adds indexes for search performance
   - Creates `areas_full_hierarchy` view
   - Adds helper functions

2. **`/backend/migrations/020_populate_kathmandu_areas.sql`**
   - Populates 39 areas in Kathmandu Valley
   - Includes English/Nepali names, coordinates, ward numbers

3. **`/backend/routes/areas.js`**
   - 5 API endpoints for area search and hierarchy
   - Full implementation with error handling

4. **`/backend/server.js`** (Modified)
   - Added line 1902: `app.use('/api/areas', require('./routes/areas'));`

### Frontend Files

5. **`/frontend/src/components/search/AreaSearchInput.jsx`** (New)
   - Autocomplete search component
   - Debounced API calls
   - Smart dropdown with click-outside detection

6. **`/frontend/src/components/search/ActiveLocationFilters.jsx`** (New)
   - Removable filter chips
   - "Clear All" functionality

7. **`/frontend/src/components/search/PopularAreas.jsx`** (New)
   - Popular areas quick selection
   - Collapsible section with counts

8. **`/frontend/src/components/search/LocationHierarchyBrowser.jsx`** (New)
   - Full 5-level hierarchy browser
   - Checkboxes for multi-select
   - Lazy-loaded province details

9. **`/frontend/src/components/search/SearchFiltersPanel.jsx`** (Updated)
   - Integrated all new components
   - Added feature flag for gradual rollout
   - Maintained backward compatibility

---

## Testing Checklist

### Backend API Testing

```bash
# Test area search
curl "http://localhost:5000/api/areas/search?q=thamel"

# Test popular areas
curl "http://localhost:5000/api/areas/popular?limit=5"

# Test hierarchy
curl "http://localhost:5000/api/areas/hierarchy?province_id=3"

# Test wards
curl "http://localhost:5000/api/areas/wards?municipality_id=30101"
```

### Frontend Testing

1. **Search Functionality**
   - [ ] Type 2+ characters, see autocomplete results
   - [ ] Click area from dropdown, verify it's added to chips
   - [ ] Already-selected areas don't appear in search results

2. **Popular Areas**
   - [ ] Popular areas load on component mount
   - [ ] Click popular area, verify it's added to chips
   - [ ] Selected popular areas show checkmark and are disabled

3. **Hierarchy Browser**
   - [ ] Click province, verify districts load
   - [ ] Drill down: Province → District → Municipality → Ward → Area
   - [ ] Check area checkbox, verify chip appears
   - [ ] Uncheck area, verify chip is removed

4. **Filter Chips**
   - [ ] Click × on chip, verify area is removed
   - [ ] Click "Clear All", verify all areas are cleared
   - [ ] Chips show popular badge (⭐) when applicable

5. **Integration**
   - [ ] Multiple areas can be selected simultaneously
   - [ ] Filter count badge updates correctly
   - [ ] "Clear All" button clears both areas and other filters

---

## API Response Examples

### Search Results
```json
GET /api/areas/search?q=ban

{
  "success": true,
  "data": [
    {
      "id": 5,
      "name": "Baneshwor",
      "name_np": "बानेश्वर",
      "ward_number": 4,
      "municipality_name": "Kathmandu Metropolitan City",
      "district_name": "Kathmandu",
      "province_name": "Bagmati Province",
      "display_text": "Baneshwor, Ward 4, Kathmandu Metropolitan City, Kathmandu",
      "listing_count": 89,
      "is_popular": true
    },
    {
      "id": 6,
      "name": "New Baneshwor",
      "name_np": "नयाँ बानेश्वर",
      "ward_number": 5,
      "municipality_name": "Kathmandu Metropolitan City",
      "district_name": "Kathmandu",
      "province_name": "Bagmati Province",
      "display_text": "New Baneshwor, Ward 5, Kathmandu Metropolitan City, Kathmandu",
      "listing_count": 45,
      "is_popular": true
    }
  ],
  "query": "ban"
}
```

### Full Hierarchy
```json
GET /api/areas/hierarchy?province_id=3

{
  "success": true,
  "data": {
    "province_id": 3,
    "province_name": "Bagmati Province",
    "districts": [
      {
        "id": 301,
        "name": "Kathmandu",
        "ad_count": 450,
        "municipalities": [
          {
            "id": 30101,
            "name": "Kathmandu Metropolitan City",
            "type": "metropolitan",
            "ad_count": 420,
            "wards": [
              {
                "ward_number": 1,
                "ad_count": 95,
                "areas": [
                  {
                    "id": 1,
                    "name": "Thamel",
                    "listing_count": 156,
                    "is_popular": true
                  },
                  {
                    "id": 2,
                    "name": "Ason",
                    "listing_count": 45,
                    "is_popular": true
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
}
```

---

## Troubleshooting

### Issue: Search returns no results

**Solution:**
1. Verify areas exist in database:
   ```sql
   SELECT COUNT(*) FROM areas;
   ```
2. Check if search index was created:
   ```sql
   \d areas
   -- Look for idx_areas_search
   ```
3. Test query directly:
   ```sql
   SELECT * FROM areas WHERE name ILIKE '%thamel%';
   ```

### Issue: Listing counts are wrong

**Solution:**
1. Run the update function:
   ```sql
   SELECT update_area_listing_counts();
   ```
2. Verify counts:
   ```sql
   SELECT name, listing_count FROM areas ORDER BY listing_count DESC LIMIT 10;
   ```
3. Compare with actual ads:
   ```sql
   SELECT area_id, COUNT(*)
   FROM ads
   WHERE status = 'approved'
   GROUP BY area_id;
   ```

### Issue: Hierarchy doesn't load

**Solution:**
1. Check if province data exists:
   ```sql
   SELECT * FROM locations WHERE type = 'province';
   ```
2. Verify municipality links:
   ```sql
   SELECT COUNT(*) FROM areas
   JOIN locations ON areas.municipality_id = locations.id;
   ```
3. Check API endpoint in browser DevTools Network tab

---

## Future Enhancements

### Short-term
- [ ] Add area aliases (e.g., "New Road" → "Sundhara", "KTM" → "Kathmandu")
- [ ] Implement fuzzy search for typo tolerance
- [ ] Add area images/thumbnails
- [ ] Show area boundaries on map
- [ ] Add "Nearby areas" suggestions

### Medium-term
- [ ] Bulk import from OpenStreetMap
- [ ] User-generated area suggestions
- [ ] Area-based trending/statistics
- [ ] Save favorite areas per user
- [ ] Email alerts for new listings in saved areas

### Long-term
- [ ] AI-powered area recommendations
- [ ] Geofencing for mobile push notifications
- [ ] Heat maps of listing density
- [ ] Price trends per area
- [ ] Area guides/descriptions

---

## Summary

✅ **Complete Implementation** of area-based location filtering with:
- **Database**: 5-level hierarchy with 39 sample areas
- **Backend**: 5 RESTful API endpoints
- **Frontend**: 4 new React components + integrated SearchFiltersPanel
- **Backward Compatibility**: Feature flag for gradual rollout

**Ready for Phase 2:** Integration with ads search and production testing.

---

**Implementation Date:** October 11, 2025
**Developer:** Claude (Anthropic)
**Status:** ✅ All tasks complete - Ready for integration testing
