#!/usr/bin/env node

const KoreaUSPriceCrawler = require('../crawlers/korea-us-crawler');
const { loggers } = require('../utils/logger');
const { CircuitBreaker, GracefulDegradation } = require('../utils/resilience');

const logger = loggers.crawler;

async function startRealCrawling() {
  logger.info('🚀 Starting Real Price Crawling System');
  
  try {
    // Initialize the crawler
    const crawler = new KoreaUSPriceCrawler({
      delay: 5000, // 5 second delay between requests
      maxRetries: 3,
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    });

    logger.info('✅ Crawler initialized successfully');

    // Start monitoring Korea-US price disparities
    logger.info('📊 Starting Korea-US price disparity monitoring...');
    const disparities = await crawler.monitorKoreaUSPrices();
    
    logger.info(`✅ Found ${disparities.length} price disparities`);
    
    // Display results
    if (disparities.length > 0) {
      logger.info('\n📈 Price Disparity Results:');
      disparities.forEach((disparity, index) => {
        logger.info(`${index + 1}. ${disparity.itemName}`);
        logger.info(`   Korea: ₩${disparity.krPrice.toLocaleString()} (${disparity.krSite})`);
        logger.info(`   US: $${disparity.usPrice.toLocaleString()} (${disparity.usSite})`);
        logger.info(`   Disparity: ${disparity.disparity.toFixed(2)}%`);
        logger.info(`   Cheaper in: ${disparity.cheaperIn}`);
        logger.info(`   Potential Savings: $${disparity.potentialSavings.toFixed(2)}`);
        logger.info('');
      });
    }

    // Generate recommendations
    logger.info('💡 Generating recommendations...');
    const recommendations = crawler.generateRecommendations(disparities);
    
    if (recommendations.length > 0) {
      logger.info('\n🎯 Recommendations:');
      recommendations.forEach((rec, index) => {
        logger.info(`${index + 1}. ${rec.title}`);
        logger.info(`   ${rec.description}`);
        logger.info(`   Estimated Savings: $${rec.estimatedSavings}`);
        logger.info('');
      });
    }

    // Generate report
    logger.info('📋 Generating comprehensive report...');
    const report = await crawler.generateDisparityReport();
    logger.info('✅ Report generated successfully');

    // Close crawler
    await crawler.close();
    logger.info('✅ Crawling session completed');

  } catch (error) {
    logger.error('❌ Error during crawling:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  logger.info('🛑 Received SIGINT, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGTERM', async () => {
  logger.info('🛑 Received SIGTERM, shutting down gracefully...');
  process.exit(0);
});

// Start the crawling
if (require.main === module) {
  startRealCrawling().catch(error => {
    logger.error('❌ Fatal error:', error);
    process.exit(1);
  });
}

module.exports = { startRealCrawling }; 