import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { GoogleGenAI } from "@google/genai";
import { 
  Search, 
  ArrowLeft, 
  Sparkles,
  Loader,
  Leaf,
  Droplets,
  Sun,
  Sprout,
  Ruler,
  Cloud,
  Shield,
  AlertTriangle,
  Check,
  Thermometer,
  Zap,
  MapPin,
  ChevronRight
} from 'lucide-react';

const AIHerbSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [herbData, setHerbData] = useState(null);
  const [plantRecommendations, setPlantRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchMode, setSearchMode] = useState('single'); // 'single' or 'multiple'
  const searchInputRef = useRef(null);

  // Initialize Google GenAI
  const API_KEY = process.env.REACT_APP_GEMINI_API_KEY;
  const ai = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;

  // Debug useEffect
  useEffect(() => {
    console.log('Current search mode:', searchMode);
    console.log('Herb data:', herbData);
    console.log('Plant recommendations:', plantRecommendations);
  }, [searchMode, herbData, plantRecommendations]);

  // Create default herb data structure
  const createDefaultHerbData = (query) => ({
    botanical_name: 'Information not available',
    common_name: query || 'Plant',
    family: 'Information not available',
    description: `Comprehensive information about ${query || 'this plant'} will be displayed here once available.`,
    medicinal_uses: ['Medicinal uses information being gathered...'],
    health_benefits: ['Health benefits information being gathered...'],
    cultivation_method: 'Cultivation information being gathered...',
    watering_needs: 'Moderate',
    sunlight_requirements: 'Partial to full sun',
    soil_type: 'Well-drained soil',
    climate_zones: ['Tropical', 'Subtropical'],
    region: ['Various regions'],
    difficulty_level: 'Beginner',
    climate_resilience: 'Moderate',
    growth_rate: 'Medium',
    max_height: null,
    co2_absorption_rate: null,
    care_tips: ['Regular care needed'],
    precautions: ['Consult healthcare professional before use'],
    harvesting_guide: 'Harvest when mature'
  });

