import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { GoogleGenAI } from "@google/genai";
import { 
  Lightbulb, 
  ArrowLeft, 
  BookOpen, 
  GraduationCap, 
  Play, 
  Clock, 
  Users, 
  Star,
  Leaf,
  Sprout,
  Sparkles,
  RefreshCw
} from 'lucide-react';

const Microlearning = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [aiFacts, setAiFacts] = useState([]);
  const [loadingFacts, setLoadingFacts] = useState(true);
  const [factError, setFactError] = useState(false);

  // Initialize Google GenAI with API key from environment
  const API_KEY = process.env.REACT_APP_GEMINI_API_KEY;
  const ai = new GoogleGenAI({ apiKey: API_KEY });

  // Sample course data with YouTube links and Unsplash thumbnails
  const courses = [
    {
      id: 1,
      title: '8 MULTIFUNCTIONAL MEDICINAL HERBS',
      description: 'Discover the incredible healing properties of common medicinal plants and how to use them safely.',
      youtubeId: 'dlHGq6bLbh4',
      thumbnail: 'https://images.unsplash.com/photo-1611073761742-bce90ccd60ae?q=80',
      duration: '52:11',
      level: 'Beginner',
      lessons: 8,
      rating: 4.8,
      category: 'medicine'
    },
    {
      id: 2,
      title: 'All about AYUSH. Ayurveda, Yoga & Naturopathy, Unani, Siddha and Homeopathy',
      description: 'A guide on understanding the AYUSH medicinal system and learning about traditional Indian healing herbs.',
      youtubeId: 'GcJYDEFFKhc',
      thumbnail: 'https://images.unsplash.com/photo-1492552181161-62217fc3076d?q=80&',
      duration: '8:53',
      level: 'Beginner',
      lessons: 6,
      rating: 4.7,
      category: 'ayurveda'
    },
    {
      id: 3,
      title: 'Tulsi / Holy Basil - How to Grow and Harvest',
      description: 'Learn everything about growing Tulsi - from planting to harvesting and using this sacred herb.',
      youtubeId: 'OLzqNjAuv-U',
      thumbnail: 'https://images.unsplash.com/photo-1645682479324-8517af445ba6?q=80&',
      duration: '7:37',
      level: 'Beginner',
      lessons: 5,
      rating: 4.9,
      category: 'ayurveda'
    },
    {
      id: 4,
      title: 'Grow Your Own Pharmacy, 10 Healing Herbs You Need!',
      description: 'Step-by-step guide to creating your first medicinal herb garden with easy-to-grow plants.',
      youtubeId: 'Bh7HUetelMc',
      thumbnail: 'https://images.unsplash.com/photo-1601654253194-260e0b6984f9?q=80&',
      duration: '33:44',
      level: 'Beginner',
      lessons: 10,
      rating: 4.6,
      category: 'gardening'
    },
    {
      id: 5,
      title: 'Ashwagandha - The Stress Relief Herb',
      description: 'The Unique Benefits of ASHWAGANDHA',
      youtubeId: 'vqzNWVVo5Is',
      thumbnail: 'https://images.unsplash.com/photo-1569936906148-06de87cb0681?q=80&',
      duration: '6:27',
      level: 'Intermediate',
      lessons: 7,
      rating: 4.8,
      category: 'ayurveda'
    },
    {
      id: 6,
      title: 'How to make natural shampoos',
      description: '5 Natural shampoo - natural ways to wash your hair to stop hair fall and grow thicker hair',
      youtubeId: 'pwzbXdQfrJc',
      thumbnail: 'https://images.unsplash.com/photo-1655892817271-c66841c2506e?q=80&',
      duration: '9:34',
      level: 'Intermediate',
      lessons: 12,
      rating: 4.9,
      category: 'medicine'
    },
  ];

  const categories = [
    { id: 'all', name: 'All Courses', count: courses.length },
    { id: 'gardening', name: 'Gardening', count: courses.filter(c => c.category === 'gardening').length },
    { id: 'ayurveda', name: 'Ayurveda', count: courses.filter(c => c.category === 'ayurveda').length },
    { id: 'medicine', name: 'Medicine', count: courses.filter(c => c.category === 'medicine').length },
    { id: 'sustainability', name: 'Sustainability', count: courses.filter(c => c.category === 'sustainability').length }
  ];

  // Fetch AI facts using the new Google GenAI SDK
  const fetchAIFacts = async () => {
    // Don't try to fetch if no API key
    if (!API_KEY) {
      console.log('No Gemini API key found, using fallback facts');
      setAiFacts(getFallbackFacts());
      setLoadingFacts(false);
      setFactError(true);
      return;
    }

    try {
      setLoadingFacts(true);
      setFactError(false);

      const prompt = `Generate 6 interesting, educational, and surprising facts about medicinal plants, Ayurveda, AYUSH system, herbal gardening, and traditional Indian medicine. 
      
      Requirements:
      - Each fact should be unique and surprising
      - Include relevant emojis for each fact
      - Focus on Indian medicinal plants and AYUSH system, also gardening
      - Make it engaging for herbal medicine learners
      - Each fact should be 1-2 sentences maximum
      - Return only the facts, one per line, no numbering
      - Include specific plant names like Tulsi, Ashwagandha, Turmeric, Neem, Brahmi, etc.
      
      Example format:
      🌿 Tulsi (Holy Basil) can naturally purify air and is worshipped in Hindu households for its spiritual significance.
      💊 Ashwagandha can reduce cortisol levels by up to 30% and has been used for 3000 years in Ayurveda.`;

      // Use the new Google GenAI SDK
      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash", // Using the recommended model
        contents: prompt,
      });

      if (!response.text) {
        throw new Error('No response text from AI');
      }

      const text = response.text;
      
      // Parse the response into individual facts
      const facts = text.split('\n')
        .filter(line => line.trim().length > 10 && !line.includes('```')) // Filter out short lines and code blocks
        .slice(0, 6) // Take first 5 facts
        .map(fact => fact.replace(/^[-•\d\s\.]+/, '').trim()) // Remove bullets and numbering
        .filter(fact => fact.length > 0);

      if (facts.length === 0) {
        // If parsing fails, use the raw text
        const rawFacts = text.split('\n').filter(line => line.trim().length > 20).slice(0, 5);
        setAiFacts(rawFacts.length > 0 ? rawFacts : getFallbackFacts());
      } else {
        setAiFacts(facts);
      }
      
      setLoadingFacts(false);
      
    } catch (error) {
      console.error('Error fetching AI facts:', error);
      setFactError(true);
      setLoadingFacts(false);
      setAiFacts(getFallbackFacts());
    }
  };

  // Separate function for fallback facts
  const getFallbackFacts = () => [
    "🌿 Tulsi (Holy Basil) is called the 'Queen of Herbs' in Ayurveda and is worshipped daily in Hindu households for its spiritual significance.",
    "💊 Ashwagandha can reduce cortisol levels by up to 30% and has been used in Ayurvedic medicine for over 3,000 years as a powerful adaptogen.",
    "🟡 Turmeric contains curcumin, which has anti-inflammatory effects so potent they match some pharmaceutical drugs without the side effects.",
    "🌱 Neem is called 'Sarva Roga Nivarini' - the curer of all ailments - in Sanskrit, and every part of the tree has medicinal uses.",
    "🧠 Brahmi (Bacopa monnieri) enhances memory and cognitive function by increasing protein kinase activity and new nerve cell development."
  ];

  useEffect(() => {
    fetchAIFacts();
  }, []);

  const handleRefreshFacts = () => {
    fetchAIFacts();
  };

  const filteredCourses = activeCategory === 'all' 
    ? courses 
    : courses.filter(course => course.category === activeCategory);

  const handleStartCourse = (youtubeId) => {
    // Open YouTube video in new tab
    window.open(`https://www.youtube.com/watch?v=${youtubeId}`, '_blank', 'noopener,noreferrer');
  };

  const CourseCard = ({ course }) => (
    <div className="course-card">
      <div className="course-image">
        <img 
          src={course.thumbnail} 
          alt={course.title}
          className="course-thumbnail"
          loading="lazy"
        />
        <div className="course-overlay">
          <div className="play-button">
            <Play size={32} fill="white" />
          </div>
        </div>
      </div>
      
      <div className="course-content">
        <div className="course-category">{course.category}</div>
        <h3 className="course-title">{course.title}</h3>
        <p className="course-description">{course.description}</p>
        
        <div className="course-meta">
          <div className="meta-item">
            <Clock size={16} />
            <span>{course.duration}</span>
          </div>
          <div className="meta-item">
            <BookOpen size={16} />
            <span>{course.lessons} lessons</span>
          </div>
          <div className="meta-item">
            <Star size={16} fill="currentColor" />
            <span>{course.rating}</span>
          </div>
        </div>
        
        <div className="course-level">{course.level}</div>
        
        <button 
          className="btn btn-primary course-btn"
          onClick={() => handleStartCourse(course.youtubeId)}
        >
          <Play size={20} />
          Start Course
        </button>
      </div>
    </div>
  );

  return (
    <div className="virtual-garden">
      <div className="container">
        <div className="page-header">
          <Link to="/" className="btn btn-secondary" style={{marginBottom: '2rem'}}>
            <ArrowLeft size={20} />
            Back to Home
          </Link>
          <h1>Microlearning Hub</h1>
          <p>Personalized educational content based on your interests</p>
        </div>

        {/* AI Learning Facts Section */}
        <div className="ai-learning-section">
          <div className="ai-learning-header">
            <div className="ai-title">
              <Sparkles size={24} />
              <h2>Did you know? (AI Learning)</h2>
            </div>
            <button 
              className="refresh-facts-btn"
              onClick={handleRefreshFacts}
              disabled={loadingFacts}
            >
              <RefreshCw size={16} className={loadingFacts ? 'spinning' : ''} />
              {loadingFacts ? 'Generating...' : 'New Facts'}
            </button>
          </div>
          
          <div className="facts-container">
            {loadingFacts ? (
              <div className="facts-loading">
                <div className="loading-spinner"></div>
                <p>AI is generating fascinating facts about medicinal plants...</p>
              </div>
            ) : (
              <div className="facts-grid">
                {aiFacts.map((fact, index) => (
                  <div key={index} className="fact-card">
                    <span className="fact-text">{fact}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          {factError && (
            <div className="facts-notice">
              <small>
                {!API_KEY 
                  ? "AI features require an API key. Showing enhanced knowledge base."
                  : "Showing enhanced knowledge base. Click 'New Facts' to try AI again."
                }
              </small>
            </div>
          )}
        </div>

        {/* Stats Overview */}
        <div className="stats-overview" style={{marginBottom: '3rem'}}>
          <div className="stat-card">
            <div className="stat-icon">
              <BookOpen size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-value">{courses.length}</div>
              <div className="stat-label">Available Courses</div>
              <div className="stat-subtitle">Learn at your pace</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">
              <Clock size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-value">2+</div>
              <div className="stat-label">Hours of Content</div>
              <div className="stat-subtitle">Bite-sized lessons</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">
              <Users size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-value">4.8/5</div>
              <div className="stat-label">Average Rating</div>
              <div className="stat-subtitle">From 2.5K+ learners</div>
            </div>
  </div>
          <div className="stat-card">
            <div className="stat-icon">
              <GraduationCap size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-value">2</div>
              <div className="stat-label">Skill Levels</div>
              <div className="stat-subtitle">Beginner to Intermediate</div>
            </div>
          </div>
        </div>

        {/* Category Filters */}
        <div className="category-filters">
          <div className="filters-header">
            <h3>Browse Courses</h3>
            <p>Select a category to explore specific topics</p>
          </div>
          <div className="filters-grid">
            {categories.map(category => (
              <button
                key={category.id}
                className={`filter-btn ${activeCategory === category.id ? 'active' : ''}`}
                onClick={() => setActiveCategory(category.id)}
              >
                <span className="filter-name">{category.name}</span>
                <span className="filter-count">{category.count}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Courses Grid */}
        <div className="courses-section">
          <div className="section-header">
            <h3>Featured Courses</h3>
            <span className="section-badge">{filteredCourses.length} courses</span>
          </div>
          
          {filteredCourses.length === 0 ? (
            <div className="no-results">
              <BookOpen size={64} />
              <h3>No courses found</h3>
              <p>Try selecting a different category</p>
            </div>
          ) : (
            <div className="courses-grid">
              {filteredCourses.map(course => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          )}
        </div>

        {/* Learning Path Section */}
        <div className="learning-path">
          <div className="path-header">
            <Lightbulb size={48} />
            <h2>Structured Learning Paths</h2>
            <p>Follow these curated paths to master herbal wellness step by step</p>
          </div>
          
          <div className="path-cards">
            <div className="path-card">
              <div className="path-icon gardening">
                <Sprout size={32} />
              </div>
              <h4>Beginner Gardener</h4>
              <p>Start your herbal garden journey with basic gardening techniques</p>
              <div className="path-courses">
                <span>3 courses • 45 minutes</span>
              </div>
            </div>
            
            <div className="path-card">
              <div className="path-icon medicine">
                <Leaf size={32} />
              </div>
              <h4>Herbal Medicine Maker</h4>
              <p>Learn to create effective herbal remedies and preparations</p>
              <div className="path-courses">
                <span>4 courses • 1.5 hours</span>
              </div>
            </div>
            
            <div className="path-card">
              <div className="path-icon advanced">
                <GraduationCap size={32} />
              </div>
              <h4>Advanced Herbalist</h4>
              <p>Master complex formulations and traditional healing systems</p>
              <div className="path-courses">
                <span>5 courses • 2+ hours</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Microlearning;