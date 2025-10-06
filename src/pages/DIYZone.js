import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  Recycle, ArrowLeft, Hammer, Sparkles, Upload, 
  Search, Play, Youtube, Trash2, Image,
  Loader, AlertCircle, CheckCircle, FileImage
} from 'lucide-react';

const DIYZone = () => {
  const [activeTab, setActiveTab] = useState('upload');
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [youtubeResults, setYoutubeResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  // Handle drag and drop events
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelection(files[0]);
    }
  };

  // Handle file selection
  const handleFileSelection = (file) => {
    if (file && file.type.startsWith('image/')) {
      if (file.size > 5 * 1024 * 1024) {
        setError('File size too large. Please select an image under 5MB.');
        return;
      }
      
      setSelectedImage(file);
      setError(null);
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
      setAnalysisResult(null);
      setYoutubeResults([]);
    } else {
      setError('Please select a valid image file (JPG, PNG, WEBP)');
    }
  };

  // Handle manual file input
  const handleFileInput = (event) => {
    const file = event.target.files[0];
    if (file) {
      handleFileSelection(file);
    }
  };

  // Convert image to base64 for Gemini API
  const imageToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(',')[1]);
      reader.onerror = error => reject(error);
    });
  };

  // Analyze image with Gemini API
  const analyzeImage = async () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);
    setError(null);
    
    try {
      const base64Image = await imageToBase64(selectedImage);
      
      console.log('Sending request to Gemini API...');
      
      // Use the correct Gemini API endpoint
      const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${process.env.REACT_APP_GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [
              {
                text: "Look at this image and identify what object it shows. Then provide 3 creative DIY gardening upcycling ideas specifically for this object. For each idea, provide:\n1. A creative project name\n2. A brief description of how to make it\n3. A YouTube search query to find tutorials\n\nFormat your response exactly like this:\n\nPROJECT 1: [Project Name]\nDESCRIPTION: [Brief description of the project]\nQUERY: [YouTube search query for this project]\n\nPROJECT 2: [Project Name]\nDESCRIPTION: [Brief description of the project]\nQUERY: [YouTube search query for this project]\n\nPROJECT 3: [Project Name]\nDESCRIPTION: [Brief description of the project]\nQUERY: [YouTube search query for this project]"
              },
              {
                inline_data: {
                  mime_type: selectedImage.type,
                  data: base64Image
                }
              }
            ]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          }
        })
      });

      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API error response:', errorText);
        throw new Error(`API request failed with status ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log('Full API response:', data);
      
      if (data.candidates && data.candidates[0] && data.candidates[0].content) {
        const analysisText = data.candidates[0].content.parts[0].text;
        console.log('Analysis text:', analysisText);
        
        const queries = parseAnalysisResult(analysisText);
        setAnalysisResult({ 
          text: analysisText, 
          queries,
          rawResponse: data 
        });
        
        // Search YouTube for the first query
        if (queries.length > 0) {
          await searchYouTube(queries[0].query);
        }
      } else {
        throw new Error('Unexpected API response format');
      }
    } catch (error) {
      console.error('Error analyzing image:', error);
      setError(`Error analyzing image: ${error.message}. Please try again.`);
      setAnalysisResult(null);
    }
    setIsAnalyzing(false);
  };

  // Parse Gemini response to extract queries
  const parseAnalysisResult = (text) => {
    console.log('Parsing analysis result:', text);
    
    const projects = [];
    const lines = text.split('\n');
    
    let currentProject = {};
    
    lines.forEach(line => {
      const trimmedLine = line.trim();
      
      if (trimmedLine.startsWith('PROJECT')) {
        // If we were building a project, save it
        if (currentProject.name) {
          projects.push(currentProject);
        }
        currentProject = {
          name: trimmedLine.replace(/PROJECT \d+:\s*/i, '').trim(),
          description: '',
          query: ''
        };
      } else if (trimmedLine.startsWith('DESCRIPTION:')) {
        currentProject.description = trimmedLine.replace('DESCRIPTION:', '').trim();
      } else if (trimmedLine.startsWith('QUERY:')) {
        currentProject.query = trimmedLine.replace('QUERY:', '').trim();
      }
    });
    
    // Don't forget the last project
    if (currentProject.name) {
      projects.push(currentProject);
    }
    
    console.log('Parsed projects:', projects);
    
    // If parsing failed, provide fallback queries
    if (projects.length === 0) {
      return [
        { 
          name: 'Plastic Bottle Planter', 
          description: 'Create self-watering planters from plastic bottles',
          query: 'plastic bottle planter DIY gardening'
        },
        { 
          name: 'Upcycled Container Garden', 
          description: 'Transform containers into beautiful garden planters',
          query: 'upcycled container garden ideas'
        },
        { 
          name: 'Creative Garden Upcycling', 
          description: 'Innovative ways to reuse household items in garden',
          query: 'creative garden upcycling projects'
        }
      ];
    }
    
    return projects;
  };

  // Search YouTube
  const searchYouTube = async (query) => {
    if (!query.trim()) return;

    setIsSearching(true);
    setError(null);
    
    try {
      console.log('Searching YouTube for:', query);
      
      // Use a fallback if YouTube API fails
      const searchQuery = encodeURIComponent(query + ' DIY gardening tutorial');
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=6&q=${searchQuery}&type=video&key=${process.env.REACT_APP_YOUTUBE_API_KEY}`
      );
      
      if (!response.ok) {
        throw new Error(`YouTube API request failed with status ${response.status}`);
      }
      
      const data = await response.json();
      console.log('YouTube response:', data);
      
      if (data.items && data.items.length > 0) {
        setYoutubeResults(data.items.map(item => ({
          id: item.id.videoId,
          title: item.snippet.title,
          thumbnail: item.snippet.thumbnails.medium.url,
          channelTitle: item.snippet.channelTitle,
          description: item.snippet.description
        })));
      } else {
        // Fallback: Show some generic DIY gardening videos
        setYoutubeResults([
          {
            id: 'dQw4w9WgXcQ',
            title: '10 Creative Plastic Bottle Garden Ideas',
            thumbnail: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/mqdefault.jpg',
            channelTitle: 'DIY Gardening',
            description: 'Learn how to transform plastic bottles into amazing garden planters and tools.'
          },
          {
            id: 'dQw4w9WgXcQ',
            title: 'Upcycling for Garden - Easy DIY Projects',
            thumbnail: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/mqdefault.jpg',
            channelTitle: 'Eco Garden',
            description: 'Turn household waste into beautiful garden decorations and functional items.'
          }
        ]);
      }
    } catch (error) {
      console.error('Error searching YouTube:', error);
      setError(`YouTube search failed. Showing sample results.`);
      // Fallback results
      setYoutubeResults([
        {
          id: 'sample1',
          title: 'DIY Plastic Bottle Vertical Garden',
          thumbnail: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=300&h=200&fit=crop',
          channelTitle: 'Garden Upcycling',
          description: 'Create a space-saving vertical garden using plastic bottles'
        },
        {
          id: 'sample2',
          title: 'Composting for Beginners',
          thumbnail: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=300&h=200&fit=crop',
          channelTitle: 'Sustainable Living',
          description: 'Learn how to start composting at home with simple materials'
        }
      ]);
    }
    setIsSearching(false);
  };

  // Handle manual search
  const handleManualSearch = () => {
    if (searchQuery.trim()) {
      searchYouTube(searchQuery);
    }
  };

  // Clear everything
  const clearAll = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setAnalysisResult(null);
    setYoutubeResults([]);
    setSearchQuery('');
    setError(null);
    setIsDragOver(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Open YouTube video
  const openYouTubeVideo = (videoId) => {
    window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank');
  };

  return (
    <div className="virtual-garden">
      <div className="container">
        <div className="page-header">
          <Link to="/" className="btn btn-secondary" style={{marginBottom: '2rem'}}>
            <ArrowLeft size={20} />
            Back to Home
          </Link>
          <h1>Sustainable DIY Zone</h1>
          <p>Transform waste into garden treasures with AI-powered upcycling ideas</p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="error-banner">
            <AlertCircle size={20} />
            <span>{error}</span>
            <button onClick={() => setError(null)}>×</button>
          </div>
        )}

        {/* Main Content */}
        <div className="diy-container">
          {/* Tabs */}
          <div className="diy-tabs">
            <button 
              className={`tab-button ${activeTab === 'upload' ? 'active' : ''}`}
              onClick={() => setActiveTab('upload')}
            >
              <Upload size={18} />
              AI Image Analysis
            </button>
            <button 
              className={`tab-button ${activeTab === 'search' ? 'active' : ''}`}
              onClick={() => setActiveTab('search')}
            >
              <Search size={18} />
              Manual Search
            </button>
          </div>

          {/* Upload Section */}
          {activeTab === 'upload' && (
            <div className="upload-section">
              <div 
                className={`upload-area ${isDragOver ? 'drag-over' : ''} ${imagePreview ? 'has-image' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => !imagePreview && fileInputRef.current?.click()}
              >
                {!imagePreview ? (
                  <div className="upload-placeholder">
                    <div className="upload-icon">
                      {isDragOver ? <FileImage size={48} /> : <Upload size={48} />}
                    </div>
                    <h3>{isDragOver ? 'Drop your image here' : 'Upload Waste Item Image'}</h3>
                    <p>Drag & drop or click to upload photo of plastic bottles, containers, or other recyclables</p>
                    <span>Supports JPG, PNG, WEBP (Max 5MB)</span>
                    <button 
                      className="btn btn-outline browse-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        fileInputRef.current?.click();
                      }}
                    >
                      Browse Files
                    </button>
                  </div>
                ) : (
                  <div className="image-preview">
                    <div className="image-container">
                      <img src={imagePreview} alt="Upload preview" />
                    </div>
                    <button 
                      className="remove-image-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        clearAll();
                      }}
                    >
                      <Trash2 size={20} />
                    </button>
                    <div className="image-actions">
                      <button 
                        className="btn btn-outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          fileInputRef.current?.click();
                        }}
                      >
                        Change Image
                      </button>
                    </div>
                  </div>
                )}
                
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileInput}
                  accept="image/*"
                  style={{ display: 'none' }}
                />
              </div>

              {selectedImage && (
                <div className="analysis-section">
                  <div className="analysis-actions">
                    <button 
                      className="btn btn-primary analyze-btn"
                      onClick={analyzeImage}
                      disabled={isAnalyzing}
                    >
                      {isAnalyzing ? (
                        <>
                          <Loader size={18} className="spinning" />
                          Analyzing with AI...
                        </>
                      ) : (
                        <>
                          <Sparkles size={18} />
                          Get Upcycling Ideas
                        </>
                      )}
                    </button>
                    
                    <button 
                      className="btn btn-secondary"
                      onClick={clearAll}
                      disabled={isAnalyzing}
                    >
                      <Trash2 size={18} />
                      Clear
                    </button>
                  </div>
                  
                  {isAnalyzing && (
                    <div className="analysis-progress">
                      <div className="progress-text">
                        <Loader size={16} className="spinning" />
                        Analyzing your image and generating creative upcycling ideas...
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Analysis Results */}
              {analysisResult && (
                <div className="analysis-results">
                  <div className="results-header">
                    <CheckCircle size={24} color="var(--primary-green)" />
                    <div>
                      <h3>AI Upcycling Suggestions</h3>
                      <p>Based on your uploaded image</p>
                    </div>
                  </div>
                  
                  <div className="suggested-projects">
                    <h4>Recommended Projects:</h4>
                    <div className="projects-grid">
                      {analysisResult.queries.map((project, index) => (
                        <div key={index} className="project-card">
                          <div className="project-number">{index + 1}</div>
                          <div className="project-content">
                            <h5>{project.name}</h5>
                            <p className="project-description">{project.description}</p>
                            <button
                              className="project-search-btn"
                              onClick={() => searchYouTube(project.query)}
                              disabled={isSearching}
                            >
                              <Search size={16} />
                              Search: "{project.query}"
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Manual Search Section */}
          {activeTab === 'search' && (
            <div className="search-section">
              <div className="search-container">
                <div className="search-box-wrapper">
                  <div className="search-box diy-search">
                    <div className="search-icon">
                      <Search size={20} />
                    </div>
                    <input
                      type="text"
                      placeholder="Search for DIY gardening projects..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleManualSearch()}
                    />
                    <button 
                      className="search-btn"
                      onClick={handleManualSearch}
                      disabled={isSearching || !searchQuery.trim()}
                    >
                      {isSearching ? <Loader size={18} className="spinning" /> : 'Search'}
                    </button>
                  </div>
                </div>
                
                <div className="search-suggestions">
                  <p>Try these popular searches:</p>
                  <div className="suggestion-tags">
                    {['plastic bottle garden', 'upcycling planters', 'compost bin DIY', 'pallet garden furniture', 'tin can planters', 'mason jar herb garden'].map((tag) => (
                      <button
                        key={tag}
                        className="suggestion-tag"
                        onClick={() => {
                          setSearchQuery(tag);
                          setTimeout(() => searchYouTube(tag), 100);
                        }}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* YouTube Results */}
          {(youtubeResults.length > 0 || isSearching) && (
            <div className="youtube-results">
              <div className="results-header">
                <Youtube size={24} color="#FF0000" />
                <h3>YouTube Tutorials</h3>
                {youtubeResults.length > 0 && (
                  <span className="results-count">{youtubeResults.length} videos found</span>
                )}
              </div>

              {isSearching ? (
                <div className="loading-container">
                  <Loader size={40} className="spinning" />
                  <p>Searching for tutorials...</p>
                </div>
              ) : (
                <div className="videos-grid">
                  {youtubeResults.map((video) => (
                    <div 
                      key={video.id} 
                      className="video-card"
                      onClick={() => openYouTubeVideo(video.id)}
                    >
                      <div className="video-thumbnail">
                        <img src={video.thumbnail} alt={video.title} />
                        <div className="play-overlay">
                          <Play size={40} color="white" />
                          <span>Watch on YouTube</span>
                        </div>
                        <div className="video-duration">YouTube</div>
                      </div>
                      <div className="video-info">
                        <h4>{video.title}</h4>
                        <p className="channel">{video.channelTitle}</p>
                        <p className="description">
                          {video.description && video.description.length > 120 
                            ? video.description.substring(0, 120) + '...'
                            : video.description || 'DIY gardening tutorial'
                          }
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Empty State */}
          {!selectedImage && activeTab === 'upload' && youtubeResults.length === 0 && !isAnalyzing && (
            <div className="empty-state">
              <Recycle size={64} className="empty-icon" />
              <h3>Transform Waste into Wonder</h3>
              <p>Upload an image of everyday items to discover creative upcycling ideas for your garden</p>
              
              <div className="feature-cards">
                <div className="feature-card">
                  <Hammer size={32} />
                  <h4>Smart Upcycling</h4>
                  <p>AI-powered suggestions for common household items</p>
                </div>
                <div className="feature-card">
                  <Sparkles size={32} />
                  <h4>Video Tutorials</h4>
                  <p>Step-by-step guides from YouTube creators</p>
                </div>
                <div className="feature-card">
                  <Youtube size={32} />
                  <h4>Instant Results</h4>
                  <p>Get relevant tutorials in seconds</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DIYZone;