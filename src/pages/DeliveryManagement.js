import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { Package, MapPin, Navigation, AlertCircle, CheckCircle, X, LayoutGrid, Plane, Truck, ShoppingCart } from 'lucide-react';
import L from 'leaflet';

const CITIES_DB = {
  'Mumbai': { 
    lat: 19.08861, 
    lng: 72.86806,
    airport: 'Chatrapati Shivaji Maharaj International Airport',
    code: 'BOM',
    address: 'Terminal 2, CSMI Airport, Vile Parle East, Mumbai 400099'
  },
  'Pune': { 
    lat: 18.58222, 
    lng: 73.91972,
    airport: 'Pune International Airport',
    code: 'PNQ',
    address: 'Airport Road, Pune-Bangalore Highway, Pune 411014'
  },
  'Bangalore': { 
    lat: 13.19889, 
    lng: 77.70556,
    airport: 'Kempegowda International Airport',
    code: 'BLR',
    address: 'Devanahalli, Bangalore 560300'
  },
  'Hyderabad': { 
    lat: 17.23000, 
    lng: 78.43194,
    airport: 'Rajiv Gandhi International Airport',
    code: 'HYD',
    address: 'Shamshabad, Hyderabad 508207'
  },
  'Delhi': { 
    lat: 28.56861, 
    lng: 77.11222,
    airport: 'Indira Gandhi International Airport',
    code: 'DEL',
    address: 'Dwarka, New Delhi 110037'
  },
  'Chennai': { 
    lat: 12.98222, 
    lng: 80.16361,
    airport: 'Chennai International Airport',
    code: 'MAA',
    address: 'Minambakkam, Chennai 600027'
  },
  'Kolkata': { 
    lat: 22.65472, 
    lng: 88.44667,
    airport: 'Netaji Subhas Chandra Bose International',
    code: 'CCU',
    address: 'Dum Dum, Kolkata 700052'
  },
  'Jaipur': { 
    lat: 26.82417, 
    lng: 75.81222,
    airport: 'Jaipur International Airport',
    code: 'JAI',
    address: 'Sanganer, Jaipur 302029'
  },
  'Nashik': { 
    lat: 20.11944, 
    lng: 73.91361,
    airport: 'Nashik International Airport (Ozar)',
    code: 'OSL',
    address: 'Ozar, Nashik 422207'
  },
  'Goa': { 
    lat: 15.38139, 
    lng: 73.83417,
    airport: 'Goa International Airport',
    code: 'GOI',
    address: 'Dabolim, North Goa 403801'
  },
  'Surat': { 
    lat: 21.11766, 
    lng: 72.74526,
    airport: 'Surat International Airport',
    code: 'STV',
    address: 'Umbergaon, Surat 395005'
  },
  'Ahmedabad': { 
    lat: 23.07722, 
    lng: 72.63472,
    airport: 'Sardar Vallabhbhai Patel International',
    code: 'AMD',
    address: 'Hansol, Ahmedabad 382421'
  },
};

class DeliveryGraph {
  constructor(cities = []) {
    this.cities = cities;
    this.size = cities.length;
    this.distanceMatrix = Array(this.size)
      .fill(null)
      .map(() => Array(this.size).fill(0));
  }

  addRoute(fromIdx, toIdx, distance) {
    this.distanceMatrix[fromIdx][toIdx] = distance;
    this.distanceMatrix[toIdx][fromIdx] = distance;
  }

  findAllPaths(start, end, visited = new Set(), path = [], totalDist = 0) {
    if (start === end) {
      return [{ path: [...path, end], distance: totalDist }];
    }

    visited.add(start);
    let paths = [];

    for (let j = 0; j < this.size; j++) {
      if (this.distanceMatrix[start][j] > 0 && !visited.has(j)) {
        paths = paths.concat(
          this.findAllPaths(
            j,
            end,
            new Set(visited),
            [...path, start],
            totalDist + this.distanceMatrix[start][j]
          )
        );
      }
    }

    return paths;
  }

  displayMatrix() {
    return {
      cities: this.cities,
      matrix: this.distanceMatrix.slice(0, this.size).map(row => row.slice(0, this.size)),
    };
  }
}

const calculateDeliveryTime = (distance) => {
  const baseHours = 2;
  const hoursPerKm = distance / 500;
  const totalHours = Math.ceil(baseHours + hoursPerKm);
  return totalHours;
};

const DeliveryManagement = () => {
  const cityList = Object.keys(CITIES_DB);
  const [graph] = useState(() => {
    const g = new DeliveryGraph(cityList);
    
    const routes = [
      { from: 'Mumbai', to: 'Pune', dist: 163 },
      { from: 'Pune', to: 'Bangalore', dist: 564 },
      { from: 'Bangalore', to: 'Hyderabad', dist: 578 },
      { from: 'Hyderabad', to: 'Delhi', dist: 1466 },
      { from: 'Delhi', to: 'Kolkata', dist: 1517 },
      { from: 'Mumbai', to: 'Delhi', dist: 1420 },
      { from: 'Bangalore', to: 'Chennai', dist: 360 },
      { from: 'Pune', to: 'Hyderabad', dist: 597 },
      { from: 'Mumbai', to: 'Bangalore', dist: 852 },
      { from: 'Mumbai', to: 'Nashik', dist: 210 },
      { from: 'Nashik', to: 'Delhi', dist: 1272 },
      { from: 'Mumbai', to: 'Goa', dist: 609 },
      { from: 'Goa', to: 'Bangalore', dist: 680 },
      { from: 'Ahmedabad', to: 'Mumbai', dist: 547 },
      { from: 'Ahmedabad', to: 'Delhi', dist: 920 },
      { from: 'Surat', to: 'Mumbai', dist: 291 },
      { from: 'Surat', to: 'Ahmedabad', dist: 291 },
      { from: 'Pune', to: 'Nashik', dist: 330 },
      { from: 'Chennai', to: 'Hyderabad', dist: 581 },
      { from: 'Jaipur', to: 'Delhi', dist: 265 },
    ];

    routes.forEach(route => {
      const fromIdx = cityList.indexOf(route.from);
      const toIdx = cityList.indexOf(route.to);
      if (fromIdx !== -1 && toIdx !== -1) {
        g.addRoute(fromIdx, toIdx, route.dist);
      }
    });

    return g;
  });

  const [homeCity, setHomeCity] = useState('');
  const [deliveryOptions, setDeliveryOptions] = useState([]);
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const handleSelectHome = (city) => {
    setHomeCity(city);
    setSelectedDelivery(null);
    
    if (!city) {
      setDeliveryOptions([]);
      return;
    }

    const homeIdx = cityList.indexOf(city);
    const options = [];

    cityList.forEach((sourceCity, idx) => {
      if (sourceCity !== city) {
        const paths = graph.findAllPaths(idx, homeIdx);
        if (paths.length > 0) {
          const shortestPath = paths.reduce((min, p) => 
            p.distance < min.distance ? p : min
          );
          options.push({
            sourceCity,
            path: shortestPath.path.map(i => cityList[i]),
            distance: shortestPath.distance,
            deliveryTime: calculateDeliveryTime(shortestPath.distance),
            sourceAddress: CITIES_DB[sourceCity].address,
            fullPath: shortestPath.path.map(i => cityList[i]).join(' → ')
          });
        }
      }
    });

    options.sort((a, b) => a.distance - b.distance);
    setDeliveryOptions(options);
    showMessage('success', `Found ${options.length} delivery options from nearby cities`);
  };

  const handleBuyNow = (option) => {
    window.open('https://arogya-ecommerce.vercel.app/', '_blank');
  };

  const getPathCoordinates = (path) => {
    return path.map(city => [CITIES_DB[city].lat, CITIES_DB[city].lng]);
  };

  const matrixData = graph.displayMatrix();

  const redMarkerIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  const greenMarkerIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  return (
    <div className="dm-page">
      {/* Header */}
      <div className="dm-header-section">
        <div className="dm-header-content">
          <div className="dm-header-icon">
            <ShoppingCart size={36} />
          </div>
          <div className="dm-header-text">
            <h1>ArogyaVatika Express Delivery</h1>
            <p>Fast & reliable herbal product delivery to your city</p>
          </div>
        </div>
      </div>

      {/* Message */}
      {message.text && (
        <div className={`dm-message dm-message-${message.type}`}>
          <div className="dm-message-icon">
            {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
          </div>
          <span className="dm-message-text">{message.text}</span>
          <button className="dm-message-close" onClick={() => setMessage({ type: '', text: '' })}>
            <X size={18} />
          </button>
        </div>
      )}

      <div className="dm-main-wrapper">
        {/* Top: Controls + Map */}
        <div className="dm-top-section">
          {/* Left: Controls */}
          <aside className="dm-controls-section">
            <div className="dm-card">
              <h2>Your Delivery Location</h2>

              <div className="dm-input-group">
                <label htmlFor="home-select">Select Your City</label>
                <select 
                  id="home-select"
                  value={homeCity} 
                  onChange={(e) => handleSelectHome(e.target.value)}
                  className="dm-select"
                >
                  <option value="">Choose your city...</option>
                  {cityList.map(city => (
                    <option key={city} value={city}>
                      {city} ({CITIES_DB[city].code}) - {CITIES_DB[city].address}
                    </option>
                  ))}
                </select>
              </div>

              {/* Delivery Options */}
              {deliveryOptions.length > 0 && (
                <div className="dm-routes-section">
                  <h3>Delivery From ({deliveryOptions.length})</h3>
                  <div className="dm-routes-container">
                    {deliveryOptions.map((option, idx) => (
                      <div
                        key={idx}
                        className={`dm-delivery-card ${selectedDelivery === idx ? 'dm-selected' : ''}`}
                        onClick={() => setSelectedDelivery(idx)}
                      >
                        <div className="dm-delivery-rank">
                          {idx === 0 ? 'FAST' : `${idx + 1}`}
                        </div>
                        <div className="dm-delivery-info">
                          <div className="dm-delivery-from">
                            {option.sourceCity}
                          </div>
                          <div className="dm-delivery-path">
                            {option.fullPath}
                          </div>
                          <div className="dm-delivery-time">
                            Delivery in {option.deliveryTime} hours
                          </div>
                          <div className="dm-delivery-distance">
                            {option.distance} km
                          </div>
                        </div>
                        <button
                          className="dm-buy-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleBuyNow(option);
                          }}
                        >
                          <ShoppingCart size={16} />
                          Shop Now
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {homeCity && deliveryOptions.length === 0 && (
                <div className="dm-no-options">
                  <AlertCircle size={32} />
                  <p>No delivery routes available from other cities</p>
                </div>
              )}
            </div>
          </aside>

          {/* Right: Map - Always Shows All Paths */}
          <div className="dm-map-section">
            <div className="dm-card dm-map-card">
              {homeCity && deliveryOptions.length > 0 ? (
                <MapContainer 
                  center={[20.5937, 78.9629]} 
                  zoom={5} 
                  className="dm-map-container"
                >
                  <TileLayer 
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; OpenStreetMap contributors"
                  />

                  {/* All delivery paths - except fastest */}
                  {deliveryOptions.map((option, idx) => {
                    const isFastest = idx === 0;
                    return isFastest ? null : (
                      <Polyline
                        key={idx}
                        positions={getPathCoordinates(option.path)}
                        color="#ef4444"
                        weight={2}
                        opacity={0.6}
                        dashArray=""
                      />
                    );
                  })}

                  {/* Fastest path - rendered LAST to appear on top */}
                  {deliveryOptions.length > 0 && (
                    <Polyline
                      positions={getPathCoordinates(deliveryOptions[0].path)}
                      color="#2563eb"
                      weight={4}
                      opacity={0.95}
                      dashArray=""
                    />
                  )}

                  {/* All cities on all paths */}
                  {homeCity && deliveryOptions.map((option, optIdx) => (
                    option.path.map((city, pathIdx) => {
                      const coords = CITIES_DB[city];
                      const isHome = city === homeCity;
                      
                      return (
                        <Marker 
                          key={`${optIdx}-${city}`}
                          position={[coords.lat, coords.lng]}
                          icon={isHome ? greenMarkerIcon : redMarkerIcon}
                        >
                          <Popup>
                            <div className="dm-popup">
                              <strong>{city}</strong>
                              <div className="dm-popup-airport">
                                {coords.airport}
                              </div>
                              <div className="dm-popup-code">
                                Code: {coords.code}
                              </div>
                              {isHome && <div className="dm-popup-label">Your Location</div>}
                            </div>
                          </Popup>
                        </Marker>
                      );
                    })
                  ))}
                </MapContainer>
              ) : (
                <div className="dm-placeholder">
                  <MapPin size={56} />
                  <h3>Select Your City</h3>
                  <p>Choose your location to see all delivery routes</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom: Always Visible Matrix */}
        <div className="dm-matrix-section">
          <div className="dm-card">
            <div className="dm-matrix-header">
              <h2>Delivery Network - Distance Matrix (km)</h2>
            </div>

            <div className="dm-matrix-wrapper">
              <table className="dm-matrix-table">
                <thead>
                  <tr>
                    <th></th>
                    {matrixData.cities.map(c => (
                      <th key={c}>{c.substring(0, 20)}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {matrixData.matrix.map((row, i) => (
                    <tr key={i}>
                      <th>{matrixData.cities[i].substring(0, 20)}</th>
                      {row.map((val, j) => (
                        <td key={j} className={val > 0 ? 'dm-connected' : ''}>
                          {val > 0 ? val : '—'}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryManagement;
