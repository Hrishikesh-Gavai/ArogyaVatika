import { useState } from 'react';
import { Package, Heart, Leaf, Sprout } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  const handleProductClick = () => {
    if (product._id) {
      navigate(`/product/${product._id}`);
    }
  };

  const nextImage = (e) => {
    e.stopPropagation();
    if (product.img && product.img.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % product.img.length);
    }
  };

  const prevImage = (e) => {
    e.stopPropagation();
    if (product.img && product.img.length > 1) {
      setCurrentImageIndex((prev) => (prev - 1 + product.img.length) % product.img.length);
    }
  };

  const toggleFavorite = (e) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  const isOutOfStock = product.quantity === 0;
  const isLowStock = product.quantity > 0 && product.quantity <= 5;
  const hasImages = product.img && product.img.length > 0;
  const currentImage = hasImages ? product.img[currentImageIndex] : null;

  return (
    <div 
      className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden border-2 border-emerald-100/50 hover:border-emerald-200 w-72 h-96 flex flex-col cursor-pointer backdrop-blur-sm"
      onClick={handleProductClick}
    >
      {/* Image Section - Fixed Height with Nature Background */}
      <div className="relative h-56 bg-gradient-to-br from-emerald-50/80 to-teal-50/80">
        {currentImage ? (
          <>
            <img
              src={currentImage}
              alt={product.p_name}
              className={`w-full h-full object-cover transition-opacity duration-300 ${
                isImageLoading ? 'opacity-0' : 'opacity-100'
              } group-hover:scale-110 transition-transform duration-700 ease-out`}
              onLoad={() => setIsImageLoading(false)}
              onError={() => setIsImageLoading(false)}
            />
            
            {/* Organic Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            {/* Image Navigation */}
            {product.img.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg border border-emerald-100"
                >
                  <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg border border-emerald-100"
                >
                  <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                
                {/* Natural Image Dots */}
                <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {product.img.map((_, index) => (
                    <button
                      key={index}
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentImageIndex(index);
                      }}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        index === currentImageIndex 
                          ? 'bg-emerald-500 scale-125 shadow-lg' 
                          : 'bg-white/60 hover:bg-white/90'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="relative">
              <Package className="w-16 h-16 text-emerald-300" />
              <Leaf className="w-6 h-6 text-emerald-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
            </div>
          </div>
        )}

        {/* Eco-friendly Favorite Button */}
        <button
          onClick={toggleFavorite}
          className="absolute top-3 right-3 bg-white/90 hover:bg-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg border border-emerald-100"
        >
          <Heart 
            className={`w-4 h-4 transition-all duration-300 ${
              isFavorite ? 'fill-rose-500 text-rose-500 scale-110' : 'text-emerald-600 hover:text-rose-400'
            }`} 
          />
        </button>

        {/* Natural Stock Status Badge */}
        {isOutOfStock && (
          <div className="absolute top-3 left-3 bg-rose-500 text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg border border-rose-200">
            <Sprout className="w-3 h-3 inline mr-1" />
            Out of Stock
          </div>
        )}
        {isLowStock && !isOutOfStock && (
          <div className="absolute top-3 left-3 bg-amber-500 text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg border border-amber-200">
            <Leaf className="w-3 h-3 inline mr-1" />
            Low Stock
          </div>
        )}

        {/* Eco-friendly Indicator */}
        {!isOutOfStock && (
          <div className="absolute top-3 left-3 bg-emerald-500 text-white px-2 py-1 rounded-full text-xs font-semibold shadow-lg border border-emerald-200">
            <Leaf className="w-3 h-3 inline mr-1" />
            Natural
          </div>
        )}
      </div>
      
      {/* Content Section - Natural Themed */}
      <div className="p-5 flex-1 flex flex-col justify-between bg-gradient-to-b from-white to-emerald-50/30">
        {/* Product Name with Nature-inspired Typography */}
        <div>
          <h3 className="text-lg font-serif font-semibold text-emerald-900 mb-2 line-clamp-2 leading-tight group-hover:text-emerald-700 transition-colors duration-300">
            {product.p_name}
          </h3>

          {/* Categories as Natural Tags */}
          {product.category && product.category.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {product.category.slice(0, 2).map((cat, index) => (
                <span 
                  key={index}
                  className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full text-xs font-medium border border-emerald-200/50"
                >
                  {cat}
                </span>
              ))}
              {product.category.length > 2 && (
                <span className="text-emerald-400 text-xs self-center">
                  +{product.category.length - 2}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Quantity Display with Natural Styling */}
        <div className="mt-auto">
          <div className="flex items-center justify-between">
            <p className={`text-sm font-medium ${
              isOutOfStock ? 'text-rose-600' : 
              isLowStock ? 'text-amber-600' : 'text-emerald-700'
            }`}>
              {isOutOfStock ? 'Restocking soon' : `${product.quantity} available`}
            </p>
            
            {/* Price Display */}
            {product.amt && (
              <span className="text-lg font-serif font-bold text-emerald-600">
                ₹{product.amt.toFixed(2)}
              </span>
            )}
          </div>
          
          {/* Natural Stock Indicator Bar */}
          {!isOutOfStock && (
            <div className="w-full bg-emerald-100 rounded-full h-1.5 mt-2 overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${
                  isLowStock ? 'bg-amber-400' : 'bg-emerald-400'
                }`}
                style={{ 
                  width: `${Math.min((product.quantity / 10) * 100, 100)}%` 
                }}
              ></div>
            </div>
          )}
        </div>
      </div>

      {/* Hover Effect Border */}
      <div className="absolute inset-0 border-2 border-transparent group-hover:border-emerald-300/30 rounded-2xl pointer-events-none transition-all duration-300"></div>
    </div>
  );
};

export default ProductCard;