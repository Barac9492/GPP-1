const functions = require('firebase-functions');
const admin = require('firebase-admin');
// eslint-disable-next-line no-unused-vars
// const axios = require('axios');
// eslint-disable-next-line no-unused-vars
// const cron = require('node-cron');

// Initialize Firebase Admin
admin.initializeApp();

const db = admin.firestore();

/**
 * Extract product data from URL
 * Anti-Spaghetti: Modular function with clear error handling
 */
exports.extractProduct = functions.https.onCall(async (data, context) => {
  try {
    // Verify user authentication
    if (!context.auth) {
      throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
    }
    
    const { link } = data;
    
    if (!link) {
      throw new functions.https.HttpsError('invalid-argument', 'Link is required');
    }
    
    console.log(`Extracting product data from: ${link}`);
    
    // Extract product data based on domain
    const productData = await extractProductFromURL(link);
    
    return productData;
  } catch (error) {
    console.error('Error extracting product data:', error);
    throw new functions.https.HttpsError('internal', 'Error extracting product data');
  }
});

/**
 * Extract product data from different e-commerce sites
 * Anti-Spaghetti: Separate extraction logic by domain
 */
async function extractProductFromURL(url) {
  const urlObj = new URL(url);
  const domain = urlObj.hostname.toLowerCase();
  
  try {
    // For now, return mock data based on domain
    // In production, implement actual web scraping
    if (domain.includes('amazon')) {
      return extractAmazonProduct(url);
    } else if (domain.includes('coupang')) {
      return extractCoupangProduct(url);
    } else if (domain.includes('gmarket') || domain.includes('auction')) {
      return extractGmarketProduct(url);
    } else {
      return extractGenericProduct(url);
    }
  } catch (error) {
    console.error('Error extracting product data:', error);
    throw new Error('상품 정보를 추출할 수 없습니다');
  }
}

/**
 * Extract Amazon product data
 * Anti-Spaghetti: Separate function for Amazon
 */
function extractAmazonProduct(_url) {
  // Mock Amazon extraction
  // In production, use actual web scraping
  return {
    title: 'Amazon 상품',
    price: '₩150,000',
    imageUrl: 'https://via.placeholder.com/300x300?text=Amazon+Product',
    description: 'Amazon에서 판매하는 상품입니다.',
    source: 'Amazon'
  };
}

/**
 * Extract Coupang product data
 * Anti-Spaghetti: Separate function for Coupang
 */
function extractCoupangProduct(_url) {
  // Mock Coupang extraction
  return {
    title: '쿠팡 상품',
    price: '₩120,000',
    imageUrl: 'https://via.placeholder.com/300x300?text=Coupang+Product',
    description: '쿠팡에서 판매하는 상품입니다.',
    source: 'Coupang'
  };
}

/**
 * Extract Gmarket/Auction product data
 * Anti-Spaghetti: Separate function for Gmarket
 */
function extractGmarketProduct(_url) {
  // Mock Gmarket extraction
  return {
    title: 'G마켓 상품',
    price: '₩100,000',
    imageUrl: 'https://via.placeholder.com/300x300?text=Gmarket+Product',
    description: 'G마켓에서 판매하는 상품입니다.',
    source: 'Gmarket'
  };
}

/**
 * Extract generic product data
 * Anti-Spaghetti: Fallback function for unknown sites
 */
function extractGenericProduct(_url) {
  // Mock generic extraction
  return {
    title: '온라인 상품',
    price: '₩80,000',
    imageUrl: 'https://via.placeholder.com/300x300?text=Online+Product',
    description: '온라인에서 판매하는 상품입니다.',
    source: 'Online Store'
  };
}

/**
 * Process quiz submission and match deals using AI logic
 * Anti-Spaghetti: Modular function with clear error handling
 */
