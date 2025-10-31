import React, { useState, useEffect } from 'react';
import { 
  Plus, Trash2, Search, SortAsc, SortDesc, 
  TreePine, AlertCircle, CheckCircle, X, Lock
} from 'lucide-react';
import { supabase } from '../services/supabase';
import PlantModal from '../components/PlantModal';
import PlantCard from '../components/PlantCard';
import InsertPlantModal from '../components/InsertPlantModal';

// ============================================
// AVL NODE - With Full-Text Searchable Key
// ============================================
class AVLNode {
  constructor(plant) {
    this.plant = plant;
    this.primaryKey = plant.common_name.toLowerCase();
    this.height = 0;
    this.left = null;
    this.right = null;
  }
}

// ============================================
// AVL TREE - Self-Balancing Binary Search Tree
// ============================================
class AVLTree {
  constructor() {
    this.root = null;
    this.comparisons = 0;
  }

  getHeight(node) {
    return node === null ? -1 : node.height;
  }

  getBalanceFactor(node) {
    return node === null ? 0 : this.getHeight(node.left) - this.getHeight(node.right);
  }

  rotateLeft(x) {
    const y = x.right;
    x.right = y.left;
    y.left = x;
    x.height = Math.max(this.getHeight(x.left), this.getHeight(x.right)) + 1;
    y.height = Math.max(this.getHeight(y.left), this.getHeight(y.right)) + 1;
    return y;
  }

  rotateRight(x) {
    const y = x.left;
    x.left = y.right;
    y.right = x;
    x.height = Math.max(this.getHeight(x.left), this.getHeight(x.right)) + 1;
    y.height = Math.max(this.getHeight(y.left), this.getHeight(y.right)) + 1;
    return y;
  }

  insert(node, plant) {
    if (node === null) {
      return new AVLNode(plant);
    }

    const primaryKeyLower = plant.common_name.toLowerCase();
    
    if (primaryKeyLower < node.primaryKey) {
      node.left = this.insert(node.left, plant);
    } else if (primaryKeyLower > node.primaryKey) {
      node.right = this.insert(node.right, plant);
    } else {
      return node;
    }

    node.height = Math.max(this.getHeight(node.left), this.getHeight(node.right)) + 1;
    const balance = this.getBalanceFactor(node);

    if (balance > 1 && primaryKeyLower < node.left.primaryKey) {
      return this.rotateRight(node);
    }

    if (balance < -1 && primaryKeyLower > node.right.primaryKey) {
      return this.rotateLeft(node);
    }

    if (balance > 1 && primaryKeyLower > node.left.primaryKey) {
      node.left = this.rotateLeft(node.left);
      return this.rotateRight(node);
    }

    if (balance < -1 && primaryKeyLower < node.right.primaryKey) {
      node.right = this.rotateRight(node.right);
      return this.rotateLeft(node);
    }

    return node;
  }

  find(node, searchTerm) {
    this.comparisons++;
    if (node === null) return null;

    const searchLower = searchTerm.toLowerCase();
    const commonNameLower = node.plant.common_name.toLowerCase();
    
    if (commonNameLower.includes(searchLower)) {
      return node;
    } else if (searchLower < node.primaryKey) {
      return this.find(node.left, searchTerm);
    } else {
      return this.find(node.right, searchTerm);
    }
  }

  delete(node, key) {
    if (node === null) return null;

    const keyLower = key.toLowerCase();

    if (keyLower < node.plant.common_name.toLowerCase()) {
      node.left = this.delete(node.left, key);
    } else if (keyLower > node.plant.common_name.toLowerCase()) {
      node.right = this.delete(node.right, key);
    } else {
      if (node.left === null || node.right === null) {
        return node.left ? node.left : node.right;
      } else {
        let succ = node.right;
        while (succ.left !== null) {
          succ = succ.left;
        }
        node.plant = succ.plant;
        node.primaryKey = succ.primaryKey;
        node.right = this.delete(node.right, succ.plant.common_name);
      }
    }

    if (node === null) return node;

    node.height = Math.max(this.getHeight(node.left), this.getHeight(node.right)) + 1;
    const balance = this.getBalanceFactor(node);

    if (balance > 1 && this.getBalanceFactor(node.left) >= 0) {
      return this.rotateRight(node);
    }

    if (balance > 1 && this.getBalanceFactor(node.left) < 0) {
      node.left = this.rotateLeft(node.left);
      return this.rotateRight(node);
    }

    if (balance < -1 && this.getBalanceFactor(node.right) <= 0) {
      return this.rotateLeft(node);
    }

    if (balance < -1 && this.getBalanceFactor(node.right) > 0) {
      node.right = this.rotateRight(node.right);
      return this.rotateLeft(node);
    }

    return node;
  }