// Detect search mode based on query
const detectSearchMode = (query) => {
  const lowerQuery = query.toLowerCase().trim();
  
  // Specific plant names (exact matches or contains)
  const specificPlants = [
    'lemon', 'ginger', 'tulsi', 'ashwagandha', 'turmeric', 'aloe vera', 
    'neem', 'brahmi', 'mint', 'basil', 'rosemary', 'lavender', 'chamomile', 
    'peppermint', 'cinnamon', 'cardamom', 'clove', 'thyme', 'oregano',
    'sage', 'lemongrass', 'fennel', 'coriander', 'parsley', 'holy basil',
    'indian gooseberry', 'gotu kola', 'licorice', 'ginkgo', 'echinacea',
    'ginseng', 'valerian', 'st johns wort', 'milk thistle', 'dandelion'
  ];

  // Check if it's a specific plant name
  const isSpecificPlant = specificPlants.some(plant => 
    lowerQuery === plant || 
    lowerQuery.includes(` ${plant} `) ||
    lowerQuery.startsWith(`${plant} `) ||
    lowerQuery.endsWith(` ${plant}`)
  );

  // MUCH BROADER medicinal use detection
  const isMedicinalUse = 
    // Any query containing "plants for" or "herbs for"
    /(plants?|herbs?)\s+for\s+/.test(lowerQuery) ||
    // Any query containing "for" followed by a health condition (very broad)
    /for\s+(?!the|a|an|my|your|our|their)([a-z\s]+)$/i.test(lowerQuery) ||
    // Any query about medicinal/healing/therapeutic plants
    /(medicinal|healing|therapeutic|remedy|treatment|medicine|health benefits?|good for|beneficial for|help with|treat|relieve|reduce)/i.test(lowerQuery) ||
    // Any "what plants" or "which herbs" query
    /(what|which)\s+(plants?|herbs?)/i.test(lowerQuery) ||
    // Any "plants that" or "herbs that" query
    /(plants?|herbs?)\s+(that|which)/i.test(lowerQuery);

  console.log('Query:', query);
  console.log('Is specific plant:', isSpecificPlant);
  console.log('Is medicinal use:', isMedicinalUse);
  console.log('Mode:', isMedicinalUse && !isSpecificPlant ? 'multiple' : 'single');

  return isMedicinalUse && !isSpecificPlant ? 'multiple' : 'single';
};

  // Search for single plant
  const searchSinglePlant = async (query) => {
    try {
      const prompt = `
        Provide comprehensive information about the specific plant: "${query}"
        
        Return ONLY a valid JSON object with the following exact structure. No additional text, no markdown, just pure JSON:
        {
          "botanical_name": "scientific name",
          "common_name": "common name",
          "family": "plant family",
          "description": "detailed description",
          "medicinal_uses": ["use1", "use2", "use3"],
          "health_benefits": ["benefit1", "benefit2", "benefit3"],
          "cultivation_method": "how to grow",
          "watering_needs": "watering requirements",
          "sunlight_requirements": "sunlight needs",
          "soil_type": "preferred soil",
          "climate_zones": ["zone1", "zone2"],
          "region": ["region1", "region2"],
          "difficulty_level": "Beginner/Intermediate/Advanced",
          "climate_resilience": "Low/Moderate/High",
          "growth_rate": "Slow/Medium/Fast",
          "max_height": number,
          "co2_absorption_rate": number,
          "care_tips": ["tip1", "tip2", "tip3"],
          "precautions": ["precaution1", "precaution2"],
          "harvesting_guide": "when and how to harvest"
        }

        Important:
        - Provide specific information about "${query}"
        - If you don't know specific information, provide reasonable estimates
        - Ensure all array fields have at least one item
        - Make the information accurate and comprehensive
      `;

      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: prompt,
      });

      const text = response.text;
      console.log('Raw AI response for single plant:', text);
      
      let cleanedText = text.replace(/```json|```/g, '').trim();
      const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        cleanedText = jsonMatch[0];
      }
      
      const parsedData = JSON.parse(cleanedText);
      const validatedData = {
        ...createDefaultHerbData(query),
        ...parsedData
      };
      
      return validatedData;

    } catch (error) {
      console.error('Error searching single plant:', error);
      throw error;
    }
  };

  // Search for plant recommendations
  const searchPlantRecommendations = async (query) => {
    try {
      const prompt = `
        For the medicinal use query: "${query}", recommend 3-6 specific medicinal plants that are scientifically known to be effective.
        
        Return ONLY a valid JSON array with the following structure. No additional text, no markdown, just pure JSON:
        [
          {
            "common_name": "Plant Common Name 1",
            "botanical_name": "Scientific Name 1"
          },
          {
            "common_name": "Plant Common Name 2", 
            "botanical_name": "Scientific Name 2"
          },
          {
            "common_name": "Plant Common Name 3",
            "botanical_name": "Scientific Name 3"
          }
        ]

        Important:
        - Return exactly 3-6 plants, no more, no less
        - Focus on plants with scientific evidence for "${query}"
        - Include both common names and scientific names
        - Choose plants that are commonly available for cultivation
        - Do not include any other fields, only common_name and botanical_name
      `;

      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: prompt,
      });

      const text = response.text;
      console.log('Raw recommendations response:', text);
      
      let cleanedText = text.replace(/```json|```/g, '').trim();
      const jsonMatch = cleanedText.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        cleanedText = jsonMatch[0];
      }
      
      const parsedData = JSON.parse(cleanedText);
      const recommendations = Array.isArray(parsedData) ? parsedData.slice(0, 6) : [];
      
      console.log('Parsed recommendations:', recommendations);
      return recommendations;

    } catch (error) {
      console.error('Error searching plant recommendations:', error);
      throw new Error('Failed to get plant recommendations. Please try again.');
    }
  };

  // Main search function
  const searchHerbs = async (query) => {
    if (!query.trim()) return;

    setLoading(true);
    setHerbData(null);
    setPlantRecommendations([]);
    setError(null);

    try {
      if (!ai) {
        throw new Error('AI service not available. Please check your API key.');
      }

      const mode = detectSearchMode(query);
      setSearchMode(mode);
      console.log('Final search mode:', mode);

      if (mode === 'single') {
        // Single plant search
        console.log('Searching for single plant:', query);
        const plantData = await searchSinglePlant(query);
        setHerbData(plantData);
      } else {
        // Multiple plant recommendations
        console.log('Searching for plant recommendations:', query);
        const recommendations = await searchPlantRecommendations(query);
        console.log('Final recommendations:', recommendations);
        
        if (!recommendations || recommendations.length === 0) {
          throw new Error('No specific plant recommendations found. Try searching for a specific plant name.');
        }
        
        setPlantRecommendations(recommendations);
      }

    } catch (error) {
      console.error('Error searching herbs:', error);
      setError(error.message || 'Failed to fetch plant information. Please try again with a different query.');
      
      // Set fallback data for single plant mode
      if (searchMode === 'single') {
        setHerbData(createDefaultHerbData(query));
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle clicking on a recommended plant
  const handlePlantSelect = async (plantName) => {
    console.log('Plant selected:', plantName);
    setSearchQuery(plantName);
    setPlantRecommendations([]);
    await searchHerbs(plantName);
  };

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Search submitted:', searchQuery);
    searchHerbs(searchQuery);
  };

  // Reset search
  const resetSearch = () => {
    setSearchQuery('');
    setHerbData(null);
    setPlantRecommendations([]);
    setError(null);
    setSearchMode('single');
  };

  // Safe array access helper
  const safeArray = (array) => {
    return Array.isArray(array) && array.length > 0 ? array : ['Information not available'];
  };

  // Safe string access helper
  const safeString = (str) => {
    return str && str !== 'Information not available' ? str : 'Not specified';
  };

  // Plant Recommendation Component - Simplified
  const PlantRecommendations = ({ recommendations, onPlantSelect }) => {
    if (!recommendations || recommendations.length === 0) return null;

    return (
      <div className="recommendations-container">
        <div className="recommendations-header">
          <h2>Recommended Plants</h2>
          <p>Found {recommendations.length} plants that match your search. Click on any plant to see detailed information.</p>
        </div>
        
        <div className="recommendations-grid">
          {recommendations.map((plant, index) => (
            <div 
              key={index} 
              className="recommendation-card"
              onClick={() => onPlantSelect(plant.common_name)}
            >
              <div className="recommendation-content">
                <div className="plant-main">
                  <h3>{safeString(plant.common_name)}</h3>
                  <p className="botanical-name">{safeString(plant.botanical_name)}</p>
                </div>
                
                <div className="view-details">
                  <span>View Details</span>
                  <ChevronRight size={16} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Herb Information Display Component
  const HerbInfoDisplay = ({ data }) => {
    if (!data) return null;

    return (
      <div className="herb-info-container">
        <div className="herb-info-header">
          <h2>{safeString(data.common_name)}</h2>
          <p className="botanical-name">{safeString(data.botanical_name)}</p>
          <p className="plant-family">Family: {safeString(data.family)}</p>
        </div>

        <div className="herb-info-grid">
          {/* Basic Information */}
          <div className="info-section">
            <h3>Description</h3>
            <p>{safeString(data.description)}</p>
          </div>

          {/* Medicinal Information */}
          <div className="info-section">
            <h3>Medicinal Uses</h3>
            <div className="tags-list">
              {safeArray(data.medicinal_uses).map((use, index) => (
                <span key={index} className="info-tag">{use}</span>
              ))}
            </div>
          </div>

          <div className="info-section">
            <h3>Health Benefits</h3>
            <div className="tags-list">
              {safeArray(data.health_benefits).map((benefit, index) => (
                <span key={index} className="info-tag benefit">{benefit}</span>
              ))}
            </div>
          </div>

          {/* Growing Conditions */}
          <div className="info-section">
            <h3>Growing Conditions</h3>
            <div className="conditions-grid">
              <div className="condition-item">
                <Droplets size={18} />
                <div>
                  <strong>Watering:</strong> {safeString(data.watering_needs)}
                </div>
              </div>
              <div className="condition-item">
                <Sun size={18} />
                <div>
                  <strong>Sunlight:</strong> {safeString(data.sunlight_requirements)}
                </div>
              </div>
              <div className="condition-item">
                <Sprout size={18} />
                <div>
                  <strong>Soil Type:</strong> {safeString(data.soil_type)}
                </div>
              </div>
              <div className="condition-item">
                <Thermometer size={18} />
                <div>
                  <strong>Climate Zones:</strong> {safeArray(data.climate_zones).join(', ')}
                </div>
              </div>
            </div>
          </div>

          {/* Plant Characteristics */}
          <div className="info-section">
            <h3>Plant Characteristics</h3>
            <div className="characteristics-grid">
              <div className="characteristic">
                <Zap size={18} />
                <div>
                  <label>Growth Rate</label>
                  <span>{safeString(data.growth_rate)}</span>
                </div>
              </div>
              <div className="characteristic">
                <Ruler size={18} />
                <div>
                  <label>Max Height</label>
                  <span>{data.max_height ? `${data.max_height}m` : 'Not specified'}</span>
                </div>
              </div>
              <div className="characteristic">
                <Cloud size={18} />
                <div>
                  <label>CO2 Absorption</label>
                  <span>{data.co2_absorption_rate ? `${data.co2_absorption_rate} kg/year` : 'Not specified'}</span>
                </div>
              </div>
              <div className="characteristic">
                <Shield size={18} />
                <div>
                  <label>Climate Resilience</label>
                  <span>{safeString(data.climate_resilience)}</span>
                </div>
              </div>
              <div className="characteristic">
                <Sprout size={18} />
                <div>
                  <label>Difficulty Level</label>
                  <span>{safeString(data.difficulty_level)}</span>
                </div>
              </div>
              <div className="characteristic">
                <MapPin size={18} />
                <div>
                  <label>Suitable Regions</label>
                  <span>{safeArray(data.region).join(', ')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Cultivation Guide */}
          <div className="info-section">
            <h3>Cultivation Method</h3>
            <p>{safeString(data.cultivation_method)}</p>
          </div>

          {/* Care Tips */}
          <div className="info-section">
            <h3>Care Tips</h3>
            <ul className="tips-list">
              {safeArray(data.care_tips).map((tip, index) => (
                <li key={index}>
                  <Check size={16} />
                  {tip}
                </li>
              ))}
            </ul>
          </div>

          {/* Precautions */}
          <div className="info-section">
            <h3>Precautions</h3>
            <ul className="precautions-list">
              {safeArray(data.precautions).map((precaution, index) => (
                <li key={index}>
                  <AlertTriangle size={16} />
                  {precaution}
                </li>
              ))}
            </ul>
          </div>

          {/* Harvesting Guide */}
          {data.harvesting_guide && data.harvesting_guide !== 'Harvest when mature' && (
            <div className="info-section">
              <h3>Harvesting Guide</h3>
              <p>{safeString(data.harvesting_guide)}</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="virtual-garden">
      <div className="container">
        <div className="page-header">
          <Link to="/" className="btn btn-secondary" style={{marginBottom: '2rem'}}>
            <ArrowLeft size={20} />
            Back to Home
          </Link>
          <h1>AI Herb Search</h1>
          <p>Get comprehensive botanical and medicinal information about any plant</p>
        </div>

        {/* Search Section */}
        <div className="search-section">
          <form onSubmit={handleSearch} className="search-container">
            <div className="search-box ai-search-box">
              <Search size={20} />
              <input 
                ref={searchInputRef}
                type="text" 
                placeholder="Enter plant name or use case: 'Tulsi', 'plants for headache', 'medicinal herbs for stress'..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                disabled={loading}
              />
              {loading && <Loader size={20} className="spinning" />}
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              <Sparkles size={20} />
              {loading ? 'Searching...' : 'AI Search'}
            </button>
            {(herbData || plantRecommendations.length > 0) && (
              <button type="button" className="btn btn-secondary" onClick={resetSearch}>
                New Search
              </button>
            )}
          </form>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>AI is gathering comprehensive plant information...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="error-container">
            <AlertTriangle size={48} />
            <h3>Search Issue</h3>
            <p>{error}</p>
            <button className="btn btn-primary" onClick={() => setError(null)}>
              Try Again
            </button>
          </div>
        )}

        {/* Plant Recommendations */}
        {plantRecommendations.length > 0 && !loading && (
          <PlantRecommendations 
            recommendations={plantRecommendations} 
            onPlantSelect={handlePlantSelect}
          />
        )}

        {/* Single Plant Results */}
        {herbData && !loading && plantRecommendations.length === 0 && (
          <HerbInfoDisplay data={herbData} />
        )}

        {/* Welcome State */}
        {!herbData && !loading && !error && plantRecommendations.length === 0 && (
          <div className="welcome-section">
            <div className="welcome-content">
              <Leaf size={64} />
              <h3>Discover Plant Knowledge</h3>
              <p>Search for any plant to get detailed botanical, medicinal, and cultivation information</p>
              <div className="search-examples">
                <h4>Try searching for:</h4>
                <div className="example-tags">
                  <span className="example-tag" onClick={() => setSearchQuery('Tulsi')}>Tulsi</span>
                  <span className="example-tag" onClick={() => setSearchQuery('plants for headache')}>Headache relief plants</span>
                  <span className="example-tag" onClick={() => setSearchQuery('medicinal herbs for stress')}>Stress relief herbs</span>
                  <span className="example-tag" onClick={() => setSearchQuery('Aloe Vera')}>Aloe Vera</span>
                  <span className="example-tag" onClick={() => setSearchQuery('plants for digestion')}>Digestive plants</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIHerbSearch;