import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { GoogleGenAI } from "@google/genai";
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  BarChart3, 
  ArrowLeft, 
  Map, 
  Cpu, 
  MapPin, 
  Home, 
  Building, 
  Square,
  Plus,
  Check,
  Sparkles,
  Sun,
  Droplets,
  Thermometer,
  Sprout,
  Clock,
  Users,
  Zap,
  Cloud,
  Lightbulb,
  Target,
  Navigation
} from 'lucide-react';

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// City coordinates for major Indian cities
const cityCoordinates = {
  Mumbai: [19.0760, 72.8777],
  Delhi: [28.7041, 77.1025],
  Bangalore: [12.9716, 77.5946],
  Hyderabad: [17.3850, 78.4867],
  Ahmedabad: [23.0225, 72.5714],
  Chennai: [13.0827, 80.2707],
  Kolkata: [22.5726, 88.3639],
  Surat: [21.1702, 72.8311],
  Pune: [18.5204, 73.8567],
  Jaipur: [26.9124, 75.7873],
  Lucknow: [26.8467, 80.9462],
  Kanpur: [26.4499, 80.3319],
  Nagpur: [21.1458, 79.0882],
  Indore: [22.7196, 75.8577],
  Thane: [19.2183, 72.9781],
  Bhopal: [23.2599, 77.4126],
  Visakhapatnam: [17.6868, 83.2185],
  "Pimpri-Chinchwad": [18.6279, 73.8004],
  Patna: [25.5941, 85.1376],
  Vadodara: [22.3072, 73.1812],
  Ghaziabad: [28.6692, 77.4538],
  Ludhiana: [30.9010, 75.8573],
  Agra: [27.1767, 78.0081],
  Nashik: [20.0059, 73.7910],
  Faridabad: [28.4089, 77.3178],
  Meerut: [28.9845, 77.7064],
  Rajkot: [22.3039, 70.8022],
  "Kalyan-Dombivli": [19.2352, 73.1296],
  "Vasai-Virar": [19.4259, 72.8225],
  Varanasi: [25.3176, 82.9739],
  Srinagar: [34.0836, 74.7973],
  Aurangabad: [19.8762, 75.3433],
  Dhanbad: [23.7957, 86.4304],
  Amritsar: [31.6340, 74.8723],
  "Navi Mumbai": [19.0330, 73.0297],
  Allahabad: [25.4358, 81.8463],
  Ranchi: [23.3441, 85.3096],
  Howrah: [22.5958, 88.2636],
  Coimbatore: [11.0168, 76.9558],
  Jabalpur: [23.1815, 79.9864]
};

// Component to update map center
function MapUpdater({ center }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 12);
  }, [center, map]);
  return null;
}

const CityMap = ({ city }) => {
  const defaultPosition = [20.5937, 78.9629]; // Default India coordinates
  const cityPosition = cityCoordinates[city] || defaultPosition;

  return (
    <MapContainer 
      center={cityPosition} 
      zoom={cityCoordinates[city] ? 12 : 5} 
      style={{ height: '400px', width: '100%' }}
      scrollWheelZoom={false}
    >
      <MapUpdater center={cityPosition} />
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={cityPosition}>
        <Popup>
          <strong>{city}</strong>
          <br />
          Garden Planning Location
        </Popup>
      </Marker>
    </MapContainer>
  );
};

