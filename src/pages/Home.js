import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Leaf, Calculator, Recycle, ShoppingCart, Sprout, Book, Globe, Search, Users, Lightbulb, BarChart3, GitBranch, Truck } from 'lucide-react';

const Home = () => {
  const features = [
    {
      icon: <Leaf />,
      title: 'Virtual Herbal Garden',
      description: 'Explore interactive 3D models of AYUSH medicinal plants with botanical info, uses, and AI-powered climate resilience ratings.',
      path: '/garden',
      color: 'green'
    },
    {
      icon: <BarChart3 />,
      title: 'AI Garden Planner',
      description: 'Get personalized garden layouts based on your location with climate-suitable herb recommendations and low-maintenance combos.',
      path: '/planner',
      color: 'purple'
    },
    {
      icon: <Calculator />,
      title: 'Carbon Calculator',
      description: 'Track CO₂ absorption from your plants with AI-refined estimates and fun environmental impact equivalents.',
      path: '/carbon',
      color: 'teal'
    },
    {
      icon: <Search />,
      title: 'AI Herb Search',
      description: 'Smart search by plant name or medicinal use with natural language understanding and climate-adaptive filters.',
      path: '/search',
      color: 'blue'
    },
    {
      icon: <Recycle />,
      title: 'Sustainable DIY Zone',
      description: 'Upcycling guides and composting tips with AI suggestions for transforming waste into garden resources.',
      path: '/diy',
      color: 'orange'
    },
    {
      icon: <Lightbulb />,
      title: 'Microlearning Hub',
      description: 'Personalized educational content and herbal facts based on your interests and regional climate patterns.',
      path: '/learn',
      color: 'pink'
    },
    {
      icon: <Users />,
      title: 'Personal Dashboard',
      description: 'Track your garden progress, bookmark herbs, and get AI-powered suggestions for new plants and combos.',
      path: '/dashboard',
      color: 'indigo'
    },
    {
      icon: <ShoppingCart />,
      title: 'Eco Marketplace',
      description: 'Shop for seeds, saplings, and garden tools with AI recommendations based on your location and garden type.',
      path: 'https://arogya-ecommerce.vercel.app',
      color: 'pink',
      external: true
    },
    {
      icon: <GitBranch />,
      title: 'AVL Plant Editor',
      description: 'Manage plant database with self-balancing AVL tree technology. Admin-only access for secure insertion and deletion operations with real-time tree updation.',
      path: '/avl',
      color: 'green'
    },
    {
      icon: <Truck />,
      title: 'Delivery Routes',
      description: 'Optimize delivery paths using Adjacency Matrix with multiple route visualization on interactive maps.',
      path: '/delivery',
      color: 'orange'
    }
  ];

  const stats = [
    { number: '50+', label: 'AYUSH Medicinal Plants' },
    { number: '2.5K+', label: 'Active Gardeners' },
    { number: '15T+', label: 'CO₂ Offset Tracked' },
    { number: '98%', label: 'Climate Match Accuracy' }
  ];

  const missionPoints = [
    {
      icon: <Leaf size={24} />,
      title: 'Climate Resilience',
      description: 'Promote climate-resilient cultivation practices for medicinal plants and biodiversity conservation'
    },
    {
      icon: <Book size={24} />,
      title: 'Knowledge Preservation',
      description: 'Digitize and preserve traditional herbal knowledge for future generations through interactive learning'
    },
    {
      icon: <Globe size={24} />,
      title: 'Sustainable Living',
      description: 'Encourage sustainable home gardening and eco-friendly practices for urban and rural communities'
    }
  ];

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge">
            <Sprout size={20} />
            <span>AI-Powered Herbal Wellness</span>
          </div>
          
          <h1 className="hero-title">
            ArogyaVatika
            <span className="subtitle">Where Ancient AYUSH Wisdom Meets Modern AI Technology</span>
          </h1>
          
          <p className="hero-description">
            A climate-smart virtual herbal garden platform that bridges traditional medicinal knowledge 
            with cutting-edge AI to promote sustainable living, environmental wellness, and personalized herbal care.
          </p>
          
          <div className="hero-actions">
            <Link to="/garden" className="btn btn-primary">
              Explore Virtual Garden
              <ArrowRight size={20} />
            </Link>
            <Link to="/planner" className="btn btn-secondary">
              Start AI Garden Planning
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats">
        <div className="container">
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <div key={index} className="stat-item">
                <div className="stat-number">{stat.number}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Complete Herbal Wellness Platform</h2>
            <p className="section-subtitle">
              All-in-one solution featuring AI-powered tools for climate-resilient herbal gardening and sustainable living
            </p>
          </div>
          
          <div className="features-grid-compact">
            {features.map((feature, index) => (
              feature.external ? (
                <a
                  key={index}
                  href={feature.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="feature-card-compact"
                >
                  <div className={`feature-icon-compact ${feature.color}`}>
                    {feature.icon}
                  </div>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                  <div className="feature-arrow">
                    <ArrowRight size={20} />
                  </div>
                </a>
              ) : (
                <Link key={index} to={feature.path} className="feature-card-compact">
                  <div className={`feature-icon-compact ${feature.color}`}>
                    {feature.icon}
                  </div>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                  <div className="feature-arrow">
                    <ArrowRight size={20} />
                  </div>
                </Link>
              )
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="mission">
        <div className="container">
          <div className="mission-grid">
            <div className="mission-content">
              <h2 className="section-title">Our Climate-Smart Mission</h2>
              <p className="mission-text">
                ArogyaVatika addresses the critical challenge of climate change impacting medicinal plants 
                vital to AYUSH systems. Our AI-powered platform combines traditional wisdom with modern technology 
                to create resilient herbal ecosystems and promote environmental stewardship.
              </p>
              <div className="mission-points">
                {missionPoints.map((point, index) => (
                  <div key={index} className="mission-point">
                    <div className="point-icon">
                      {point.icon}
                    </div>
                    <div>
                      <h4>{point.title}</h4>
                      <p>{point.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mission-visual">
              <div 
                className="visual-card"
                style={{
                  background: `url('https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80') center/cover`,
                  position: 'relative',
                  color: 'white'
                }}
              >
                <Sprout size={48} />
                <h3>AI-Enhanced Herbal Journey</h3>
                <p>Experience personalized plant recommendations, climate adaptation tips, and sustainable gardening practices powered by intelligent algorithms.</p>
                <div style={{marginTop: '1.5rem', fontSize: '0.9rem', opacity: 0.9}}>
                  <strong>Smart Features:</strong>
                  <br/>• Climate Resilience Scoring
                  <br/>• Location-Based Planning
                  <br/>• Carbon Impact Tracking
                  <br/>• Personalized Learning
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
