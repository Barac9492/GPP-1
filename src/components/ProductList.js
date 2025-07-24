import React, { useState, useEffect } from 'react';
import { getProducts, incrementProductViews } from '../services/productService';
import { Eye, ExternalLink, Calendar, User, TrendingUp, Tag } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../translations';
import { getCategoryDisplayName } from '../utils/productValidation';

function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { language } = useLanguage();
  const t = translations[language];

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      console.error('상품 목록 불러오기 실패:', err);
      setError(t.loadFailed);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handlePurchaseClick = async (productId) => {
    try {
      await incrementProductViews(productId);
      // Refresh the product list to update view counts
      fetchProducts();
    } catch (error) {
      console.error('조회수 증가 실패:', error);
    }
  };

  const formatPrice = (price) => {
    return t.formatPrice(price);
  };

  const formatDate = (date) => {
    return t.formatDate(date);
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'korean_cosmetics':
        return 'bg-pink-100 text-pink-800 border-pink-200';
      case 'us_it':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center space-x-2 text-gray-600">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span>{t.loadingProducts}</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
          <h3 className="text-lg font-semibold text-red-800 mb-2">{t.error}</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={fetchProducts}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            {t.retry}
          </button>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 max-w-md mx-auto">
          <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{t.noProducts}</h3>
          <p className="text-gray-600 mb-6">{t.noProductsDescription}</p>
          <button 
            onClick={() => window.location.hash = '#/products'}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            {t.registerFirstProduct}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{t.latestProducts}</h2>
        <p className="text-gray-600">{t.productListDescription}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            {/* Product Image */}
            <div className="aspect-square bg-gray-100 rounded-t-lg overflow-hidden relative">
              {product.imageUrl ? (
                <img 
                  src={product.imageUrl} 
                  alt={product.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/300x300?text=No+Image';
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <span className="text-sm">No Image</span>
                </div>
              )}
              
              {/* Category Badge */}
              {product.category && (
                <div className={`absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-medium border ${getCategoryColor(product.category)}`}>
                  <Tag className="w-3 h-3 inline mr-1" />
                  {getCategoryDisplayName(product.category)}
                </div>
              )}
            </div>
            
            {/* Product Info */}
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                {product.title}
              </h3>
              
              <div className="flex items-center justify-between mb-3">
                <span className="text-lg font-bold text-blue-600">
                  {formatPrice(product.price)}
                </span>
                <div className="flex items-center space-x-1 text-sm text-gray-500">
                  <Eye className="w-4 h-4" />
                  <span>{product.views || 0}{t.views}</span>
                </div>
              </div>
              
              {product.description && (
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {product.description}
                </p>
              )}
              
              {/* Product Meta */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center space-x-2 text-xs text-gray-500">
                  <User className="w-3 h-3" />
                  <span>{t.recommender}: {product.introducedBy || t.anonymous}</span>
                </div>
                <div className="flex items-center space-x-2 text-xs text-gray-500">
                  <Calendar className="w-3 h-3" />
                  <span>{formatDate(product.createdAt)}</span>
                </div>
              </div>
              
              {/* Purchase Button */}
              <a
                href={product.link}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handlePurchaseClick(product.id)}
                className="flex items-center justify-center space-x-2 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                <ExternalLink className="w-4 h-4" />
                <span>{t.buyNow}</span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductList; 