exports.processQuiz = functions.firestore
  .document('quizzes/{quizId}')
  // eslint-disable-next-line no-unused-vars
  .onCreate(async (snap, context) => {
    try {
      const quizData = snap.data();
      const { item, budget, region, category } = quizData;
      
      console.log(`Processing quiz for item: ${item}, budget: ${budget}, region: ${region}`);
      
      // Get all deals from Firestore
      const dealsSnapshot = await db.collection('deals').get();
      const allDeals = dealsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      // AI-driven deal matching logic
      const matchedDeals = matchDealsAI(allDeals, {
        item,
        budget: parseFloat(budget),
        region,
        category
      });
      
      // Update quiz with matched deals
      await snap.ref.update({
        matchedDeals,
        processedAt: admin.firestore.FieldValue.serverTimestamp(),
        status: 'completed'
      });
      
      // Track affiliate click for analytics
      await trackQuizAnalytics(quizData, matchedDeals.length);
      
      console.log(`Matched ${matchedDeals.length} deals for quiz ${context.params.quizId}`);
      return null;
      
    } catch (error) {
      console.error('Error processing quiz:', error);
      
      // Update quiz with error status
      await snap.ref.update({
        status: 'error',
        error: error.message,
        processedAt: admin.firestore.FieldValue.serverTimestamp()
      });
      
      return null;
    }
  });

/**
 * AI-driven deal matching algorithm
 * Anti-Spaghetti: Separate function for complex logic
 */
function matchDealsAI(deals, criteria) {
  const { item, budget, region, category } = criteria;
  
  return deals
    .filter(deal => {
      // Basic filtering
      const matchesItem = deal.item.toLowerCase().includes(item.toLowerCase()) ||
                         item.toLowerCase().includes(deal.item.toLowerCase());
      const withinBudget = deal.price <= budget;
      const matchesRegion = !region || deal.region === region || deal.region === 'global';
      const matchesCategory = !category || deal.category === category;
      
      return matchesItem && withinBudget && matchesRegion && matchesCategory;
    })
    .map(deal => ({
      ...deal,
      relevanceScore: calculateRelevanceScore(deal, criteria)
    }))
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, 10); // Return top 10 matches
}

/**
 * Calculate relevance score for deal matching
 * Anti-Spaghetti: Separate scoring function
 */
function calculateRelevanceScore(deal, criteria) {
  let score = 0;
  
  // Price optimization (closer to budget = higher score)
  const priceRatio = deal.price / criteria.budget;
  score += (1 - priceRatio) * 50;
  
  // Platform preference
  const preferredPlatforms = ['amazon', 'expedia', 'booking.com'];
  if (preferredPlatforms.some(platform => 
    deal.platform.toLowerCase().includes(platform))) {
    score += 20;
  }
  
  // Regional preference
  if (deal.region === criteria.region) {
    score += 30;
  }
  
  // Fresh deals (recently added)
  if (deal.addedAt) {
    const daysSinceAdded = (Date.now() - deal.addedAt.toMillis()) / (1000 * 60 * 60 * 24);
    if (daysSinceAdded < 7) score += 10;
  }
  
  return Math.max(0, score);
}

/**
 * Track quiz analytics for business intelligence
 * Anti-Spaghetti: Separate analytics function
 */
async function trackQuizAnalytics(quizData, matchCount) {
  try {
    await db.collection('analytics').add({
      type: 'quiz_submission',
      userId: quizData.userId,
      item: quizData.item,
      category: quizData.category,
      budget: quizData.budget,
      region: quizData.region,
      matchCount,
      timestamp: admin.firestore.FieldValue.serverTimestamp()
    });
  } catch (error) {
    console.error('Error tracking analytics:', error);
  }
}

/**
 * Scheduled function to scrape new deals
 * Runs daily at 2 AM
 * Anti-Spaghetti: Separate scraping function
 */
exports.scrapeDeals = functions.pubsub
  .schedule('0 2 * * *')
  .timeZone('Asia/Seoul')
  // eslint-disable-next-line no-unused-vars
  .onRun(async (context) => {
    try {
      console.log('Starting daily deal scraping...');
      
      // Mock deal scraping (replace with actual API calls)
      const newDeals = await scrapeDealsFromAPIs();
      
      // Add new deals to Firestore
      const batch = db.batch();
      newDeals.forEach(deal => {
        const dealRef = db.collection('deals').doc();
        batch.set(dealRef, {
          ...deal,
          addedAt: admin.firestore.FieldValue.serverTimestamp()
        });
      });
      
      await batch.commit();
      console.log(`Added ${newDeals.length} new deals`);
      
      return null;
    } catch (error) {
      console.error('Error scraping deals:', error);
      return null;
    }
  });

