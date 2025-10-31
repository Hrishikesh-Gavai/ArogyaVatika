import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { supabase } from '../services/supabase';

const CATEGORIES = [
  'Culinary', 'Medicinal', 'Ornamental', 'Indoor Plant',
  'Outdoor Plant', 'Perennial', 'Annual', 'Edible'
];

const InsertPlantModal = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    botanical_name: '',
    common_name: '',
    family: '',
    description: '',
    medicinal_uses: '',
    health_benefits: '',
    cultivation_method: '',
    watering_needs: '',
    sunlight_requirements: '',
    soil_type: '',
    climate_zones: '',
    region: '',
    difficulty_level: 'Intermediate',
    climate_resilience: 'Moderate',
    growth_rate: 'Slow',
    max_height: '',
    co2_absorption_rate: '',
    care_tips: '',
    precautions: '',
    harvesting_guide: '',
    image_url: '',
    model_3d_url: '',
    is_featured: false,
  });

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
    setError('');
  };

  const handleCategoryToggle = (category) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validate required fields
      if (!formData.common_name.trim() || !formData.botanical_name.trim()) {
        setError('Common name and botanical name are required');
        setLoading(false);
        return;
      }

      // ✅ Check if plant with same common name already exists
      const { data: existingCommon } = await supabase
        .from('plants')
        .select('id')
        .eq('common_name', formData.common_name.trim())
        .single();

      if (existingCommon) {
        setError(`⚠️ A plant with common name "${formData.common_name}" already exists!`);
        setLoading(false);
        return;
      }

      // ✅ Check if plant with same botanical name already exists
      const { data: existingBotanical } = await supabase
        .from('plants')
        .select('id')
        .eq('botanical_name', formData.botanical_name.trim())
        .single();

      if (existingBotanical) {
        setError(`⚠️ A plant with botanical name "${formData.botanical_name}" already exists!`);
        setLoading(false);
        return;
      }

      // Parse array fields
      const plantData = {
        ...formData,
        medicinal_uses: formData.medicinal_uses.split(',').map(u => u.trim()).filter(u => u),
        health_benefits: formData.health_benefits.split(',').map(b => b.trim()).filter(b => b),
        region: formData.region.split(',').map(r => r.trim()).filter(r => r),
        climate_zones: formData.climate_zones.split(',').map(z => z.trim()).filter(z => z),
        care_tips: formData.care_tips.split(',').map(t => t.trim()).filter(t => t),
        precautions: formData.precautions.split(',').map(p => p.trim()).filter(p => p),
        max_height: parseFloat(formData.max_height) || 1,
        co2_absorption_rate: parseFloat(formData.co2_absorption_rate) || 0,
      };

      const { error: insertError } = await supabase
        .from('plants')
        .insert([plantData]);

      if (insertError) throw insertError;

      onSuccess();
    } catch (err) {
      console.error('Error inserting plant:', err);
      setError(err.message || 'Failed to insert plant');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="insert-modal-overlay" onClick={onClose}>
      <div className="insert-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="insert-modal-header">
          <h2>Add New Plant</h2>
          <button className="modal-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        {error && (
          <div className="insert-error">
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="insert-form">
          {/* Basic Info */}
          <div className="form-section">
            <h3>Basic Information</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Common Name *</label>
                <input
                  type="text"
                  name="common_name"
                  value={formData.common_name}
                  onChange={handleChange}
                  placeholder="e.g., Aloe Vera"
                  required
                />
              </div>
              <div className="form-group">
                <label>Botanical Name *</label>
                <input
                  type="text"
                  name="botanical_name"
                  value={formData.botanical_name}
                  onChange={handleChange}
                  placeholder="e.g., Aloe barbadensis"
                  required
                />
              </div>
              <div className="form-group">
                <label>Family</label>
                <input
                  type="text"
                  name="family"
                  value={formData.family}
                  onChange={handleChange}
                  placeholder="e.g., Asphodelaceae"
                />
              </div>
              <div className="form-group">
                <label>Difficulty Level</label>
                <select name="difficulty_level" value={formData.difficulty_level} onChange={handleChange}>
                  <option>Easy</option>
                  <option>Intermediate</option>
                  <option>Difficult</option>
                </select>
              </div>
            </div>
            <div className="form-group full-width">
              <label>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Detailed description of the plant"
                rows="3"
              />
            </div>
          </div>

          {/* Health & Uses */}
          <div className="form-section">
            <h3>Health & Uses</h3>
            <div className="form-group full-width">
              <label>Medicinal Uses (comma-separated)</label>
              <textarea
                name="medicinal_uses"
                value={formData.medicinal_uses}
                onChange={handleChange}
                placeholder="Wound healing, Digestive health, ..."
                rows="2"
              />
            </div>
            <div className="form-group full-width">
              <label>Health Benefits (comma-separated)</label>
              <textarea
                name="health_benefits"
                value={formData.health_benefits}
                onChange={handleChange}
                placeholder="Improves skin, Boosts immunity, ..."
                rows="2"
              />
            </div>
          </div>

          {/* Cultivation */}
          <div className="form-section">
            <h3>Cultivation</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Sunlight Requirements</label>
                <select name="sunlight_requirements" value={formData.sunlight_requirements} onChange={handleChange}>
                  <option value="">Select...</option>
                  <option>Full Sun</option>
                  <option>Partial Shade</option>
                  <option>Shade</option>
                </select>
              </div>
              <div className="form-group">
                <label>Watering Needs</label>
                <select name="watering_needs" value={formData.watering_needs} onChange={handleChange}>
                  <option value="">Select...</option>
                  <option>Low</option>
                  <option>Moderate</option>
                  <option>High</option>
                </select>
              </div>
              <div className="form-group">
                <label>Soil Type</label>
                <input
                  type="text"
                  name="soil_type"
                  value={formData.soil_type}
                  onChange={handleChange}
                  placeholder="e.g., Well-draining loam"
                />
              </div>
              <div className="form-group">
                <label>Growth Rate</label>
                <select name="growth_rate" value={formData.growth_rate} onChange={handleChange}>
                  <option>Slow</option>
                  <option>Moderate</option>
                  <option>Fast</option>
                </select>
              </div>
            </div>
            <div className="form-group full-width">
              <label>Cultivation Method</label>
              <textarea
                name="cultivation_method"
                value={formData.cultivation_method}
                onChange={handleChange}
                placeholder="Step-by-step cultivation guide"
                rows="3"
              />
            </div>
            <div className="form-group full-width">
              <label>Care Tips (comma-separated)</label>
              <textarea
                name="care_tips"
                value={formData.care_tips}
                onChange={handleChange}
                placeholder="Mist leaves regularly, Prune in spring, ..."
                rows="2"
              />
            </div>
          </div>

          {/* Environment */}
          <div className="form-section">
            <h3>Environment</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Climate Resilience</label>
                <select name="climate_resilience" value={formData.climate_resilience} onChange={handleChange}>
                  <option>Resilient</option>
                  <option>Moderate</option>
                  <option>Sensitive</option>
                </select>
              </div>
              <div className="form-group">
                <label>CO₂ Absorption (kg/year)</label>
                <input
                  type="number"
                  name="co2_absorption_rate"
                  value={formData.co2_absorption_rate}
                  onChange={handleChange}
                  step="0.1"
                  placeholder="0.5"
                />
              </div>
              <div className="form-group">
                <label>Max Height (m)</label>
                <input
                  type="number"
                  name="max_height"
                  value={formData.max_height}
                  onChange={handleChange}
                  step="0.1"
                  placeholder="1.5"
                />
              </div>
            </div>
            <div className="form-grid">
              <div className="form-group full-width">
                <label>Climate Zones (comma-separated)</label>
                <input
                  type="text"
                  name="climate_zones"
                  value={formData.climate_zones}
                  onChange={handleChange}
                  placeholder="Tropical, Subtropical, Temperate"
                />
              </div>
              <div className="form-group full-width">
                <label>Suitable Regions (comma-separated)</label>
                <input
                  type="text"
                  name="region"
                  value={formData.region}
                  onChange={handleChange}
                  placeholder="India, Africa, Americas"
                />
              </div>
            </div>
          </div>

          {/* Safety & Harvesting */}
          <div className="form-section">
            <h3>Safety & Harvesting</h3>
            <div className="form-group full-width">
              <label>Precautions (comma-separated)</label>
              <textarea
                name="precautions"
                value={formData.precautions}
                onChange={handleChange}
                placeholder="Not for internal use, Allergic reactions possible, ..."
                rows="2"
              />
            </div>
            <div className="form-group full-width">
              <label>Harvesting Guide</label>
              <textarea
                name="harvesting_guide"
                value={formData.harvesting_guide}
                onChange={handleChange}
                placeholder="When and how to harvest"
                rows="2"
              />
            </div>
          </div>

          {/* Media */}
          <div className="form-section">
            <h3>Media & Links</h3>
            <div className="form-group full-width">
              <label>Image URL</label>
              <input
                type="url"
                name="image_url"
                value={formData.image_url}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div className="form-group full-width">
              <label>3D Model URL</label>
              <input
                type="url"
                name="model_3d_url"
                value={formData.model_3d_url}
                onChange={handleChange}
                placeholder="https://example.com/model.gltf"
              />
            </div>
          </div>

          {/* Categories */}
          <div className="form-section">
            <h3>Categories</h3>
            <div className="categories-grid">
              {CATEGORIES.map(category => (
                <label key={category} className="category-checkbox">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category)}
                    onChange={() => handleCategoryToggle(category)}
                  />
                  <span>{category}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Featured */}
          <div className="form-section">
            <label className="featured-checkbox">
              <input
                type="checkbox"
                name="is_featured"
                checked={formData.is_featured}
                onChange={handleChange}
              />
              <span>Mark as Featured</span>
            </label>
          </div>

          {/* Submit */}
          <div className="insert-form-actions">
            <button type="button" className="btn-outline" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Adding...' : (
                <>
                  <Plus size={18} />
                  Add Plant
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InsertPlantModal;
