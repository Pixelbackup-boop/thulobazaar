'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { apiClient } from '../lib/api';

interface Location {
  id: number;
  name: string;
  type: 'province' | 'district' | 'municipality' | 'ward' | 'area';
  parent_id?: number | null;
}

interface District extends Location {
  municipalities?: Municipality[];
}

interface Municipality extends Location {
  wards?: Ward[];
}

interface Ward {
  ward_number: number;
  areas?: Location[];
}

interface Province extends Location {
  districts?: District[];
}

interface SearchResult extends Location {
  hierarchy_info?: string;
}

interface LocationSelectorProps {
  onLocationSelect: (location: { id: number; name: string; type: string } | null) => void;
  selectedLocationId?: number | null;
  label?: string;
  placeholder?: string;
  required?: boolean;
  filterType?: 'area' | 'all'; // 'area' for post-ad (only areas), 'all' for filters (any location)
}

export default function LocationSelector({
  onLocationSelect,
  selectedLocationId,
  label = 'Select Location',
  placeholder = 'Search location...',
  required = false,
  filterType = 'area'
}: LocationSelectorProps) {
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [isLoadingHierarchy, setIsLoadingHierarchy] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);

  // Dropdown selection states
  const [selectedProvince, setSelectedProvince] = useState<Province | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<District | null>(null);
  const [selectedMunicipality, setSelectedMunicipality] = useState<Municipality | null>(null);
  const [selectedWard, setSelectedWard] = useState<Ward | null>(null);

  // Search autocomplete states
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const searchInputRef = useRef<HTMLDivElement>(null);

  // Fetch hierarchy on mount
  useEffect(() => {
    fetchHierarchy();
  }, []);

  const fetchHierarchy = async () => {
    try {
      setIsLoadingHierarchy(true);
      // Use areas hierarchy API for area selection (Province → District → Municipality → Ward → Area)
      const response = filterType === 'area'
        ? await apiClient.getAreasHierarchy()
        : await apiClient.getHierarchy();

      if (response.success && response.data) {
        // For areas API, the response is an array of provinces (without nested data initially)
        setProvinces(response.data as Province[]);
      }
    } catch (error) {
      console.error('❌ Error fetching location hierarchy:', error);
    } finally {
      setIsLoadingHierarchy(false);
    }
  };

  // Fetch nested data for a specific province
  const fetchProvinceData = async (provinceId: number) => {
    try {
      setIsLoadingHierarchy(true);
      const response = await apiClient.getAreasHierarchy(provinceId);

      if (response.success && response.data) {
        // Update the provinces array with the nested data for this province
        const updatedProvinces = provinces.map(province =>
          province.id === provinceId
            ? { ...province, districts: response.data.districts }
            : province
        );
        setProvinces(updatedProvinces);

        // Also update selectedProvince to point to the updated province object
        const updatedProvince = updatedProvinces.find(p => p.id === provinceId);
        if (updatedProvince) {
          setSelectedProvince(updatedProvince);
        }
      }
    } catch (error) {
      console.error('❌ Error fetching province data:', error);
    } finally {
      setIsLoadingHierarchy(false);
    }
  };

  // Handle location selection
  const handleLocationSelect = (location: Location) => {
    setSelectedLocation(location);
    setSearchTerm(location.name);
    setShowAutocomplete(false);

    // Notify parent component
    onLocationSelect({
      id: location.id,
      name: location.name,
      type: location.type
    });
  };

  // Search locations with debounce
  const searchLocations = useCallback(async (query: string) => {
    if (!query || query.trim().length < 2) {
      setSearchResults([]);
      setShowAutocomplete(false);
      return;
    }

    setIsSearching(true);
    try {
      // Use areas search API for area-only selection
      const response = filterType === 'area'
        ? await apiClient.searchAreas(query.trim())
        : await apiClient.searchAllLocations(query.trim());

      if (response.success && response.data) {
        let results = response.data;

        // Filter to only show areas for post-ad (already filtered by areas API)
        if (filterType === 'area') {
          results = results.filter((item: SearchResult) => item.type === 'area');
        }

        setSearchResults(results as SearchResult[]);
        setShowAutocomplete(true);
      }
    } catch (error) {
      console.error('❌ Error searching locations:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, [filterType]);

  // Handle search input change with debounce
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Set new timeout
    searchTimeoutRef.current = setTimeout(() => {
      searchLocations(value);
    }, 300); // 300ms debounce
  };

  // Handle selection from autocomplete
  const handleAutocompleteSelect = (result: SearchResult) => {
    handleLocationSelect(result);
  };

  // Close autocomplete when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchInputRef.current && !searchInputRef.current.contains(event.target as Node)) {
        setShowAutocomplete(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Get location type label with icon
  const getLocationTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      province: '🏛 Province',
      district: '📍 District',
      municipality: '🏙 Municipality',
      ward: '🏘 Ward',
      area: '📌 Area'
    };
    return labels[type] || type;
  };

  return (
    <div style={{
      border: '2px solid #e5e7eb',
      borderRadius: '8px',
      padding: '1rem',
      marginBottom: '1rem'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '0.75rem'
      }}>
        <h3 style={{
          margin: 0,
          fontSize: '1rem',
          fontWeight: '600',
          color: '#111827'
        }}>
          {label} {required && <span style={{ color: '#ef4444' }}>*</span>}
        </h3>
      </div>

      {/* Selected Location Display */}
      {selectedLocation && (
        <div style={{
          padding: '0.75rem',
          backgroundColor: '#ede9fe',
          borderRadius: '6px',
          marginBottom: '0.75rem',
          fontSize: '0.875rem',
          color: '#7c3aed',
          fontWeight: '600',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span>📍 {selectedLocation.name} ({getLocationTypeLabel(selectedLocation.type)})</span>
          <button
            type="button"
            onClick={() => {
              setSelectedLocation(null);
              setSearchTerm('');
              if (onLocationSelect) {
                onLocationSelect(null);
              }
            }}
            style={{
              background: 'none',
              border: 'none',
              color: '#7c3aed',
              cursor: 'pointer',
              fontSize: '0.875rem',
              textDecoration: 'underline'
            }}
          >
            Clear
          </button>
        </div>
      )}

      {/* Search Input Box */}
      <div ref={searchInputRef} style={{
        marginBottom: '0.75rem',
        position: 'relative'
      }}>
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder={placeholder}
          style={{
            width: '100%',
            padding: '0.75rem',
            fontSize: '0.875rem',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            outline: 'none',
            transition: 'border-color 0.2s',
          }}
          onFocus={() => {
            if (searchResults.length > 0) {
              setShowAutocomplete(true);
            }
          }}
        />

        {/* Autocomplete Dropdown */}
        {showAutocomplete && (searchResults.length > 0 || isSearching) && (
          <div style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            marginTop: '4px',
            backgroundColor: 'white',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            maxHeight: '300px',
            overflowY: 'auto',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            zIndex: 1000
          }}>
            {isSearching ? (
              <div style={{
                padding: '1rem',
                textAlign: 'center',
                color: '#6b7280',
                fontSize: '0.875rem'
              }}>
                Searching...
              </div>
            ) : (
              searchResults.map((result, index) => (
                <button
                  key={`${result.id}-${index}`}
                  type="button"
                  onClick={() => handleAutocompleteSelect(result)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: 'none',
                    borderBottom: index < searchResults.length - 1 ? '1px solid #e5e7eb' : 'none',
                    background: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'background-color 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f3f4f6';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <div style={{
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: '#111827',
                    marginBottom: '2px'
                  }}>
                    {result.name}
                  </div>
                  <div style={{
                    fontSize: '0.75rem',
                    color: '#6b7280'
                  }}>
                    {getLocationTypeLabel(result.type)}
                  </div>
                </button>
              ))
            )}
          </div>
        )}
      </div>

      {/* Divider */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        margin: '1rem 0',
        gap: '0.5rem'
      }}>
        <div style={{ flex: 1, height: '1px', background: '#e5e7eb' }} />
        <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>OR</span>
        <div style={{ flex: 1, height: '1px', background: '#e5e7eb' }} />
      </div>

      {/* Cascading Dropdowns */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {/* Province Dropdown */}
        <div>
          <label style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontSize: '0.875rem',
            fontWeight: '500',
            color: '#374151'
          }}>
            1. Select Province
          </label>
          <select
            value={selectedProvince?.id || ''}
            onChange={async (e) => {
              const provinceId = parseInt(e.target.value);
              const province = provinces.find(p => p.id === provinceId);
              setSelectedProvince(province || null);
              setSelectedDistrict(null);
              setSelectedMunicipality(null);
              setSelectedWard(null);

              // Fetch nested data for this province if not already loaded
              if (province && !province.districts) {
                await fetchProvinceData(provinceId);
              }
            }}
            disabled={isLoadingHierarchy}
            style={{
              width: '100%',
              padding: '0.75rem',
              fontSize: '0.875rem',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              outline: 'none',
              backgroundColor: isLoadingHierarchy ? '#f3f4f6' : 'white',
              cursor: isLoadingHierarchy ? 'wait' : 'pointer'
            }}
          >
            <option value="">{isLoadingHierarchy ? 'Loading...' : '-- Select Province --'}</option>
            {provinces.map((province) => (
              <option key={province.id} value={province.id}>
                {province.name}
              </option>
            ))}
          </select>
        </div>

        {/* District Dropdown */}
        {selectedProvince && selectedProvince.districts && (
          <div>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#374151'
            }}>
              2. Select District
            </label>
            <select
              value={selectedDistrict?.id || ''}
              onChange={(e) => {
                const district = selectedProvince.districts?.find(d => d.id === parseInt(e.target.value));
                setSelectedDistrict(district || null);
                setSelectedMunicipality(null);
                setSelectedWard(null);
              }}
              style={{
                width: '100%',
                padding: '0.75rem',
                fontSize: '0.875rem',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="">-- Select District --</option>
              {selectedProvince.districts.map((district) => (
                <option key={district.id} value={district.id}>
                  {district.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Municipality Dropdown */}
        {selectedDistrict && selectedDistrict.municipalities && (
          <div>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#374151'
            }}>
              3. Select Municipality
            </label>
            <select
              value={selectedMunicipality?.id || ''}
              onChange={(e) => {
                const municipality = selectedDistrict.municipalities?.find(m => m.id === parseInt(e.target.value));
                setSelectedMunicipality(municipality || null);
                setSelectedWard(null);
              }}
              style={{
                width: '100%',
                padding: '0.75rem',
                fontSize: '0.875rem',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="">-- Select Municipality --</option>
              {selectedDistrict.municipalities.map((municipality) => (
                <option key={municipality.id} value={municipality.id}>
                  {municipality.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Ward Dropdown */}
        {filterType === 'area' && selectedMunicipality && selectedMunicipality.wards && (
          <div>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#374151'
            }}>
              4. Select Ward
            </label>
            <select
              value={selectedWard?.ward_number || ''}
              onChange={(e) => {
                const ward = selectedMunicipality.wards?.find(w => w.ward_number === parseInt(e.target.value));
                setSelectedWard(ward || null);
              }}
              style={{
                width: '100%',
                padding: '0.75rem',
                fontSize: '0.875rem',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="">-- Select Ward --</option>
              {selectedMunicipality.wards.map((ward) => (
                <option key={`ward-${ward.ward_number}`} value={ward.ward_number}>
                  Ward {ward.ward_number}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Area Dropdown */}
        {filterType === 'area' && selectedWard && selectedWard.areas && (
          <div>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#374151'
            }}>
              5. Select Area
            </label>
            <select
              value={selectedLocation?.id || ''}
              onChange={(e) => {
                const area = selectedWard.areas?.find(a => a.id === parseInt(e.target.value));
                if (area) {
                  handleLocationSelect(area);
                }
              }}
              style={{
                width: '100%',
                padding: '0.75rem',
                fontSize: '0.875rem',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="">-- Select Area --</option>
              {selectedWard.areas.map((area) => (
                <option key={area.id} value={area.id}>
                  {area.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <small style={{
        display: 'block',
        marginTop: '0.75rem',
        color: '#6b7280',
        fontSize: '0.75rem'
      }}>
        {filterType === 'area'
          ? 'Select a specific area/place (e.g., Thamel, Naxal) for your ad'
          : 'Select any location level to filter results'}
      </small>
    </div>
  );
}
