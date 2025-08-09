import React, { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import './FilterSidebar.css';

interface FilterOption {
  id: string;
  name: string;
  count?: number;
}

interface FilterSection {
  title: string;
  options: FilterOption[];
  type: 'checkbox' | 'radio';
}

interface FilterSidebarProps {
  filters: FilterSection[];
  selectedFilters: Record<string, string[]>;
  onFilterChange: (sectionTitle: string, optionId: string, isSelected: boolean) => void;
  priceRange: { min: number; max: number };
  selectedPriceRange: { min: number; max: number };
  onPriceRangeChange: (range: { min: number; max: number }) => void;
}

const minDistance = 1000; // Minimum distance between price range values

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  selectedFilters,
  onFilterChange,
  priceRange,
  selectedPriceRange,
  onPriceRangeChange,
}) => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(filters.map(f => f.title))
  );

  // Local state for input fields to allow free typing
  const [minInputValue, setMinInputValue] = useState(selectedPriceRange.min.toString());
  const [maxInputValue, setMaxInputValue] = useState(selectedPriceRange.max.toString());

  // Update local input values when selectedPriceRange changes (from slider)
  React.useEffect(() => {
    setMinInputValue(selectedPriceRange.min.toString());
    setMaxInputValue(selectedPriceRange.max.toString());
  }, [selectedPriceRange]);

  // Convert price range to array format for Material-UI slider
  const priceRangeArray = [selectedPriceRange.min, selectedPriceRange.max];
  
  // Debug logging for price range values
  console.log('🔍 FilterSidebar: Price range values:', {
    priceRange,
    selectedPriceRange,
    priceRangeArray,
    'Array length': priceRangeArray.length,
    'Values equal': priceRangeArray[0] === priceRangeArray[1]
  });

  const handlePriceSliderChange = (_event: Event, newValue: number[], activeThumb: number) => {
    console.log('🔍 FilterSidebar: Slider change event:', { newValue, activeThumb });
    
    if (!Array.isArray(newValue)) {
      console.log('🔍 FilterSidebar: newValue is not an array:', newValue);
      return;
    }

    if (newValue[1] - newValue[0] < minDistance) {
      console.log('🔍 FilterSidebar: Applying minimum distance constraint');
      if (activeThumb === 0) {
        const clamped = Math.min(newValue[0], priceRange.max - minDistance);
        onPriceRangeChange({ min: clamped, max: clamped + minDistance });
      } else {
        const clamped = Math.max(newValue[1], priceRange.min + minDistance);
        onPriceRangeChange({ min: clamped - minDistance, max: clamped });
      }
    } else {
      console.log('🔍 FilterSidebar: Setting new price range:', { min: newValue[0], max: newValue[1] });
      onPriceRangeChange({ min: newValue[0], max: newValue[1] });
    }
  };

  const toggleSection = (title: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(title)) {
      newExpanded.delete(title);
    } else {
      newExpanded.add(title);
    }
    setExpandedSections(newExpanded);
  };

  const formatPrice = (price: number) => {
    return `Rs. ${price.toLocaleString()}`;
  };

  // Handle input changes - allow completely free typing
  const handleMinInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMinInputValue(e.target.value);
  };

  const handleMaxInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMaxInputValue(e.target.value);
  };

  // Handle input blur (validate and apply changes)
  const handleMinInputBlur = () => {
    const value = Number(minInputValue);
    if (!isNaN(value) && value >= priceRange.min && value <= priceRange.max) {
      const clampedValue = Math.min(value, selectedPriceRange.max - minDistance);
      const finalValue = Math.max(clampedValue, priceRange.min);
      onPriceRangeChange({ min: finalValue, max: selectedPriceRange.max });
    } else {
      // Reset to current value if invalid
      setMinInputValue(selectedPriceRange.min.toString());
    }
  };

  const handleMaxInputBlur = () => {
    const value = Number(maxInputValue);
    if (!isNaN(value) && value >= priceRange.min && value <= priceRange.max) {
      const clampedValue = Math.max(value, selectedPriceRange.min + minDistance);
      const finalValue = Math.min(clampedValue, priceRange.max);
      onPriceRangeChange({ min: selectedPriceRange.min, max: finalValue });
    } else {
      // Reset to current value if invalid
      setMaxInputValue(selectedPriceRange.max.toString());
    }
  };

  // Handle Enter key to apply changes immediately
  const handleKeyDown = (e: React.KeyboardEvent, type: 'min' | 'max') => {
    if (e.key === 'Enter') {
      if (type === 'min') {
        handleMinInputBlur();
      } else {
        handleMaxInputBlur();
      }
      (e.target as HTMLInputElement).blur();
    }
  };

  return (
    <div className="w-full max-w-sm text-gray-900 p-6 rounded-lg shadow-lg border border-gray-200" style={{ backgroundColor: 'white' }} id="filter-sidebar-container">
      <h2 className="text-xl font-bold mb-6 text-gray-900" id="filters-title">FILTERS</h2>
      
      {/* Product Brands */}
      {filters.map((section) => (
        <div key={section.title} className="mb-6" id={`filter-section-${section.title.toLowerCase().replace(/\s+/g, '-')}`}>
          <div 
            className="flex items-center justify-between cursor-pointer mb-4"
            onClick={() => toggleSection(section.title)}
            id={`filter-section-header-${section.title.toLowerCase().replace(/\s+/g, '-')}`}
          >
            <h3 className="text-lg font-semibold text-gray-900 uppercase tracking-wide">
              {section.title}
            </h3>
            {expandedSections.has(section.title) ? (
              <ChevronUpIcon className="w-5 h-5 text-gray-700" />
            ) : (
              <ChevronDownIcon className="w-5 h-5 text-gray-700" />
            )}
          </div>
          
          {expandedSections.has(section.title) && (
            <div className="space-y-3">
              {section.options.map((option) => (
                <label
                  key={option.id}
                  className="flex items-center space-x-3 cursor-pointer hover:bg-gray-100 p-2 rounded transition-colors"
                >
                  <input
                    type={section.type}
                    name={section.type === 'radio' ? section.title : undefined}
                    checked={selectedFilters[section.title]?.includes(option.id) || false}
                    onChange={(e) => onFilterChange(section.title, option.id, e.target.checked)}
                    className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                  />
                  <span className="text-gray-900 flex-1">{option.name}</span>
                  {option.count && (
                    <span className="text-gray-500 text-sm">({option.count})</span>
                  )}
                </label>
              ))}
            </div>
          )}
        </div>
      ))}

      {/* Price Range Filter */}
      <div className="mb-6">
        <div 
          className="flex items-center justify-between cursor-pointer mb-4"
          onClick={() => toggleSection('FILTER BY PRICE')}
        >
          <h3 className="text-lg font-semibold text-gray-900 uppercase tracking-wide">
            FILTER BY PRICE
          </h3>
          {expandedSections.has('FILTER BY PRICE') ? (
            <ChevronUpIcon className="w-5 h-5 text-gray-700" />
          ) : (
            <ChevronDownIcon className="w-5 h-5 text-gray-700" />
          )}
        </div>
        
        {expandedSections.has('FILTER BY PRICE') && (
          <div className="space-y-4">
            {/* Price Range Slider */}
            <div className="px-2">
              <div className="relative mb-6">
                <Box sx={{ width: '100%', px: 1 }}>
                  <Slider
                    getAriaLabel={() => 'Price range'}
                    value={priceRangeArray}
                    onChange={handlePriceSliderChange}
                    valueLabelDisplay="auto"
                    valueLabelFormat={(value) => `Rs. ${value.toLocaleString()}`}
                    min={priceRange.min}
                    max={priceRange.max}
                    step={1000}
                    disableSwap
                    id="price-range-slider"
                    data-testid="price-range-slider"
                    sx={{
                      color: '#151b25',
                      height: 8,
                      '& .MuiSlider-thumb': {
                        height: 20,
                        width: 20,
                        backgroundColor: '#151b25',
                        border: '2px solid white',
                        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.15)',
                        '&:hover': {
                          backgroundColor: '#0f1419',
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)',
                        },
                        '&:focus': {
                          boxShadow: '0 0 0 8px rgba(21, 27, 37, 0.16)',
                        },
                      },
                      '& .MuiSlider-track': {
                        backgroundColor: '#151b25',
                        height: 8,
                        border: 'none',
                      },
                      '& .MuiSlider-rail': {
                        backgroundColor: '#E5E7EB',
                        height: 8,
                      },
                      '& .MuiSlider-valueLabel': {
                        backgroundColor: '#151b25',
                      },
                    }}
                  />
                </Box>
                <div className="flex justify-between text-sm text-gray-600 mt-3">
                  <span className="font-medium">{formatPrice(selectedPriceRange.min)}</span>
                  <span className="font-medium">{formatPrice(selectedPriceRange.max)}</span>
                </div>
              </div>
            </div>
            
            {/* Price Input Fields */}
            <div className="flex space-x-2">
              <div className="flex-1">
                <input
                  type="number"
                  value={minInputValue}
                  onChange={handleMinInputChange}
                  onBlur={handleMinInputBlur}
                  onKeyDown={(e) => handleKeyDown(e, 'min')}
                  min={priceRange.min}
                  max={priceRange.max}
                  className="w-full px-3 py-2 bg-white text-gray-900 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Min"
                />
              </div>
              <div className="flex-1">
                <input
                  type="number"
                  value={maxInputValue}
                  onChange={handleMaxInputChange}
                  onBlur={handleMaxInputBlur}
                  onKeyDown={(e) => handleKeyDown(e, 'max')}
                  min={priceRange.min}
                  max={priceRange.max}
                  className="w-full px-3 py-2 bg-white text-gray-900 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Max"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterSidebar;