  inorderAsc(node, result = []) {
    if (node !== null) {
      this.inorderAsc(node.left, result);
      result.push({ key: node.plant.common_name, plant: node.plant });
      this.inorderAsc(node.right, result);
    }
    return result;
  }

  inorderDesc(node, result = []) {
    if (node !== null) {
      this.inorderDesc(node.right, result);
      result.push({ key: node.plant.common_name, plant: node.plant });
      this.inorderDesc(node.left, result);
    }
    return result;
  }

  substringSearch(node, substr, result = []) {
    if (node === null) return result;
    
    this.substringSearch(node.left, substr, result);
    
    const substrLower = substr.toLowerCase();
    const plant = node.plant;
    
    const matchFound = 
      (plant.common_name || '').toLowerCase().includes(substrLower) ||
      (plant.botanical_name || '').toLowerCase().includes(substrLower) ||
      (plant.family || '').toLowerCase().includes(substrLower) ||
      (plant.description || '').toLowerCase().includes(substrLower) ||
      (plant.medicinal_uses || []).some(u => u.toLowerCase().includes(substrLower)) ||
      (plant.health_benefits || []).some(b => b.toLowerCase().includes(substrLower)) ||
      (plant.cultivation_method || '').toLowerCase().includes(substrLower) ||
      (plant.watering_needs || '').toLowerCase().includes(substrLower) ||
      (plant.sunlight_requirements || '').toLowerCase().includes(substrLower) ||
      (plant.soil_type || '').toLowerCase().includes(substrLower) ||
      (plant.climate_zones || []).some(z => z.toLowerCase().includes(substrLower)) ||
      (plant.region || []).some(r => r.toLowerCase().includes(substrLower)) ||
      (plant.difficulty_level || '').toLowerCase().includes(substrLower) ||
      (plant.climate_resilience || '').toLowerCase().includes(substrLower) ||
      (plant.growth_rate || '').toLowerCase().includes(substrLower) ||
      (plant.care_tips || []).some(t => t.toLowerCase().includes(substrLower)) ||
      (plant.precautions || []).some(p => p.toLowerCase().includes(substrLower)) ||
      (plant.harvesting_guide || '').toLowerCase().includes(substrLower);
    
    if (matchFound) {
      result.push({ 
        key: plant.common_name, 
        plant: node.plant
      });
    }
    
    this.substringSearch(node.right, substr, result);
    
    return result;
  }
}

