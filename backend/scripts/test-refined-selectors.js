#!/usr/bin/env node

const KoreaUSPriceCrawler = require('../crawlers/korea-us-crawler');
const { loggers } = require('../utils/logger');

const logger = loggers.crawler;

// Refined selectors for better accuracy
const refinedSelectors = {
  amazon: {
    priceSelectors: [
      '.a-price .a-offscreen',
      '.a-price-whole',
      '.a-price .a-price-whole',
      '[data-price]'
    ],
    titleSelectors: [
      '.a-size-medium.a-color-base.a-text-normal',
      '.a-size-base-plus.a-color-base.a-text-normal',
      'h2 a.a-link-normal',
      '.a-size-medium.a-color-base'
    ],
    productContainer: '.s-result-item[data-component-type="s-search-result"]'
  },
  bestbuy: {
    priceSelectors: [
      '.priceView-customer-price .priceView-customer-price',
      '.priceView-layout-large .priceView-customer-price',
      '.priceView-customer-price'
    ],
    titleSelectors: [
      '.sku-title',
      '.product-title',
      'h4 a'
    ],
    productContainer: '.sku-item'
  }
};

async function testRefinedSelectors() {
  logger.info('🔧 Testing Refined Selectors');
  
  try {
    const crawler = new KoreaUSPriceCrawler({
      delay: 2000,
      maxRetries: 2,
      timeout: 15000
    });

    // Override rate limiting for testing
    crawler.checkRateLimit = async function() {
      return true;
    };

    await new Promise(resolve => setTimeout(resolve, 1000));
    logger.info('✅ Crawler initialized');

    // Test Amazon with refined selectors
    logger.info('🔍 Testing Amazon with refined selectors...');
    
    try {
      const response = await crawler.makeRequest('https://www.amazon.com/s?k=iPhone+15+Pro&i=electronics');
      logger.info('✅ Successfully fetched Amazon electronics search');
      
      // Use refined selectors
      const amazonConfig = {
        priceSelectors: refinedSelectors.amazon.priceSelectors,
        titleSelectors: refinedSelectors.amazon.titleSelectors
      };
      
      const prices = crawler.extractUSPrice(response.data, 'amazon', amazonConfig);
      
      // Filter prices to only include iPhone-related products
      const filteredPrices = prices.filter(price => {
        const title = price.title.toLowerCase();
        return title.includes('iphone') || title.includes('15') || title.includes('pro');
      });
      
      logger.info(`Found ${prices.length} total prices, ${filteredPrices.length} iPhone-related prices`);
      
      if (filteredPrices.length > 0) {
        logger.info('✅ Found iPhone prices!');
        filteredPrices.forEach((price, index) => {
          logger.info(`${index + 1}. ${price.title} - $${price.price}`);
        });
      } else {
        logger.warn('⚠️ No iPhone prices found - checking all prices:');
        prices.slice(0, 5).forEach((price, index) => {
          logger.info(`${index + 1}. ${price.title} - $${price.price}`);
        });
      }
      
    } catch (error) {
      logger.error('❌ Error testing Amazon:', error.message);
    }

    // Test Best Buy
    logger.info('\n🔍 Testing Best Buy...');
    
    try {
      const response = await crawler.makeRequest('https://www.bestbuy.com/site/searchpage.jsp?st=iPhone+15+Pro');
      logger.info('✅ Successfully fetched Best Buy search');
      
      const bestbuyConfig = {
        priceSelectors: refinedSelectors.bestbuy.priceSelectors,
        titleSelectors: refinedSelectors.bestbuy.titleSelectors
      };
      
      const prices = crawler.extractUSPrice(response.data, 'bestbuy', bestbuyConfig);
      
      const filteredPrices = prices.filter(price => {
        const title = price.title.toLowerCase();
        return title.includes('iphone') || title.includes('15') || title.includes('pro');
      });
      
      logger.info(`Found ${prices.length} total prices, ${filteredPrices.length} iPhone-related prices`);
      
      if (filteredPrices.length > 0) {
        logger.info('✅ Found iPhone prices on Best Buy!');
        filteredPrices.forEach((price, index) => {
          logger.info(`${index + 1}. ${price.title} - $${price.price}`);
        });
      }
      
    } catch (error) {
      logger.error('❌ Error testing Best Buy:', error.message);
    }

    await crawler.close();
    logger.info('✅ Refined selector test completed');

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
  testRefinedSelectors().catch(error => {
    logger.error('❌ Fatal error:', error);
    process.exit(1);
  });
}

module.exports = { testRefinedSelectors }; 