# Thulobazaar - Specifications Implementation Roadmap

## Overview
This document tracks the implementation of category-specific specification templates for displaying detailed product information in ad listings.

---

## Implementation Status

### ✅ Completed
1. **Electronics & Mobiles** (Categories 1, 2)
   - Display Component: `ElectronicsSpecs.jsx`
   - Form Template: `ElectronicsForm.jsx`
   - Fields: Brand, Model, Warranty, Storage, RAM, Battery Health, Processor, Graphics, Screen Size, etc.
   - Status: ✅ Fully Implemented (Form + Display)

2. **Vehicles** (Category 3)
   - Display Component: `VehiclesSpecs.jsx`
   - Form Template: `VehiclesForm.jsx`
   - Fields: Brand, Model, Year, Mileage, Fuel Type, Transmission, Engine Capacity, Body Type, Color, Number of Owners, Registration Year, Parking Sensors, Backup Camera, etc.
   - Status: ✅ Fully Implemented (Form + Display)

3. **Property** (Category 5)
   - Display Component: `PropertySpecs.jsx`
   - Form Template: `PropertyForm.jsx`
   - Fields: Total Area, Area Unit, Bedrooms, Bathrooms, Furnishing, Floor Number, Total Floors, Parking, Facing, Property Age, Amenities, Land Type, Road Access, Road Width, Monthly Rent, Security Deposit, Available From, etc.
   - Note: Property Type and Property For fields removed (redundant with subcategory)
   - Status: ✅ Fully Implemented (Form + Display)

4. **Fashion & Apparel** (Categories 7, 8)
   - Display Component: `FashionSpecs.jsx`
   - Form Template: `FashionForm.jsx`
   - Fields: Size, Color, Brand, Material, Clothing Type, Fit Type, Sleeve Type, Pattern, Occasion, Footwear Type, Shoe Size, Accessory Type, Watch Type, Strap Material, Dial Shape, Water Resistance, Warranty, Age Group, Season, etc.
   - Note: Gender field included in template but redundant (Men's Fashion & Women's Fashion are separate categories). Condition field hidden for Fashion ads.
   - Status: ✅ Fully Implemented (Form + Display)

---

## Priority Queue for Implementation

### ~~🚗 1. Vehicles Specs (Category 3)~~ ✅ COMPLETED
**Priority: HIGH** - Very popular category with high-value items

---

### ~~🏠 2. Property Specs (Category 5)~~ ✅ COMPLETED
**Priority: HIGH** - High-value transactions, needs detailed specs

**Subcategories:**
- 501: Land For Sale
- 502: Apartments For Sale
- 503: Apartment Rentals
- 504: Commercial Property Rentals
- 505: Houses For Sale
- 506: Commercial Properties For Sale
- 507: Room Rentals
- 508: House Rentals
- 509: Land Rentals

**Specification Fields:**
```javascript
{
  // Universal fields (propertyType and propertyFor are redundant - already in subcategory)
  totalArea: 'Total Area',
  areaUnit: 'Unit (aana, ropani, sq.ft, sq meter)',

  // Apartment/House fields
  bedrooms: 'Number of Bedrooms',
  bathrooms: 'Number of Bathrooms',
  furnishing: 'Furnishing (Fully Furnished, Semi Furnished, Unfurnished)',
  floorNumber: 'Floor Number',
  totalFloors: 'Total Floors in Building',
  parking: 'Number of Parking Spaces',
  facing: 'Facing Direction (North, South, East, West)',
  propertyAge: 'Property Age',
  amenities: 'Amenities (multiselect)',

  // Land fields
  landType: 'Land Type (Residential, Commercial, Agricultural, etc.)',
  roadAccess: 'Road Access',
  roadWidth: 'Road Width (in feet)',

  // Rental fields
  monthlyRent: 'Monthly Rent (NPR)',
  securityDeposit: 'Security Deposit (NPR)',
  availableFrom: 'Available From'
}
```

**Component Name:** `PropertySpecs.jsx`

---

### ~~👕 3. Fashion Specs (Categories 7, 8)~~ ✅ COMPLETED
**Priority: MEDIUM** - Very popular but simpler fields

**Categories:**
- 7: Men's Fashion & Grooming
- 8: Women's Fashion & Beauty

**Specification Fields:**
```javascript
{
  brand: 'Brand',
  size: 'Size (S, M, L, XL, 2XL, or numeric)',
  color: 'Color',
  material: 'Material (Cotton, Silk, Polyester, Leather, etc.)',
  gender: 'Gender (Men, Women, Unisex)',
  occasion: 'Occasion (Casual, Formal, Party, Sports)',
  pattern: 'Pattern (Solid, Striped, Printed, Checked)',
  fitType: 'Fit Type (Slim, Regular, Loose, Oversized)',
  sleeveType: 'Sleeve Type (Full, Half, Sleeveless)',
  warranty: 'Warranty (for watches, shoes)',
  age: 'Age Group (Adult, Kids, Baby)',
  season: 'Season (Summer, Winter, All-Season)'
}
```

**Component Name:** `FashionSpecs.jsx`

