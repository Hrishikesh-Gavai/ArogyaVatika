import { useState, useEffect } from 'react';
import { Plus, Edit2, Save, X, Trash2, CheckCircle, Leaf, Trees, Package, Sprout, ExternalLink, Upload } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import { api } from '../../services/api';
import { useParams, useNavigate } from 'react-router-dom';
import { uploadToCloudinary } from '../../utils/cloudinary'; // Import the utility

const BusinessDashboard = () => {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [orderHistory, setOrderHistory] = useState([]);
  const [products, setProducts] = useState([]);
  const { businessId } = useParams();
  const navigate = useNavigate();

  // Order History delete functionality states
  const [showDeleteMode, setShowDeleteMode] = useState(false);
  const [selectedOrders, setSelectedOrders] = useState([]);

  // Close Business states
  const [showCloseBusinessModal, setShowCloseBusinessModal] = useState(false);
  const [closingBusiness, setClosingBusiness] = useState(false);

  const [showAddProduct, setShowAddProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productData, setProductData] = useState({
    p_name: '',
    p_desp: '',
    amt: '',
    quantity: '',
    category: [],
    img: []
  });

  // Cloudinary upload states
  const [uploadingImages, setUploadingImages] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});

  useEffect(() => {
    if (businessId && token) {
      fetchOrders();
      fetchOrderHistory();
      fetchProducts();
    }
  }, [businessId, token]);

  const fetchProducts = async () => {
    try {
      const response = await api.getBusinessProducts(businessId, token);
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await api.getBusinessOrders(businessId, token);
      if (response.ok) {
        const data = await response.json();
        setOrders(data.filter(order => !order.pay));
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const fetchOrderHistory = async () => {
    try {
      const response = await api.getBusinessOrders(businessId, token);
      if (response.ok) {
        const data = await response.json();
        setOrderHistory(data.filter(order => order.pay));
      }
    } catch (error) {
      console.error('Error fetching order history:', error);
    }
  };

  // Close Business Functionality
  const handleCloseBusiness = async () => {
    if (!businessId || !token) {
      alert('Unable to close business: Missing business ID or authentication');
      return;
    }

    setClosingBusiness(true);
    try {
      const response = await api.deleteBusiness(businessId, token);
      
      if (response.ok) {
        alert('Business closed successfully!');
        navigate('/dashboard'); // Redirect to businesses list or dashboard
      } else {
        const errorData = await response.json();
        alert(`Failed to close business: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error closing business:', error);
      alert('Error closing business. Please try again.');
    } finally {
      setClosingBusiness(false);
      setShowCloseBusinessModal(false);
    }
  };

  // Cloudinary Image Upload Functions
  // Cloudinary Image Upload Functions
const handleImageUpload = async (file, index) => {
  setUploadingImages(true);
  setUploadProgress(prev => ({ ...prev, [index]: 0 }));

  try {
    console.log('Starting upload for file:', file.name, 'at index:', index);
    
    const imageUrl = await uploadToCloudinary(file);
    
    console.log('Upload successful, URL:', imageUrl);
    
    // Update the specific image input with the Cloudinary URL
    updateImageInput(index, imageUrl);
    
    setUploadProgress(prev => ({ ...prev, [index]: 100 }));
    
  } catch (error) {
    console.error('Failed to upload image:', error);
    alert(`Failed to upload image: ${error.message}`);
  } finally {
    setUploadingImages(false);
    setTimeout(() => {
      setUploadProgress(prev => {
        const newProgress = { ...prev };
        delete newProgress[index];
        return newProgress;
      });
    }, 2000);
  }
};

const handleImageInputChange = (index, event) => {
  const file = event.target.files[0];
  console.log('File selected:', file);
  
  if (file) {
    // Check file type and size
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (JPEG, PNG, etc.)');
      return;
    }
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      alert('Image size should be less than 10MB');
      return;
    }
    
    console.log('File validation passed, starting upload...');
    handleImageUpload(file, index);
    
    // Reset the input to allow selecting the same file again
    event.target.value = '';
  }
};

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const response = await api.addProduct(businessId, {
        ...productData,
        amt: parseFloat(productData.amt),
        quantity: parseInt(productData.quantity),
        category: productData.category.filter(cat => cat.trim() !== ''),
        img: productData.img.filter(image => image.trim() !== '')
      }, token);
      
      if (response.ok) {
        alert('Product added successfully!');
        setShowAddProduct(false);
        setProductData({ p_name: '', p_desp: '', amt: '', quantity: '', category: [], img: [] });
        fetchProducts();
      }
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct({
      ...product,
      categoryString: product.category?.join(', ') || '',
      imgString: product.img?.join(', ') || ''
    });
  };

  const handleUpdateProduct = async (productId) => {
    try {
      const updatedData = {
        p_name: editingProduct.p_name,
        p_desp: editingProduct.p_desp,
        amt: parseFloat(editingProduct.amt),
        quantity: parseInt(editingProduct.quantity),
        category: editingProduct.categoryString.split(',').map(cat => cat.trim()).filter(cat => cat !== ''),
        img: editingProduct.imgString.split(',').map(img => img.trim()).filter(img => img !== '')
      };

      const response = await api.updateProduct(productId, updatedData, token);
      
      if (response.ok) {
        alert('Product updated successfully!');
        setEditingProduct(null);
        fetchProducts();
      }
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const response = await api.deleteProduct(productId, token);
        
        if (response.ok) {
          alert('Product deleted successfully!');
          fetchProducts();
        }
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const handleConfirmPayment = async (orderId) => {
    if (window.confirm('Are you sure you want to confirm this payment?')) {
      try {
        const response = await api.confirmPayment(orderId, token);
        
        if (response.ok) {
          alert('Payment confirmed successfully!');
          fetchOrders();
          fetchOrderHistory();
        } else {
          alert('Failed to confirm payment. Please try again.');
        }
      } catch (error) {
        console.error('Error confirming payment:', error);
        alert('Error confirming payment. Please try again.');
      }
    }
  };

  // Order History Delete Functions
  const handleSelectOrder = (orderId) => {
    setSelectedOrders(prev => 
      prev.includes(orderId) 
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  const handleSelectAllOrders = () => {
    if (selectedOrders.length === orderHistory.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(orderHistory.map(order => order.o_id));
    }
  };

  const handleDeleteSelectedOrders = async () => {
    if (selectedOrders.length === 0) {
      alert('Please select orders to delete.');
      return;
    }

    if (window.confirm(`Are you sure you want to delete ${selectedOrders.length} selected order(s) from history?`)) {
      try {
        const deletePromises = selectedOrders.map(orderId => 
          api.deleteOrderHistory(orderId, businessId, token)
        );
        
        await Promise.all(deletePromises);
        
        alert('Selected orders deleted successfully!');
        setSelectedOrders([]);
        setShowDeleteMode(false);
        fetchOrderHistory();
      } catch (error) {
        console.error('Error deleting selected orders:', error);
        alert('Error deleting selected orders. Please try again.');
      }
    }
  };

  const toggleDeleteMode = () => {
    setShowDeleteMode(!showDeleteMode);
    setSelectedOrders([]);
  };

  const addCategoryInput = () => {
    setProductData({
      ...productData,
      category: [...productData.category, '']
    });
  };

  const addImageInput = () => {
    setProductData({
      ...productData,
      img: [...productData.img, '']
    });
  };

  const updateCategoryInput = (index, value) => {
    const newCategories = [...productData.category];
    newCategories[index] = value;
    setProductData({
      ...productData,
      category: newCategories
    });
  };

  const updateImageInput = (index, value) => {
    const newImages = [...productData.img];
    newImages[index] = value;
    setProductData({
      ...productData,
      img: newImages
    });
  };

  const removeCategoryInput = (index) => {
    const newCategories = productData.category.filter((_, i) => i !== index);
    setProductData({
      ...productData,
      category: newCategories
    });
  };

  const removeImageInput = (index) => {
    const newImages = productData.img.filter((_, i) => i !== index);
    setProductData({
      ...productData,
      img: newImages
    });
  };


  const handleBusinessClick = () => {
    if (businessId) {
      navigate(`/business-public/${businessId}`);
    }
  };

  // Render function for image inputs (moved to the end before JSX)
  const renderImageInputs = () => (
    <div>
      <label className="block text-sm font-medium mb-2 text-emerald-700">Product Images</label>
      {productData.img.map((image, index) => (
        <div key={index} className="flex gap-2 mb-3 items-center">
          {/* File input for new uploads */}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageInputChange(index, e)}
            className="flex-1 px-4 py-3 border-2 border-emerald-200 rounded-xl focus:border-emerald-400 focus:outline-none"
            disabled={uploadingImages}
          />
          
          {/* Progress bar */}
          {uploadProgress[index] !== undefined && (
            <div className="w-20 bg-emerald-200 rounded-full h-2">
              <div 
                className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress[index]}%` }}
              ></div>
            </div>
          )}
          
          {/* Display uploaded image preview */}
          {image && (
            <div className="relative">
              <img 
                src={image} 
                alt={`Preview ${index + 1}`}
                className="w-12 h-12 object-cover rounded-lg border-2 border-emerald-200"
              />
              <div className="absolute -top-1 -right-1 bg-emerald-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">
                ✓
              </div>
            </div>
          )}
          
          <button
            type="button"
            onClick={() => removeImageInput(index)}
            className="bg-rose-500 hover:bg-rose-600 text-white px-4 py-3 rounded-xl transition-colors disabled:bg-rose-300"
            disabled={uploadingImages}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
      
      <button
        type="button"
        onClick={addImageInput}
        className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm transition-colors flex items-center gap-2"
        disabled={uploadingImages}
      >
        <Upload className="w-4 h-4" />
        Add Image Upload
      </button>
      
      {uploadingImages && (
        <p className="text-sm text-emerald-600 mt-2">Uploading images... Please wait.</p>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50/30 to-teal-50/30 py-8">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-serif font-bold bg-gradient-to-r from-emerald-700 to-teal-600 bg-clip-text text-transparent">
              Business Dashboard
            </h1>
            <p className="text-emerald-600 mt-2">Manage your natural products and orders</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <button
              onClick={handleBusinessClick}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-6 py-3 rounded-2xl flex items-center gap-2 shadow-lg hover:shadow-blue-200/50 transition-all duration-200 transform hover:-translate-y-0.5"
            >
              <ExternalLink className="w-5 h-5" />
              Visit Business
            </button>
            <button
              onClick={() => setShowAddProduct(!showAddProduct)}
              className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-6 py-3 rounded-2xl flex items-center gap-2 shadow-lg hover:shadow-emerald-200/50 transition-all duration-200 transform hover:-translate-y-0.5"
            >
              <Plus className="w-5 h-5" />
              Add Product
            </button>
            <button
              onClick={() => setShowCloseBusinessModal(true)}
              className="bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white px-6 py-3 rounded-2xl flex items-center gap-2 shadow-lg hover:shadow-rose-200/50 transition-all duration-200 transform hover:-translate-y-0.5"
            >
              <Trash2 className="w-5 h-5" />
              Close Business
            </button>
          </div>
        </div>

        {/* Close Business Modal */}
        {showCloseBusinessModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trash2 className="w-8 h-8 text-rose-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Close Business</h3>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to close this business? This action cannot be undone. All products and data will be permanently deleted.
                </p>
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={() => setShowCloseBusinessModal(false)}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                    disabled={closingBusiness}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCloseBusiness}
                    disabled={closingBusiness}
                    className="px-6 py-3 bg-rose-600 text-white rounded-xl hover:bg-rose-700 transition-colors disabled:bg-rose-400 flex items-center gap-2"
                  >
                    {closingBusiness ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Closing...
                      </>
                    ) : (
                      'Close Business'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add Product Form */}
        {showAddProduct && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border-2 border-emerald-100/50 p-6 mb-8">
            <h3 className="text-xl font-serif font-semibold text-emerald-900 mb-4 flex items-center gap-2">
              <Leaf className="w-5 h-5" />
              Add New Natural Product
            </h3>
            <form onSubmit={handleAddProduct} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-emerald-700">Product Name</label>
                  <input
                    type="text"
                    value={productData.p_name}
                    onChange={(e) => setProductData({...productData, p_name: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-emerald-200 rounded-xl focus:border-emerald-400 focus:outline-none transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-emerald-700">Price (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={productData.amt}
                    onChange={(e) => setProductData({...productData, amt: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-emerald-200 rounded-xl focus:border-emerald-400 focus:outline-none transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-emerald-700">Quantity</label>
                  <input
                    type="number"
                    value={productData.quantity}
                    onChange={(e) => setProductData({...productData, quantity: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-emerald-200 rounded-xl focus:border-emerald-400 focus:outline-none transition-colors"
                    required
                  />
                </div>
                <div className="md:col-span-2 lg:col-span-1">
                  <label className="block text-sm font-medium mb-2 text-emerald-700">Description</label>
                  <input
                    type="text"
                    value={productData.p_desp}
                    onChange={(e) => setProductData({...productData, p_desp: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-emerald-200 rounded-xl focus:border-emerald-400 focus:outline-none transition-colors"
                    placeholder="Product description"
                  />
                </div>
              </div>

              {/* Description Field */}
              <div>
                <label className="block text-sm font-medium mb-2 text-emerald-700">Product Description</label>
                <textarea
                  value={productData.p_desp}
                  onChange={(e) => setProductData({...productData, p_desp: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-emerald-200 rounded-xl focus:border-emerald-400 focus:outline-none transition-colors"
                  placeholder="Describe your natural product..."
                  rows="3"
                />
              </div>

              {/* Categories Section */}
              <div>
                <label className="block text-sm font-medium mb-2 text-emerald-700">Categories</label>
                {productData.category.map((category, index) => (
                  <div key={index} className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={category}
                      onChange={(e) => updateCategoryInput(index, e.target.value)}
                      className="flex-1 px-4 py-3 border-2 border-emerald-200 rounded-xl focus:border-emerald-400 focus:outline-none"
                      placeholder="Enter category"
                    />
                    <button
                      type="button"
                      onClick={() => removeCategoryInput(index)}
                      className="bg-rose-500 hover:bg-rose-600 text-white px-4 py-3 rounded-xl transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addCategoryInput}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm transition-colors"
                >
                  Add Category
                </button>
              </div>

              {/* Images Section - Using the render function */}
              {renderImageInputs()}

              <div className="flex gap-3">
                <button type="submit" className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-colors">
                  <Plus className="w-4 h-4" />
                  Add Product
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddProduct(false);
                    setProductData({ p_name: '', p_desp: '', amt: '', quantity: '', category: [], img: [] });
                  }}
                  className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-xl transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Rest of your existing JSX remains the same */}
        {/* Products Table */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border-2 border-emerald-100/50 p-6 mb-8">
          <h3 className="text-xl font-serif font-semibold text-emerald-900 mb-4 flex items-center gap-2">
            <Package className="w-5 h-5" />
            Natural Products ({products.length})
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-emerald-200">
                  <th className="text-left p-4 text-emerald-700 font-semibold">Product ID</th>
                  <th className="text-left p-4 text-emerald-700 font-semibold">Product Name</th>
                  <th className="text-left p-4 text-emerald-700 font-semibold">Description</th>
                  <th className="text-left p-4 text-emerald-700 font-semibold">Price</th>
                  <th className="text-left p-4 text-emerald-700 font-semibold">Quantity</th>
                  <th className="text-left p-4 text-emerald-700 font-semibold">Categories</th>
                  <th className="text-left p-4 text-emerald-700 font-semibold">Images</th>
                  <th className="text-left p-4 text-emerald-700 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product, index) => (
                  <tr key={product._id || index} className="border-b border-emerald-100 hover:bg-emerald-50/50 transition-colors">
                    {editingProduct && editingProduct._id === product._id ? (
                      // Edit mode
                      <>
                        <td className="p-4 font-mono text-sm text-emerald-600">{product._id}</td>
                        <td className="p-4">
                          <input
                            type="text"
                            value={editingProduct.p_name}
                            onChange={(e) => setEditingProduct({...editingProduct, p_name: e.target.value})}
                            className="w-full px-3 py-2 border-2 border-emerald-200 rounded-lg focus:border-emerald-400"
                          />
                        </td>
                        <td className="p-4">
                          <textarea
                            value={editingProduct.p_desp}
                            onChange={(e) => setEditingProduct({...editingProduct, p_desp: e.target.value})}
                            className="w-full px-3 py-2 border-2 border-emerald-200 rounded-lg focus:border-emerald-400"
                            placeholder="Product description"
                            rows="2"
                          />
                        </td>
                        <td className="p-4">
                          <input
                            type="number"
                            step="0.01"
                            value={editingProduct.amt}
                            onChange={(e) => setEditingProduct({...editingProduct, amt: e.target.value})}
                            className="w-full px-3 py-2 border-2 border-emerald-200 rounded-lg focus:border-emerald-400"
                          />
                        </td>
                        <td className="p-4">
                          <input
                            type="number"
                            value={editingProduct.quantity}
                            onChange={(e) => setEditingProduct({...editingProduct, quantity: e.target.value})}
                            className="w-full px-3 py-2 border-2 border-emerald-200 rounded-lg focus:border-emerald-400"
                          />
                        </td>
                        <td className="p-4">
                          <textarea
                            value={editingProduct.categoryString}
                            onChange={(e) => setEditingProduct({...editingProduct, categoryString: e.target.value})}
                            className="w-full px-3 py-2 border-2 border-emerald-200 rounded-lg focus:border-emerald-400"
                            placeholder="Comma separated categories"
                            rows="2"
                          />
                        </td>
                        <td className="p-4">
                          <textarea
                            value={editingProduct.imgString}
                            onChange={(e) => setEditingProduct({...editingProduct, imgString: e.target.value})}
                            className="w-full px-3 py-2 border-2 border-emerald-200 rounded-lg focus:border-emerald-400"
                            placeholder="Comma separated image URLs"
                            rows="2"
                          />
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleUpdateProduct(product._id)}
                              className="bg-emerald-500 hover:bg-emerald-600 text-white p-2 rounded-lg transition-colors"
                            >
                              <Save className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setEditingProduct(null)}
                              className="bg-amber-500 hover:bg-amber-600 text-white p-2 rounded-lg transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </>
                    ) : (
                      // View mode
                      <>
                        <td className="p-4 font-mono text-sm text-emerald-600">{product._id}</td>
                        <td className="p-4 font-medium text-emerald-900">{product.p_name}</td>
                        <td className="p-4 text-emerald-600 text-sm max-w-xs">
                          {product.p_desp ? (
                            <div className="truncate" title={product.p_desp}>
                              {product.p_desp}
                            </div>
                          ) : (
                            <span className="text-emerald-400">No description</span>
                          )}
                        </td>
                        <td className="p-4 text-emerald-600 font-semibold">₹{product.amt}</td>
                        <td className="p-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            product.quantity > 10 ? 'bg-emerald-100 text-emerald-700' :
                            product.quantity > 0 ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'
                          }`}>
                            {product.quantity} in stock
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="max-w-xs">
                            {product.category?.length > 0 ? (
                              <div className="flex flex-wrap gap-1">
                                {product.category.map((cat, idx) => (
                                  <span key={idx} className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full text-xs border border-emerald-200">
                                    {cat}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <span className="text-emerald-400 text-sm">No categories</span>
                            )}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="max-w-xs">
                            {product.img?.length > 0 ? (
                              <div className="flex flex-wrap gap-1">
                                {product.img.slice(0, 2).map((imgUrl, idx) => (
                                  <img
                                    key={idx}
                                    src={imgUrl}
                                    alt={`${product.p_name} ${idx + 1}`}
                                    className="w-8 h-8 object-cover rounded-lg border-2 border-emerald-200"
                                    onError={(e) => {
                                      e.target.style.display = 'none';
                                    }}
                                  />
                                ))}
                                {product.img.length > 2 && (
                                  <span className="text-xs text-emerald-500">+{product.img.length - 2} more</span>
                                )}
                              </div>
                            ) : (
                              <span className="text-emerald-400 text-sm">No images</span>
                            )}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEditProduct(product)}
                              className="bg-emerald-500 hover:bg-emerald-600 text-white p-2 rounded-lg transition-colors"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(product._id)}
                              className="bg-rose-500 hover:bg-rose-600 text-white p-2 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
            {products.length === 0 && (
              <div className="text-center py-8">
                <Package className="w-12 h-12 text-emerald-200 mx-auto mb-3" />
                <p className="text-emerald-600">No products added yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Current Orders Table */}
<div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border-2 border-emerald-100/50 p-6 mb-8">
  <h3 className="text-xl font-serif font-semibold text-emerald-900 mb-4 flex items-center gap-2">
    <Sprout className="w-5 h-5" />
    Pending Orders ({orders.length})
  </h3>
  <div className="overflow-x-auto">
    <table className="w-full min-w-[800px]">
      <thead>
        <tr className="border-b-2 border-emerald-200">
          <th className="text-left p-4 text-emerald-700 font-semibold">Order ID</th>
          <th className="text-left p-4 text-emerald-700 font-semibold">Customer</th>
          <th className="text-left p-4 text-emerald-700 font-semibold">Product Name</th>
          <th className="text-left p-4 text-emerald-700 font-semibold">Quantity</th>
          <th className="text-left p-4 text-emerald-700 font-semibold min-w-[250px]">Address</th>
          <th className="text-left p-4 text-emerald-700 font-semibold">Payment Status</th>
          <th className="text-left p-4 text-emerald-700 font-semibold">Actions</th>
        </tr>
      </thead>
      <tbody>
        {orders.map((order, index) => (
          <tr key={order.o_id || index} className="border-b border-emerald-100 hover:bg-emerald-50/50 transition-colors">
            <td className="p-4 font-mono text-sm text-emerald-600">{order.o_id}</td>
            <td className="p-4 text-emerald-900">{order.orderBy}</td>
            <td className="p-4 text-emerald-900">{order.p_name}</td>
            <td className="p-4 text-emerald-600">{order.quantity}</td>
            <td className="p-4 text-emerald-600 text-sm">
              <div className="break-words whitespace-normal max-w-[300px]">
                {order.p_id} 
              </div>
            </td>
            <td className="p-4">
              <span className="bg-amber-100 text-amber-700 px-3 py-1.5 rounded-full text-xs font-medium border border-amber-200">
                Pending
              </span>
            </td>
            <td className="p-4">
              <button
                onClick={() => handleConfirmPayment(order.o_id)}
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-colors text-sm"
                title="Confirm Payment"
              >
                <CheckCircle className="w-4 h-4" />
                Confirm
              </button>
            </td>
          </tr>
        ))}
        {orders.length === 0 && (
          <tr>
            <td colSpan="7" className="p-8 text-center text-emerald-500">
              <Sprout className="w-8 h-8 mx-auto mb-2 opacity-50" />
              No pending orders found
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
</div>

        {/* Order History Table */}
<div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border-2 border-emerald-100/50 p-6">
  <div className="flex justify-between items-center mb-4">
    <h3 className="text-xl font-serif font-semibold text-emerald-900 flex items-center gap-2">
      <Trees className="w-5 h-5" />
      Order History ({orderHistory.length})
    </h3>
    <div className="flex items-center gap-2">
      {showDeleteMode && (
        <>
          <button
            onClick={handleSelectAllOrders}
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm transition-colors"
          >
            {selectedOrders.length === orderHistory.length ? 'Deselect All' : 'Select All'}
          </button>
          <button
            onClick={handleDeleteSelectedOrders}
            className="bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded-xl text-sm transition-colors disabled:bg-rose-300"
            disabled={selectedOrders.length === 0}
          >
            Delete Selected ({selectedOrders.length})
          </button>
          <button
            onClick={toggleDeleteMode}
            className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-xl text-sm transition-colors"
          >
            Cancel
          </button>
        </>
      )}
      <button
        onClick={toggleDeleteMode}
        className="bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded-xl transition-colors flex items-center gap-2"
        title="Delete Orders"
      >
        <Trash2 className="w-4 h-4" />
        {showDeleteMode ? 'Exit Delete' : 'Delete History'}
      </button>
    </div>
  </div>
  <div className="overflow-x-auto">
    <table className="w-full min-w-[800px]">
      <thead>
        <tr className="border-b-2 border-emerald-200">
          {showDeleteMode && (
            <th className="text-left p-4 w-12">
              <input
                type="checkbox"
                checked={selectedOrders.length === orderHistory.length && orderHistory.length > 0}
                onChange={handleSelectAllOrders}
                className="rounded border-2 border-emerald-300 text-emerald-500 focus:ring-emerald-400"
              />
            </th>
          )}
          <th className="text-left p-4 text-emerald-700 font-semibold">Order ID</th>
          <th className="text-left p-4 text-emerald-700 font-semibold">Customer</th>
          <th className="text-left p-4 text-emerald-700 font-semibold">Product Name</th>
          <th className="text-left p-4 text-emerald-700 font-semibold">Quantity</th>
          <th className="text-left p-4 text-emerald-700 font-semibold min-w-[250px]">Address</th>
          <th className="text-left p-4 text-emerald-700 font-semibold">Payment Status</th>
        </tr>
      </thead>
      <tbody>
        {orderHistory.map((order, index) => (
          <tr key={order.o_id || index} className="border-b border-emerald-100 hover:bg-emerald-50/50 transition-colors">
            {showDeleteMode && (
              <td className="p-4">
                <input
                  type="checkbox"
                  checked={selectedOrders.includes(order.o_id)}
                  onChange={() => handleSelectOrder(order.o_id)}
                  className="rounded border-2 border-emerald-300 text-emerald-500 focus:ring-emerald-400"
                />
              </td>
            )}
            <td className="p-4 font-mono text-sm text-emerald-600">{order.o_id}</td>
            <td className="p-4 text-emerald-900">{order.orderBy}</td>
            <td className="p-4 text-emerald-900">{order.p_name}</td>
            <td className="p-4 text-emerald-600">{order.quantity}</td>
            <td className="p-4 text-emerald-600 text-sm">
              <div className="break-words whitespace-normal max-w-[300px]">
                {order.p_id} 
              </div>
            </td>
            <td className="p-4">
              <span className="bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-full text-xs font-medium border border-emerald-200">
                Completed
              </span>
            </td>
          </tr>
        ))}
        {orderHistory.length === 0 && (
          <tr>
            <td colSpan={showDeleteMode ? "7" : "6"} className="p-8 text-center text-emerald-500">
              <Leaf className="w-8 h-8 mx-auto mb-2 opacity-50" />
              No completed orders found
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
  </div>
      </div>
    </div>
  );
};

export default BusinessDashboard;
