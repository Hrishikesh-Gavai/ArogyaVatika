import React, { useState, useEffect } from 'react';
import { Search, Filter, Grid, List, Sprout } from 'lucide-react'; // Added Sprout import
import { supabase } from '../services/supabase';
import PlantModal from '../components/PlantModal';
import PlantCard from '../components/PlantCard';
import LoadingScreen from '../components/LoadingScreen';

const VirtualGarden = () => {
  const [plants, setPlants] = useState([]);
  const [filteredPlants, setFilteredPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [filters, setFilters] = useState({
    climateResilience: '',
    difficulty: '',
    region: ''
  });

  useEffect(() => {
    fetchPlants();
  }, []);

  useEffect(() => {
    filterPlants();
  }, [plants, searchTerm, filters]);

  const fetchPlants = async () => {
    try {
      // Simulate loading for better UX
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const { data, error } = await supabase
        .from('plants')
        .select('*')
        .order('is_featured', { ascending: false })
        .order('common_name');

      if (error) throw error;
      setPlants(data || []);
    } catch (error) {
      console.error('Error fetching plants:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterPlants = () => {
    let filtered = plants;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(plant =>
        plant.common_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plant.botanical_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (plant.medicinal_uses && plant.medicinal_uses.some(use => 
          use.toLowerCase().includes(searchTerm.toLowerCase())
        ))
      );
    }

    // Climate resilience filter
    if (filters.climateResilience) {
      filtered = filtered.filter(plant => 
        plant.climate_resilience === filters.climateResilience
      );
    }

    // Difficulty filter
    if (filters.difficulty) {
      filtered = filtered.filter(plant => 
        plant.difficulty_level === filters.difficulty
      );
    }

    // Region filter
    if (filters.region) {
      filtered = filtered.filter(plant => 
        plant.region && plant.region.includes(filters.region)
      );
    }

    setFilteredPlants(filtered);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      climateResilience: '',
      difficulty: '',
      region: ''
    });
    setSearchTerm('');
  };

  // Show full-screen loading for initial load
  if (loading) {
    return <LoadingScreen message="Loading our herbal garden collection..." />;
  }

  return (
    <div className="virtual-garden">
      <div className="container">
        {/* Header */}
        <div className="page-header">
          <h1>Virtual Herbal Garden</h1>
          <p>Explore our collection of medicinal plants with detailed information and interactive 3D models</p>
        </div>

        {/* Controls */}
        <div className="garden-controls">
          <div className="search-box">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search plants by name, uses, or benefits..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="controls-right">
            <div className="view-toggle">
              <button
                className={viewMode === 'grid' ? 'active' : ''}
                onClick={() => setViewMode('grid')}
              >
                <Grid size={20} />
              </button>
              <button
                className={viewMode === 'list' ? 'active' : ''}
                onClick={() => setViewMode('list')}
              >
                <List size={20} />
              </button>
            </div>

            <div className="filter-dropdown">
              <Filter size={20} />
              <select
                value={filters.climateResilience}
                onChange={(e) => handleFilterChange('climateResilience', e.target.value)}
              >
                <option value="">All Climate Types</option>
                <option value="Resilient">Climate Resilient</option>
                <option value="Moderate">Moderate</option>
                <option value="Sensitive">Climate Sensitive</option>
              </select>
            </div>

            <div className="filter-dropdown">
              <select
                value={filters.difficulty}
                onChange={(e) => handleFilterChange('difficulty', e.target.value)}
              >
                <option value="">All Difficulty Levels</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Expert">Expert</option>
              </select>
            </div>

            <button className="btn btn-outline" onClick={clearFilters}>
              Clear Filters
            </button>
          </div>
        </div>

        {/* Results Info */}
        <div className="results-info">
          <p>Showing {filteredPlants.length} of {plants.length} plants</p>
        </div>

        {/* Plants Grid/List */}
        <div className={`plants-container ${viewMode}`}>
          {filteredPlants.map((plant) => (
            <PlantCard 
              key={plant.id}
              plant={plant} 
              onClick={setSelectedPlant}
              viewMode={viewMode}
            />
          ))}
        </div>

        {filteredPlants.length === 0 && (
          <div className="no-results">
            <Sprout size={64} />
            <h3>No plants found</h3>
            <p>Try adjusting your search or filters to discover more plants</p>
            <button className="btn btn-primary" onClick={clearFilters}>
              Clear All Filters
            </button>
          </div>
        )}
      </div>

      {/* Plant Modal */}
      {selectedPlant && (
        <PlantModal
          plant={selectedPlant}
          onClose={() => setSelectedPlant(null)}
        />
      )}
    </div>
  );
};

export default VirtualGarden;