import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calculator, ArrowLeft, Leaf, TrendingUp, Plus, Minus, 
  Sparkles, Calendar, Zap, TreePine, Cloud, Smartphone, 
  Car, Laptop, Recycle, Info, AlertCircle
} from 'lucide-react';
import { supabase } from '../services/supabase';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini with error handling
let genAI;
try {
  genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);
} catch (error) {
  console.error('Failed to initialize Gemini AI:', error);
}

const CarbonCalculator = () => {
  const [plants, setPlants] = useState([]);
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [growthStage, setGrowthStage] = useState('mature');
  const [climateZone, setClimateZone] = useState('tropical');
  const [totalCO2, setTotalCO2] = useState(0);
  const [aiInsight, setAiInsight] = useState('');
  const [loading, setLoading] = useState(false);
  const [calculating, setCalculating] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [calculationBreakdown, setCalculationBreakdown] = useState(null);
  const [aiError, setAiError] = useState('');

  const growthStages = [
    { value: 'seedling', label: 'Seedling (0-1 year)', multiplier: 0.3 },
    { value: 'young', label: 'Young (1-3 years)', multiplier: 0.7 },
    { value: 'mature', label: 'Mature (3+ years)', multiplier: 1.0 },
    { value: 'old', label: 'Old Growth (10+ years)', multiplier: 1.2 }
  ];

  const climateZones = [
    { value: 'tropical', label: 'Tropical', multiplier: 1.1 },
    { value: 'subtropical', label: 'Subtropical', multiplier: 1.0 },
    { value: 'temperate', label: 'Temperate', multiplier: 0.9 },
    { value: 'arid', label: 'Arid', multiplier: 0.8 },
    { value: 'continental', label: 'Continental', multiplier: 0.85 }
  ];

  useEffect(() => {
    fetchPlants();
  }, []);

  const fetchPlants = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('plants')
        .select('id, common_name, botanical_name, co2_absorption_rate, growth_rate, climate_resilience')
        .not('co2_absorption_rate', 'is', null)
        .order('common_name');

      if (error) throw error;
      setPlants(data || []);
    } catch (error) {
      console.error('Error fetching plants:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateCO2 = () => {
    if (!selectedPlant) return;

    setCalculating(true);
    setAiError('');
    
    setTimeout(() => {
      const baseCO2 = selectedPlant.co2_absorption_rate || 0;
      const growthMultiplier = growthStages.find(stage => stage.value === growthStage)?.multiplier || 1;
      const climateMultiplier = climateZones.find(zone => zone.value === climateZone)?.multiplier || 1;
      
      const adjustedCO2PerPlant = baseCO2 * growthMultiplier * climateMultiplier;
      const total = adjustedCO2PerPlant * quantity;

      setCalculationBreakdown({
        baseCO2,
        growthMultiplier,
        climateMultiplier,
        adjustedCO2PerPlant,
        total
      });
      
      setTotalCO2(total);
      generateAIInsight(selectedPlant, quantity, total, growthStage, climateZone);
      setCalculating(false);
    }, 1000);
  };

  // Function to clean markdown formatting from AI response
  const cleanMarkdown = (text) => {
    if (!text) return '';
    
    return text
      // Remove bold markdown **text**
      .replace(/\*\*(.*?)\*\*/g, '$1')
      // Remove italic markdown *text* or _text_
      .replace(/(?<!\*)\*(?!\*)(.*?)(?<!\*)\*(?!\*)/g, '$1')
      .replace(/_(.*?)_/g, '$1')
      // Remove header markdown ###
      .replace(/^#{1,6}\s+/gm, '')
      // Remove links [text](url)
      .replace(/\[(.*?)\]\(.*?\)/g, '$1')
      // Clean up extra spaces
      .replace(/\s+/g, ' ')
      .trim();
  };

  // Generate fallback insight based on calculation
  const generateFallbackInsight = (plant, qty, co2Total, stage, zone) => {
    const carKm = (co2Total / 2.3).toFixed(1);
    const phoneDays = (co2Total / 0.008).toFixed(0);
    const growthStageLabel = growthStages.find(s => s.value === stage)?.label || 'mature plants';
    const climateLabel = climateZones.find(z => z.value === zone)?.label || 'your climate';
    
    const tips = [
      "Add organic compost to boost plant growth and carbon absorption.",
      "Regular pruning encourages denser foliage for better CO2 capture.",
      "Mulching helps retain moisture and improves soil health.",
      "Companion planting can create a more resilient garden ecosystem.",
      "Water deeply but less frequently to encourage strong root systems."
    ];
    
    const randomTip = tips[Math.floor(Math.random() * tips.length)];
    
    return `🌿 Amazing environmental impact! Your ${qty} ${plant.common_name} ${qty > 1 ? 'plants' : 'plant'} (${growthStageLabel}) in ${climateLabel} are absorbing ${co2Total.toFixed(2)} kg of CO₂ annually. 

That's equivalent to ${carKm} km of car travel or ${phoneDays} days of smartphone charging!

💡 Pro Tip: ${randomTip}

🌍 Beyond carbon reduction, your garden also supports biodiversity and improves local air quality. Keep up the great work!`;
  };

  const generateAIInsight = async (plant, qty, co2Total, stage, zone) => {
    // Clear previous insight and error
    setAiInsight('');
    setAiError('');
    setAiLoading(true);

    try {
      // Check if Gemini is properly initialized
      if (!genAI) {
        throw new Error('AI service not available');
      }

      // Use the correct model name - gemini-pro is more reliable
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
      
      const prompt = `
        As an environmental AI assistant, provide a friendly, encouraging insight about carbon offsetting through gardening.
        
        Context:
        - Plant: ${plant.common_name} (${plant.botanical_name})
        - Quantity: ${qty} plants
        - Growth Stage: ${growthStages.find(s => s.value === stage)?.label}
        - Climate Zone: ${climateZones.find(z => z.value === zone)?.label}
        - Estimated Annual CO2 Absorption: ${co2Total.toFixed(2)} kg
        
        Please provide:
        1. A positive opening statement about their environmental impact
        2. One fun equivalent (e.g., "This offsets X km of car travel" or "Like Y days of phone charging")
        3. One practical gardening tip to improve carbon absorption
        4. One environmental benefit beyond CO2 reduction
        
        Important: 
        - Keep it under 120 words
        - Use a friendly, conversational tone
        - DO NOT use markdown formatting (no **bold**, *italic*, etc.)
        - Use simple text only with emojis if appropriate
        - Make it encouraging and educational
      `;

      console.log('Sending request to Gemini API...');
      const result = await model.generateContent(prompt);
      const response = await result.response;
      let text = response.text();
      
      console.log('Raw AI response:', text);
      
      // Clean any markdown formatting that might slip through
      text = cleanMarkdown(text);
      
      console.log('Cleaned AI response:', text);
      setAiInsight(text);
      
    } catch (error) {
      console.error('Error generating AI insight:', error);
      
      // Set specific error messages based on error type
      if (error.message?.includes('API key') || !process.env.REACT_APP_GEMINI_API_KEY) {
        setAiError('AI insights temporarily unavailable. Using enhanced calculations instead.');
      } else if (error.message?.includes('quota') || error.message?.includes('rate limit')) {
        setAiError('AI service is busy. Showing calculated insights instead.');
      } else if (error.message?.includes('network') || error.message?.includes('fetch')) {
        setAiError('Network issue. Using local insights based on your calculation.');
      } else {
        setAiError('Enhanced insights temporarily unavailable.');
      }
      
      // Generate fallback insight
      const fallbackInsight = generateFallbackInsight(plant, qty, co2Total, stage, zone);
      setAiInsight(fallbackInsight);
      
    } finally {
      setAiLoading(false);
    }
  };

  const getFunEquivalents = (co2Kg) => {
    const equivalents = [
      { 
        value: (co2Kg / 0.008).toFixed(0), 
        label: 'days of smartphone charging',
        icon: <Smartphone size={20} />
      },
      { 
        value: (co2Kg / 2.3).toFixed(1), 
        label: 'km driven by a car',
        icon: <Car size={20} />
      },
      { 
        value: (co2Kg / 0.9).toFixed(1), 
        label: 'hours of laptop use',
        icon: <Laptop size={20} />
      },
      { 
        value: (co2Kg / 0.16).toFixed(0), 
        label: 'plastic bottles recycled',
        icon: <Recycle size={20} />
      }
    ];
    
    return equivalents.filter(eq => eq.value > 0.1);
  };

  const resetCalculator = () => {
    setSelectedPlant(null);
    setQuantity(1);
    setGrowthStage('mature');
    setClimateZone('tropical');
    setTotalCO2(0);
    setAiInsight('');
    setCalculationBreakdown(null);
    setAiError('');
  };

  return (
    <div className="virtual-garden">
      <div className="container">
        <div className="page-header">
          <Link to="/" className="btn btn-secondary" style={{marginBottom: '2rem'}}>
            <ArrowLeft size={20} />
            Back to Home
          </Link>
          <h1>Carbon Offset Calculator</h1>
          <p>Track CO₂ absorption from your plants with AI-refined estimates</p>
        </div>

        <div className="carbon-calculator-container">
          {/* Calculator Card */}
          <div className="calculator-card">
            <div className="calculator-header">
              <div className="calculator-icon">
                <Calculator size={24} />
              </div>
              <div>
                <h3>Calculate Your Impact</h3>
                <p>Select your plants and conditions</p>
              </div>
            </div>

            <div className="calculator-form">
              {/* Plant Selection */}
              <div className="form-group">
                <label className="form-label">
                  <TreePine size={18} />
                  Select Plant
                </label>
                <select 
                  value={selectedPlant?.id || ''} 
                  onChange={(e) => {
                    const plant = plants.find(p => p.id === e.target.value);
                    setSelectedPlant(plant);
                  }}
                  className="form-select"
                >
                  <option value="">Choose a plant...</option>
                  {plants.map(plant => (
                    <option key={plant.id} value={plant.id}>
                      {plant.common_name} ({plant.botanical_name}) - {plant.co2_absorption_rate} kg/year
                    </option>
                  ))}
                </select>
                {selectedPlant && (
                  <div className="plant-info-badge">
                    <Leaf size={14} />
                    Base absorption: {selectedPlant.co2_absorption_rate} kg/year
                  </div>
                )}
              </div>

              {/* Quantity Input */}
              <div className="form-group">
                <label className="form-label">
                  <Plus size={18} />
                  Number of Plants
                </label>
                <div className="quantity-controls">
                  <button 
                    type="button" 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="quantity-btn"
                  >
                    <Minus size={16} />
                  </button>
                  <div className="quantity-display">
                    <span className="quantity-number">{quantity}</span>
                    <span className="quantity-label">plants</span>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => setQuantity(quantity + 1)}
                    className="quantity-btn"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              {/* Growth Stage */}
              <div className="form-group">
                <label className="form-label">
                  <Calendar size={18} />
                  Growth Stage
                </label>
                <select 
                  value={growthStage} 
                  onChange={(e) => setGrowthStage(e.target.value)}
                  className="form-select"
                >
                  {growthStages.map(stage => (
                    <option key={stage.value} value={stage.value}>
                      {stage.label} (Multiplier: {stage.multiplier})
                    </option>
                  ))}
                </select>
              </div>

              {/* Climate Zone */}
              <div className="form-group">
                <label className="form-label">
                  <Cloud size={18} />
                  Climate Zone
                </label>
                <select 
                  value={climateZone} 
                  onChange={(e) => setClimateZone(e.target.value)}
                  className="form-select"
                >
                  {climateZones.map(zone => (
                    <option key={zone.value} value={zone.value}>
                      {zone.label} (Multiplier: {zone.multiplier})
                    </option>
                  ))}
                </select>
              </div>

              {/* Action Buttons */}
              <div className="action-buttons">
                <button 
                  onClick={calculateCO2}
                  disabled={!selectedPlant || calculating}
                  className="btn btn-primary calculate-btn"
                >
                  {calculating ? (
                    <>
                      <div className="loading-spinner-small"></div>
                      Calculating...
                    </>
                  ) : (
                    <>
                      <Zap size={20} />
                      Calculate CO₂ Impact
                    </>
                  )}
                </button>

                <button 
                  onClick={resetCalculator}
                  className="btn btn-outline reset-btn"
                >
                  Reset All
                </button>
              </div>
            </div>
          </div>

          {/* Results Card */}
          <div className="results-section">
            {(totalCO2 > 0 || aiInsight) ? (
              <div className="results-card">
                <div className="results-header">
                  <div className="results-icon">
                    <TrendingUp size={24} />
                  </div>
                  <div>
                    <h3>Environmental Impact</h3>
                    <p>Your garden's positive contribution</p>
                  </div>
                </div>

                {/* CO2 Total */}
                <div className="co2-total">
                  <div className="co2-amount">{totalCO2.toFixed(2)} kg</div>
                  <div className="co2-label">CO₂ Absorbed Annually</div>
                </div>

                {/* Calculation Breakdown */}
                {calculationBreakdown && (
                  <div className="calculation-breakdown">
                    <div className="breakdown-header">
                      <Info size={16} />
                      <span>Calculation Breakdown</span>
                    </div>
                    <div className="breakdown-steps">
                      <div className="breakdown-step">
                        <span className="step-label">Base Rate</span>
                        <span className="step-value">{calculationBreakdown.baseCO2} kg</span>
                      </div>
                      <div className="breakdown-step">
                        <span className="step-label">Growth Multiplier</span>
                        <span className="step-value">× {calculationBreakdown.growthMultiplier}</span>
                      </div>
                      <div className="breakdown-step">
                        <span className="step-label">Climate Multiplier</span>
                        <span className="step-value">× {calculationBreakdown.climateMultiplier}</span>
                      </div>
                      <div className="breakdown-step">
                        <span className="step-label">Per Plant</span>
                        <span className="step-value">{calculationBreakdown.adjustedCO2PerPlant.toFixed(2)} kg</span>
                      </div>
                      <div className="breakdown-step total">
                        <span className="step-label">Total ({quantity} plants)</span>
                        <span className="step-value">{calculationBreakdown.total.toFixed(2)} kg</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Fun Equivalents */}
                <div className="fun-equivalents">
                  <h4>That's Equivalent To:</h4>
                  <div className="equivalents-grid">
                    {getFunEquivalents(totalCO2).map((eq, index) => (
                      <div key={index} className="equivalent-item">
                        <div className="equivalent-icon">
                          {eq.icon}
                        </div>
                        <div className="equivalent-content">
                          <span className="equivalent-value">{eq.value}</span>
                          <span className="equivalent-label">{eq.label}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* AI Insight */}
                {(aiLoading || aiInsight) && (
                  <div className="ai-insight">
                    <div className="ai-insight-header">
                      <Sparkles size={20} />
                      <h4>AI Insight</h4>
                      {aiLoading && (
                        <div className="ai-loading-indicator">
                          <div className="loading-spinner-small"></div>
                        </div>
                      )}
                    </div>
                    
                    {aiError && (
                      <div className="ai-error">
                        <AlertCircle size={16} />
                        <span>{aiError}</span>
                      </div>
                    )}
                    
                    {aiLoading ? (
                      <div className="ai-loading-content">
                        <p>Generating personalized insights...</p>
                      </div>
                    ) : (
                      <div className="ai-insight-content">
                        {aiInsight.split('\n').map((line, index) => (
                          <p key={index}>{line}</p>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="empty-results">
                <div className="empty-icon">
                  <Leaf size={48} />
                </div>
                <h3>Calculate Your Impact</h3>
                <p>Select a plant and conditions to see your garden's carbon offset potential</p>
              </div>
            )}

            {/* Loading State */}
            {loading && (
              <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading plants data...</p>
              </div>
            )}

            {/* Empty State */}
            {!loading && plants.length === 0 && (
              <div className="empty-state">
                <Leaf size={48} />
                <h3>No Plants Available</h3>
                <p>Plant data is being updated. Please check back later.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarbonCalculator;