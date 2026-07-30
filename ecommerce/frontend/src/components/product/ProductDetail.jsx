import { useState, useEffect } from 'react';
import { Package, ShoppingCart, Store, Heart, Zap, Star, MapPin, Clock, Tag, Leaf } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import { api } from '../../services/api';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

const ProductDetail = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = useAuth();
  const [isBuying, setIsBuying] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [product, setProduct] = useState(null);
  const [business, setBusiness] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Order placement states
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India',
    phoneNumber: ''
  });
  const [orderQuantity, setOrderQuantity] = useState(1);

  // Check if user came here with buy now intent
  const { buyNowIntent, quantity: initialQuantity } = location.state || {};

  useEffect(() => {
    fetchProductDetail();
  }, [productId]);

  useEffect(() => {
    if (buyNowIntent && product) {
      setOrderQuantity(initialQuantity || 1);
      handleBuyNowModal();
    }
  }, [buyNowIntent, product]);

  const fetchProductDetail = async () => {
    try {
      setLoading(true);
      const res = await api.getProductById(productId, token);
      if (res.ok) {
        const data = await res.json();
        setProduct(data);
        setBusiness(data.p_belongs || null);
      }
    } catch (err) {
      console.error('Failed to fetch product:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!token) {
      alert('Please login to add items to cart');
      return;
    }

    setIsAddingToCart(true);
    try {
      const response = await api.addToCart(productId, token);
      if (response.ok) {
        alert('Product added to cart successfully!');
      } else {
        const errData = await response.json();
        alert(errData.message || 'Failed to add to cart');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Error adding to cart. Please try again.');
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleBuyNowModal = () => {
    if (!token || !product) {
      alert('Please login to place an order');
      return;
    }

    setSelectedProduct({
      productId: product._id,
      businessId: product.p_belongs?.id,
      quantity: orderQuantity,
      product: product
    });
    setShowAddressModal(true);
  };

  const handlePlaceOrder = async () => {
    if (!selectedProduct) return;

    // Validate address
    if (!address.street || !address.city || !address.state ||!address.zipCode || !address.phoneNumber) {
      alert('Please fill in all address fields');
      return;
    }

    setIsBuying(true);
    try {
      // Format address as a string (since your backend expects String in @RequestBody)
      const addressString = `${address.street}, ${address.city}, ${address.state}, ${address.zipCode}, ${address.country}, Phone: ${address.phoneNumber}`;

      const response = await api.placeOrder(
        selectedProduct.productId,
        selectedProduct.businessId,
        selectedProduct.quantity,
        addressString, // Pass as string, not object
        token
      );

      if (response.ok) {
        // Check if response has content before parsing
        const contentLength = response.headers.get('content-length');
        if (contentLength && parseInt(contentLength) > 0) {
          try {
            const orderData = await response.json();
            alert('Order placed successfully!');
            closeModal();
            
            window.dispatchEvent(new CustomEvent('app:navigate', { 
              detail: { path: `/order-confirmation/${orderData.orderId || 'success'}` } 
            }));
          } catch (parseError) {
            // If JSON parsing fails but status is OK, still treat as success
            console.log('Empty response, but order was successful');
            alert('Order placed successfully!');
            closeModal();
          }
        } else {
          // Empty response but successful
          alert('Order placed successfully!');
          closeModal();
        }
      } else {
        // Handle error response
        try {
          const errorText = await response.text();
          if (errorText) {
            try {
              const errorData = JSON.parse(errorText);
              alert(`Error placing order: ${errorData.message || 'Please try again'}`);
            } catch {
              alert(`Error placing order: ${errorText}`);
            }
          } else {
            alert(`Error placing order: HTTP ${response.status}`);
          }
        } catch (error) {
          alert('Error placing order. Please try again.');
        }
      }
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Error placing order. Please try again.');
    } finally {
      setIsBuying(false);
    }
  };

  const handleAddressChange = (field, value) => {
    setAddress(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const closeModal = () => {
    setShowAddressModal(false);
    setSelectedProduct(null);
    setAddress({
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'India',
      phoneNumber: ''
    });
    setOrderQuantity(1);
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const nextImage = () => {
    if (product.img && product.img.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % product.img.length);
    }
  };

  const prevImage = () => {
    if (product.img && product.img.length > 1) {
      setCurrentImageIndex((prev) => (prev - 1 + product.img.length) % product.img.length);
    }
  };

  const handleBusinessClick = () => {
    if (product.p_belongs?.id) {
      navigate(`/business-public/${product.p_belongs.id}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-200 border-t-green-600 mx-auto mb-4"></div>
          <p className="text-green-800 font-medium">Loading natural product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
        <div className="text-center bg-white/70 backdrop-blur-sm rounded-3xl p-12 shadow-xl border border-green-100">
          <Package className="w-20 h-20 text-green-400 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-green-800 mb-2">Product not found</h2>
          <p className="text-green-600">This natural product might be out of season</p>
        </div>
      </div>
    );
  }

  const isOutOfStock = product.quantity === 0;
  const isLowStock = product.quantity > 0 && product.quantity <= 5;
  const currentImage = product.img && product.img.length > 0 ? product.img[currentImageIndex] : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-8 relative overflow-hidden">
      {/* Nature pattern background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 text-6xl text-green-600">🌿</div>
        <div className="absolute top-40 right-20 text-4xl text-emerald-600">🍃</div>
        <div className="absolute bottom-32 left-32 text-5xl text-teal-600">🌱</div>
        <div className="absolute bottom-20 right-16 text-3xl text-green-600">🌿</div>
        <div className="absolute top-60 left-1/2 text-4xl text-emerald-600">🍃</div>
      </div>

      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <button 
            onClick={() => navigate(-1)}
            className="text-green-700 hover:text-green-900 font-semibold bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full border border-green-200 hover:bg-white/80 transition-all duration-200 shadow-sm"
          >
            ← Back to Natural Products
          </button>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-green-100">
              {currentImage ? (
                <img
                  src={currentImage}
                  alt={product.p_name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-100 to-emerald-100">
                  <Package className="w-32 h-32 text-green-300" />
                </div>
              )}

              {/* Image Navigation */}
              {product.img && product.img.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white backdrop-blur-sm rounded-full p-3 shadow-lg border border-green-100 hover:border-green-200 transition-all duration-200"
                  >
                    <svg className="w-5 h-5 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white backdrop-blur-sm rounded-full p-3 shadow-lg border border-green-100 hover:border-green-200 transition-all duration-200"
                  >
                    <svg className="w-5 h-5 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </>
              )}

              {/* Favorite Button */}
              <button
                onClick={toggleFavorite}
                className="absolute top-4 right-4 bg-white/90 hover:bg-white backdrop-blur-sm rounded-full p-3 shadow-lg border border-green-100 hover:border-green-200 transition-all duration-200"
              >
                <Heart 
                  className={`w-6 h-6 transition-colors ${
                    isFavorite ? 'fill-red-500 text-red-500' : 'text-green-700'
                  }`} 
                />
              </button>

              {/* Stock Status */}
              {isOutOfStock && (
                <div className="absolute top-4 left-4 bg-red-500/90 backdrop-blur-sm text-white px-4 py-2 rounded-2xl text-sm font-semibold border border-red-300">
                  Out of Season
                </div>
              )}

              {/* Eco Badge */}
              <div className="absolute bottom-4 left-4 bg-green-600/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center border border-green-400">
                <Leaf className="w-3 h-3 mr-1" />
                Eco-Friendly
              </div>
            </div>

            {/* Thumbnail Images */}
            {product.img && product.img.length > 1 && (
              <div className="flex space-x-3 overflow-x-auto">
                {product.img.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-2xl overflow-hidden border-3 transition-all duration-200 ${
                      index === currentImageIndex 
                        ? 'border-green-500 shadow-lg scale-105' 
                        : 'border-green-200 hover:border-green-400'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.p_name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Information */}
          <div className="space-y-6">
            {/* Product Header */}
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-green-100">
              <h1 className="text-3xl lg:text-4xl font-bold text-green-900 mb-4 leading-tight">
                {product.p_name}
              </h1>
              
              {/* Price */}
              <div className="flex items-baseline space-x-3 mb-6">
                <span className="text-4xl font-bold text-green-700">
                  ₹{product.amt.toFixed(2)}
                </span>
                <span className={`text-lg font-semibold px-3 py-1 rounded-full ${
                  isOutOfStock ? 'text-red-600 bg-red-50' : 
                  isLowStock ? 'text-orange-600 bg-orange-50' : 'text-green-600 bg-green-50'
                }`}>
                  {product.quantity} available
                </span>
              </div>

              {/* Categories */}
              {product.category && product.category.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {product.category.map((cat, index) => (
                    <span
                      key={index}
                      className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold flex items-center border border-green-200"
                    >
                      <Tag className="w-3 h-3 mr-2" />
                      {cat}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Business Information */}
            {business && (
              <div 
                className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-green-100 cursor-pointer hover:bg-white/80 transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]"
                onClick={handleBusinessClick}
              >
                <div className="flex items-center space-x-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-green-100 via-emerald-100 to-teal-100 rounded-full flex items-center justify-center border-2 border-green-200">
                    <Store className="w-10 h-10 text-green-700" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-green-900 mb-2">
                      {business.name}
                    </h3>
                    <p className="text-green-700 mb-3 line-clamp-2 font-medium">
                      {business.desp || 'Certified eco-friendly seller promoting sustainable living'}
                    </p>
                    <div className="flex items-center space-x-6 text-sm text-green-600">
                      <span className="flex items-center bg-yellow-50 px-3 py-1 rounded-full border border-yellow-200">
                        <Star className="w-4 h-4 text-yellow-500 mr-1 fill-current" />
                        <span className="font-semibold text-green-800">4.8 (256 reviews)</span>
                      </span>
                      <span className="flex items-center bg-green-50 px-3 py-1 rounded-full border border-green-200">
                        <MapPin className="w-4 h-4 text-green-500 mr-1" />
                        <span className="font-semibold text-green-800">{business.location || 'Sustainable Store'}</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Product Description */}
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-green-100">
              <h3 className="text-xl font-bold text-green-900 mb-4 flex items-center">
                <Leaf className="w-5 h-5 mr-2 text-green-600" />
                Natural Product Description
              </h3>
              <p className="text-green-800 leading-relaxed font-medium">
                {product.p_desp || 'This carefully curated natural product embodies our commitment to sustainability and environmental consciousness. Made with love for nature and designed to bring harmony to your eco-friendly lifestyle.'}
              </p>
            </div>

            {/* Additional Product Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-green-100">
                <h4 className="font-bold text-green-900 mb-3 flex items-center">
                  <Package className="w-4 h-4 mr-2 text-green-600" />
                  Product Details
                </h4>
                <div className="space-y-2 text-sm text-green-700">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Product ID:</span>
                    <span className="font-mono bg-green-50 px-2 py-1 rounded text-xs">{product._id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Added on:</span>
                    <span>{new Date(product.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Last updated:</span>
                    <span>{new Date(product.updatedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-green-100">
                <h4 className="font-bold text-green-900 mb-3 flex items-center">
                  <Clock className="w-4 h-4 mr-2 text-green-600" />
                  Eco Delivery Info
                </h4>
                <div className="space-y-3 text-sm text-green-700">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-3 text-green-500" />
                    <span className="font-medium">Carbon-neutral shipping in 2-3 days</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-3 text-emerald-500" />
                    <span className="font-medium">Free eco-packaging on orders over ₹500</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quantity Selector */}
            {token && !isOutOfStock && (
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-green-100">
                <label className="block text-sm font-bold text-green-900 mb-3">
                  Quantity
                </label>
                <input
                  type="number"
                  min="1"
                  max={product.quantity}
                  value={orderQuantity}
                  onChange={(e) => setOrderQuantity(parseInt(e.target.value) || 1)}
                  className="w-32 px-4 py-3 border-2 border-green-200 rounded-xl focus:ring-4 focus:ring-green-100 focus:border-green-500 transition-all duration-200 bg-white/80 backdrop-blur-sm font-semibold text-green-900"
                />
              </div>
            )}

            {/* Action Buttons */}
            {token && (
              <div className="space-y-3">
                {/* Buy Now Button */}
                <button
                  onClick={handleBuyNowModal}
                  disabled={isOutOfStock || isBuying}
                  className={`w-full py-4 px-6 rounded-2xl font-bold text-white transition-all duration-300 flex items-center justify-center space-x-3 shadow-xl ${
                    isOutOfStock 
                      ? 'bg-gray-400 cursor-not-allowed border border-gray-300' 
                      : 'bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 hover:from-orange-600 hover:via-red-600 hover:to-pink-600 active:scale-95 hover:shadow-2xl border-2 border-orange-300'
                  } ${isBuying ? 'opacity-70' : ''}`}
                >
                  {isBuying ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      <span>Processing Order...</span>
                    </>
                  ) : isOutOfStock ? (
                    <span>Currently Out of Season</span>
                  ) : (
                    <>
                      <Zap className="w-5 h-5" />
                      <span>Buy Now - Support Nature</span>
                    </>
                  )}
                </button>

                {/* Add to Cart Button */}
                <button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock || isAddingToCart}
                  className={`w-full py-4 px-6 rounded-2xl font-bold text-white transition-all duration-300 flex items-center justify-center space-x-3 shadow-xl ${
                    isOutOfStock 
                      ? 'bg-gray-400 cursor-not-allowed border border-gray-300' 
                      : 'bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 hover:from-green-600 hover:via-emerald-600 hover:to-teal-600 active:scale-95 hover:shadow-2xl border-2 border-green-300'
                  } ${isAddingToCart ? 'opacity-70' : ''}`}
                >
                  {isAddingToCart ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      <span>Adding to Eco Cart...</span>
                    </>
                  ) : isOutOfStock ? (
                    <span>Currently Out of Season</span>
                  ) : (
                    <>
                      <ShoppingCart className="w-5 h-5" />
                      <span>Add to Eco Cart</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {!token && (
              <div className="text-center py-10 bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-green-100">
                <Leaf className="w-16 h-16 text-green-400 mx-auto mb-4" />
                <p className="text-green-800 mb-6 text-lg font-semibold">Join our eco-friendly community to purchase sustainable products</p>
                <button
                  onClick={() => navigate('/login')}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-4 rounded-2xl font-bold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                >
                  Login to Continue Your Green Journey
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Address Modal */}
        {showAddressModal && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white/95 backdrop-blur-lg rounded-3xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-green-200">
              <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold text-green-900 flex items-center">
                    <MapPin className="w-6 h-6 mr-2 text-green-600" />
                    Eco Delivery Address
                  </h2>
                  <button
                    onClick={closeModal}
                    className="text-green-400 hover:text-green-600 text-3xl hover:bg-green-50 rounded-full w-10 h-10 flex items-center justify-center transition-all duration-200"
                  >
                    ×
                  </button>
                </div>

                {selectedProduct && (
                  <div className="mb-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-200">
                    <h3 className="font-bold text-green-900 mb-3 flex items-center">
                      <Leaf className="w-4 h-4 mr-2 text-green-600" />
                      Order Summary
                    </h3>
                    <p className="text-green-800 font-semibold">
                      {selectedProduct.product.p_name}
                    </p>
                    <p className="text-green-700 text-sm">
                      Quantity: {selectedProduct.quantity}
                    </p>
                    <p className="text-2xl font-bold text-green-700 mt-3">
                      ₹{(selectedProduct.product.amt * selectedProduct.quantity).toFixed(2)}
                    </p>
                  </div>
                )}

                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-bold text-green-900 mb-2">
                      Street Address *
                    </label>
                    <input
                      type="text"
                      value={address.street}
                      onChange={(e) => handleAddressChange('street', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-green-200 rounded-xl focus:ring-4 focus:ring-green-100 focus:border-green-500 transition-all duration-200 bg-white/80 backdrop-blur-sm"
                      placeholder="Enter your street address"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-green-900 mb-2">
                        State *
                      </label>
                      <input
                        type="text"
                        value={address.state}
                        onChange={(e) => handleAddressChange('state', e.target.value)}
                        className="w-full px-4 py-3 border-2 border-green-200 rounded-xl focus:ring-4 focus:ring-green-100 focus:border-green-500 transition-all duration-200 bg-white/80 backdrop-blur-sm"
                        placeholder="State"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-green-900 mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        value={address.city}
                        onChange={(e) => handleAddressChange('city', e.target.value)}
                        className="w-full px-4 py-3 border-2 border-green-200 rounded-xl focus:ring-4 focus:ring-green-100 focus:border-green-500 transition-all duration-200 bg-white/80 backdrop-blur-sm"
                        placeholder="City"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-green-900 mb-2">
                        ZIP Code *
                      </label>
                      <input
                        type="text"
                        value={address.zipCode}
                        onChange={(e) => handleAddressChange('zipCode', e.target.value)}
                        className="w-full px-4 py-3 border-2 border-green-200 rounded-xl focus:ring-4 focus:ring-green-100 focus:border-green-500 transition-all duration-200 bg-white/80 backdrop-blur-sm"
                        placeholder="ZIP Code"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-green-900 mb-2">
                        Country
                      </label>
                      <input
                        type="text"
                        value={address.country}
                        onChange={(e) => handleAddressChange('country', e.target.value)}
                        className="w-full px-4 py-3 border-2 border-green-200 rounded-xl focus:ring-4 focus:ring-green-100 focus:border-green-500 transition-all duration-200 bg-white/80 backdrop-blur-sm"
                        placeholder="Country"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-green-900 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={address.phoneNumber}
                      onChange={(e) => handleAddressChange('phoneNumber', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-green-200 rounded-xl focus:ring-4 focus:ring-green-100 focus:border-green-500 transition-all duration-200 bg-white/80 backdrop-blur-sm"
                      placeholder="Enter your phone number"
                      required
                    />
                  </div>

                  <div className="flex space-x-4 pt-6">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="flex-1 px-6 py-4 border-2 border-green-300 text-green-700 rounded-xl hover:bg-green-50 transition-all duration-200 font-bold backdrop-blur-sm"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handlePlaceOrder}
                      className="flex-1 px-6 py-4 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 hover:from-orange-600 hover:via-red-600 hover:to-pink-600 text-white rounded-xl transition-all duration-200 font-bold shadow-xl hover:shadow-2xl flex items-center justify-center"
                      disabled={!selectedProduct || isBuying}
                    >
                      {isBuying ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                          Processing...
                        </>
                      ) : (
                        <>
                          <Leaf className="w-4 h-4 mr-2" />
                          Place Eco Order
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;