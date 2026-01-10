import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../../services/api';
import ProductCard from '../common/ProductCard';
import { Store, Package, Users, Star, Leaf, Sprout, Heart } from 'lucide-react';
import userImg from '../../assets/react.svg';

const BusinessPublicPage = () => {
  const { businessId } = useParams();
  const [business, setBusiness] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBusinessData();
  }, [businessId]);

  const fetchBusinessData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const businessResponse = await api.getBusinessPublic(businessId);
      
      if (businessResponse.ok) {
        const businessData = await businessResponse.json();
        console.log('Business Data:', businessData);
        
        setBusiness(businessData);
        setProducts(businessData.products || []);
      } else {
        setError('Failed to fetch business data');
      }
    } catch (error) {
      console.error('Error fetching business data:', error);
      setError('Error loading business page');
    } finally {
      setLoading(false);
    }
  };

  // Corrected property mapping
  const formatProductForCard = (product) => ({
    _id: product.p_id,
    p_name: product.name,
    amt: product.amt,
    quantity: product.quantity,
    img: product.img || [],
    category: product.categories || [],
    p_belongs: business ? {
      id: business.id,
      name: business.name,
      profile: business.profile, // This is the image URL
      description: business.desp // This is the description
    } : null
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-emerald-50">
        <div className="text-center">
          <div className="relative mb-6">
            <div className="w-20 h-20 mx-auto bg-emerald-100 rounded-full flex items-center justify-center">
              <Leaf className="w-10 h-10 text-emerald-600 animate-pulse" />
            </div>
            <div className="absolute -inset-4 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
          </div>
          <h3 className="text-xl font-serif font-semibold text-emerald-800 mb-2">Loading Natural Products</h3>
          <p className="text-emerald-600">Discovering sustainable treasures...</p>
        </div>
      </div>
    );
  }

  if (error || !business) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-amber-50">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-24 h-24 mx-auto mb-6 bg-amber-100 rounded-full flex items-center justify-center">
            <Sprout className="w-12 h-12 text-amber-600" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-amber-800 mb-3">Business Not Found</h2>
          <p className="text-amber-700 mb-6">{error || "The natural business you're looking for doesn't exist or may have returned to the earth."}</p>
          <button 
            onClick={fetchBusinessData}
            className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 focus:ring-2 focus:ring-amber-300 focus:ring-offset-2"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-amber-50">
      {/* Header Section with Natural Background */}
      <div className="relative bg-white shadow-sm border-b border-emerald-100 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-50/30 to-amber-50/30"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-200 rounded-full -translate-y-32 translate-x-32 opacity-20"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-200 rounded-full translate-y-24 -translate-x-24 opacity-30"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-8 md:space-y-0 md:space-x-8">

            {/* Business Logo with Natural Frame */}
            <div className="flex-shrink-0 relative">
              <div className="relative">
                <img 
                  src={business.profile || userImg}
                  alt={business.name || 'Business'}
                  onError={(e) => { e.target.src = userImg; }}
                  className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-8 border-white shadow-2xl ring-4 ring-emerald-100/50"
                />
                <div className="absolute -inset-4 bg-gradient-to-r from-emerald-400 to-amber-400 rounded-full -z-10 blur-sm opacity-30"></div>
              </div>
              <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-2 rounded-full shadow-lg">
                <Leaf className="w-5 h-5" />
              </div>
            </div>

            {/* Business Info */}
            <div className="flex-1 text-center md:text-left">
              <div className="inline-flex items-center space-x-2 bg-emerald-100 text-emerald-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
                <Store className="w-4 h-4" />
                <span>Natural Business</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-emerald-900 mb-4 leading-tight">
                {business.name || 'Untitled Business'}
              </h1>
              
              <p className="text-lg text-emerald-700 mb-8 max-w-3xl leading-relaxed font-serif">
                {business.desp || 'A trusted business offering sustainable, eco-friendly products for conscious living.'}
              </p>
              
              {/* Business Stats */}
              <div className="flex flex-wrap justify-center md:justify-start gap-4">
                <div className="flex items-center space-x-3 bg-white/80 backdrop-blur-sm px-5 py-3 rounded-xl shadow-sm border border-emerald-100">
                  <div className="p-2 bg-emerald-100 rounded-lg">
                    <Package className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-emerald-700">{products.length}</div>
                    <div className="text-sm text-emerald-600">Natural Products</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3 bg-white/80 backdrop-blur-sm px-5 py-3 rounded-xl shadow-sm border border-amber-100">
                  <div className="p-2 bg-amber-100 rounded-lg">
                    <Users className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-amber-700">100+</div>
                    <div className="text-sm text-amber-600">Eco-Conscious Customers</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3 bg-white/80 backdrop-blur-sm px-5 py-3 rounded-xl shadow-sm border border-green-100">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Star className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-700">4.8</div>
                    <div className="text-sm text-green-600">Sustainable Rating</div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-emerald-900 mb-2">
              Our Natural Collection
            </h2>
            <p className="text-emerald-600 font-serif">
              Discover {products.length} carefully curated sustainable products
            </p>
          </div>
          
          {products.length > 0 && (
            <div className="mt-4 sm:mt-0">
              <select className="border border-emerald-200 rounded-xl px-4 py-3 text-sm bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400 transition-all duration-200">
                <option>Sort by: New Arrivals</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Name: A to Z</option>
                <option>Most Sustainable</option>
              </select>
            </div>
          )}
        </div>
        
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product) => (
              <ProductCard 
                key={product.p_id}
                product={formatProductForCard(product)}
                onAddToCart={() => {
                  console.log('Add to cart:', product.p_id);
                }}
                onBuyNow={() => {
                  console.log('Buy now:', product.p_id);
                }}
                showAddToCart={true}
                showBuyNow={true}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-emerald-100">
            <div className="w-24 h-24 mx-auto mb-6 bg-emerald-100 rounded-full flex items-center justify-center">
              <Package className="w-12 h-12 text-emerald-400" />
            </div>
            <h3 className="text-2xl font-serif font-semibold text-emerald-800 mb-3">No Products Available Yet</h3>
            <p className="text-emerald-600 max-w-md mx-auto mb-6 font-serif">
              This sustainable business is carefully preparing their natural product collection. 
              Great things take time to grow!
            </p>
            <div className="animate-pulse text-sm text-emerald-500 flex items-center justify-center space-x-2">
              <Sprout className="w-4 h-4" />
              <span>New sustainable products growing soon...</span>
            </div>
          </div>
        )}
      </div>

      {/* Business Footer Info */}
      <div className="bg-white/80 backdrop-blur-sm border-t border-emerald-100 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-emerald-400 to-amber-400 rounded-full flex items-center justify-center">
              <Heart className="w-8 h-8 text-white" />
            </div>
            
            <h3 className="text-2xl font-serif font-bold text-emerald-900 mb-3">{business.name}</h3>
            <p className="text-emerald-700 mb-6 max-w-2xl mx-auto font-serif text-lg">
              {business.desp || 'Committed to sustainable practices and eco-friendly products for a better planet'}
            </p>
            
            <div className="flex flex-wrap justify-center gap-6 text-sm text-emerald-600">
              <span className="flex items-center space-x-2 bg-emerald-50 px-4 py-2 rounded-full">
                <Leaf className="w-4 h-4" />
                <span>🌱 100% Sustainable</span>
              </span>
              <span className="flex items-center space-x-2 bg-amber-50 px-4 py-2 rounded-full">
                <span>🚚 Eco-Friendly Delivery</span>
              </span>
              <span className="flex items-center space-x-2 bg-green-50 px-4 py-2 rounded-full">
                <span>💚 Planet Positive</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessPublicPage;