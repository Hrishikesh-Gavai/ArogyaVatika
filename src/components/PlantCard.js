import React, { useState } from 'react';
import { ZoomIn, Thermometer, Sprout, Droplets, Sun, Leaf, Image } from 'lucide-react';

const PlantCard = ({ plant, onClick, viewMode = 'grid' }) => {
  const [imageError, setImageError] = useState(false);
  
  const getClimateColor = (resilience) => {
    switch (resilience) {
      case 'Resilient': return '#10b981';
      case 'Moderate': return '#f59e0b';
      case 'Sensitive': return '#ef4444';
      default: return '#0055ffff';
    }
  };

  const handleImageError = () => {
    setImageError(true);
  };

  // Fallback image component
  const ImagePlaceholder = () => (
    <div className="image-placeholder">
      <Image size={40} />
      <span>{plant.common_name}</span>
    </div>
  );

  if (viewMode === 'list') {
    return (
      <div className="plant-card list" onClick={() => onClick(plant)}>
        {plant.is_featured && (
          <div className="featured-badge">Featured</div>
        )}
        
        <div className="plant-image">
          {imageError || !plant.image_url ? (
            <ImagePlaceholder />
          ) : (
            <img 
              src={plant.image_url} 
              alt={plant.common_name}
              onError={handleImageError}
            />
          )}
          <div className="plant-overlay">
            <ZoomIn size={20} />
            <span>View Details</span>
          </div>
        </div>

        <div className="plant-info">
          <h3>{plant.common_name}</h3>
          <p className="botanical-name">{plant.botanical_name}</p>
          
          <div className="plant-tags">
            <span 
              className="climate-tag"
              style={{ backgroundColor: getClimateColor(plant.climate_resilience) }}
            >
              <Thermometer size={14} />
              {plant.climate_resilience}
            </span>
            <span className="difficulty-tag">
              <Sprout size={14} />
              {plant.difficulty_level}
            </span>
          </div>

          <div className="plant-stats">
            <div className="stat">
              <Sun size={14} />
              <span>{plant.sunlight_requirements}</span>
            </div>
            <div className="stat">
              <Droplets size={14} />
              <span>{plant.watering_needs}</span>
            </div>
          </div>

          <div className="plant-uses">
            {plant.medicinal_uses?.slice(0, 3).map((use, index) => (
              <span key={index} className="use-tag">{use}</span>
            ))}
            {plant.medicinal_uses?.length > 3 && (
              <span className="use-tag more">+{plant.medicinal_uses.length - 3} more</span>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Grid view
  return (
    <div className="plant-card grid" onClick={() => onClick(plant)}>
      {plant.is_featured && (
        <div className="featured-badge">Featured</div>
      )}
      
      <div className="plant-image">
        {imageError || !plant.image_url ? (
          <ImagePlaceholder />
        ) : (
          <img 
            src={plant.image_url} 
            alt={plant.common_name}
            onError={handleImageError}
          />
        )}
        <div className="plant-overlay">
          <ZoomIn size={24} />
          <span>View Details</span>
        </div>
      </div>

      <div className="plant-info">
        <h3>{plant.common_name}</h3>
        <p className="botanical-name">{plant.botanical_name}</p>
        
        <div className="plant-tags">
          <span 
            className="climate-tag"
            style={{ backgroundColor: getClimateColor(plant.climate_resilience) }}
          >
            <Thermometer size={14} />
            {plant.climate_resilience}
          </span>
          <span className="difficulty-tag">
            <Sprout size={14} />
            {plant.difficulty_level}
          </span>
        </div>

        <div className="plant-stats">
          <div className="stat">
            <Sun size={14} />
            <span>{plant.sunlight_requirements}</span>
          </div>
          <div className="stat">
            <Droplets size={14} />
            <span>{plant.watering_needs}</span>
          </div>
        </div>

        <div className="plant-uses">
          {plant.medicinal_uses?.slice(0, 3).map((use, index) => (
            <span key={index} className="use-tag">{use}</span>
          ))}
          {plant.medicinal_uses?.length > 3 && (
            <span className="use-tag more">+{plant.medicinal_uses.length - 3} more</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlantCard;