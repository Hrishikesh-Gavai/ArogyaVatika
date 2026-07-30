import { useState, useEffect, useCallback } from 'react';
import ProductCard from './common/ProductCard';
import useAuth from '../hooks/useAuth';
import { api } from '../services/api';
import { Leaf, Sprout, Trees, Search, Info } from 'lucide-react';
import Trie from '../utils/Trie';
import Heap from '../utils/Heap';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [displayProducts, setDisplayProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('');
  const [trieStats, setTrieStats] = useState(null);
  const { token } = useAuth();

  const [trie, setTrie] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  // Build Trie when products are fetched
  useEffect(() => {
    if (products.length > 0) {
      const searchTrie = new Trie();
      console.time('Trie Build Time');
      searchTrie.build(products);
      console.timeEnd('Trie Build Time');
      
      // Get Trie statistics
      const stats = searchTrie.getStats();
      setTrieStats(stats);
      
      console.log('Trie Statistics:', stats);
      searchTrie.print(); // Print trie structure to console
      
      setTrie(searchTrie);
      setDisplayProducts(products);
      
      console.log('Actual products count:', products.length);
      console.log('Products:', products.map(p => p.p_name));
    }
  }, [products]);

  // Apply search and sort when filters change
  useEffect(() => {
    if (!trie) return;

    let results = [];

    // Apply search using Trie
    if (searchTerm.trim()) {
      console.time('Trie Search Time');
      results = trie.searchByName(searchTerm);
      console.timeEnd('Trie Search Time');
      console.log(`Found ${results.length} products for search: "${searchTerm}"`);
    } else {
      results = trie.getAllProducts();
    }

    // Apply sorting using Heap
    if (sortOption === 'price-low-high') {
      results = Heap.sortByPrice(results, 'asc');
    } else if (sortOption === 'price-high-low') {
      results = Heap.sortByPrice(results, 'desc');
    }

    setDisplayProducts(results);
  }, [searchTerm, sortOption, trie]);

  const fetchProducts = async () => {
    try {
      const response = await api.getAllProducts();
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = useCallback(
    debounce((term) => {
      setSearchTerm(term);
    }, 300),
    []
  );

  const handleAddToCart = async (productId) => {
    if (!token) {
      alert('Please login to add products to cart');
      return;
    }
        
    try {
      const response = await api.addToCart(productId, token);
      if (response.ok) {
        alert('Product added to cart!');
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message || 'Failed to add to cart'}`);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Error adding to cart. Please try again.');
    }
  };

  const handleBuyNow = async (productId, businessId, quantity = 1) => {
    if (!token) {
      alert('Please login to place an order');
      return;
    }

    window.dispatchEvent(new CustomEvent('app:navigate', { 
      detail: { 
        path: `/product/${productId}`,
        state: { buyNowIntent: true, quantity }
      } 
    }));
  };

  // Debounce utility
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-emerald-400 border-t-transparent mx-auto mb-4"></div>
            <Leaf className="w-6 h-6 text-emerald-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          <p className="text-emerald-700 font-medium mt-4">Discovering natural treasures...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-amber-50 to-teal-50">
      {/* Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMTUgMTVoMzB2MzBIMTV6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-10"></div>
        <div className="container mx-auto px-4 py-12 text-center relative z-10">
          <div className="flex justify-center mb-4">
            <div className="bg-white/20 p-3 rounded-full backdrop-blur-sm">
              <Trees className="w-8 h-8" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">
            ArogyaVatika Marketplace
          </h1>
          <p className="text-emerald-100 text-lg max-w-2xl mx-auto leading-relaxed">
            Discover handcrafted, sustainable products from eco-conscious creators and nursery owners
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-emerald-50 to-transparent"></div>
      </div>

      {/* Search and Sort Section */}
      <div className="container mx-auto px-4 py-8 -mt-8 relative z-20">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-emerald-100 mb-8">
          {/* Trie Stats Display */}
          {trieStats && (
            <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 text-blue-700 mb-2">
                <Info className="w-4 h-4" />
                <span className="font-semibold">Trie Data Structure (Prefix Search):</span>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-medium">Total Products:</span> {trieStats.totalProducts}
                </div>
                <div>
                  <span className="font-medium">Trie Nodes:</span> {trieStats.totalNodes}
                </div>
                <div>
                  <span className="font-medium">Tree Height:</span> {trieStats.treeHeight}
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search Bar */}
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-500 w-5 h-5" />
              <input
                type="text"
                placeholder="Search products by name (Trie prefix search)..."
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white/50 backdrop-blur-sm text-emerald-900 placeholder-emerald-400"
              />
            </div>

            {/* Sort Dropdown */}
            <div className="flex gap-4 items-center">
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="px-4 py-3 border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white/50 backdrop-blur-sm text-emerald-900 min-w-[200px]"
              >
                <option value="">Default Order</option>
                <option value="price-low-high">Price: High to Low (Heap Sort)</option>
                <option value="price-high-low">Price: Low to High (Heap Sort)</option>
              </select>

              <div className="text-emerald-700 font-medium whitespace-nowrap">
                {displayProducts.length} products
              </div>
            </div>
          </div>
        </div>

        {/* Products Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-sm border border-emerald-100 mb-4">
            <Sprout className="w-5 h-5 text-emerald-600" />
            <span className="text-emerald-700 font-semibold">
              {displayProducts.length} Natural Products Available
            </span>
          </div>
          <h2 className="text-3xl font-serif font-bold text-emerald-900 mb-3">
            Curated Eco-Friendly Collection
          </h2>
          <p className="text-emerald-700 max-w-2xl mx-auto">
            Each product tells a story of sustainability and care for our planet
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {displayProducts.map((product) => (
            <div 
              key={product._id} 
              className="transform hover:scale-105 transition-transform duration-300"
            >
              <ProductCard
                product={product}
                onAddToCart={handleAddToCart}
                onBuyNow={handleBuyNow}
              />
            </div>
          ))}
        </div>

        {/* Empty State */}
        {displayProducts.length === 0 && !loading && (
          <div className="text-center py-16 bg-white/50 rounded-2xl backdrop-blur-sm border border-emerald-100">
            <div className="bg-gradient-to-br from-emerald-100 to-teal-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <Leaf className="w-10 h-10 text-emerald-600" />
            </div>
            <h3 className="text-2xl font-serif font-bold text-emerald-800 mb-3">
              No Products Found
            </h3>
            <p className="text-emerald-600 max-w-md mx-auto">
              {searchTerm 
                ? `No products found matching "${searchTerm}". Try a different search term.`
                : "We're currently refreshing our natural collection. Please check back soon for new eco-friendly arrivals."
              }
            </p>
          </div>
        )}

        {/* Nature-inspired Decorative Elements */}
        <div className="absolute -z-10 top-20 -left-20 w-40 h-40 bg-emerald-200 rounded-full opacity-20 blur-xl"></div>
        <div className="absolute -z-10 bottom-10 -right-20 w-60 h-60 bg-amber-200 rounded-full opacity-20 blur-xl"></div>
      </div>

      {/* Eco-friendly Commitment Banner */}
      <div className="bg-white border-t border-emerald-100">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-wrap justify-center gap-8 text-center text-emerald-700">
            <div className="flex items-center gap-2">
              <div className="bg-emerald-100 p-2 rounded-full">
                <Leaf className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium">100% Natural Materials</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-emerald-100 p-2 rounded-full">
                <Trees className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium">Sustainable Sourcing</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-emerald-100 p-2 rounded-full">
                <Sprout className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium">Eco-Conscious Packaging</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
