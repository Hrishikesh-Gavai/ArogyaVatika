import React from 'react';

const AppLoadingScreen = ({ progress = 0 }) => {
  return (
    <div className="app-loading-screen">
      <div className="app-loading-content">
        <div className="nerv-text-container">
          <div className="nerv-text" style={{ '--fill-percent': `${progress}%` }}>
            N.E.R.V
          </div>
        </div>
        
        <div className="app-loading-progress">
          <div className="app-progress-bar">
            <div 
              className="app-progress-fill"
              style={{ 
                width: `${progress}%`,
                animation: progress === 100 ? 'app-progress-complete 0.5s ease-out' : 'none'
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppLoadingScreen;