
const _rawApiBase = import.meta.env.VITE_APP_URL;
const API_BASE = _rawApiBase ? String(_rawApiBase).replace(/\/$/, '') : '';

if (!_rawApiBase) {

  console.warn('[API] VITE_APP_URL is not set. Using relative paths. Set VITE_APP_URL in your environment variables for production.');
}

const authHeaders = (token, json = false) => {
  const headers = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (json) headers['Content-Type'] = 'application/json';
  return headers;
};

export const api = {
  // -------------------- AUTH --------------------
  register: (userData) => fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: authHeaders(null, true),
    body: JSON.stringify(userData)
  }),

  login: (credentials) => fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: authHeaders(null, true),
    body: JSON.stringify(credentials)
  }),

  // -------------------- PUBLIC --------------------
  getAllProducts: () => fetch(`${API_BASE}/public/all-products`, {
    method: 'GET'
  }),

  getBusinessPublic: (businessId) => fetch(`${API_BASE}/public/see-business/${businessId}`, {
    method: 'GET'
  }),

  // -------------------- USER --------------------
  getUserInfo: (token) => fetch(`${API_BASE}/user`, {
    method: 'GET',
    headers: authHeaders(token, false)
  }),

  deleteAccount: (token) => fetch(`${API_BASE}/user/delete-acc`, {
    method: 'DELETE',
    headers: authHeaders(token, false)
  }),

  deleteUserOrder: (orderId, token) => 
  fetch(`${API_BASE}/user/order-history/${orderId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  }),

  changePassword: (newPass, token) => fetch(`${API_BASE}/user/change-pass/${encodeURIComponent(newPass)}`, {
    method: 'PUT',
    headers: authHeaders(token, false)
  }),

  updateProfile: (userData, token) => 
  fetch(`${API_BASE}/user/update-profile`, {
    method: 'PUT',
    headers: {
      ...authHeaders(token, true), // true => content-type JSON
    },
    body: JSON.stringify(userData)
  }),

  addToCart: (productId, token) => fetch(`${API_BASE}/user/add-to-cart/${productId}`, {
    method: 'PUT',
    headers: authHeaders(token, false)
  }),

  getCartProducts: (token) => fetch(`${API_BASE}/user/get-product-for`, {
    method: 'GET',
    headers: authHeaders(token, false)
  }),

  placeOrder: (productId, businessId, quantity, address, token) => fetch(`${API_BASE}/user/placed-order/${productId}/${businessId}/${quantity}`, {
    method: 'POST',
    headers: authHeaders(token, true),
    body: JSON.stringify(address)
  }),

  cancelOrder: (orderId, token) => fetch(`${API_BASE}/user/cancel-order/${orderId}`, {
    method: 'DELETE',
    headers: authHeaders(token, false)
  }),

  addBusiness: (businessData, token) => fetch(`${API_BASE}/user/add-business`, {
    method: 'POST',
    headers: authHeaders(token, true),
    body: JSON.stringify(businessData)
  }),

  deleteBusiness: (businessId, token) => fetch(`${API_BASE}/user/delete-business/${businessId}`, {
    method: 'DELETE',
    headers: authHeaders(token, false)
  }),

  getProductById: (productId, token) => fetch(`${API_BASE}/user/get-product/${productId}`, {
    method: 'GET',
    headers: authHeaders(token, false)
}),


  // -------------------- OWNER --------------------
  // returns BusinessSummaryDTO[]
  getBusinesses: (token) => fetch(`${API_BASE}/owner/get-business`, {
    method: 'GET',
    headers: authHeaders(token, true)
  }),

  confirmPayment: (o_id, token) => fetch(`${API_BASE}/owner/confirm-payment/${o_id}`, {
  method: 'PUT',
  headers: authHeaders(token, true)
}),


  getBusinessProducts: (businessId, token) =>
  fetch(`${API_BASE}/owner/${businessId}`, {
    method: 'GET',
    headers: authHeaders(token),
  }),

  addProduct: (businessId, productData, token) => fetch(`${API_BASE}/owner/add-product/${businessId}`, {
    method: 'POST',
    headers: authHeaders(token, true),
    body: JSON.stringify(productData)
  }),

  deleteProduct: (productId, token) => fetch(`${API_BASE}/owner/delete-product/${productId}`, {
    method: 'DELETE',
    headers: authHeaders(token, false)
  }),

  getBusinessOrders: (businessId, token) => fetch(`${API_BASE}/owner/order/${businessId}`, {
    method: 'GET',
    headers: authHeaders(token, false)
  }),

  deleteOrderHistory: (orderId,businessId, token) => 
  fetch(`${API_BASE}/owner/order-history/${orderId}/${businessId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  }),

  updateProduct: (productId, productData, token) =>
    fetch(`${API_BASE}/owner/update/${productId}`, {
      method: "PUT",
      headers: authHeaders(token, true),
      body: JSON.stringify(productData),
    }),

  // get business entity by id (owner/admin)
  getBusinessById: (businessId, token) => fetch(`${API_BASE}/owner/business/${businessId}`, {
    method: 'GET',
    headers: authHeaders(token, false)
  }),

  // -------------------- ADMIN --------------------
  getAllUsers: (token) => fetch(`${API_BASE}/admin/all-users`, {
    method: 'GET',
    headers: authHeaders(token, false)
  }),

  addAdmin: (userData, token) => fetch(`${API_BASE}/admin/add-admin`, {
    method: 'POST',
    headers: authHeaders(token, true),
    body: JSON.stringify(userData)
  }),

  getUserById: (userId, token) => fetch(`${API_BASE}/admin/get-user/${userId}`, {
    method: 'GET',
    headers: authHeaders(token, false)
  }),

  deleteUser: (userId, token) => fetch(`${API_BASE}/admin/${userId}`, {
    method: 'DELETE',
    headers: authHeaders(token, false)
  }),

  getAllBusinesses: (token) => fetch(`${API_BASE}/admin/all-business`, {
    method: 'GET',
    headers: authHeaders(token, false)
  }),

  getAllOrders: (token) => fetch(`${API_BASE}/admin/all-order`, {
    method: 'GET',
    headers: authHeaders(token, false)
  }),

  getOrderById: (orderId, token) => fetch(`${API_BASE}/admin/get-order/${orderId}`, {
    method: 'GET',
    headers: authHeaders(token, false)
  }),

  cancelOrderAdmin: (orderId, token) => fetch(`${API_BASE}/admin/cancel-order/${orderId}`, {
    method: 'DELETE',
    headers: authHeaders(token, false)
  }),

  getBusinessAdminById: (businessId, token) => fetch(`${API_BASE}/admin/get-business/${businessId}`, {
    method: 'GET',
    headers: authHeaders(token, false)
  }),

  getProductAdminById: (productId, token) => fetch(`${API_BASE}/admin/get-product/${productId}`, {
    method: 'GET',
    headers: authHeaders(token, false)
  }),

  // -------------------- Misc / Helpers --------------------
  // remove from cart (user) - convenience endpoint (implement if present in backend)
  removeFromCart: (productId, token) => fetch(`${API_BASE}/user/remove-from-cart/${productId}`, {
    method: 'DELETE',
    headers: authHeaders(token, false)
  })
};
