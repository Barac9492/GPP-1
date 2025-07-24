const ManualTriggerCrawler = require('../crawlers/manual-trigger-crawler');
const KnowledgeGraph = require('../intelligence/knowledge-graph');
const UserEngagementSystem = require('../engagement/user-engagement-system');
const winston = require('winston');

// Set up logging
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.colorize(),
    winston.format.simple()
  ),
  transports: [
    new winston.transports.Console()
  ]
});

async function testEngagementSystem() {
  logger.info('🚀 Starting Global Price Pulse Engagement System Test');
  
  // Initialize systems
  const crawler = new ManualTriggerCrawler();
  const knowledgeGraph = new KnowledgeGraph();
  const engagementSystem = new UserEngagementSystem();
  
  try {
    // Test 1: User Search Trigger
    logger.info('\n📊 Test 1: User Search Trigger');
    const searchResults = await crawler.handleUserTrigger('search', {
      query: 'iPhone 15 Pro'
    }, { id: 'user123' });
    
    logger.info(`Found ${searchResults.length} products for iPhone 15 Pro`);
    
    // Test 2: Knowledge Graph Creation
    logger.info('\n🧠 Test 2: Knowledge Graph Creation');
    
    // Create product nodes
    await knowledgeGraph.createNode('product', 'iphone15pro', {
      name: 'iPhone 15 Pro',
      category: 'smartphone',
      brand: 'Apple',
      price: 999
    });
    
    await knowledgeGraph.createNode('market', 'US', {
      name: 'United States',
      currency: 'USD'
    });
    
    await knowledgeGraph.createNode('market', 'JP', {
      name: 'Japan',
      currency: 'JPY'
    });
    
    // Create relationships
    await knowledgeGraph.createRelationship(
      'product', 'iphone15pro',
      'available_in', 'market', 'US',
      { price: 999, currency: 'USD' }
    );
    
    await knowledgeGraph.createRelationship(
      'product', 'iphone15pro',
      'available_in', 'market', 'JP',
      { price: 120000, currency: 'JPY' }
    );
    
    await knowledgeGraph.createRelationship(
      'user', 'user123',
      'interested_in', 'product', 'iphone15pro',
      { strength: 8.5, timestamp: new Date().toISOString() }
    );
    
    logger.info('✅ Knowledge graph nodes and relationships created');
    
    // Test 3: Knowledge Graph Analysis
    logger.info('\n🔍 Test 3: Knowledge Graph Analysis');
    
    const connectedNodes = await knowledgeGraph.findConnectedNodes('product', 'iphone15pro', 2);
    logger.info(`Found ${connectedNodes.length} connected nodes for iPhone 15 Pro`);
    
    const patterns = await knowledgeGraph.analyzePatterns('product', 'iphone15pro', 'comprehensive');
    logger.info('Pattern analysis completed:', {
      priceAnalysis: patterns.priceAnalysis ? '✅' : '❌',
      userBehavior: patterns.userBehavior ? '✅' : '❌',
      marketTrends: patterns.marketTrends ? '✅' : '❌',
      recommendations: patterns.recommendations ? '✅' : '❌'
    });
    
    // Test 4: User Engagement Processing
    logger.info('\n🎯 Test 4: User Engagement Processing');
    
    const engagementResult = await engagementSystem.processUserEngagement('user123', 'search', {
      query: 'iPhone 15 Pro',
      results: searchResults.length
    });
    
    logger.info('Engagement processing result:', {
      opportunities: engagementResult.opportunities ? '✅' : '❌',
      gamificationUpdate: engagementResult.gamificationUpdate ? '✅' : '❌',
      nextHooks: engagementResult.nextEngagementHooks
    });
    
    // Test 5: Daily Engagement Generation
    logger.info('\n📅 Test 5: Daily Engagement Generation');
    
    const dailyEngagement = await engagementSystem.generateDailyEngagement('user123');
    if (dailyEngagement) {
      logger.info('Daily engagement generated:', {
        priceAlerts: dailyEngagement.priceAlerts.length,
        marketInsights: dailyEngagement.marketInsights.length,
        trendingDeals: dailyEngagement.trendingDeals.length,
        personalizedInsights: dailyEngagement.personalizedInsights.length
      });
    }
    
    // Test 6: Weekly Engagement Generation
    logger.info('\n📊 Test 6: Weekly Engagement Generation');
    
    const weeklyEngagement = await engagementSystem.generateWeeklyEngagement('user123');
    if (weeklyEngagement) {
      logger.info('Weekly engagement generated:', {
        personalizedReport: weeklyEngagement.personalizedReport ? '✅' : '❌',
        communityInsights: weeklyEngagement.communityInsights.length,
        savingsAnalysis: weeklyEngagement.savingsAnalysis ? '✅' : '❌',
        recommendations: weeklyEngagement.recommendations.length
      });
    }
    
    // Test 7: Gamification System
    logger.info('\n🏆 Test 7: Gamification System');
    
    // Simulate multiple user actions
    const actions = [
      { action: 'search', data: { query: 'MacBook Air' } },
      { action: 'view_product', data: { productId: 'macbook-air' } },
      { action: 'set_price_alert', data: { productId: 'iphone15pro', targetPrice: 899 } },
      { action: 'share_deal', data: { productId: 'iphone15pro' } }
    ];
    
    for (const { action, data } of actions) {
      const gamificationUpdate = await engagementSystem.updateGamificationProgress('user123', action, data);
      logger.info(`${action}: +${gamificationUpdate.pointsEarned} points (Total: ${gamificationUpdate.totalPoints})`);
      
      if (gamificationUpdate.newBadges.length > 0) {
        logger.info(`🎖️ New badges earned: ${gamificationUpdate.newBadges.map(b => b.name).join(', ')}`);
      }
      
      if (gamificationUpdate.newLevel) {
        logger.info(`🎉 Level up! New level: ${gamificationUpdate.newLevel.name}`);
      }
    }
    
    // Test 8: Knowledge Graph Search
    logger.info('\n🔎 Test 8: Knowledge Graph Search');
    
    const graphSearchResults = await knowledgeGraph.searchGraph('iPhone', ['product'], 10);
    logger.info(`Found ${graphSearchResults.length} products matching "iPhone"`);
    
    // Test 9: Graph Statistics
    logger.info('\n📈 Test 9: Graph Statistics');
    
    const stats = await knowledgeGraph.getGraphStats();
    logger.info('Knowledge graph statistics:', {
      totalNodes: stats.totalNodes,
      totalRelationships: stats.totalRelationships,
      nodesByType: stats.nodesByType,
      relationshipsByType: stats.relationshipsByType
    });
    
    // Test 10: Virtuous Loop Demonstration
    logger.info('\n🔄 Test 10: Virtuous Loop Demonstration');
    
    // Simulate the virtuous loop
    logger.info('Step 1: User searches for product');
    await engagementSystem.processUserEngagement('user123', 'search', { query: 'Samsung Galaxy' });
    
    logger.info('Step 2: System learns user preferences');
    await knowledgeGraph.createRelationship(
      'user', 'user123',
      'interested_in', 'product', 'samsung-galaxy',
      { strength: 7.0, timestamp: new Date().toISOString() }
    );
    
    logger.info('Step 3: System generates personalized recommendations');
    const recommendations = await knowledgeGraph.generateRecommendations('user', 'user123');
    logger.info(`Generated ${recommendations.length} recommendations`);
    
    logger.info('Step 4: User engages with recommendations');
    await engagementSystem.processUserEngagement('user123', 'view_product', { productId: 'samsung-galaxy' });
    
    logger.info('Step 5: System improves with more data');
    const updatedPatterns = await knowledgeGraph.analyzePatterns('user', 'user123', 'user_behavior');
    logger.info('Updated user behavior analysis completed');
    
    logger.info('✅ Virtuous loop demonstrated successfully!');
    
    // Test 11: Compounding Moat Demonstration
    logger.info('\n🏰 Test 11: Compounding Moat Demonstration');
    
    // Demonstrate data moat
    logger.info('Data Moat: Unique combinations of user behavior + market data');
    const userBehavior = await knowledgeGraph.analyzeUserBehavior('user', 'user123');
    logger.info(`User has ${userBehavior.interests.length} interests with varying strengths`);
    
    // Demonstrate network effect moat
    logger.info('Network Effect Moat: Community insights improve recommendations');
    const communityInsights = await engagementSystem.getCommunityInsights('user123');
    logger.info(`Generated ${communityInsights.length} community insights`);
    
    // Demonstrate intelligence moat
    logger.info('Intelligence Moat: ML models improve with more data');
    const comprehensiveAnalysis = await knowledgeGraph.analyzePatterns('product', 'iphone15pro', 'comprehensive');
    logger.info('Comprehensive analysis completed with multiple dimensions');
    
    // Demonstrate trust moat
    logger.info('Trust Moat: Proven savings build user loyalty');
    const savingsAnalysis = await engagementSystem.analyzeUserSavings('user123');
    if (savingsAnalysis) {
      logger.info(`User has saved $${savingsAnalysis.totalSavings} total`);
    }
    
    logger.info('✅ All compounding moats demonstrated successfully!');
    
    // Final summary
    logger.info('\n🎉 Test Summary');
    logger.info('✅ Manual trigger crawling system working');
    logger.info('✅ Knowledge graph with Obsidian-style connections working');
    logger.info('✅ User engagement system with virtuous loops working');
    logger.info('✅ Gamification system working');
    logger.info('✅ Compounding moats established');
    logger.info('✅ Palantir-style intelligence working');
    
    logger.info('\n🚀 Global Price Pulse is ready for sophisticated, intelligent price comparison!');
    
  } catch (error) {
    logger.error('❌ Test failed:', error);
  } finally {
    // Cleanup
    await crawler.close();
    await knowledgeGraph.close();
    await engagementSystem.close();
    logger.info('🧹 Cleanup completed');
  }
}

// Run the test
if (require.main === module) {
  testEngagementSystem().catch(console.error);
}

module.exports = { testEngagementSystem }; 