#!/usr/bin/env node

const KoreaUSPriceCrawler = require('../crawlers/korea-us-crawler');
const { loggers } = require('../utils/logger');

const logger = loggers.crawler;

// Mock price data for testing
const mockPrices = {
  'iPhone 15 Pro': {
    korean: [
      { price: 1500000, site: 'coupang', title: 'iPhone 15 Pro 128GB' },
      { price: 1480000, site: 'gmarket', title: 'iPhone 15 Pro 128GB' },
      { price: 1520000, site: 'elevenst', title: 'iPhone 15 Pro 128GB' }
    ],
    us: [
      { price: 999, site: 'amazon', title: 'iPhone 15 Pro 128GB' },
      { price: 999, site: 'bestbuy', title: 'iPhone 15 Pro 128GB' },
      { price: 1049, site: 'walmart', title: 'iPhone 15 Pro 128GB' }
    ]
  },
  'Samsung Galaxy S24': {
    korean: [
      { price: 1200000, site: 'coupang', title: 'Samsung Galaxy S24 128GB' },
      { price: 1180000, site: 'gmarket', title: 'Samsung Galaxy S24 128GB' }
    ],
    us: [
      { price: 799, site: 'amazon', title: 'Samsung Galaxy S24 128GB' },
      { price: 799, site: 'bestbuy', title: 'Samsung Galaxy S24 128GB' }
    ]
  },
  'Laneige Lip Sleeping Mask': {
    korean: [
      { price: 11000, site: 'coupang', title: 'Laneige Lip Sleeping Mask 20g' },
      { price: 12000, site: 'gmarket', title: 'Laneige Lip Sleeping Mask 20g' }
    ],
    us: [
      { price: 26, site: 'amazon', title: 'Laneige Lip Sleeping Mask 20g' },
      { price: 28, site: 'sephora', title: 'Laneige Lip Sleeping Mask 20g' }
    ]
  }
};

async function testRealCrawling() {
  logger.info('🚀 Starting Real Price Crawling Test with Mock Data');
  
  try {
    // Initialize the crawler
    const crawler = new KoreaUSPriceCrawler({
      delay: 1000, // 1 second delay
      maxRetries: 2,
      timeout: 10000
    });

    await new Promise(resolve => setTimeout(resolve, 1000));
    logger.info('✅ Crawler initialized successfully');

    // Override the scraping methods to use mock data
    crawler.getKoreanPrices = async function(item) {
      logger.info(`🇰🇷 Getting Korean prices for ${item.name}`);
      const mockData = mockPrices[item.name]?.korean || [];
      logger.info(`Found ${mockData.length} Korean prices for ${item.name}`);
      return mockData;
    };

    crawler.getUSPrices = async function(item) {
      logger.info(`🇺🇸 Getting US prices for ${item.name}`);
      const mockData = mockPrices[item.name]?.us || [];
      logger.info(`Found ${mockData.length} US prices for ${item.name}`);
      return mockData;
    };

    // Test with all products
    const testProducts = [
      {
        category: 'Electronics',
        name: 'iPhone 15 Pro',
        krKeywords: ['아이폰 15 프로'],
        usKeywords: ['iPhone 15 Pro'],
        expectedKRPrice: 1500000,
        expectedUSPrice: 999,
        priority: 'high'
      },
      {
        category: 'Electronics',
        name: 'Samsung Galaxy S24',
        krKeywords: ['삼성 갤럭시 S24'],
        usKeywords: ['Samsung Galaxy S24'],
        expectedKRPrice: 1200000,
        expectedUSPrice: 799,
        priority: 'high'
      },
      {
        category: 'Beauty',
        name: 'Laneige Lip Sleeping Mask',
        krKeywords: ['라네즈 립 슬리핑 마스크'],
        usKeywords: ['Laneige Lip Sleeping Mask'],
        expectedKRPrice: 11000,
        expectedUSPrice: 26,
        priority: 'medium'
      }
    ];

    const disparities = [];

    for (const product of testProducts) {
      logger.info(`\n📊 Analyzing ${product.name}...`);
      
      try {
        const disparity = await crawler.analyzeItemDisparity(product);
        if (disparity) {
          disparities.push(disparity);
          await crawler.storeDisparity(disparity);
          
          logger.info(`✅ ${product.name}:`);
          logger.info(`   Korea: ₩${disparity.krPrice.toLocaleString()} (${disparity.krSite})`);
          logger.info(`   US: $${disparity.usPrice.toLocaleString()} (${disparity.usSite})`);
          logger.info(`   Disparity: ${disparity.disparity.toFixed(2)}%`);
          logger.info(`   Cheaper in: ${disparity.cheaperIn}`);
          logger.info(`   Potential Savings: $${disparity.potentialSavings.toFixed(2)}`);
        }
        
        // Add delay between products
        await crawler.delay(1000);
        
      } catch (error) {
        logger.error(`❌ Error analyzing ${product.name}:`, error);
      }
    }

    logger.info(`\n📈 Summary: Found ${disparities.length} disparities`);

    // Generate recommendations
    if (disparities.length > 0) {
      logger.info('\n💡 Recommendations:');
      const recommendations = crawler.generateRecommendations(disparities);
      
      recommendations.forEach((rec, index) => {
        logger.info(`${index + 1}. ${rec.title}`);
        logger.info(`   ${rec.description}`);
        logger.info(`   Estimated Savings: $${rec.estimatedSavings.toFixed(2)}`);
      });
    }

    // Generate report
    logger.info('\n📋 Generating report...');
    const report = await crawler.generateDisparityReport();
    
    if (report) {
      logger.info('📊 Report Summary:');
      logger.info(`   Total Items: ${report.summary.totalItems}`);
      logger.info(`   Items with Disparities: ${report.summary.itemsWithDisparities}`);
      logger.info(`   Average Disparity: ${report.summary.averageDisparity.toFixed(2)}%`);
      logger.info(`   Total Potential Savings: $${report.summary.totalPotentialSavings.toFixed(2)}`);
    }

    // Close crawler
    await crawler.close();
    logger.info('\n✅ Real crawling test completed successfully');

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
  testRealCrawling().catch(error => {
    logger.error('❌ Fatal error:', error);
    process.exit(1);
  });
}

module.exports = { testRealCrawling }; 