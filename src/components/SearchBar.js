import React, { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';

const SearchBar = ({ 
  onSearch, 
  onFilterChange, 
  placeholder = "Search plants by name, uses, or benefits...",
  filters = {},
  showFilters = true 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilterPanel, setShowFilterPanel] = useState(false);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  const handleFilterToggle = () => {
    setShowFilterPanel(!showFilterPanel);
  };

  const clearSearch = () => {
    setSearchTerm('');
    onSearch('');
  };

  return (
    <div className="search-bar">
      <div className="search-input-container">
        <Search className="search-icon" size={20} />
        <input
          type="text"
          className="search-input"
          placeholder={placeholder}
          value={searchTerm}
          onChange={handleSearchChange}
        />
        {searchTerm && (
          <button className="clear-search" onClick={clearSearch}>
            <X size={16} />
          </button>
        )}
      </div>

      {showFilters && (
        <>
          <button 
            className={`filter-toggle ${showFilterPanel ? 'active' : ''}`}
            onClick={handleFilterToggle}
          >
            <Filter size={20} />
            Filters
          </button>

          {showFilterPanel && (
            <div className="filter-panel">
              <div className="filter-group">
                <label>Climate Resilience</label>
                <select
                  value={filters.climateResilience || ''}
                  onChange={(e) => onFilterChange('climateResilience', e.target.value)}
                >
                  <option value="">All</option>
                  <option value="Resilient">Resilient</option>
                  <option value="Moderate">Moderate</option>
                  <option value="Sensitive">Sensitive</option>
                </select>
              </div>

              <div className="filter-group">
                <label>Difficulty Level</label>
                <select
                  value={filters.difficulty || ''}
                  onChange={(e) => onFilterChange('difficulty', e.target.value)}
                >
                  <option value="">All</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Expert">Expert</option>
                </select>
              </div>

              <div className="filter-group">
                <label>Region</label>
                <select
                  value={filters.region || ''}
                  onChange={(e) => onFilterChange('region', e.target.value)}
                >
                  <option value="">All Regions</option>
                  <option value="India">India</option>
                  <option value="Tropical">Tropical</option>
                  <option value="Arid">Arid</option>
                  <option value="Global">Global</option>
                </select>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SearchBar;