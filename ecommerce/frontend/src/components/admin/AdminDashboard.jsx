import { useState, useEffect } from 'react';
import { Eye, Trash2, Plus, Leaf, Trees, Package, Users, Sprout } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import { api } from '../../services/api';

const AdminDashboard = () => {
  const { token } = useAuth();
  const [users, setUsers] = useState([]);
  const [businesses, setBusinesses] = useState([]);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("users");
  const [showAddAdmin, setShowAddAdmin] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [newAdminData, setNewAdminData] = useState({
    username: '',
    email: '',
    pass: ''
  });
  const [loading, setLoading] = useState({
    users: false,
    businesses: false,
    orders: false,
    addAdmin: false
  });

  useEffect(() => {
    if (token) {
      fetchUsers();
      fetchBusinesses();
      fetchOrders();
    }
  }, [token]);

  const fetchUsers = async () => {
    try {
      setLoading(prev => ({ ...prev, users: true }));
      const response = await api.getAllUsers(token);
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else {
        console.error('Failed to fetch users:', response.status);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(prev => ({ ...prev, users: false }));
    }
  };

  const fetchBusinesses = async () => {
    try {
      setLoading(prev => ({ ...prev, businesses: true }));
      const response = await api.getAllBusinesses(token);
      if (response.ok) {
        const data = await response.json();
        setBusinesses(data);
      } else {
        console.error('Failed to fetch businesses:', response.status);
      }
    } catch (error) {
      console.error('Error fetching businesses:', error);
    } finally {
      setLoading(prev => ({ ...prev, businesses: false }));
    }
  };

  const fetchOrders = async () => {
    try {
      setLoading(prev => ({ ...prev, orders: true }));
      const response = await api.getAllOrders(token);
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      } else {
        console.error('Failed to fetch orders:', response.status);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(prev => ({ ...prev, orders: false }));
    }
  };

  const handleAddAdmin = async (e) => {
    e.preventDefault();
    
    if (!newAdminData.username || !newAdminData.email || !newAdminData.pass) {
      setMessage({ type: 'error', text: 'Please fill in all fields' });
      return;
    }

    if (newAdminData.pass.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters long' });
      return;
    }

    setLoading(prev => ({ ...prev, addAdmin: true }));
    setMessage({ type: '', text: '' });

    try {
      const response = await api.addAdmin(newAdminData, token);
      
      if (response.ok) {
        setMessage({ type: 'success', text: 'Admin added successfully!' });
        setNewAdminData({ username: '', email: '', pass: '' });
        setShowAddAdmin(false);
        fetchUsers();
      } else {
        const errorData = await response.json();
        setMessage({ type: 'error', text: errorData.message || 'Failed to add admin' });
      }
    } catch (error) {
      console.error('Error adding admin:', error);
      setMessage({ type: 'error', text: 'Error adding admin. Please try again.' });
    } finally {
      setLoading(prev => ({ ...prev, addAdmin: false }));
    }
  };

  const handleInputChange = (field, value) => {
    setNewAdminData(prev => ({
      ...prev,
      [field]: value
    }));
    if (message.text) {
      setMessage({ type: '', text: '' });
    }
  };

  const resetForm = () => {
    setNewAdminData({ username: '', email: '', pass: '' });
    setMessage({ type: '', text: '' });
    setShowAddAdmin(false);
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const response = await api.deleteUser(userId, token);
        if (response.ok) {
          alert('User deleted successfully!');
          fetchUsers();
        } else {
          const errorData = await response.json();
          alert(`Failed to delete user: ${errorData.message || 'Unknown error'}`);
        }
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Error deleting user. Please try again.');
      }
    }
  };

  const handleDeleteBusiness = async (businessId) => {
    if (window.confirm('Are you sure you want to delete this business?')) {
      try {
        const response = await api.deleteBusiness(businessId, token);
        if (response.ok) {
          alert('Business deleted successfully!');
          fetchBusinesses();
        } else {
          const errorData = await response.json();
          alert(`Failed to delete business: ${errorData.message || 'Unknown error'}`);
        }
      } catch (error) {
        console.error('Error deleting business:', error);
        alert('Error deleting business. Please try again.');
      }
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      try {
        const response = await api.cancelOrderAdmin(orderId, token);
        if (response.ok) {
          alert('Order cancelled successfully!');
          fetchOrders();
        } else {
          const errorData = await response.json();
          alert(`Failed to cancel order: ${errorData.message || 'Unknown error'}`);
        }
      } catch (error) {
        console.error('Error cancelling order:', error);
        alert('Error cancelling order. Please try again.');
      }
    }
  };

  const renderLoading = () => (
    <div className="flex justify-center items-center py-12">
      <div className="relative">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-400 border-t-transparent"></div>
        <Leaf className="w-6 h-6 text-emerald-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
      </div>
    </div>
  );

  // FIXED: Correctly handle the icon component
  const renderEmptyState = (message, IconComponent = Leaf) => (
    <div className="text-center py-12">
      <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
        <IconComponent className="w-8 h-8 text-emerald-500" />
      </div>
      <p className="text-emerald-600 text-lg">{message}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50/30 to-teal-50/30 py-4 lg:py-8">
      <div className="container mx-auto px-3 lg:px-4">
        {/* Header */}
        <div className="text-center mb-6 lg:mb-8">
          <div className="flex items-center justify-center gap-3 mb-3 lg:mb-4">
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-2 lg:p-3 rounded-2xl shadow-lg">
              <Sprout className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
            </div>
            <h1 className="text-2xl lg:text-4xl font-serif font-bold bg-gradient-to-r from-emerald-700 to-teal-600 bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
          </div>
          <p className="text-emerald-600 text-base lg:text-lg">Manage your natural marketplace ecosystem</p>
        </div>
        
        {/* Tabs - Mobile Responsive */}
        <div className="flex flex-col lg:flex-row lg:space-x-2 space-y-2 lg:space-y-0 mb-6 lg:mb-8 bg-white/80 backdrop-blur-sm p-2 rounded-2xl shadow-lg border-2 border-emerald-100/50">
          {[
            { key: 'users', label: 'Users', count: users.length, icon: Users },
            { key: 'businesses', label: 'Businesses', count: businesses.length, icon: Trees },
            { key: 'orders', label: 'Orders', count: orders.length, icon: Package }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center justify-center lg:justify-start space-x-3 px-4 lg:px-6 py-3 rounded-xl transition-all duration-200 flex-1 ${
                activeTab === tab.key
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg'
                  : 'text-emerald-700 hover:text-emerald-600 hover:bg-emerald-50/50'
              }`}
            >
              <tab.icon className="w-4 h-4 lg:w-5 lg:h-5" />
              <span className="font-semibold text-sm lg:text-base">{tab.label}</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                activeTab === tab.key ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-700'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border-2 border-emerald-100/50 overflow-hidden">
            {/* Add Admin Section */}
            <div className="p-4 lg:p-6 border-b border-emerald-100 bg-gradient-to-r from-emerald-50/80 to-teal-50/80">
              <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 mb-4">
                <h3 className="text-lg lg:text-xl font-serif font-semibold text-emerald-900 flex items-center gap-2">
                  <Users className="w-4 h-4 lg:w-5 lg:h-5" />
                  Admin Management
                </h3>
                <button
                  onClick={() => setShowAddAdmin(!showAddAdmin)}
                  className="flex items-center justify-center space-x-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-4 py-2 rounded-xl transition-all duration-200 shadow-lg text-sm lg:text-base"
                >
                  <Plus className="w-4 h-4" />
                  <span>{showAddAdmin ? 'Cancel' : 'Add New Admin'}</span>
                </button>
              </div>

              {/* Add Admin Form */}
              {showAddAdmin && (
                <div className="bg-white p-4 lg:p-6 rounded-xl border-2 border-emerald-100 shadow-sm">
                  <form onSubmit={handleAddAdmin} className="space-y-4 lg:space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
                      <div>
                        <label className="block text-sm font-medium text-emerald-700 mb-2">
                          Username *
                        </label>
                        <input
                          type="text"
                          value={newAdminData.username}
                          onChange={(e) => handleInputChange('username', e.target.value)}
                          className="w-full px-3 lg:px-4 py-2 lg:py-3 border-2 border-emerald-200 rounded-xl focus:border-emerald-400 focus:outline-none transition-colors text-sm lg:text-base"
                          placeholder="Enter username"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-emerald-700 mb-2">
                          Email *
                        </label>
                        <input
                          type="email"
                          value={newAdminData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className="w-full px-3 lg:px-4 py-2 lg:py-3 border-2 border-emerald-200 rounded-xl focus:border-emerald-400 focus:outline-none transition-colors text-sm lg:text-base"
                          placeholder="Enter email"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-emerald-700 mb-2">
                          Password *
                        </label>
                        <input
                          type="password"
                          value={newAdminData.pass}
                          onChange={(e) => handleInputChange('pass', e.target.value)}
                          className="w-full px-3 lg:px-4 py-2 lg:py-3 border-2 border-emerald-200 rounded-xl focus:border-emerald-400 focus:outline-none transition-colors text-sm lg:text-base"
                          placeholder="Enter password"
                          required
                          minLength="6"
                        />
                      </div>
                    </div>

                    {/* Message Display */}
                    {message.text && (
                      <div className={`p-3 lg:p-4 rounded-xl border-2 text-sm lg:text-base ${
                        message.type === 'success' 
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-200' 
                          : 'bg-rose-100 text-rose-800 border-rose-200'
                      }`}>
                        {message.text}
                      </div>
                    )}

                    <div className="flex flex-col lg:flex-row justify-end space-y-3 lg:space-y-0 lg:space-x-3">
                      <button
                        type="button"
                        onClick={resetForm}
                        className="px-4 lg:px-6 py-2 lg:py-3 border-2 border-emerald-200 text-emerald-700 rounded-xl hover:bg-emerald-50 transition-colors text-sm lg:text-base"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={loading.addAdmin}
                        className="flex items-center justify-center space-x-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 disabled:from-emerald-300 disabled:to-teal-300 text-white px-4 lg:px-6 py-2 lg:py-3 rounded-xl transition-all duration-200 text-sm lg:text-base"
                      >
                        {loading.addAdmin ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                            <span>Adding...</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-4 h-4" />
                            <span>Add Admin</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>

            <div className="p-4 lg:p-6 border-b border-emerald-100">
              <h3 className="text-lg lg:text-xl font-serif font-semibold text-emerald-900 flex items-center gap-2">
                All Users ({users.length})
              </h3>
            </div>
            {loading.users ? (
              renderLoading()
            ) : users.length === 0 ? (
              renderEmptyState('No users found in the ecosystem', Users)
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-max">
                  <thead className="bg-emerald-50/50">
                    <tr>
                      <th className="text-left p-3 lg:p-4 text-xs lg:text-sm font-semibold text-emerald-700 uppercase tracking-wider">Username</th>
                      <th className="text-left p-3 lg:p-4 text-xs lg:text-sm font-semibold text-emerald-700 uppercase tracking-wider">Email</th>
                      <th className="text-left p-3 lg:p-4 text-xs lg:text-sm font-semibold text-emerald-700 uppercase tracking-wider">Roles</th>
                      <th className="text-left p-3 lg:p-4 text-xs lg:text-sm font-semibold text-emerald-700 uppercase tracking-wider">Created</th>
                      <th className="text-left p-3 lg:p-4 text-xs lg:text-sm font-semibold text-emerald-700 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-emerald-100">
                    {users.map((user) => (
                      <tr key={user._id} className="hover:bg-emerald-50/30 transition-colors">
                        <td className="p-3 lg:p-4 text-xs lg:text-sm font-medium text-emerald-900">{user.username}</td>
                        <td className="p-3 lg:p-4 text-xs lg:text-sm text-emerald-600">{user.email || 'N/A'}</td>
                        <td className="p-3 lg:p-4">
                          <div className="flex flex-wrap gap-1">
                            {user.role?.map((role, index) => (
                              <span key={index} className="bg-emerald-100 text-emerald-700 px-2 lg:px-3 py-1 rounded-full text-xs border border-emerald-200">
                                {role}
                              </span>
                            )) || 'N/A'}
                          </div>
                        </td>
                        <td className="p-3 lg:p-4 text-xs lg:text-sm text-emerald-600">
                          {user.created ? new Date(user.created).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="p-3 lg:p-4">
                          <button
                            onClick={() => handleDeleteUser(user._id)}
                            className="text-rose-500 hover:text-rose-700 p-1 lg:p-2 rounded-lg hover:bg-rose-50 transition-colors"
                            title="Delete User"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Businesses Tab */}
        {activeTab === 'businesses' && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border-2 border-emerald-100/50 overflow-hidden">
            <div className="p-4 lg:p-6 border-b border-emerald-100">
              <h3 className="text-lg lg:text-xl font-serif font-semibold text-emerald-900 flex items-center gap-2">
                <Trees className="w-4 h-4 lg:w-5 lg:h-5" />
                All Businesses ({businesses.length})
              </h3>
            </div>
            {loading.businesses ? (
              renderLoading()
            ) : businesses.length === 0 ? (
              renderEmptyState('No businesses found', Trees)
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-max">
                  <thead className="bg-emerald-50/50">
                    <tr>
                      <th className="text-left p-3 lg:p-4 text-xs lg:text-sm font-semibold text-emerald-700 uppercase tracking-wider">Business Name</th>
                      <th className="text-left p-3 lg:p-4 text-xs lg:text-sm font-semibold text-emerald-700 uppercase tracking-wider hidden lg:table-cell">Description</th>
                      <th className="text-left p-3 lg:p-4 text-xs lg:text-sm font-semibold text-emerald-700 uppercase tracking-wider">Products</th>
                      <th className="text-left p-3 lg:p-4 text-xs lg:text-sm font-semibold text-emerald-700 uppercase tracking-wider">Orders</th>
                      <th className="text-left p-3 lg:p-4 text-xs lg:text-sm font-semibold text-emerald-700 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-emerald-100">
                    {businesses.map((business) => (
                      <tr key={business._id} className="hover:bg-emerald-50/30 transition-colors">
                        <td className="p-3 lg:p-4 text-xs lg:text-sm font-medium text-emerald-900">{business.b_name}</td>
                        <td className="p-3 lg:p-4 text-xs lg:text-sm text-emerald-600 max-w-xs truncate hidden lg:table-cell" title={business.b_desp}>
                          {business.b_desp || 'No description'}
                        </td>
                        <td className="p-3 lg:p-4 text-center">
                          <span className="bg-emerald-100 text-emerald-700 px-2 lg:px-3 py-1 rounded-full text-xs font-medium">
                            {business.products?.length || 0}
                          </span>
                        </td>
                        <td className="p-3 lg:p-4 text-center">
                          <span className="bg-teal-100 text-teal-700 px-2 lg:px-3 py-1 rounded-full text-xs font-medium">
                            {business.orders?.length || 0}
                          </span>
                        </td>
                        <td className="p-3 lg:p-4">
                          <div className="flex space-x-1 lg:space-x-2">
                            <button
                              className="text-emerald-500 hover:text-emerald-700 p-1 lg:p-2 rounded-lg hover:bg-emerald-50 transition-colors"
                              title="View Business"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteBusiness(business._id)}
                              className="text-rose-500 hover:text-rose-700 p-1 lg:p-2 rounded-lg hover:bg-rose-50 transition-colors"
                              title="Delete Business"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border-2 border-emerald-100/50 overflow-hidden">
            <div className="p-4 lg:p-6 border-b border-emerald-100">
              <h3 className="text-lg lg:text-xl font-serif font-semibold text-emerald-900 flex items-center gap-2">
                <Package className="w-4 h-4 lg:w-5 lg:h-5" />
                All Orders ({orders.length})
              </h3>
            </div>
            {loading.orders ? (
              renderLoading()
            ) : orders.length === 0 ? (
              renderEmptyState('No orders found', Package)
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-max">
                  <thead className="bg-emerald-50/50">
                    <tr>
                      <th className="text-left p-3 lg:p-4 text-xs lg:text-sm font-semibold text-emerald-700 uppercase tracking-wider">Order ID</th>
                      <th className="text-left p-3 lg:p-4 text-xs lg:text-sm font-semibold text-emerald-700 uppercase tracking-wider">Customer</th>
                      <th className="text-left p-3 lg:p-4 text-xs lg:text-sm font-semibold text-emerald-700 uppercase tracking-wider hidden lg:table-cell">Product</th>
                      <th className="text-left p-3 lg:p-4 text-xs lg:text-sm font-semibold text-emerald-700 uppercase tracking-wider">Qty</th>
                      <th className="text-left p-3 lg:p-4 text-xs lg:text-sm font-semibold text-emerald-700 uppercase tracking-wider">Payment</th>
                      <th className="text-left p-3 lg:p-4 text-xs lg:text-sm font-semibold text-emerald-700 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-emerald-100">
                    {orders.map((order) => (
                      <tr key={order.o_id} className="hover:bg-emerald-50/30 transition-colors">
                        <td className="p-3 lg:p-4 text-xs lg:text-sm font-mono text-emerald-600 truncate max-w-[120px] lg:max-w-none">
                          {order.o_id}
                        </td>
                        <td className="p-3 lg:p-4 text-xs lg:text-sm text-emerald-900 truncate max-w-[100px] lg:max-w-none">
                          {order.orderBy}
                        </td>
                        <td className="p-3 lg:p-4 text-xs lg:text-sm text-emerald-600 truncate max-w-[100px] lg:max-w-none hidden lg:table-cell">
                          {order.p_name}
                        </td>
                        <td className="p-3 lg:p-4 text-center">
                          <span className="bg-amber-100 text-amber-700 px-2 lg:px-3 py-1 rounded-full text-xs font-medium">
                            {order.quantity}
                          </span>
                        </td>
                        <td className="p-3 lg:p-4">
                          <span className={`px-2 lg:px-3 py-1 rounded-full text-xs font-medium border ${
                            order.pay 
                              ? 'bg-emerald-100 text-emerald-700 border-emerald-200' 
                              : 'bg-amber-100 text-amber-700 border-amber-200'
                          }`}>
                            {order.pay ? 'Paid' : 'Pending'}
                          </span>
                        </td>
                        <td className="p-3 lg:p-4">
                          <button
                            onClick={() => handleCancelOrder(order.o_id)}
                            disabled={order.pay}
                            className={`px-3 lg:px-4 py-1 lg:py-2 rounded-xl text-xs font-medium transition-colors ${
                              order.pay 
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                : 'bg-rose-100 text-rose-700 hover:bg-rose-200 border border-rose-200'
                            }`}
                          >
                            Cancel
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;