const GardenPlanner = () => {
  const [location, setLocation] = useState('');
  const [gardenType, setGardenType] = useState('');
  const [gardenSize, setGardenSize] = useState('');
  const [sunlight, setSunlight] = useState('');
  const [loading, setLoading] = useState(false);
  const [gardenPlan, setGardenPlan] = useState(null);
  const [myGarden, setMyGarden] = useState([]);
  const [aiTips, setAiTips] = useState([]);
  const [citySuggestions, setCitySuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showMap, setShowMap] = useState(false);

  // Initialize Google GenAI
  const API_KEY = process.env.REACT_APP_GEMINI_API_KEY;
  const ai = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;

  // Major Indian cities for suggestions
  const indianCities = [
    "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Ahmedabad", "Chennai", "Kolkata", 
    "Surat", "Pune", "Jaipur", "Lucknow", "Kanpur", "Nagpur", "Indore", "Thane",
    "Bhopal", "Visakhapatnam", "Pimpri-Chinchwad", "Patna", "Vadodara", "Ghaziabad",
    "Ludhiana", "Agra", "Nashik", "Faridabad", "Meerut", "Rajkot", "Kalyan-Dombivli",
    "Vasai-Virar", "Varanasi", "Srinagar", "Aurangabad", "Dhanbad", "Amritsar",
    "Navi Mumbai", "Allahabad", "Ranchi", "Howrah", "Coimbatore", "Jabalpur"
  ];

  // Garden types
  const gardenTypes = [
    { id: 'balcony', name: 'Balcony Garden', icon: Building, description: 'Small space, container gardening' },
    { id: 'terrace', name: 'Terrace Garden', icon: Home, description: 'Rooftop gardening with pots and planters' },
    { id: 'ground', name: 'Ground Garden', icon: Square, description: 'Traditional in-ground gardening' }
  ];

  // Garden sizes
  const gardenSizes = [
    { id: 'small', name: 'Small (Under 50 sq ft)', plants: '3-5 plants', icon: Sprout },
    { id: 'medium', name: 'Medium (50-200 sq ft)', plants: '6-12 plants', icon: Map },
    { id: 'large', name: 'Large (200+ sq ft)', plants: '13+ plants', icon: Square }
  ];

  // Sunlight options
  const sunlightOptions = [
    { id: 'full', name: 'Full Sun', description: '6+ hours direct sunlight', icon: Sun },
    { id: 'partial', name: 'Partial Sun', description: '3-6 hours sunlight', icon: Cloud },
    { id: 'shade', name: 'Shade', description: 'Less than 3 hours sunlight', icon: Building }
  ];

  // Filter cities based on input
  const handleLocationChange = (value) => {
    setLocation(value);
    if (value.length > 1) {
      const filtered = indianCities.filter(city =>
        city.toLowerCase().includes(value.toLowerCase())
      );
      setCitySuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const selectCity = (city) => {
    setLocation(city);
    setShowSuggestions(false);
  };

  // Toggle map visibility
  const toggleMap = () => {
    setShowMap(!showMap);
  };

  // Fetch AI garden recommendations
  const generateGardenPlan = async () => {
    if (!location || !gardenType || !gardenSize || !sunlight) {
      alert('Please fill all the fields to generate your garden plan');
      return;
    }

    // Validate city input
    if (!indianCities.includes(location)) {
      alert('Please select a valid Indian city from the suggestions');
      return;
    }

    setLoading(true);
    setGardenPlan(null);

    try {
      if (!ai) {
        throw new Error('AI service not available. Please check your API key.');
      }

      const prompt = `
        Create a comprehensive garden plan for ${location}, India based on these inputs:
        - Garden Type: ${gardenType}
        - Garden Size: ${gardenSize}
        - Sunlight: ${sunlight}

        Return ONLY a valid JSON object with this exact structure:
        {
          "suitable_plants": [
            {
              "name": "Plant Common Name",
              "botanical_name": "Scientific Name",
              "reason": "Why suitable for this location/garden type",
              "care_level": "Beginner/Intermediate/Advanced",
              "sunlight": "Full/Partial/Shade",
              "watering": "Low/Medium/High",
              "spacing": "spacing requirements",
              "companion_plants": ["plant1", "plant2"],
              "season": "Best planting season"
            }
          ],
          "layout_suggestions": [
            "Specific layout suggestion 1",
            "Specific layout suggestion 2"
          ],
          "maintenance_tips": [
            "Maintenance tip 1",
            "Maintenance tip 2",
            "Maintenance tip 3"
          ],
          "seasonal_considerations": [
            "Seasonal consideration 1",
            "Seasonal consideration 2"
          ],
          "climate_notes": "Specific climate adaptation notes for ${location}"
        }

        Important:
        - Recommend 5-8 plants suitable for ${location}'s climate
        - Include both common and scientific names
        - Provide specific spacing and layout suggestions
        - Include practical maintenance tips
        - Consider seasonal variations in Indian climate
      `;

      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: prompt,
      });

      const text = response.text;
      let cleanedText = text.replace(/```json|```/g, '').trim();
      const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        cleanedText = jsonMatch[0];
      }
      
      const planData = JSON.parse(cleanedText);
      setGardenPlan(planData);

      // Generate AI tips
      generateAiTips(planData);

    } catch (error) {
      console.error('Error generating garden plan:', error);
      alert('Failed to generate garden plan. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Generate AI tips based on garden plan
  const generateAiTips = async (planData) => {
    try {
      const prompt = `
        Based on this garden plan data for ${location}: ${JSON.stringify(planData)}
        
        Generate 3-5 smart AI tips for garden optimization. Return as JSON array:
        [
          {
            "title": "Tip Title",
            "description": "Detailed tip description with practical advice",
            "icon": "sun/droplets/sprout/clock/users/zap/lightbulb/target",
            "priority": "high/medium/low",
            "category": "watering/planting/maintenance/harvesting"
          }
        ]
        
        Make tips very practical and actionable.
      `;

      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: prompt,
      });

      const text = response.text;
      let cleanedText = text.replace(/```json|```/g, '').trim();
      const jsonMatch = cleanedText.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        cleanedText = jsonMatch[0];
      }
      
      const tips = JSON.parse(cleanedText);
      setAiTips(tips);

    } catch (error) {
      console.error('Error generating AI tips:', error);
      // Set default tips if AI fails
      setAiTips([
        {
          title: "Companion Planting",
          description: "Group plants with similar water and sunlight needs together for easier maintenance",
          icon: "sprout",
          priority: "high",
          category: "planting"
        }
      ]);
    }
  };

  // Add plant to my garden
  const addToMyGarden = (plant) => {
    if (!myGarden.find(p => p.name === plant.name)) {
      setMyGarden([...myGarden, { ...plant, added: true }]);
    }
  };

  // Remove plant from my garden
  const removeFromMyGarden = (plantName) => {
    setMyGarden(myGarden.filter(plant => plant.name !== plantName));
  };

  // Get icon component
  const getIcon = (iconName) => {
    const icons = {
      sun: Sun,
      droplets: Droplets,
      sprout: Sprout,
      clock: Clock,
      users: Users,
      zap: Zap,
      lightbulb: Lightbulb,
      target: Target,
      cloud: Cloud
    };
    return icons[iconName] || Sparkles;
  };

  return (
    <div className="virtual-garden">
      <div className="container">
        <div className="page-header">
          <Link to="/" className="btn btn-secondary" style={{marginBottom: '2rem'}}>
            <ArrowLeft size={20} />
            Back to Home
          </Link>
          <h1>AI Garden Planner</h1>
          <p>Get personalized garden layouts based on your city and space</p>
        </div>

        {/* Garden Input Form */}
        <div className="garden-planner-form">
          <div className="form-section">
            <h3>Garden Details</h3>
            <div className="input-grid">
              <div className="input-group">
                <label>
                  <MapPin size={16} />
                  City
                </label>
                <div className="city-input-wrapper">
                  <input
                    type="text"
                    placeholder="e.g., Bangalore, Mumbai, Delhi..."
                    value={location}
                    onChange={(e) => handleLocationChange(e.target.value)}
                    onFocus={() => location.length > 1 && setShowSuggestions(true)}
                  />
                  {showSuggestions && citySuggestions.length > 0 && (
                    <div className="city-suggestions">
                      {citySuggestions.slice(0, 5).map((city, index) => (
                        <div
                          key={index}
                          className="suggestion-item"
                          onClick={() => selectCity(city)}
                        >
                          <MapPin size={14} />
                          {city}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <small>Enter your city name for climate-specific recommendations</small>
                
                {/* Map Toggle Button */}
                {location && indianCities.includes(location) && (
                  <button 
                    className="btn btn-outline map-toggle-btn"
                    onClick={toggleMap}
                    style={{ marginTop: '0.5rem' }}
                  >
                    <Navigation size={16} />
                    {showMap ? 'Hide Map' : 'Show City Map'}
                  </button>
                )}
              </div>

              {/* Map Container */}
              {showMap && location && (
                <div className="map-container">
                  <div className="map-header">
                    <h4>
                      <MapPin size={18} />
                      Map of {location}
                    </h4>
                    <button 
                      className="btn btn-sm btn-outline"
                      onClick={toggleMap}
                    >
                      Close
                    </button>
                  </div>
                  <CityMap city={location} />
                </div>
              )}

              <div className="input-group">
                <label>Garden Type</label>
                <div className="option-grid three-column">
                  {gardenTypes.map(type => {
                    const IconComponent = type.icon;
                    return (
                      <div
                        key={type.id}
                        className={`option-card ${gardenType === type.id ? 'selected' : ''}`}
                        onClick={() => setGardenType(type.id)}
                      >
                        <div className="option-icon">
                          <IconComponent size={24} />
                        </div>
                        <span className="option-name">{type.name}</span>
                        <span className="option-desc">{type.description}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="input-group">
                <label>Garden Size</label>
                <div className="option-grid three-column">
                  {gardenSizes.map(size => {
                    const IconComponent = size.icon;
                    return (
                      <div
                        key={size.id}
                        className={`option-card ${gardenSize === size.id ? 'selected' : ''}`}
                        onClick={() => setGardenSize(size.id)}
                      >
                        <div className="option-icon">
                          <IconComponent size={24} />
                        </div>
                        <span className="option-name">{size.name}</span>
                        <span className="option-desc">{size.plants}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="input-group">
                <label>Sunlight Availability</label>
                <div className="option-grid three-column">
                  {sunlightOptions.map(option => {
                    const IconComponent = option.icon;
                    return (
                      <div
                        key={option.id}
                        className={`option-card ${sunlight === option.id ? 'selected' : ''}`}
                        onClick={() => setSunlight(option.id)}
                      >
                        <div className="option-icon">
                          <IconComponent size={24} />
                        </div>
                        <span className="option-name">{option.name}</span>
                        <span className="option-desc">{option.description}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <button 
              className="btn btn-primary generate-plan-btn"
              onClick={generateGardenPlan}
              disabled={loading}
            >
              <Sparkles size={20} />
              {loading ? 'Generating Plan...' : 'Generate AI Garden Plan'}
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>AI is creating your personalized garden plan for {location}...</p>
          </div>
        )}

        {/* Garden Plan Results */}
        {gardenPlan && !loading && (
          <div className="garden-plan-results">
            <div className="plan-header">
              <h2>Your AI-Generated Garden Plan for {location}</h2>
              <p>Climate-smart recommendations tailored for your city</p>
              
              {/* Map toggle in plan header */}
              {location && (
                <button 
                  className="btn btn-outline map-toggle-btn"
                  onClick={toggleMap}
                >
                  <Navigation size={16} />
                  {showMap ? 'Hide Map' : 'Show City Map'}
                </button>
              )}
            </div>

            {/* Map Container in Results */}
            {showMap && location && (
              <div className="map-container">
                <div className="map-header">
                  <h4>
                    <MapPin size={18} />
                    Map of {location}
                  </h4>
                  <button 
                    className="btn btn-sm btn-outline"
                    onClick={toggleMap}
                  >
                    Close
                  </button>
                </div>
                <CityMap city={location} />
              </div>
            )}

            {/* AI Tips Section */}
            {aiTips.length > 0 && (
              <div className="ai-tips-section">
                <div className="section-header">
                  <Cpu size={24} />
                  <h3>AI Smart Tips</h3>
                </div>
                <div className="tips-grid">
                  {aiTips.map((tip, index) => {
                    const IconComponent = getIcon(tip.icon);
                    return (
                      <div key={index} className={`tip-card ${tip.priority} ${tip.category}`}>
                        <div className="tip-header">
                          <div className="tip-icon-wrapper">
                            <IconComponent size={20} />
                          </div>
                          <div className="tip-meta">
                            <span className="tip-priority">{tip.priority} priority</span>
                            <span className="tip-category">{tip.category}</span>
                          </div>
                        </div>
                        <div className="tip-content">
                          <h4>{tip.title}</h4>
                          <p>{tip.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Suitable Plants */}
            <div className="plants-section">
              <div className="section-header">
                <Sprout size={24} />
                <h3>Recommended Plants for {location}</h3>
              </div>
              <div className="plants-grid">
                {gardenPlan.suitable_plants?.map((plant, index) => (
                  <div key={index} className="plant-card">
                    <div className="plant-header">
                      <h4>{plant.name}</h4>
                      <span className="botanical-name">{plant.botanical_name}</span>
                    </div>
                    
                    <p className="plant-reason">{plant.reason}</p>
                    
                    <div className="plant-details-grid">
                      <div className="detail-item">
                        <div className="detail-icon">
                          <Sprout size={16} />
                        </div>
                        <div className="detail-content">
                          <span className="detail-label">Care Level</span>
                          <span className="detail-value">{plant.care_level}</span>
                        </div>
                      </div>
                      <div className="detail-item">
                        <div className="detail-icon">
                          <Sun size={16} />
                        </div>
                        <div className="detail-content">
                          <span className="detail-label">Sunlight</span>
                          <span className="detail-value">{plant.sunlight}</span>
                        </div>
                      </div>
                      <div className="detail-item">
                        <div className="detail-icon">
                          <Droplets size={16} />
                        </div>
                        <div className="detail-content">
                          <span className="detail-label">Watering</span>
                          <span className="detail-value">{plant.watering}</span>
                        </div>
                      </div>
                      <div className="detail-item">
                        <div className="detail-icon">
                          <Map size={16} />
                        </div>
                        <div className="detail-content">
                          <span className="detail-label">Spacing</span>
                          <span className="detail-value">{plant.spacing}</span>
                        </div>
                      </div>
                    </div>

                    {plant.season && (
                      <div className="plant-season">
                        <Thermometer size={14} />
                        <span>Best planted in: {plant.season}</span>
                      </div>
                    )}

                    {plant.companion_plants && plant.companion_plants.length > 0 && (
                      <div className="companion-plants">
                        <strong>Companion Plants: </strong>
                        <span>{plant.companion_plants.join(', ')}</span>
                      </div>
                    )}

                    <button
                      className={`btn ${myGarden.find(p => p.name === plant.name) ? 'btn-success' : 'btn-primary'} add-to-garden-btn`}
                      onClick={() => 
                        myGarden.find(p => p.name === plant.name) 
                          ? removeFromMyGarden(plant.name)
                          : addToMyGarden(plant)
                      }
                    >
                      {myGarden.find(p => p.name === plant.name) ? (
                        <>
                          <Check size={16} />
                          Added to My Garden
                        </>
                      ) : (
                        <>
                          <Plus size={16} />
                          Add to My Garden
                        </>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Layout Suggestions */}
            {gardenPlan.layout_suggestions && (
              <div className="layout-section">
                <div className="section-header">
                  <Map size={24} />
                  <h3>Layout Suggestions</h3>
                </div>
                <div className="suggestions-list">
                  {gardenPlan.layout_suggestions.map((suggestion, index) => (
                    <div key={index} className="suggestion-item">
                      <div className="suggestion-number">{index + 1}</div>
                      <p>{suggestion}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Maintenance Tips */}
            {gardenPlan.maintenance_tips && (
              <div className="maintenance-section">
                <div className="section-header">
                  <Clock size={24} />
                  <h3>Maintenance Tips</h3>
                </div>
                <div className="tips-list">
                  {gardenPlan.maintenance_tips.map((tip, index) => (
                    <div key={index} className="tip-item">
                      <div className="tip-bullet">
                        <Check size={16} />
                      </div>
                      <span>{tip}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Climate Notes */}
            {gardenPlan.climate_notes && (
              <div className="climate-section">
                <div className="section-header">
                  <Cloud size={24} />
                  <h3>Climate Considerations for {location}</h3>
                </div>
                <div className="climate-content">
                  <p>{gardenPlan.climate_notes}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* My Garden Section */}
        {myGarden.length > 0 && (
          <div className="my-garden-section">
            <div className="section-header">
              <Sprout size={24} />
              <h3>My Garden Plan ({myGarden.length} plants)</h3>
            </div>
            <div className="my-garden-plants">
              {myGarden.map((plant, index) => (
                <div key={index} className="my-garden-plant">
                  <div className="plant-info">
                    <span className="plant-name">{plant.name}</span>
                    <span className="plant-scientific">{plant.botanical_name}</span>
                  </div>
                  <button
                    className="btn btn-outline remove-btn"
                    onClick={() => removeFromMyGarden(plant.name)}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Welcome State */}
        {!gardenPlan && !loading && (
          <div className="welcome-section">
            <div className="welcome-content">
              <BarChart3 size={64} />
              <h3>Smart Garden Design</h3>
              <p>Fill out the form above to get your personalized AI-powered garden plan with climate-suitable plant recommendations</p>
              
              <div className="feature-grid">
                <div className="feature-card">
                  <Map size={32} />
                  <h4>City-Specific Planning</h4>
                  <p>Optimal plant selection based on your city's climate</p>
                </div>
                <div className="feature-card">
                  <Cpu size={32} />
                  <h4>AI Suggestions</h4>
                  <p>Climate-smart plant combinations for Indian cities</p>
                </div>
                <div className="feature-card">
                  <Sparkles size={32} />
                  <h4>Smart Tips</h4>
                  <p>AI-powered maintenance recommendations</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GardenPlanner;