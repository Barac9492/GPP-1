#!/usr/bin/env node

const KoreaUSPriceCrawler = require('../crawlers/korea-us-crawler');
const { loggers } = require('../utils/logger');

const logger = loggers.crawler;

async function testSingleCrawl() {
  logger.info('🧪 Testing Single Product Crawling');
  
  try {
    // Initialize the crawler
    const crawler = new KoreaUSPriceCrawler({
      delay: 2000, // 2 second delay
      maxRetries: 2,
      timeout: 15000 // 15 seconds timeout
    });

    // Wait for Redis to connect
    await new Promise(resolve => setTimeout(resolve, 1000));

    logger.info('✅ Crawler initialized successfully');

    // Test with just one product
    const testProduct = {
      category: 'Electronics',
      name: 'iPhone 15 Pro',
      krKeywords: ['아이폰 15 프로'],
      usKeywords: ['iPhone 15 Pro'],
      expectedKRPrice: 1500000,
      expectedUSPrice: 999,
      shippingKR: 0,
      shippingUS: 0,
      priority: 'high'
    };

    logger.info(`🔍 Testing with: ${testProduct.name}`);

    // Test Korean prices
    logger.info('🇰🇷 Testing Korean price scraping...');
    const krPrices = await crawler.getKoreanPrices(testProduct);
    logger.info(`Found ${krPrices.length} Korean prices:`, krPrices);

    // Test US prices
    logger.info('🇺🇸 Testing US price scraping...');
    const usPrices = await crawler.getUSPrices(testProduct);
    logger.info(`Found ${usPrices.length} US prices:`, usPrices);

    // Test disparity calculation
    if (krPrices.length > 0 && usPrices.length > 0) {
      logger.info('📊 Testing disparity calculation...');
      const disparity = await crawler.analyzeItemDisparity(testProduct);
      logger.info('Disparity result:', disparity);
    } else {
      logger.warn('⚠️ Insufficient data for disparity calculation');
    }

    // Close crawler
    await crawler.close();
    logger.info('✅ Test completed successfully');

  } catch (error) {
    logger.error('❌ Test failed:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  logger.info('🛑 Received SIGINT, shutting down gracefully...');
  process.exit(0);
});

// Start the test
if (require.main === module) {
  testSingleCrawl().catch(error => {
    logger.error('❌ Fatal error:', error);
    process.exit(1);
  });
}

module.exports = { testSingleCrawl }; 