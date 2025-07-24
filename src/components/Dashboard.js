import React, { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db, trackAffiliateClick } from '../firebase';
import { ExternalLink, Share2, Heart, Star, TrendingUp } from 'lucide-react';

const Dashboard = ({ quizId, onBackToQuiz }) => {
  const [quizData, setQuizData] = useState(null);
  const [matchedDeals, setMatchedDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mock data for testing when Firebase is not available
  const mockQuizData = {
    item: 'AirPods Pro',
    budget: 300,
    region: 'US',
    category: 'Electronics',
    email: 'test@example.com',
    userId: 'anonymous',
    matchedDeals: [
      {
        id: 'deal-1',
        item: 'AirPods Pro',
        platform: 'Amazon',
        region: 'US',
        price: 240,
        originalPrice: 330,
        affiliateLink: 'https://amazon.com/dp/B0C1234567',
        imageUrl: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=300&fit=crop',
        relevanceScore: 95,
        savings: 90,
        category: 'Electronics'
      },
      {
        id: 'deal-2',
        item: 'AirPods Pro',
        platform: 'Best Buy',
        region: 'US',
        price: 255,
        originalPrice: 315,
        affiliateLink: 'https://bestbuy.com/site/product/123456',
        imageUrl: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=300&fit=crop',
        relevanceScore: 88,
        savings: 60,
        category: 'Electronics'
      },
      {
        id: 'deal-3',
        item: 'AirPods Pro',
        platform: 'Rakuten',
        region: 'Japan',
        price: 210,
        originalPrice: 360,
        affiliateLink: 'https://rakuten.co.jp/item/123456',
        imageUrl: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=300&fit=crop',
        relevanceScore: 92,
        savings: 150,
        category: 'Electronics'
      }
    ]
  };

  useEffect(() => {
    if (!quizId) {
      // If no quizId, use mock data for testing
      setQuizData(mockQuizData);
      setMatchedDeals(mockQuizData.matchedDeals);
      setLoading(false);
      return;
    }

    // Listen to quiz document changes
    const unsubscribe = onSnapshot(
      doc(db, 'quizzes', quizId),
      (doc) => {
        if (doc.exists()) {
          const data = doc.data();
          setQuizData(data);
          setMatchedDeals(data.matchedDeals || []);
          setLoading(false);
        } else {
          setError('Quiz not found');
          setLoading(false);
        }
      },
      (error) => {
        console.error('Error fetching quiz:', error);
        // Fall back to mock data if Firebase fails
        console.log('Firebase connection failed, using mock data');
        setQuizData(mockQuizData);
        setMatchedDeals(mockQuizData.matchedDeals);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [quizId]);

  const handleAffiliateClick = async (deal) => {
    try {
      // Track the click
      await trackAffiliateClick({
        dealId: deal.id,
        userId: quizData?.userId || 'anonymous'
      });

      // Open affiliate link in new tab
      window.open(deal.affiliateLink, '_blank');
    } catch (error) {
      console.error('Error tracking affiliate click:', error);
      // Still open the link even if tracking fails
      window.open(deal.affiliateLink, '_blank');
    }
  };

  const handleShare = async (deal) => {
    const shareText = `🔥 Amazing deal on ${deal.item}! Save $${deal.originalPrice - deal.price} on ${deal.platform}. Check it out: ${deal.affiliateLink}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Deal Alert: ${deal.item}`,
          text: shareText,
          url: deal.affiliateLink
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(shareText);
        alert('Deal link copied to clipboard!');
      } catch (error) {
        console.error('Error copying to clipboard:', error);
      }
    }
  };

  const formatPrice = (price) => {
    // Handle invalid or missing price values
    if (!price || isNaN(price) || typeof price !== 'number') {
      return '$0.00';
    }
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const calculateSavings = (originalPrice, currentPrice) => {
    return originalPrice - currentPrice;
  };

  const getSavingsPercentage = (originalPrice, currentPrice) => {
    return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700">Finding the best deals for you...</h2>
          <p className="text-gray-500 mt-2">Our AI is analyzing prices across global markets</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-4">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={onBackToQuiz}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-gray-800">
            Your Personalized Deals
          </h1>
          <button
            onClick={onBackToQuiz}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            New Search
          </button>
        </div>
        
        {quizData && (
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-gray-700">
              <span className="font-semibold">Search:</span> {quizData.item} • 
              <span className="font-semibold"> Budget:</span> {quizData.budget ? formatPrice(quizData.budget) : 'Not specified'} • 
              <span className="font-semibold"> Region:</span> {quizData.region}
            </p>
          </div>
        )}
      </div>

      {/* Results summary */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">
            Found {matchedDeals.length} deals matching your criteria
          </h2>
          <div className="flex items-center text-sm text-gray-600">
            <TrendingUp className="w-4 h-4 mr-1" />
            AI-powered matching
          </div>
        </div>
      </div>

      {/* Deals grid */}
      {matchedDeals.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {matchedDeals.map((deal, index) => (
            <div
              key={deal.id || index}
              className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow"
            >
              {/* Deal image */}
              <div className="h-48 bg-gray-100 flex items-center justify-center">
                {deal.imageUrl ? (
                  <img
                    src={deal.imageUrl}
                    alt={deal.item}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-gray-400 text-4xl">📦</div>
                )}
              </div>

              {/* Deal content */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-800 line-clamp-2">
                    {deal.item}
                  </h3>
                  <div className="flex items-center text-yellow-500">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="text-sm ml-1">{deal.relevanceScore || 85}</span>
                  </div>
                </div>

                <div className="flex items-center text-sm text-gray-600 mb-3">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                    {deal.platform}
                  </span>
                  <span className="mx-2">•</span>
                  <span>{deal.region}</span>
                </div>

                {/* Pricing */}
                <div className="mb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-green-600">
                        {formatPrice(deal.price)}
                      </div>
                      {deal.originalPrice && deal.originalPrice > deal.price && (
                        <div className="text-sm text-gray-500 line-through">
                          {formatPrice(deal.originalPrice)}
                        </div>
                      )}
                    </div>
                    {deal.originalPrice && deal.originalPrice > deal.price && (
                      <div className="text-right">
                        <div className="text-sm font-semibold text-green-600">
                          Save {formatPrice(calculateSavings(deal.originalPrice, deal.price))}
                        </div>
                        <div className="text-xs text-green-600">
                          ({getSavingsPercentage(deal.originalPrice, deal.price)}% off)
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAffiliateClick(deal)}
                    className="flex-1 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View Deal
                  </button>
                  <button
                    onClick={() => handleShare(deal)}
                    className="px-3 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    title="Share this deal"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            No deals found
          </h3>
          <p className="text-gray-500 mb-6">
            Try adjusting your search criteria or budget
          </p>
          <button
            onClick={onBackToQuiz}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Try New Search
          </button>
        </div>
      )}

      {/* Footer */}
      <div className="mt-12 text-center">
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Want more deals?
          </h3>
          <p className="text-gray-600 mb-4">
            Get notified about new deals matching your preferences
          </p>
          <div className="flex justify-center gap-4">
            <button className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
              Subscribe ($5/month)
            </button>
            <button className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 