/**
 * Mock deal scraping function
 * Anti-Spaghetti: Separate API integration
 */
async function scrapeDealsFromAPIs() {
  // Mock data for MVP - replace with actual API calls
  const mockDeals = [
    {
      item: 'AirPods Pro',
      platform: 'Amazon Japan',
      price: 180,
      originalPrice: 250,
      affiliateLink: 'https://amazon.co.jp/affiliate/airpods-pro',
      region: 'Japan',
      category: 'Electronics',
      imageUrl: 'https://example.com/airpods-pro.jpg'
    },
    {
      item: 'Samsung Galaxy S24',
      platform: 'Amazon US',
      price: 799,
      originalPrice: 999,
      affiliateLink: 'https://amazon.com/affiliate/galaxy-s24',
      region: 'US',
      category: 'Electronics',
      imageUrl: 'https://example.com/galaxy-s24.jpg'
    },
    {
      item: 'Tokyo Flight',
      platform: 'Expedia',
      price: 450,
      originalPrice: 650,
      affiliateLink: 'https://expedia.com/affiliate/tokyo-flight',
      region: 'Japan',
      category: 'Travel',
      imageUrl: 'https://example.com/tokyo-flight.jpg'
    },
    {
      item: 'MacBook Air M3',
      platform: 'Amazon Korea',
      price: 1200,
      originalPrice: 1500,
      affiliateLink: 'https://amazon.co.kr/affiliate/macbook-air',
      region: 'Korea',
      category: 'Electronics',
      imageUrl: 'https://example.com/macbook-air.jpg'
    }
  ];
  
  return mockDeals;
}

/**
 * Track affiliate clicks for revenue analytics
 * Anti-Spaghetti: Separate tracking function
 */
exports.trackAffiliateClick = functions.https.onCall(async (data, context) => {
  try {
    // Verify user authentication
    if (!context.auth) {
      throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
    }
    
    const { dealId, userId } = data;
    
    // Record affiliate click
    await db.collection('affiliateClicks').add({
      dealId,
      userId,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      ip: context.rawRequest.ip
    });
    
    // Update deal click count
    await db.collection('deals').doc(dealId).update({
      clickCount: admin.firestore.FieldValue.increment(1)
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error tracking affiliate click:', error);
    throw new functions.https.HttpsError('internal', 'Error tracking click');
  }
});

/**
 * Send notification when new deals match user preferences
 * Anti-Spaghetti: Separate notification function
 */
exports.sendDealNotification = functions.firestore
  .document('deals/{dealId}')
  // eslint-disable-next-line no-unused-vars
  .onCreate(async (snap, context) => {
    try {
      const newDeal = snap.data();
      
      // Find users who might be interested in this deal
      const interestedUsers = await findInterestedUsers(newDeal);
      
      // Send notifications (mock implementation)
      for (const userId of interestedUsers) {
        await sendNotification(userId, newDeal);
      }
      
      return null;
    } catch (error) {
      console.error('Error sending deal notification:', error);
      return null;
    }
  });

/**
 * Find users interested in a specific deal
 * Anti-Spaghetti: Separate user matching function
 */
async function findInterestedUsers(deal) {
  const usersSnapshot = await db.collection('users')
    .where('preferences.category', '==', deal.category)
    .get();
  
  return usersSnapshot.docs.map(doc => doc.id);
}

/**
 * Send notification to user
 * Anti-Spaghetti: Separate notification function
 */
async function sendNotification(userId, deal) {
  // Mock notification sending
  console.log(`Sending notification to user ${userId} about ${deal.item}`);
  
  // In production, integrate with FCM or email service
  await db.collection('notifications').add({
    userId,
    title: `New Deal: ${deal.item}`,
    body: `Save $${deal.originalPrice - deal.price} on ${deal.item}!`,
    dealId: deal.id,
    timestamp: admin.firestore.FieldValue.serverTimestamp(),
    read: false
  });
} 