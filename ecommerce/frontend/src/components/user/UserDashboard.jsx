import { useState, useEffect } from 'react';
import { Plus, Trash2, User, Pencil, Save, X, Leaf, Sprout, Trees, Package, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { api } from '../../services/api';
import userImg from '../../assets/react.svg';
import { uploadToCloudinary } from '../../utils/cloudinary';

const UserDashboard = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [cartProducts, setCartProducts] = useState([]);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || "",
    email: user?.email || "",
    pass: ""
  });
  const [userBusinesses, setUserBusinesses] = useState([]);
  const [showAddBusiness, setShowAddBusiness] = useState(false);
  const [businessData, setBusinessData] = useState({
    b_name: '',
    b_profile: '',
    b_desp: ''
  });

  // Cloudinary upload states
  const [uploadingBusinessImage, setUploadingBusinessImage] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    if (token) {
      fetchCartProducts();
    }
  }, [token]);

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const resp = await api.getBusinesses(token);
        if (resp.ok) {
          const data = await resp.json();
          setUserBusinesses(data || []);
        } else if (resp.status === 204) {
          setUserBusinesses([]);
        } else {
          console.error('Unexpected response status:', resp.status);
        }
      } catch (err) {
        console.error('Error fetching businesses:', err);
        setUserBusinesses([]);
      }
    };

    if (token) fetchBusinesses();
  }, [token]);

  const fetchCartProducts = async () => {
    try {
      const response = await api.getCartProducts(token);
      if (response.ok) {
        const data = await response.json();
        setCartProducts(data);
      }
    } catch (error) {
      console.error('Error fetching cart products:', error);
    }
  };

  const handleSave = async () => {
    try {
      const res = await api.updateProfile(formData, token);
      if (res.ok) {
        setEditing(false);
        window.location.reload();
      }
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  // Cloudinary upload for business profile image
  const handleBusinessImageUpload = async (file) => {
    setUploadingBusinessImage(true);
    setUploadProgress(0);

    try {
      const imageUrl = await uploadToCloudinary(file);
      setBusinessData(prev => ({ ...prev, b_profile: imageUrl }));
      setUploadProgress(100);
      
      // Clear progress after 2 seconds
      setTimeout(() => setUploadProgress(0), 2000);
    } catch (error) {
      console.error('Failed to upload business image:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploadingBusinessImage(false);
    }
  };

  const handleBusinessImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Check file type and size
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert('Image size should be less than 5MB');
        return;
      }
      
      handleBusinessImageUpload(file);
    }
  };

  const handleAddBusiness = async (e) => {
    e.preventDefault();
    try {
      const response = await api.addBusiness(businessData, token);
      if (response.ok) {
        alert('Business created successfully!');
        setShowAddBusiness(false);
        setBusinessData({ b_name: '', b_profile: '', b_desp: '' });
        window.location.reload();
      }
    } catch (error) {
      console.error('Error creating business:', error);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    try {
      const response = await api.deleteUserOrder(orderId, token);
      if (response.ok) {
        alert('History deleted successfully!');
        window.location.reload();
      }
    } catch (error) {
      console.error('Error deleted order:', error);
    }
  };

  const handleCancelOrder = async (orderId) => {
    try {
      const response = await api.cancelOrder(orderId, token);
      if (response.ok) {
        alert('Order cancelled successfully!');
        window.location.reload();
      }
    } catch (error) {
      console.error('Error cancelling order:', error);
    }
  };

  const handleRemoveCart = async (productId) => {
    try {
      const resp = await api.removeFromCart(productId, token);
      if (resp.ok) {
        alert('Removed from cart');
        fetchCartProducts();
      }
    } catch (err) {
      console.error('Error removing cart product:', err);
    }
  };

  // Render function for business image upload
  const renderBusinessImageUpload = () => (
    <div className="mb-3">
      <label className="block text-sm font-medium mb-2 text-emerald-700">Business Profile Image</label>
      
      {/* File input for upload */}
      <div className="flex gap-2 items-center">
        <input
          type="file"
          accept="image/*"
          onChange={handleBusinessImageChange}
          className="flex-1 px-3 py-2 border-2 border-emerald-200 rounded-lg focus:border-emerald-400 focus:outline-none"
          disabled={uploadingBusinessImage}
        />
        
        {/* Progress bar */}
        {uploadProgress > 0 && (
          <div className="w-20 bg-emerald-200 rounded-full h-2">
            <div 
              className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        )}
      </div>
      
      {/* Display uploaded image preview */}
      {businessData.b_profile && (
        <div className="mt-2 flex items-center gap-3">
          <div className="relative">
            <img 
              src={businessData.b_profile} 
              alt="Business preview"
              className="w-12 h-12 object-cover rounded-lg border-2 border-emerald-200"
            />
            <div className="absolute -top-1 -right-1 bg-emerald-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">
              ✓
            </div>
          </div>
          <span className="text-sm text-emerald-600">Image uploaded successfully</span>
        </div>
      )}
      
      {uploadingBusinessImage && (
        <p className="text-sm text-emerald-600 mt-2">Uploading image... Please wait.</p>
      )}
      
      {/* Manual URL input as fallback */}
      <div className="mt-2">
        <input
          type="url"
          placeholder="Or enter image URL manually"
          value={businessData.b_profile}
          onChange={(e) => setBusinessData({...businessData, b_profile: e.target.value})}
          className="w-full px-3 py-2 border-2 border-emerald-200 rounded-lg focus:border-emerald-400 focus:outline-none text-sm"
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50/30 to-teal-50/30 py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* User Info Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border-2 border-emerald-100/50 p-6">
              <div className="text-center mb-6">
                <div className="relative mx-auto mb-4">
                  <div className="w-24 h-24 bg-gradient-to-br from-emerald-200 to-teal-200 rounded-full flex items-center justify-center shadow-lg border-4 border-white">
                    <User className="w-12 h-12 text-emerald-600" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1 rounded-full border-2 border-white">
                    <Leaf className="w-4 h-4" />
                  </div>
                </div>

                {!editing ? (
                  <>
                    <h2 className="text-xl font-serif font-semibold text-emerald-900">{user?.username}</h2>
                    <p className="text-emerald-600">{user?.email}</p>
                    <div className="flex flex-wrap gap-2 justify-center mt-3">
                      {user?.role?.map((role, index) => (
                        <span
                          key={index}
                          className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-medium border border-emerald-200"
                        >
                          {role}
                        </span>
                      ))}
                    </div>

                    <button
                      onClick={() => setEditing(true)}
                      className="mt-4 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl flex items-center gap-2 mx-auto hover:from-emerald-600 hover:to-teal-600 transition-all duration-200"
                    >
                      <Pencil size={16} /> Edit Profile
                    </button>
                  </>
                ) : (
                  <div className="space-y-3">
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      placeholder="Enter new username"
                      className="w-full px-3 py-2 border-2 border-emerald-200 rounded-xl focus:border-emerald-400 focus:outline-none transition-colors"
                    />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="Enter new email"
                      className="w-full px-3 py-2 border-2 border-emerald-200 rounded-xl focus:border-emerald-400 focus:outline-none transition-colors"
                    />
                    <input
                      type="password"
                      name="password"
                      value={formData.pass}
                      onChange={(e) => setFormData({ ...formData, pass: e.target.value })}
                      placeholder="Enter new password"
                      className="w-full px-3 py-2 border-2 border-emerald-200 rounded-xl focus:border-emerald-400 focus:outline-none transition-colors"
                    />

                    <div className="flex justify-center gap-3 mt-4">
                      <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-emerald-500 text-white rounded-xl flex items-center gap-2 hover:bg-emerald-600 transition-colors"
                      >
                        <Save size={16} /> Save
                      </button>
                      <button
                        onClick={() => setEditing(false)}
                        className="px-4 py-2 bg-amber-500 text-white rounded-xl flex items-center gap-2 hover:bg-amber-600 transition-colors"
                      >
                        <X size={16} /> Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Businesses Owned */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border-2 border-emerald-100/50 p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-serif font-semibold text-emerald-900 flex items-center gap-2">
                  <Trees className="w-5 h-5" />
                  My Businesses
                </h3>
                <button
                  onClick={() => setShowAddBusiness(!showAddBusiness)}
                  className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white p-2 rounded-xl transition-all duration-200 shadow-lg"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {showAddBusiness && (
                <form onSubmit={handleAddBusiness} className="mb-4 p-4 bg-emerald-50/50 rounded-xl border border-emerald-200">
                  <div className="mb-3">
                    <input
                      type="text"
                      placeholder="Business Name"
                      value={businessData.b_name}
                      onChange={(e) => setBusinessData({...businessData, b_name: e.target.value})}
                      className="w-full px-3 py-2 border-2 border-emerald-200 rounded-lg focus:border-emerald-400 focus:outline-none"
                      required
                    />
                  </div>
                  
                  {/* Cloudinary Image Upload */}
                  {renderBusinessImageUpload()}
                  
                  <div className="mb-3">
                    <textarea
                      placeholder="Business Description"
                      value={businessData.b_desp}
                      onChange={(e) => setBusinessData({...businessData, b_desp: e.target.value})}
                      className="w-full px-3 py-2 border-2 border-emerald-200 rounded-lg focus:border-emerald-400 focus:outline-none"
                      rows="3"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button 
                      type="submit" 
                      className="bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600 transition-colors flex items-center gap-2"
                      disabled={uploadingBusinessImage}
                    >
                      {uploadingBusinessImage ? (
                        <>
                          <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4" />
                          Create Business
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddBusiness(false)}
                      className="bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 transition-colors"
                      disabled={uploadingBusinessImage}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {user?.role?.includes('OWNER') ? (
                userBusinesses.length > 0 ? (
                  userBusinesses.map((business) => (
                    <div 
                      key={business.id} 
                      className="flex justify-between items-center p-3 bg-emerald-50/50 rounded-xl mb-3 border border-emerald-200/50 hover:bg-emerald-100/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={business?.profile || userImg}
                          alt={business.name || "Business"}
                          className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = userImg;
                          }}
                        />
                        <div>
                          <h4 className="font-medium text-emerald-900">{business?.name || 'Untitled Business'}</h4>
                          <p className="text-sm text-emerald-600 truncate max-w-[150px]">{business?.desp || ''}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => navigate(`/business-dashboard/${business.id}`)}
                        className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-3 py-1.5 rounded-lg text-sm hover:from-emerald-600 hover:to-teal-600 transition-all duration-200"
                      >
                        Visit
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4">
                    <Package className="w-8 h-8 text-emerald-300 mx-auto mb-2" />
                    <p className="text-sm text-emerald-600">You don't have any businesses yet.</p>
                  </div>
                )
              ) : (
                <div className="text-center py-4">
                  <Sprout className="w-8 h-8 text-amber-400 mx-auto mb-2" />
                  <p className="text-sm text-emerald-600">You are not an owner.</p>
                </div>
              )}
            </div>
          </div>

          {/* Main Content - Cart and Orders */}
          <div className="lg:col-span-2 space-y-6">
            {/* Cart Products */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border-2 border-emerald-100/50 p-6">
              <h3 className="text-lg font-serif font-semibold text-emerald-900 mb-4 flex items-center gap-2">
                <Package className="w-5 h-5" />
                Cart Products ({cartProducts.length})
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-emerald-200">
                      <th className="text-left p-3 text-emerald-700 font-semibold">Product</th>
                      <th className="text-left p-3 text-emerald-700 font-semibold">Price</th>
                      <th className="text-left p-3 text-emerald-700 font-semibold">Stock</th>
                      <th className="text-left p-3 text-emerald-700 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartProducts.map((product, index) => (
                      <tr key={index} className="border-b border-emerald-100 hover:bg-emerald-50/50 transition-colors">
                        <td className="p-3 text-emerald-900">{product.name}</td>
                        <td className="p-3 text-emerald-600 font-medium">₹{product.amt}</td>
                        <td className="p-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            product.quantity > 5 ? 'bg-emerald-100 text-emerald-700' : 
                            product.quantity > 0 ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'
                          }`}>
                            {product.quantity > 0 ? `${product.quantity} available` : 'Out of stock'}
                          </span>
                        </td>
                        <td className="p-3">
                          <button 
                            onClick={() => handleRemoveCart(product.p_id)} 
                            className="text-rose-500 hover:text-rose-700 p-1 rounded-lg hover:bg-rose-50 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {cartProducts.length === 0 && (
                  <div className="text-center py-8">
                    <Package className="w-12 h-12 text-emerald-200 mx-auto mb-3" />
                    <p className="text-emerald-600">Your cart is empty</p>
                  </div>
                )}
              </div>
            </div>

            {/* Orders */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border-2 border-emerald-100/50 p-6">
              <h3 className="text-lg font-serif font-semibold text-emerald-900 mb-4 flex items-center gap-2">
                <Leaf className="w-5 h-5" />
                My Orders ({user?.orderPlace?.length || 0})
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-emerald-200">
                      <th className="text-left p-3 text-emerald-700 font-semibold">Product</th>
                      <th className="text-left p-3 text-emerald-700 font-semibold">Quantity</th>
                      <th className="text-left p-3 text-emerald-700 font-semibold">Address</th>
                      <th className="text-left p-3 text-emerald-700 font-semibold">Payment</th>
                      <th className="text-left p-3 text-emerald-700 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {user?.orderPlace?.map((order, index) => (
                      <tr key={index} className="border-b border-emerald-100 hover:bg-emerald-50/50 transition-colors">
                        <td className="p-3 text-emerald-900 font-medium">{order.p_name}</td>
                        <td className="p-3 text-emerald-600">{order.quantity}</td>
                        <td className="p-3 text-emerald-600 text-sm max-w-[200px] truncate">{order.p_id}</td>
                        <td className="p-3">
                          <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                            order.pay ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 'bg-amber-100 text-amber-700 border border-amber-200'
                          }`}>
                            {order.pay ? 'Completed' : 'Pending'}
                          </span>
                        </td>
                        <td className="p-3">
                          {order.pay ? (
                            <button
                              onClick={() => handleDeleteOrder(order.o_id)}
                              className="text-rose-500 hover:text-rose-700 px-3 py-1.5 rounded-lg hover:bg-rose-50 transition-colors text-sm font-medium"
                            >
                              Delete History
                            </button>
                          ) : (
                            <button
                              onClick={() => handleCancelOrder(order.o_id)}
                              className="text-amber-600 hover:text-amber-700 px-3 py-1.5 rounded-lg hover:bg-amber-50 transition-colors text-sm font-medium"
                            >
                              Cancel Order
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {(!user?.orderPlace || user.orderPlace.length === 0) && (
                  <div className="text-center py-8">
                    <Leaf className="w-12 h-12 text-emerald-200 mx-auto mb-3" />
                    <p className="text-emerald-600">No orders yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;