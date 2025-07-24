#!/usr/bin/env node

// Mock data generator for frontend testing
const generateMockDeals = (searchTerm, budget, region) => {
  const mockDeals = [
    {
      id: 'deal-1',
      item: searchTerm,
      platform: 'Amazon',
      region: 'US',
      price: Math.floor(budget * 0.8),
      originalPrice: Math.floor(budget * 1.1),
      affiliateLink: 'https://amazon.com/dp/B0C1234567',
      imageUrl: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=300&fit=crop',
      relevanceScore: 95,
      savings: Math.floor(budget * 0.3),
      category: 'Electronics'
    },
    {
      id: 'deal-2',
      item: searchTerm,
      platform: 'Best Buy',
      region: 'US',
      price: Math.floor(budget * 0.85),
      originalPrice: Math.floor(budget * 1.05),
      affiliateLink: 'https://bestbuy.com/site/product/123456',
      imageUrl: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=300&fit=crop',
      relevanceScore: 88,
      savings: Math.floor(budget * 0.2),
      category: 'Electronics'
    },
    {
      id: 'deal-3',
      item: searchTerm,
      platform: 'Rakuten',
      region: 'Japan',
      price: Math.floor(budget * 0.7),
      originalPrice: Math.floor(budget * 1.2),
      affiliateLink: 'https://rakuten.co.jp/item/123456',
      imageUrl: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=300&fit=crop',
      relevanceScore: 92,
      savings: Math.floor(budget * 0.5),
      category: 'Electronics'
    },
    {
      id: 'deal-4',
      item: searchTerm,
      platform: 'Coupang',
      region: 'Korea',
      price: Math.floor(budget * 0.75),
      originalPrice: Math.floor(budget * 1.15),
      affiliateLink: 'https://coupang.com/vp/products/123456',
      imageUrl: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=300&fit=crop',
      relevanceScore: 87,
      savings: Math.floor(budget * 0.4),
      category: 'Electronics'
    },
    {
      id: 'deal-5',
      item: searchTerm,
      platform: 'Otto',
      region: 'Germany',
      price: Math.floor(budget * 0.9),
      originalPrice: Math.floor(budget * 1.08),
      affiliateLink: 'https://otto.de/p/123456',
      imageUrl: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=300&fit=crop',
      relevanceScore: 82,
      savings: Math.floor(budget * 0.18),
      category: 'Electronics'
    }
  ];

  return mockDeals;
};

const createMockQuizData = (quizData) => {
  const { item, budget, region, category, email } = quizData;
  
  // Generate mock deals
  const mockDeals = generateMockDeals(item, budget, region);
  
  // Create quiz document
  const quizDoc = {
    item,
    budget: parseInt(budget),
    region,
    category,
    email: email || null,
    matchedDeals: mockDeals,
    createdAt: new Date(),
    userId: 'anonymous'
  };

  return quizDoc;
};

// Test function
const testMockData = () => {
  console.log('🎯 Testing Mock Data Generation...');
  
  const testQuizData = {
    item: 'AirPods Pro',
    budget: 300,
    region: 'US',
    category: 'Electronics',
    email: 'test@example.com'
  };

  try {
    const quizDoc = createMockQuizData(testQuizData);
    console.log(`✅ Mock data test successful!`);
    console.log(`📊 Generated ${quizDoc.matchedDeals.length} mock deals for "${quizDoc.item}"`);
    console.log(`💰 Budget: $${quizDoc.budget}`);
    console.log(`🌍 Region: ${quizDoc.region}`);
    console.log('\n📋 Sample deals:');
    quizDoc.matchedDeals.forEach((deal, index) => {
      console.log(`${index + 1}. ${deal.platform} (${deal.region}) - $${deal.price} (was $${deal.originalPrice}) - Save $${deal.savings}`);
    });
  } catch (error) {
    console.error('❌ Mock data test failed:', error);
  }
};

// Export for use in other scripts
module.exports = {
  createMockQuizData,
  generateMockDeals,
  testMockData
};

// Run test if called directly
if (require.main === module) {
  testMockData();
} 