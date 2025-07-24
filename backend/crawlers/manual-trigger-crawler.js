const BaseCrawler = require('./base-crawler');
const winston = require('winston');
const Redis = require('redis');

class ManualTriggerCrawler extends BaseCrawler {
  constructor(options = {}) {
    super({
      ...options,
      delay: 1000, // Faster for manual triggers
      maxRetries: 2
    });
    
    this.redis = Redis.createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379'
    });
    
    this.logger = winston.createLogger({
      level: process.env.LOG_LEVEL || 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
      transports: [
        new winston.transports.File({ filename: 'logs/manual-crawler.log' }),
        new winston.transports.Console()
      ]
    });
  }

  // User-initiated crawling triggers
  async handleUserTrigger(triggerType, data, user) {
    this.logger.info(`User trigger: ${triggerType}`, { user: user.id, data });
    
    switch (triggerType) {
      case 'search':
        return await this.handleUserSearch(data.query, user);
      case 'alert':
        return await this.handlePriceAlert(data.product, user);
      case 'comparison':
        return await this.handleProductComparison(data.products, user);
      case 'recommendation':
        return await this.handleRecommendationRequest(data.context, user);
      default:
        throw new Error(`Unknown trigger type: ${triggerType}`);
    }
  }

  // Handle user search with intelligent crawling
  async handleUserSearch(query, user) {
    this.logger.info(`Processing user search: ${query}`, { user: user.id });
    
    // 1. Crawl relevant products
    const products = await this.crawlRelevantProducts(query);
    
    // 2. Update user profile with search behavior
    await this.updateUserProfile(user, {
      searchQuery: query,
      timestamp: new Date(),
      productInterests: products.map(p => p.category)
    });
    
    // 3. Personalize results based on user history
    const personalizedResults = await this.personalizeResults(products, user);
    
    // 4. Store in knowledge graph
    await this.storeInKnowledgeGraph({
      type: 'user_search',
      user: user.id,
      query,
      results: personalizedResults,
      timestamp: new Date()
    });
    
    return personalizedResults;
  }

  // Handle price alert setup with monitoring
  async handlePriceAlert(product, user) {
    this.logger.info(`Setting price alert for ${product.name}`, { user: user.id });
    
    // 1. Set up price monitoring
    const alert = await this.setPriceAlert(product, user);
    
    // 2. Start monitoring the product
    await this.startMonitoring(product, user);
    
    // 3. Crawl related products for better deals
    const relatedProducts = await this.crawlRelatedProducts(product);
    
    // 4. Update user profile
    await this.updateUserProfile(user, {
      priceAlerts: [...(user.priceAlerts || []), alert],
      interests: [...(user.interests || []), product.category]
    });
    
    return {
      alert,
      relatedProducts,
      monitoringActive: true
    };
  }

  // Handle product comparison with market analysis
  async handleProductComparison(products, user) {
    this.logger.info(`Comparing ${products.length} products`, { user: user.id });
    
    // 1. Crawl detailed information for each product
    const detailedProducts = await Promise.all(
      products.map(p => this.crawlProductDetails(p))
    );
    
    // 2. Analyze market variations
    const marketAnalysis = await this.analyzeMarketVariations(detailedProducts);
    
    // 3. Generate comparison insights
    const comparisonInsights = await this.generateComparisonInsights(detailedProducts, user);
    
    // 4. Store comparison data
    await this.storeInKnowledgeGraph({
      type: 'product_comparison',
      user: user.id,
      products: detailedProducts,
      insights: comparisonInsights,
      timestamp: new Date()
    });
    
    return {
      products: detailedProducts,
      marketAnalysis,
      insights: comparisonInsights
    };
  }

  // Handle recommendation requests with AI
  async handleRecommendationRequest(context, user) {
    this.logger.info(`Generating recommendations`, { user: user.id, context });
    
    // 1. Analyze user behavior patterns
    const userPatterns = await this.analyzeUserPatterns(user);
    
    // 2. Crawl relevant market data
    const marketData = await this.crawlMarketData(context);
    
    // 3. Generate personalized recommendations
    const recommendations = await this.generateRecommendations(userPatterns, marketData, context);
    
    // 4. Store recommendation data
    await this.storeInKnowledgeGraph({
      type: 'recommendation_request',
      user: user.id,
      context,
      recommendations,
      timestamp: new Date()
    });
    
    return recommendations;
  }

  // Admin-initiated crawling triggers
  async handleAdminTrigger(triggerType, data = {}) {
    this.logger.info(`Admin trigger: ${triggerType}`, { data });
    
    switch (triggerType) {
      case 'marketScan':
        return await this.handleMarketScan(data.markets);
      case 'trendAnalysis':
        return await this.handleTrendAnalysis(data.timeframe);
      case 'userInsights':
        return await this.handleUserInsightsAnalysis(data.userSegment);
      default:
        throw new Error(`Unknown admin trigger type: ${triggerType}`);
    }
  }

  // Handle market scanning for trends
  async handleMarketScan(markets = ['US', 'UK', 'DE', 'JP', 'KR']) {
    this.logger.info(`Scanning markets: ${markets.join(', ')}`);
    
    const results = {};
    
    for (const market of markets) {
      try {
        // 1. Crawl popular products in market
        const popularProducts = await this.crawlPopularProducts(market);
        
        // 2. Analyze price trends
        const priceTrends = await this.analyzePriceTrends(popularProducts, market);
        
        // 3. Detect market anomalies
        const anomalies = await this.detectMarketAnomalies(market);
        
        results[market] = {
          products: popularProducts,
          trends: priceTrends,
          anomalies
        };
        
        // 4. Store market data
        await this.storeInKnowledgeGraph({
          type: 'market_scan',
          market,
          data: results[market],
          timestamp: new Date()
        });
        
      } catch (error) {
        this.logger.error(`Error scanning market ${market}:`, error);
        results[market] = { error: error.message };
      }
    }
    
    return results;
  }

  // Handle trend analysis with predictive insights
  async handleTrendAnalysis(timeframe = '7d') {
    this.logger.info(`Analyzing trends for timeframe: ${timeframe}`);
    
    // 1. Get historical data
    const historicalData = await this.getHistoricalData(timeframe);
    
    // 2. Identify emerging trends
    const trends = await this.identifyTrends(historicalData);
    
    // 3. Generate predictions
    const predictions = await this.generatePredictions(trends);
    
    // 4. Store trend analysis
    await this.storeInKnowledgeGraph({
      type: 'trend_analysis',
      timeframe,
      trends,
      predictions,
      timestamp: new Date()
    });
    
    return {
      trends,
      predictions,
      timeframe
    };
  }

  // Handle user insights analysis
  async handleUserInsightsAnalysis(userSegment = 'all') {
    this.logger.info(`Analyzing user insights for segment: ${userSegment}`);
    
    // 1. Get user behavior data
    const userData = await this.getUserBehaviorData(userSegment);
    
    // 2. Analyze patterns
    const patterns = await this.analyzeUserPatterns(userData);
    
    // 3. Generate insights
    const insights = await this.generateUserInsights(patterns);
    
    // 4. Store insights
    await this.storeInKnowledgeGraph({
      type: 'user_insights',
      segment: userSegment,
      patterns,
      insights,
      timestamp: new Date()
    });
    
    return {
      patterns,
      insights,
      segment: userSegment
    };
  }

  // Helper methods for intelligent crawling
  async crawlRelevantProducts(query) {
    // Implement intelligent product crawling based on query
    const products = [];
    
    // Crawl multiple sources for comprehensive results
    const sources = ['amazon', 'ebay', 'bestbuy'];
    
    for (const source of sources) {
      try {
        const sourceProducts = await this.crawlSource(source, query);
        products.push(...sourceProducts);
      } catch (error) {
        this.logger.error(`Error crawling ${source}:`, error);
      }
    }
    
    return this.deduplicateAndRank(products);
  }

  async crawlProductDetails(product) {
    // Crawl detailed information for a specific product
    const details = await this.crawlSource('detailed', product.url);
    
    return {
      ...product,
      ...details,
      lastUpdated: new Date()
    };
  }

  async crawlRelatedProducts(product) {
    // Crawl products related to the given product
    const relatedQueries = this.generateRelatedQueries(product);
    const relatedProducts = [];
    
    for (const query of relatedQueries) {
      const products = await this.crawlRelevantProducts(query);
      relatedProducts.push(...products);
    }
    
    return this.deduplicateAndRank(relatedProducts);
  }

  async crawlMarketData(context) {
    // Crawl market-specific data based on context
    const markets = context.markets || ['US', 'UK', 'DE'];
    const marketData = {};
    
    for (const market of markets) {
      try {
        const data = await this.crawlMarket(market, context);
        marketData[market] = data;
      } catch (error) {
        this.logger.error(`Error crawling market ${market}:`, error);
      }
    }
    
    return marketData;
  }

  // Knowledge graph management
  async storeInKnowledgeGraph(data) {
    // Store data in the knowledge graph for future analysis
    const key = `knowledge:${data.type}:${Date.now()}`;
    
    try {
      await this.redis.set(key, JSON.stringify(data));
      this.logger.info(`Stored in knowledge graph: ${data.type}`);
    } catch (error) {
      this.logger.error('Error storing in knowledge graph:', error);
    }
  }

  // User profile management
  async updateUserProfile(user, data) {
    // Update user profile with new behavior data
    const profileKey = `user:${user.id}:profile`;
    
    try {
      const existingProfile = await this.redis.get(profileKey);
      const profile = existingProfile ? JSON.parse(existingProfile) : {};
      
      const updatedProfile = {
        ...profile,
        ...data,
        lastUpdated: new Date()
      };
      
      await this.redis.set(profileKey, JSON.stringify(updatedProfile));
      this.logger.info(`Updated user profile: ${user.id}`);
    } catch (error) {
      this.logger.error('Error updating user profile:', error);
    }
  }

  // Personalization engine
  async personalizeResults(results, user) {
    // Personalize results based on user profile
    const profile = await this.getUserProfile(user.id);
    
    if (!profile) {
      return results;
    }
    
    // Apply personalization based on user preferences
    return results.map(result => ({
      ...result,
      relevanceScore: this.calculateRelevanceScore(result, profile),
      personalizedNote: this.generatePersonalizedNote(result, profile)
    })).sort((a, b) => b.relevanceScore - a.relevanceScore);
  }

  // Utility methods
  async getUserProfile(userId) {
    const profileKey = `user:${userId}:profile`;
    try {
      const profile = await this.redis.get(profileKey);
      return profile ? JSON.parse(profile) : null;
    } catch (error) {
      this.logger.error('Error getting user profile:', error);
      return null;
    }
  }

  calculateRelevanceScore(result, profile) {
    // Calculate relevance score based on user profile
    let score = 0;
    
    if (profile.interests && profile.interests.includes(result.category)) {
      score += 10;
    }
    
    if (profile.budget && result.price <= profile.budget) {
      score += 5;
    }
    
    return score;
  }

  generatePersonalizedNote(result, profile) {
    // Generate personalized note for the result
    const notes = [];
    
    if (profile.previousSearches && profile.previousSearches.includes(result.category)) {
      notes.push("Based on your previous searches");
    }
    
    if (result.price < result.originalPrice) {
      notes.push(`${Math.round(((result.originalPrice - result.price) / result.originalPrice) * 100)}% savings`);
    }
    
    return notes.join(' • ');
  }

  deduplicateAndRank(products) {
    // Remove duplicates and rank by relevance
    const unique = new Map();
    
    products.forEach(product => {
      const key = `${product.name}-${product.retailer}`;
      if (!unique.has(key) || unique.get(key).price > product.price) {
        unique.set(key, product);
      }
    });
    
    return Array.from(unique.values()).sort((a, b) => a.price - b.price);
  }

  generateRelatedQueries(product) {
    // Generate related search queries
    const queries = [];
    
    // Add brand variations
    if (product.brand) {
      queries.push(`${product.brand} ${product.category}`);
    }
    
    // Add alternative products
    if (product.category === 'smartphone') {
      queries.push('smartphone deals');
      queries.push('mobile phone');
    }
    
    return queries;
  }

  async close() {
    await super.close();
    await this.redis.quit();
  }
}

module.exports = ManualTriggerCrawler; 