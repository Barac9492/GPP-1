#!/usr/bin/env node

const KoreaUSPriceCrawler = require('../crawlers/korea-us-crawler');
const { loggers } = require('../utils/logger');

const logger = loggers.crawler;

async function testSingleSite() {
  logger.info('🔍 Testing Single Site (Amazon)');
  
  try {
    // Initialize crawler with bypassed rate limiting
    const crawler = new KoreaUSPriceCrawler({
      delay: 2000,
      maxRetries: 2,
      timeout: 15000
    });

    // Override rate limiting for testing
    crawler.checkRateLimit = async function() {
      return true; // Always allow requests for testing
    };

    await new Promise(resolve => setTimeout(resolve, 1000));
    logger.info('✅ Crawler initialized with rate limiting bypassed');

    // Test with iPhone 15 Pro on Amazon
    const testProduct = {
      category: 'Electronics',
      name: 'iPhone 15 Pro',
      usKeywords: ['iPhone 15 Pro'],
      expectedUSPrice: 999,
      priority: 'high'
    };

    logger.info('🔍 Testing iPhone 15 Pro on Amazon...');
    
    try {
      const response = await crawler.makeRequest('https://www.amazon.com/s?k=iPhone+15+Pro');
      logger.info('✅ Successfully fetched Amazon search page');
      
      // Test price extraction
      const amazonConfig = {
        priceSelectors: [
          '.a-price-whole',
          '.a-price .a-offscreen',
          '[data-price]',
          '.price',
          '.cost'
        ],
        titleSelectors: [
          '.a-size-medium',
          '.a-size-base',
          'h2',
          '.product-title',
          '.title'
        ]
      };
      
      const prices = crawler.extractUSPrice(response.data, 'amazon', amazonConfig);
      logger.info(`Found ${prices.length} prices on Amazon:`, prices);
      
      if (prices.length > 0) {
        logger.info('✅ Price extraction working!');
        prices.forEach((price, index) => {
          logger.info(`${index + 1}. ${price.title} - $${price.price}`);
        });
      } else {
        logger.warn('⚠️ No prices found - may need to update selectors');
      }
      
    } catch (error) {
      logger.error('❌ Error testing Amazon:', error.message);
    }

    await crawler.close();
    logger.info('✅ Single site test completed');

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
  testSingleSite().catch(error => {
    logger.error('❌ Fatal error:', error);
    process.exit(1);
  });
}

module.exports = { testSingleSite }; 