// ============================================
// CONFIRMATION DIALOG COMPONENT
// ============================================
const ConfirmDialog = ({ title, message, onConfirm, onCancel, isLoading }) => {
  return (
    <div className="confirm-overlay">
      <div className="confirm-dialog">
        <h3>{title}</h3>
        <p>{message}</p>
        <div className="confirm-buttons">
          <button 
            className="confirm-btn-cancel" 
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button 
            className="confirm-btn-confirm" 
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================
// ADMIN RESTRICTION ALERT COMPONENT
// ============================================
const AdminRestrictedAlert = ({ onLoginAsAdmin }) => {
  return (
    <div className="admin-alert">
      <div className="admin-alert-content">
        <Lock size={32} />
        <h2>Admin Only Access</h2>
        <p>Only administrators can insert or delete plants.</p>
        <p className="sub-text">If you are an admin, please login as admin first.</p>
        <button 
          className="btn-primary"
          onClick={onLoginAsAdmin}
        >
          Login as Admin
        </button>
      </div>
    </div>
  );
};

// ============================================
// MAIN AVL COMPONENT
// ============================================
const AVL = () => {
  const [avlTree] = useState(new AVLTree());
  const [plants, setPlants] = useState([]);
  const [displayedPlants, setDisplayedPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [showInsertModal, setShowInsertModal] = useState(false);
  
  const [searchKey, setSearchKey] = useState('');
  const [comparisons, setComparisons] = useState(0);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [confirmDialog, setConfirmDialog] = useState({ show: false, data: null });
  const [processingDelete, setProcessingDelete] = useState(false);
  
  const [userRole, setUserRole] = useState(null);
  const [showAdminAlert, setShowAdminAlert] = useState(false);

  useEffect(() => {
    fetchPlants();
    checkUserRole();
    
    window.addEventListener('storage', checkUserRole);
    return () => window.removeEventListener('storage', checkUserRole);
  }, []);

  const checkUserRole = () => {
    const user = localStorage.getItem('user');
    if (user) {
      try {
        const userData = JSON.parse(user);
        setUserRole(userData.role);
      } catch (err) {
        setUserRole(null);
      }
    } else {
      setUserRole(null);
    }
  };

  const isAdmin = userRole === 'admin';

  const fetchPlants = async () => {
    try {
      const { data, error } = await supabase
        .from('plants')
        .select('*');

      if (error) throw error;

      setPlants(data);
      
      avlTree.root = null;
      
      data.forEach(plant => {
        avlTree.root = avlTree.insert(avlTree.root, plant);
      });

      displayAscending();
      setLoading(false);
    } catch (error) {
      console.error('Error fetching plants:', error);
      setMessage({ type: 'error', text: 'Failed to load plants' });
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (!searchKey.trim()) {
      setMessage({ type: 'error', text: 'Please enter a search term' });
      return;
    }

    avlTree.comparisons = 0;
    const result = avlTree.find(avlTree.root, searchKey);
    setComparisons(avlTree.comparisons);

    if (result) {
      setMessage({ 
        type: 'success', 
        text: `Found "${result.plant.common_name}" - Comparisons: ${avlTree.comparisons}` 
      });
      setDisplayedPlants([{ key: result.plant.common_name, plant: result.plant }]);
    } else {
      setMessage({ 
        type: 'error', 
        text: `Not found! Comparisons: ${avlTree.comparisons}` 
      });
      setDisplayedPlants([]);
    }
  };

  const handleSubstringSearch = () => {
    if (!searchKey.trim()) {
      setMessage({ type: 'error', text: 'Please enter a search term' });
      return;
    }

    const results = avlTree.substringSearch(avlTree.root, searchKey);

    if (results.length > 0) {
      setDisplayedPlants(results);
      setMessage({ 
        type: 'success', 
        text: `Found ${results.length} plant(s) matching your search` 
      });
    } else {
      setDisplayedPlants([]);
      setMessage({ type: 'error', text: 'No matches found in any plant field' });
    }
  };

  const displayAscending = () => {
    const results = avlTree.inorderAsc(avlTree.root);
    setDisplayedPlants(results);
    setMessage({ type: 'success', text: `Displaying ${results.length} plants (Ascending)` });
  };

  const displayDescending = () => {
    const results = avlTree.inorderDesc(avlTree.root);
    setDisplayedPlants(results);
    setMessage({ type: 'success', text: `Displaying ${results.length} plants (Descending)` });
  };

  const handleAddPlantClick = () => {
    if (!isAdmin) {
      setShowAdminAlert(true);
      return;
    }
    setShowInsertModal(true);
  };

  const handleDeleteClick = (key) => {
    if (!isAdmin) {
      setShowAdminAlert(true);
      return;
    }
    setConfirmDialog({
      show: true,
      data: { key, type: 'delete' }
    });
  };

  const confirmDelete = async () => {
    setProcessingDelete(true);
    try {
      const nodeToDelete = findNodeByCommonName(avlTree.root, confirmDialog.data.key);
      
      if (nodeToDelete && nodeToDelete.plant.id) {
        const { error } = await supabase
          .from('plants')
          .delete()
          .eq('id', nodeToDelete.plant.id);

        if (error) throw error;

        avlTree.root = avlTree.delete(avlTree.root, confirmDialog.data.key);
        
        setMessage({ 
          type: 'success', 
          text: `✓ Deleted "${confirmDialog.data.key}" successfully!` 
        });
        
        displayAscending();
      }
    } catch (error) {
      console.error('Error deleting plant:', error);
      setMessage({ type: 'error', text: 'Failed to delete plant' });
    } finally {
      setProcessingDelete(false);
      setConfirmDialog({ show: false, data: null });
    }
  };

  const findNodeByCommonName = (node, commonName) => {
    if (node === null) return null;
    if (node.plant.common_name === commonName) return node;
    
    let left = findNodeByCommonName(node.left, commonName);
    if (left) return left;
    
    return findNodeByCommonName(node.right, commonName);
  };

  const handleInsertSuccess = async () => {
    setShowInsertModal(false);
    setMessage({ type: 'success', text: '✓ Plant inserted successfully!' });
    await fetchPlants();
  };

  const redirectToAdminLogin = () => {
    window.location.href = '/login?admin=true';
  };

  if (loading) {
    return (
      <div className="avl-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading AVL Trees...</p>
        </div>
      </div>
    );
  }

  if (showAdminAlert) {
    return (
      <div className="avl-page">
        <AdminRestrictedAlert onLoginAsAdmin={redirectToAdminLogin} />
      </div>
    );
  }

  return (
    <div className="avl-page">
      <div className="avl-container">
        {/* Image Section */}
        <div className="avl-image-showcase">
          <img 
            src="/assets/AVL.png"  
            alt="AVL Tree Visualization"
            className="avl-tree-image"
          />
        </div>

        {/* Header */}
        <div className="avl-header">
          <div className="avl-title">
            <TreePine size={32} />
            <div>
              <h1>AVL Tree Plant Database</h1>
              <p>Full-text searchable herbal plant database with self-balancing AVL trees</p>
            </div>
          </div>

          <button 
            className={`btn-primary ${!isAdmin ? 'btn-disabled' : ''}`}
            onClick={handleAddPlantClick}
            disabled={!isAdmin}
            title={isAdmin ? 'Add new plant' : 'Admin only'}
          >
            <Plus size={18} />
            Add Plant
          </button>
        </div>

        {/* Message Display */}
        {message.text && (
          <div className={`avl-message ${message.type}`}>
            {message.type === 'success' ? (
              <CheckCircle size={18} />
            ) : (
              <AlertCircle size={18} />
            )}
            <span>{message.text}</span>
            <button 
              className="message-close"
              onClick={() => setMessage({ type: '', text: '' })}
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* Controls */}
        <div className="avl-controls">
          <div className="search-controls">
            <input
              type="text"
              placeholder="Search plants by any field (name, uses, benefits, care tips, etc.)..."
              value={searchKey}
              onChange={(e) => setSearchKey(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSubstringSearch()}
            />
            <button className="btn-primary" onClick={handleSubstringSearch}>
              <Search size={18} />
              Search All Fields
            </button>
          </div>

          <div className="display-controls">
            <button className="btn-outline" onClick={displayAscending}>
              <SortAsc size={18} />
              Ascending
            </button>
            <button className="btn-outline" onClick={displayDescending}>
              <SortDesc size={18} />
              Descending
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="avl-stats">
          <div className="stat-card">
            <strong>Total Plants:</strong>
            <span>{plants.length}</span>
          </div>
          <div className="stat-card">
            <strong>Tree Height:</strong>
            <span>{avlTree.getHeight(avlTree.root) + 1}</span>
          </div>
          <div className="stat-card">
            <strong>Displaying:</strong>
            <span>{displayedPlants.length}</span>
          </div>
          <div className="stat-card">
            <strong>Last Comparisons:</strong>
            <span>{comparisons}</span>
          </div>
        </div>

        {/* Results Grid */}
        <div className="plants-grid">
          {displayedPlants.map((item, index) => (
            <div key={index} className="avl-plant-item">
              <PlantCard
                plant={item.plant}
                onClick={() => setSelectedPlant(item.plant)}
                viewMode="grid"
              />
              <div className="plant-actions">
                <button
                  className={`btn-delete ${!isAdmin ? 'btn-disabled' : ''}`}
                  onClick={() => handleDeleteClick(item.key)}
                  title={isAdmin ? 'Delete plant' : 'Admin only'}
                  disabled={!isAdmin}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {displayedPlants.length === 0 && !loading && (
          <div className="no-results">
            <TreePine size={48} />
            <p>No plants to display</p>
            <p className="hint">Try searching or displaying all plants</p>
          </div>
        )}
      </div>

      {selectedPlant && (
        <PlantModal
          plant={selectedPlant}
          onClose={() => setSelectedPlant(null)}
        />
      )}

      {showInsertModal && isAdmin && (
        <InsertPlantModal
          onClose={() => setShowInsertModal(false)}
          onSuccess={handleInsertSuccess}
        />
      )}

      {confirmDialog.show && (
        <ConfirmDialog
          title="Delete Plant"
          message={`Are you sure you want to delete "${confirmDialog.data.key}"? This cannot be undone.`}
          onConfirm={confirmDelete}
          onCancel={() => setConfirmDialog({ show: false, data: null })}
          isLoading={processingDelete}
        />
      )}
    </div>
  );
};

export default AVL;
