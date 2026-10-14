import React, { useState, useEffect } from 'react';
import { Search, Filter, Grid, List, Sprout } from 'lucide-react'; // Added Sprout import
import { supabase } from '../services/supabase';
import PlantModal from '../components/PlantModal';
import PlantCard from '../components/PlantCard';
import LoadingScreen from '../components/LoadingScreen';

// ---------------------------------------------------------------------------
// Supabase Storage image helpers
// ---------------------------------------------------------------------------

// Name of the Supabase Storage bucket that holds the plant images.
// Change 'plant-images' to your bucket's exact name (case-sensitive),
// or set REACT_APP_PLANT_IMAGES_BUCKET in your .env file.
const PLANT_IMAGES_BUCKET = process.env.REACT_APP_PLANT_IMAGES_BUCKET || 'plant-images';

// Columns that may hold the image value (the first non-empty one is used)
const IMAGE_FIELDS = ['image_url', 'image', 'image_path', 'photo_url', 'thumbnail_url'];

// How long signed URLs stay valid (only matters for private buckets)
const SIGNED_URL_EXPIRY_SECONDS = 60 * 60 * 24; // 24 hours

const getImageField = (plant) =>
  IMAGE_FIELDS.find((field) => typeof plant[field] === 'string' && plant[field].trim() !== '');

// Work out which bucket + file path a stored image value points to.
// Returns null for normal web URLs (e.g. Unsplash) so they are used as-is.
const parseStorageLocation = (value) => {
  const raw = value.trim();

  // A full Supabase Storage URL (public, signed or authenticated)
  const match = raw.match(/\/storage\/v1\/object\/(?:public|sign|authenticated)\/([^/]+)\/([^?#]+)/);
  if (match) {
    return { bucket: match[1], path: decodeURIComponent(match[2]) };
  }

  // Any other URL is left untouched
  if (/^(https?:|data:|blob:)/i.test(raw)) return null;

  // A plain file path, e.g. "tulsi.jpg", "/tulsi.jpg" or "plant-images/tulsi.jpg"
  let path = raw.replace(/^\/+/, '');
  if (path.startsWith(`${PLANT_IMAGES_BUCKET}/`)) {
    path = path.slice(PLANT_IMAGES_BUCKET.length + 1);
  }
  return { bucket: PLANT_IMAGES_BUCKET, path };
};

// Convert every plant's stored image value into a URL the browser can load.
// Tries a signed URL first (works for private AND public buckets), then
// falls back to the public URL. Nothing else on the plant is changed.
const resolvePlantImages = async (plantList) => {
  const jobs = plantList.map((plant) => {
    const field = getImageField(plant);
    const location = field ? parseStorageLocation(plant[field]) : null;
    return { plant, field, location, url: null };
  });

  // Group by bucket so each bucket needs only one request
  const jobsByBucket = {};
  jobs.forEach((job) => {
    if (!job.location) return;
    if (!jobsByBucket[job.location.bucket]) jobsByBucket[job.location.bucket] = [];
    jobsByBucket[job.location.bucket].push(job);
  });

  await Promise.all(
    Object.entries(jobsByBucket).map(async ([bucket, bucketJobs]) => {
      const storage = supabase.storage.from(bucket);
      const paths = [...new Set(bucketJobs.map((job) => job.location.path))];
      const signedUrls = {};

      try {
        const { data, error } = await storage.createSignedUrls(paths, SIGNED_URL_EXPIRY_SECONDS);
        if (error) throw error;
        (data || []).forEach((item, index) => {
          if (item && item.signedUrl && !item.error) {
            signedUrls[paths[index]] = item.signedUrl;
          }
        });
      } catch (err) {
        console.warn(`Could not create signed URLs for bucket "${bucket}", using public URLs instead:`, err);
      }

      bucketJobs.forEach((job) => {
        job.url =
          signedUrls[job.location.path] ||
          storage.getPublicUrl(job.location.path).data.publicUrl;
      });
    })
  );

  return jobs.map(({ plant, field, url }) => {
    if (!field) return plant;
    const finalUrl = url || plant[field].trim();
    // Write the working URL back into the original column, and also into
    // image_url so components reading either name get the right link.
    return { ...plant, [field]: finalUrl, image_url: finalUrl };
  });
};

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

      // Turn stored image paths into working Supabase Storage URLs.
      // If anything goes wrong here, still show the plants with their original data.
      let plantsWithImages = data || [];
      try {
        plantsWithImages = await resolvePlantImages(plantsWithImages);
      } catch (imageError) {
        console.error('Error resolving plant image URLs:', imageError);
      }

      setPlants(plantsWithImages);
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
