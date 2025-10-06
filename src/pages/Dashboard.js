import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, ArrowLeft, BarChart3, Bookmark, Calendar, 
  TrendingUp, Leaf, Sprout, Clock, Target, Download,
  Heart, Zap, Shield, Eye, Brain, Activity,
  Trophy, Award, Star, MessageCircle, ThumbsUp,
  User, TrendingDown, Building, Pill, Sparkles,
  Flower2, Trees, Mountain, Sun
} from 'lucide-react';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  
  // Dummy data
  const userStats = {
    plantsTracked: 12,
    carbonOffset: 45.6,
    gardenScore: 87,
    streakDays: 24,
    communityRank: 8
  };

  const favoritePlants = [
    {
      id: 1,
      name: 'Holy Basil',
      botanical: 'Ocimum tenuiflorum',
      uses: ['Immunity', 'Stress Relief'],
      lastCared: '2 days ago',
      health: 95
    },
    {
      id: 2,
      name: 'Turmeric',
      botanical: 'Curcuma longa',
      uses: ['Anti-inflammatory', 'Immunity'],
      lastCared: '1 day ago',
      health: 88
    },
    {
      id: 3,
      name: 'Aloe Vera',
      botanical: 'Aloe barbadensis',
      uses: ['Skin Care', 'Digestion'],
      lastCared: '3 days ago',
      health: 92
    }
  ];

  const aiSuggestions = [
    {
      type: 'combo',
      title: 'Immunity Boost Combo',
      description: 'Add Ginger and Licorice to enhance your immunity garden',
      reason: 'Based on your preference for immunity herbs'
    },
    {
      type: 'care',
      title: 'Prune Holy Basil',
      description: 'Time to prune for better growth and essential oil production',
      reason: 'Regular maintenance suggestion'
    },
    {
      type: 'discovery',
      title: 'Explore Skin Care Herbs',
      description: 'You have 3 immunity herbs. Want to explore herbs for skin care?',
      reason: 'Diversify your garden portfolio'
    }
  ];

  // Community Data
  const communityStats = {
    totalMembers: 1247,
    activeToday: 89,
    totalCO2Offset: 54230,
    plantsShared: 892
  };

  const topPerformers = [
    {
      rank: 1,
      name: 'GreenThumb Hrishikesh',
      co2Offset: 324.5,
      plants: 28,
      streak: 67,
      avatar: 'sarah',
      trend: 'up'
    },
    {
      rank: 2,
      name: 'Eco Warrior Yash',
      co2Offset: 298.2,
      plants: 25,
      streak: 45,
      avatar: 'mike',
      trend: 'up'
    },
    {
      rank: 3,
      name: 'Herbalist Siddhesh',
      co2Offset: 276.8,
      plants: 23,
      streak: 89,
      avatar: 'priya',
      trend: 'up'
    }
  ];

  const communityPosts = [
    {
      id: 1,
      user: 'Urban Gardener',
      avatar: 'urban',
      content: 'Just harvested my first batch of holy basil! The aroma is incredible. Any tips for drying?',
      likes: 24,
      comments: 8,
      time: '2 hours ago',
      userCo2: 156.3
    },
    {
      id: 2,
      user: 'Medicinal Plant Lover',
      avatar: 'medicine',
      content: 'My turmeric plants are thriving in the new raised beds. The rhizomes are looking healthy!',
      likes: 18,
      comments: 5,
      time: '5 hours ago',
      userCo2: 203.7
    },
    {
      id: 3,
      user: 'Balcony Gardener',
      avatar: 'balcony',
      content: 'Small space gardening challenge: Successfully growing 15 medicinal herbs in just 20 sq ft!',
      likes: 32,
      comments: 12,
      time: '1 day ago',
      userCo2: 89.2
    }
  ];

  const progressData = {
    monthly: [65, 72, 68, 79, 82, 85, 87],
    categories: {
      'Immunity Boosters': 3,
      'Stress Relief': 2,
      'Digestive Health': 1,
      'Skin Care': 1,
      'Respiratory': 2
    }
  };

  const upcomingTasks = [
    { task: 'Water Turmeric plants', time: 'Today, 6:00 PM', priority: 'high' },
    { task: 'Add compost to Holy Basil', time: 'Tomorrow, 8:00 AM', priority: 'medium' },
    { task: 'Check soil pH', time: 'In 2 days', priority: 'low' }
  ];

  // Avatar component with Lucide icons
  const UserAvatar = ({ type, size = 24 }) => {
    const avatarConfig = {
      sarah: <Flower2 size={size} />,
      mike: <Trees size={size} />,
      priya: <Sparkles size={size} />,
      urban: <Building size={size} />,
      medicine: <Pill size={size} />,
      balcony: <Sun size={size} />,
      default: <User size={size} />
    };

    return avatarConfig[type] || avatarConfig.default;
  };

  // Chart components
  const ProgressChart = () => (
    <div className="chart-container">
      <div className="chart-header">
        <h4>Garden Progress</h4>
        <span className="chart-value">{userStats.gardenScore}%</span>
      </div>
      <div className="chart-bars">
        {progressData.monthly.map((value, index) => (
          <div key={index} className="chart-bar-container">
            <div 
              className="chart-bar" 
              style={{ height: `${value}%` }}
              data-value={value}
            ></div>
            <span className="chart-label">W{index + 1}</span>
          </div>
        ))}
      </div>
    </div>
  );

  const CategoryChart = () => (
    <div className="chart-container">
      <div className="chart-header">
        <h4>Plant Categories</h4>
        <span className="chart-value">{favoritePlants.length} plants</span>
      </div>
      <div className="category-chart">
        {Object.entries(progressData.categories).map(([category, count]) => (
          <div key={category} className="category-item">
            <div className="category-bar">
              <div 
                className="category-fill"
                style={{ width: `${(count / Math.max(...Object.values(progressData.categories))) * 100}%` }}
              ></div>
            </div>
            <span className="category-name">{category}</span>
            <span className="category-count">{count}</span>
          </div>
        ))}
      </div>
    </div>
  );

  const StatCard = ({ icon, label, value, subtitle, trend }) => (
    <div className="stat-card">
      <div className="stat-icon">{icon}</div>
      <div className="stat-content">
        <div className="stat-value">{value}</div>
        <div className="stat-label">{label}</div>
        {subtitle && <div className="stat-subtitle">{subtitle}</div>}
        {trend && (
          <div className={`stat-trend ${trend > 0 ? 'positive' : 'negative'}`}>
            <TrendingUp size={14} />
            {trend}% this month
          </div>
        )}
      </div>
    </div>
  );

  const PlantCard = ({ plant }) => (
    <div className="plant-card-dashboard">
      <div className="plant-header">
        <div className="plant-avatar">
          <Leaf size={20} />
        </div>
        <div className="plant-info">
          <h4>{plant.name}</h4>
          <span className="botanical">{plant.botanical}</span>
        </div>
        <div className="plant-health">
          <div className="health-bar">
            <div 
              className="health-fill" 
              style={{ width: `${plant.health}%` }}
            ></div>
          </div>
          <span>{plant.health}%</span>
        </div>
      </div>
      <div className="plant-uses">
        {plant.uses.map((use, index) => (
          <span key={index} className="use-tag">{use}</span>
        ))}
      </div>
      <div className="plant-footer">
        <span className="care-time">
          <Clock size={14} />
          Last cared: {plant.lastCared}
        </span>
        <button className="btn-action">
          <Bookmark size={16} />
        </button>
      </div>
    </div>
  );

  const SuggestionCard = ({ suggestion }) => (
    <div className={`suggestion-card ${suggestion.type}`}>
      <div className="suggestion-icon">
        {suggestion.type === 'combo' && <Zap size={20} />}
        {suggestion.type === 'care' && <Activity size={20} />}
        {suggestion.type === 'discovery' && <Brain size={20} />}
      </div>
      <div className="suggestion-content">
        <h5>{suggestion.title}</h5>
        <p>{suggestion.description}</p>
        <span className="suggestion-reason">{suggestion.reason}</span>
      </div>
      <button className="btn-suggestion">Explore</button>
    </div>
  );

  const CommunityPost = ({ post }) => (
    <div className="community-post">
      <div className="post-header">
        <div className="user-info">
          <div className="user-avatar">
            <UserAvatar type={post.avatar} size={20} />
          </div>
          <div className="user-details">
            <span className="username">{post.user}</span>
            <span className="user-co2">{post.userCo2}kg CO₂ offset</span>
          </div>
        </div>
        <span className="post-time">{post.time}</span>
      </div>
      <div className="post-content">
        <p>{post.content}</p>
      </div>
      <div className="post-actions">
        <button className="post-action">
          <ThumbsUp size={16} />
          {post.likes}
        </button>
        <button className="post-action">
          <MessageCircle size={16} />
          {post.comments}
        </button>
      </div>
    </div>
  );

  const TopPerformerCard = ({ performer, index }) => (
    <div className={`top-performer-card rank-${performer.rank}`}>
      <div className="performer-rank">
        {performer.rank === 1 && <Trophy size={20} />}
        {performer.rank === 2 && <Award size={20} />}
        {performer.rank === 3 && <Star size={20} />}
        <span>#{performer.rank}</span>
      </div>
      <div className="performer-info">
        <div className="performer-avatar">
          <UserAvatar type={performer.avatar} size={20} />
        </div>
        <div className="performer-details">
          <span className="performer-name">{performer.name}</span>
          <span className="performer-stats">
            {performer.plants} plants • {performer.streak} day streak
          </span>
        </div>
      </div>
      <div className="performer-co2">
        <span className="co2-amount">{performer.co2Offset}kg</span>
        <span className="co2-label">CO₂ Offset</span>
      </div>
      <div className={`trend-indicator ${performer.trend}`}>
        {performer.trend === 'up' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
      </div>
    </div>
  );

  return (
    <div className="dashboard">
      <div className="container">
        {/* Header */}
        <div className="dashboard-header">
          <div className="header-left">
            <Link to="/" className="btn btn-secondary">
              <ArrowLeft size={20} />
              Back to Home
            </Link>
            <div className="user-welcome">
              <h1>Welcome Back, Gardener! <Leaf size={32} style={{ display: 'inline', verticalAlign: 'middle' }} /></h1>
              <p>Your herbal wellness journey at a glance</p>
            </div>
          </div>
          <button className="btn btn-primary">
            <Download size={20} />
            Export Report
          </button>
        </div>

        {/* Stats Overview */}
        <div className="stats-overview">
          <StatCard
            icon={<Leaf size={24} />}
            value={userStats.plantsTracked}
            label="Plants Tracked"
            subtitle="+2 this month"
            trend={12}
          />
          <StatCard
            icon={<Sprout size={24} />}
            value={`${userStats.carbonOffset}kg`}
            label="CO₂ Offset"
            subtitle="Equivalent to 3 trees"
            trend={8}
          />
          <StatCard
            icon={<Target size={24} />}
            value={`${userStats.gardenScore}%`}
            label="Garden Score"
            subtitle="Excellent progress"
            trend={5}
          />
          <StatCard
            icon={<Users size={24} />}
            value={`#${userStats.communityRank}`}
            label="Community Rank"
            subtitle="Top 1% of gardeners"
            trend={2}
          />
        </div>

        {/* Main Content */}
        <div className="dashboard-content">
          {/* Left Column */}
          <div className="content-left">
            {/* Progress Charts */}
            <div className="charts-section">
              <div className="chart-wrapper">
                <ProgressChart />
              </div>
              <div className="chart-wrapper">
                <CategoryChart />
              </div>
            </div>

            {/* AI Suggestions */}
            <div className="suggestions-section">
              <div className="section-header">
                <h3>AI Garden Assistant</h3>
                <span className="section-badge">Smart Suggestions</span>
              </div>
              <div className="suggestions-grid">
                {aiSuggestions.map((suggestion, index) => (
                  <SuggestionCard key={index} suggestion={suggestion} />
                ))}
              </div>
            </div>

            {/* Community Posts */}
            <div className="community-section">
              <div className="section-header">
                <h3>Community Feed</h3>
                <span className="section-badge">{communityStats.activeToday} active</span>
              </div>
              <div className="community-posts">
                {communityPosts.map(post => (
                  <CommunityPost key={post.id} post={post} />
                ))}
              </div>
              <button className="btn btn-outline" style={{width: '100%', marginTop: '1rem'}}>
                <MessageCircle size={16} />
                View All Posts
              </button>
            </div>
          </div>

          {/* Right Column */}
          <div className="content-right">
            {/* Favorite Plants */}
            <div className="plants-section">
              <div className="section-header">
                <h3>Your Garden</h3>
                <span className="section-badge">{favoritePlants.length} plants</span>
              </div>
              <div className="plants-grid">
                {favoritePlants.map(plant => (
                  <PlantCard key={plant.id} plant={plant} />
                ))}
              </div>
            </div>

            {/* Top Performers */}
            <div className="top-performers-section">
              <div className="section-header">
                <h3>Community Leaders</h3>
                <Trophy size={20} />
              </div>
              <div className="top-performers-grid">
                {topPerformers.map(performer => (
                  <TopPerformerCard key={performer.rank} performer={performer} />
                ))}
              </div>
              <div className="community-stats">
                <div className="community-stat">
                  <span className="stat-value">{communityStats.totalMembers.toLocaleString()}</span>
                  <span className="stat-label">Total Members</span>
                </div>
                <div className="community-stat">
                  <span className="stat-value">{communityStats.totalCO2Offset.toLocaleString()}kg</span>
                  <span className="stat-label">Total CO₂ Offset</span>
                </div>
              </div>
            </div>

            {/* Upcoming Tasks */}
            <div className="tasks-section">
              <div className="section-header">
                <h3>Upcoming Tasks</h3>
                <Calendar size={20} />
              </div>
              <div className="tasks-list">
                {upcomingTasks.map((task, index) => (
                  <div key={index} className={`task-item ${task.priority}`}>
                    <div className="task-content">
                      <span className="task-text">{task.task}</span>
                      <span className="task-time">{task.time}</span>
                    </div>
                    <div className="task-priority"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="actions-section">
              <h4>Quick Actions</h4>
              <div className="actions-grid">
                <button className="action-btn">
                  <Bookmark size={20} />
                  Add Plant
                </button>
                <button className="action-btn">
                  <Calendar size={20} />
                  Schedule Care
                </button>
                <button className="action-btn">
                  <BarChart3 size={20} />
                  View Reports
                </button>
                <button className="action-btn">
                  <Users size={20} />
                  Join Community
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;