---

### 🛋️ 4. Home & Living Specs (Category 4)
**Priority: MEDIUM** - Furniture needs dimensions

**Subcategories:**
- 401: Bedroom Furniture
- 402: Living Room Furniture
- 403: Office & Shop Furniture
- 406: Kitchen & Dining Furniture
- 407: Children's Furniture

**Specification Fields:**
```javascript
{
  itemType: 'Item Type (Bed, Sofa, Table, Chair, Wardrobe)',
  material: 'Material (Wood, Metal, Plastic, Glass, Fabric)',
  color: 'Color/Finish',
  dimensions: 'Dimensions (Length × Width × Height)',
  brand: 'Brand',
  roomType: 'Room Type (Bedroom, Living Room, Kitchen, Office)',
  assemblyRequired: 'Assembly Required (Yes/No)',
  seatingCapacity: 'Seating Capacity (for sofas, dining sets)',
  storage: 'Storage Available (Yes/No)',
  weight: 'Weight/Weight Capacity',
  style: 'Style (Modern, Traditional, Vintage, Minimalist)'
}
```

**Component Name:** `HomeLivingSpecs.jsx`

---

### 🐾 5. Pets & Animals Specs (Category 6)
**Priority: LOW-MEDIUM**

**Subcategories:**
- 601: Pets
- 602: Farm Animals
- 603: Pet & Animal Accessories
- 604: Pet & Animal food

**Specification Fields:**
```javascript
{
  type: 'Type (Dog, Cat, Bird, Fish, etc.)',
  breed: 'Breed',
  age: 'Age (months/years)',
  gender: 'Gender (Male/Female)',
  vaccinated: 'Vaccinated (Yes/No)',
  trained: 'Trained (Yes/No)',
  color: 'Color/Marking',
  weight: 'Weight',
  pedigree: 'Pedigree/Certificate Available (Yes/No)',
  temperament: 'Temperament (Friendly, Active, Calm, etc.)',
  healthStatus: 'Health Status'
}
```

**Component Name:** `PetsSpecs.jsx`

---

### 💼 6. Jobs Specs (Category 13)
**Priority: MEDIUM** - Different structure, needs custom component

**Note:** This might need a completely different UI layout than product specs.

**Specification Fields:**
```javascript
{
  jobTitle: 'Job Title',
  companyName: 'Company Name',
  jobType: 'Job Type (Full-time, Part-time, Contract, Freelance)',
  experienceRequired: 'Experience Required (in years)',
  salaryRange: 'Salary Range',
  educationLevel: 'Education Level Required',
  industry: 'Industry',
  skillsRequired: 'Skills Required',
  benefits: 'Benefits (Health Insurance, PF, Bonus, etc.)',
  vacancies: 'Number of Vacancies',
  applicationDeadline: 'Application Deadline'
}
```

**Component Name:** `JobsSpecs.jsx`

---

## Implementation Guidelines

### File Structure
```
frontend/src/components/ad-details/specs/
├── ElectronicsSpecs.jsx ✅
├── VehiclesSpecs.jsx ✅
├── PropertySpecs.jsx ✅
├── FashionSpecs.jsx ✅
├── HomeLivingSpecs.jsx (Next)
├── PetsSpecs.jsx
├── JobsSpecs.jsx
└── TemplateSpecs.css
```

### Component Template
```javascript
import React from 'react';
import './TemplateSpecs.css';

function CategorySpecs({ customFields }) {
  if (!customFields || Object.keys(customFields).length === 0) {
    return null;
  }

  const fieldLabels = {
    // Define field mappings
  };

  const specs = Object.entries(customFields)
    .filter(([key, value]) => value && value !== '' && value.length !== 0)
    .map(([key, value]) => ({
      label: fieldLabels[key] || key,
      value: Array.isArray(value) ? value.join(', ') : value
    }));

  if (specs.length === 0) {
    return null;
  }

  return (
    <div className="template-specs category-specs">
      <div className="specs-header">
        <h3>📋 Specifications</h3>
      </div>
      <div className="specs-grid">
        {specs.map((spec, index) => (
          <div key={index} className="spec-item">
            <div className="spec-label">{spec.label}</div>
            <div className="spec-value">{spec.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CategorySpecs;
```

---

## Backend Implementation Notes

### Database Schema
Custom fields are stored in `ads.custom_fields` as JSONB column.

### Template Definitions
Category templates should be defined in backend to provide:
1. Form fields for ad creation
2. Validation rules
3. Field types (text, select, multiselect, number, date)
4. Required vs optional fields

---

## Testing Checklist

For each implemented spec component:
- [ ] Component renders correctly with data
- [ ] Handles empty/null values gracefully
- [ ] Displays arrays properly (joined with commas)
- [ ] Responsive design (mobile + desktop)
- [ ] Matches overall design system
- [ ] Filters out empty fields
- [ ] Returns null when no specs available

---

## Notes
- All spec components should use the shared `TemplateSpecs.css`
- Icon emojis should be category-specific
- Field labels should be user-friendly (not camelCase)
- Consider locale/language support for field labels in future
