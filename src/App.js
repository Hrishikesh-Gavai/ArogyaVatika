import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import VirtualGarden from './pages/VirtualGarden';
import GardenPlanner from './pages/GardenPlanner';
import CarbonCalculator from './pages/CarbonCalculator';
import AIHerbSearch from './pages/AIHerbSearch';
import DIYZone from './pages/DIYZone';
import Microlearning from './pages/Microlearning';
import Dashboard from './pages/Dashboard';
import AppLoadingScreen from './components/AppLoadingScreen';
import Login from './pages/Login';
import AVL from './pages/AVL';
import DeliveryManagement from './pages/DeliveryManagement';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    const loadApp = async () => {
      try {
        // Simulate different loading phases
        setLoadingProgress(10);
        await new Promise(resolve => setTimeout(resolve, 400)); // Initial setup
        
        setLoadingProgress(25);
        await new Promise(resolve => setTimeout(resolve, 400)); // Theme context
        
        setLoadingProgress(40);
        await new Promise(resolve => setTimeout(resolve, 400)); // Router setup
        
        setLoadingProgress(60);
        await new Promise(resolve => setTimeout(resolve, 400)); // Components
        
        setLoadingProgress(80);
        await new Promise(resolve => setTimeout(resolve, 400)); // Final setup
        
        setLoadingProgress(100);
        
        // Small delay to show 100% progress before transitioning
        setTimeout(() => setIsLoading(false), 500);
        
      } catch (error) {
        console.error('Error loading app:', error);
        setIsLoading(false);
      }
    };

    loadApp();
  }, []);

  // Show app loading screen while loading
  if (isLoading) {
    return <AppLoadingScreen progress={loadingProgress} />;
  }

  // Return your main app once loading is complete
  return (
    <ThemeProvider>
      <Router>
        <div className="App">
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/garden" element={<VirtualGarden />} />
              <Route path="/planner" element={<GardenPlanner />} />
              <Route path="/carbon" element={<CarbonCalculator />} />
              <Route path="/search" element={<AIHerbSearch />} />
              <Route path="/diy" element={<DIYZone />} />
              <Route path="/learn" element={<Microlearning />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/login" element={<Login />} />
              <Route path="/avl" element={<AVL />} />
              <Route path="/delivery" element={<DeliveryManagement />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
