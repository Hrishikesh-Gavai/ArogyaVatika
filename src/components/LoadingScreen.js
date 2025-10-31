import React from 'react';
import { Sprout } from 'lucide-react'; // Make sure this import exists

const LoadingScreen = ({ message = "Loading..." }) => {
  return (
    <div className="loading-screen">
      <div className="loading-content">
        <div className="loading-animation">
          <Sprout className="loading-icon" />
          <div className="loading-pulse"></div>
        </div>
        <h3 className="loading-title">ArogyaVatika</h3>
        <p className="loading-message">{message}</p>
        <div className="loading-progress">
          <div className="progress-bar">
            <div className="progress-fill"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;