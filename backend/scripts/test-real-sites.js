#!/usr/bin/env node

const KoreaUSPriceCrawler = require('../crawlers/korea-us-crawler');
const { loggers } = require('../utils/logger');

const logger = loggers.crawler;

// Real site configurations with actual selectors
const realSiteConfig = {
  koreanSites: {
    coupang: {
      url: 'https://www.coupang.com',
      searchPath: '/np/search',
      priceSelector: '.price-value, .price, [data-price]',
      titleSelector: '.name, .product-name, h3',
      enabled: true,
      delay: 3000 // 3 seconds between requests
    },
    gmarket: {
      url: 'https://www.gmarket.co.kr',
      searchPath: '/search',
      priceSelector: '.price, .cost, [class*="price"]',
      titleSelector: '.item_title, .title, h3',
      enabled: true,
      delay: 3000
    }
  },
  usSites: {
    amazon: {
      url: 'https://www.amazon.com',
      searchPath: '/s',
      priceSelector: '.a-price-whole, .a-price .a-offscreen, [data-price]',
      titleSelector: '.a-size-medium, .a-size-base, h2',
      enabled: true,
      delay: 3000
    },
    bestbuy: {
      url: 'https://www.bestbuy.com',
      searchPath: '/site/searchpage.jsp',
      priceSelector: '.priceView-customer-price, .price, [data-price]',
      titleSelector: '.sku-title, .product-title, h4',
      enabled: true,
      delay: 3000
    }
  }
};

// Test products with real keywords
const testProducts = [
  {
    category: 'Electronics',
    name: 'iPhone 15 Pro',
    krKeywords: ['아이폰 15 프로', 'iPhone 15 Pro'],
    usKeywords: ['iPhone 15 Pro'],
    expectedKRPrice: 1500000,
    expectedUSPrice: 999,
    priority: 'high'
  },
  {
    category: 'Beauty',
    name: 'Laneige Lip Sleeping Mask',
    krKeywords: ['라네즈 립 슬리핑 마스크', 'Laneige Lip Sleeping Mask'],
    usKeywords: ['Laneige Lip Sleeping Mask'],
    expectedKRPrice: 11000,
    expectedUSPrice: 26,
    priority: 'medium'
  }
];

async function testRealSites() {
  logger.info('🌐 Starting Real Site Testing');
  
  try {
    // Initialize crawler with real site config
    const crawler = new KoreaUSPriceCrawler({
      delay: 5000, // 5 seconds between requests
      maxRetries: 2,
      timeout: 20000 // 20 seconds timeout
    });

    // Override with real site config
    crawler.koreanSites = realSiteConfig.koreanSites;
    crawler.usSites = realSiteConfig.usSites;

    await new Promise(resolve => setTimeout(resolve, 2000));
    logger.info('✅ Crawler initialized with real site config');

    const results = [];

    for (const product of testProducts) {
      logger.info(`\n🔍 Testing ${product.name} on real sites...`);
      
      try {
        // Test Korean sites
        logger.info('🇰🇷 Testing Korean sites...');
        const krPrices = await crawler.getKoreanPrices(product);
        logger.info(`Found ${krPrices.length} Korean prices:`, krPrices);

        // Test US sites
        logger.info('🇺🇸 Testing US sites...');
        const usPrices = await crawler.getUSPrices(product);
        logger.info(`Found ${usPrices.length} US prices:`, usPrices);

        // Calculate disparity if we have data
        if (krPrices.length > 0 && usPrices.length > 0) {
          const disparity = await crawler.analyzeItemDisparity(product);
          if (disparity) {
            results.push(disparity);
            logger.info(`✅ ${product.name} disparity:`, {
              krPrice: `₩${disparity.krPrice.toLocaleString()}`,
              usPrice: `$${disparity.usPrice.toLocaleString()}`,
              disparity: `${disparity.disparity.toFixed(2)}%`,
              cheaperIn: disparity.cheaperIn,
              savings: `$${disparity.potentialSavings.toFixed(2)}`
            });
          }
        } else {
          logger.warn(`⚠️ Insufficient data for ${product.name}`);
        }

        // Add delay between products
        await new Promise(resolve => setTimeout(resolve, 5000));
        
      } catch (error) {
        logger.error(`❌ Error testing ${product.name}:`, error.message);
      }
    }

    // Summary
    logger.info(`\n📊 Real Site Test Summary:`);
    logger.info(`Products tested: ${testProducts.length}`);
    logger.info(`Successful disparities: ${results.length}`);
    
    if (results.length > 0) {
      logger.info('\n💡 Real Data Results:');
      results.forEach((result, index) => {
        logger.info(`${index + 1}. ${result.itemName}`);
        logger.info(`   Korea: ₩${result.krPrice.toLocaleString()} (${result.krSite})`);
        logger.info(`   US: $${result.usPrice.toLocaleString()} (${result.usSite})`);
        logger.info(`   Disparity: ${result.disparity.toFixed(2)}%`);
        logger.info(`   Savings: $${result.potentialSavings.toFixed(2)}`);
      });
    }

    await crawler.close();
    logger.info('\n✅ Real site testing completed');

  } catch (error) {
    logger.error('❌ Real site test failed:', error);
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
  testRealSites().catch(error => {
    logger.error('❌ Fatal error:', error);
    process.exit(1);
  });
}

module.exports = { testRealSites }; 