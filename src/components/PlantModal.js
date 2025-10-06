import React, { useState } from 'react';
import { X, Thermometer, Sprout, Droplets, Sun, Ruler, Clock, Shield, Leaf, Maximize2 } from 'lucide-react';

const PlantModal = ({ plant, onClose }) => {
  const [modelLoading, setModelLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  if (!plant) return null;

  const getClimateColor = (resilience) => {
    switch (resilience) {
      case 'Resilient': return '#10b981';
      case 'Moderate': return '#f59e0b';
      case 'Sensitive': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'cultivation', label: 'Cultivation' },
    { id: 'medicinal', label: 'Medicinal Uses' },
    { id: 'environment', label: 'Environment' }
  ];

  return (
    <div className="modal-overlay plant-modal-overlay" onClick={onClose}>
      <div className="plant-modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="plant-modal-header">
          <div className="plant-title-section">
            <h1>{plant.common_name}</h1>
            <p className="botanical-name">{plant.botanical_name}</p>
          </div>
          <div className="plant-header-actions">
            <div className="plant-badges">
              <div 
                className="climate-badge"
                style={{ backgroundColor: getClimateColor(plant.climate_resilience) }}
              >
                <Thermometer size={16} />
                {plant.climate_resilience}
              </div>
              <div className="difficulty-badge">
                <Sprout size={16} />
                {plant.difficulty_level}
              </div>
            </div>
            <button className="modal-close-large" onClick={onClose}>
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Visual Section - Compact */}
        <div className="plant-visual-compact">
          {/* Image */}
          <div className="plant-image-compact">
            <img src={plant.image_url} alt={plant.common_name} />
          </div>
          
          {/* 3D Model */}
          {plant.model_3d_url && (
            <div className="plant-model-compact">
              <div className="model-section-header">
                <Maximize2 size={18} />
                <h3>3D Interactive Model</h3>
              </div>
              <div className="model-container-compact">
                {modelLoading && (
                  <div className="model-loading-compact">
                    <div className="loading-spinner"></div>
                    <p>Loading 3D model...</p>
                  </div>
                )}
                <iframe
                  title={`${plant.common_name} 3D Model`}
                  frameBorder="0"
                  allowFullScreen
                  mozAllowFullScreen="true"
                  webkitAllowFullScreen="true"
                  allow="autoplay; fullscreen; xr-spatial-tracking"
                  xr-spatial-tracking
                  execution-while-out-of-viewport
                  execution-while-not-rendered
                  web-share
                  src={plant.model_3d_url}
                  width="100%"
                  height="350"
                  onLoad={() => setModelLoading(false)}
                  style={{ display: modelLoading ? 'none' : 'block' }}
                ></iframe>
              </div>
              <div className="model-controls-info-compact">
                <p>Controls: Rotate (Click + Drag) • Zoom (Scroll) </p>
              </div>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="plant-content-section">
          {/* Navigation Tabs */}
          <div className="plant-modal-tabs">
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="tab-content">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="tab-panel">
                <section className="detail-section">
                  <h3>Description</h3>
                  <p>{plant.description}</p>
                </section>

                <div className="quick-stats-grid">
                  <div className="quick-stat-card">
                    <Sun size={20} />
                    <div>
                      <label>Sunlight</label>
                      <span>{plant.sunlight_requirements}</span>
                    </div>
                  </div>
                  <div className="quick-stat-card">
                    <Droplets size={20} />
                    <div>
                      <label>Watering</label>
                      <span>{plant.watering_needs}</span>
                    </div>
                  </div>
                  <div className="quick-stat-card">
                    <Ruler size={20} />
                    <div>
                      <label>Max Height</label>
                      <span>{plant.max_height}m</span>
                    </div>
                  </div>
                  <div className="quick-stat-card">
                    <Clock size={20} />
                    <div>
                      <label>Growth Rate</label>
                      <span>{plant.growth_rate}</span>
                    </div>
                  </div>
                </div>

                <section className="detail-section">
                  <h3>Health Benefits</h3>
                  <div className="benefits-grid">
                    {plant.health_benefits.map((benefit, index) => (
                      <div key={index} className="benefit-card">
                        <Shield size={18} />
                        <span>{benefit}</span>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            )}

            {/* Cultivation Tab */}
            {activeTab === 'cultivation' && (
              <div className="tab-panel">
                <section className="detail-section">
                  <h3>Cultivation Guide</h3>
                  <div className="cultivation-grid">
                    <div className="cultivation-card">
                      <strong>Soil Type</strong>
                      <span>{plant.soil_type}</span>
                    </div>
                    <div className="cultivation-card">
                      <strong>Watering Needs</strong>
                      <span>{plant.watering_needs}</span>
                    </div>
                    <div className="cultivation-card">
                      <strong>Sunlight</strong>
                      <span>{plant.sunlight_requirements}</span>
                    </div>
                    <div className="cultivation-card">
                      <strong>Suitable Regions</strong>
                      <span>{plant.region.join(', ')}</span>
                    </div>
                  </div>
                </section>

                <section className="detail-section">
                  <h3>Growing Method</h3>
                  <p>{plant.cultivation_method}</p>
                </section>

                {plant.care_tips && plant.care_tips.length > 0 && (
                  <section className="detail-section">
                    <h3>Care Tips</h3>
                    <div className="tips-grid">
                      {plant.care_tips.map((tip, index) => (
                        <div key={index} className="tip-card">
                          <span>{tip}</span>
                        </div>
                      ))}
                    </div>
                  </section>
                )}
              </div>
            )}

            {/* Medicinal Uses Tab */}
            {activeTab === 'medicinal' && (
              <div className="tab-panel">
                <section className="detail-section">
                  <h3>Medicinal Uses</h3>
                  <div className="uses-grid">
                    {plant.medicinal_uses.map((use, index) => (
                      <div key={index} className="use-card">
                        <Leaf size={18} />
                        <span>{use}</span>
                      </div>
                    ))}
                  </div>
                </section>

                {plant.precautions && plant.precautions.length > 0 && (
                  <section className="detail-section precautions">
                    <h3>Precautions</h3>
                    <div className="precautions-grid">
                      {plant.precautions.map((precaution, index) => (
                        <div key={index} className="precaution-card">
                          <span>{precaution}</span>
                        </div>
                      ))}
                    </div>
                  </section>
                )}
              </div>
            )}

            {/* Environment Tab */}
            {activeTab === 'environment' && (
              <div className="tab-panel">
                <section className="detail-section">
                  <h3>Environmental Impact</h3>
                  <div className="environment-grid">
                    <div className="env-card">
                      <strong>CO₂ Absorption</strong>
                      <span>{plant.co2_absorption_rate} kg/year</span>
                    </div>
                    <div className="env-card">
                      <strong>Climate Zones</strong>
                      <span>{plant.climate_zones.join(', ')}</span>
                    </div>
                    <div className="env-card">
                      <strong>Climate Resilience</strong>
                      <span style={{ color: getClimateColor(plant.climate_resilience) }}>
                        {plant.climate_resilience}
                      </span>
                    </div>
                  </div>
                </section>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlantModal;