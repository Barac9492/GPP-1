const AmazonCrawler = require('../backend/crawlers/amazon-crawler');
const fs = require('fs').promises;
const path = require('path');

async function testCrawler() {
  console.log('🧪 Testing Amazon Crawler...');
  
  const crawler = new AmazonCrawler({
    delay: 3000, // Slower for testing
    maxRetries: 2
  });

  try {
    // Test 1: Search for a specific product
    console.log('\n📦 Testing product search...');
    const searchQuery = 'iPhone 15';
    const products = await crawler.searchProducts(searchQuery, 'US', 1);
    
    console.log(`Found ${products.length} products for "${searchQuery}"`);
    
    if (products.length > 0) {
      console.log('\n📊 Sample product data:');
      console.log(JSON.stringify(products[0], null, 2));
      
      // Save results to file for inspection
      const resultsDir = path.join(__dirname, '../data');
      await fs.mkdir(resultsDir, { recursive: true });
      await fs.writeFile(
        path.join(resultsDir, 'amazon-test-results.json'),
        JSON.stringify(products, null, 2)
      );
      console.log('\n💾 Results saved to data/amazon-test-results.json');
    }

    // Test 2: Get detailed product information
    if (products.length > 0) {
      console.log('\n🔍 Testing detailed product extraction...');
      const productUrl = products[0].productUrl;
      
      if (productUrl) {
        const details = await crawler.getProductDetails(productUrl);
        if (details) {
          console.log('\n📋 Product details:');
          console.log(JSON.stringify(details, null, 2));
        }
      }
    }

    // Test 3: Price monitoring
    if (products.length > 0) {
      console.log('\n💰 Testing price monitoring...');
      const productUrl = products[0].productUrl;
      
      if (productUrl) {
        const priceInfo = await crawler.monitorPriceChanges(productUrl, 'US');
        if (priceInfo) {
          console.log('\n💵 Price information:');
          console.log(JSON.stringify(priceInfo, null, 2));
        }
      }
    }

    console.log('\n✅ All tests completed successfully!');
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    console.error('Stack trace:', error.stack);
  } finally {
    await crawler.close();
  }
}

// Test different regions
async function testMultipleRegions() {
  console.log('\n🌍 Testing multiple regions...');
  
  const regions = ['US', 'UK', 'DE'];
  const testQuery = 'Samsung Galaxy';
  
  for (const region of regions) {
    console.log(`\n📍 Testing ${region} region...`);
    
    const crawler = new AmazonCrawler({
      delay: 5000, // Even slower for multiple regions
      maxRetries: 2
    });

    try {
      const products = await crawler.searchProducts(testQuery, region, 1);
      console.log(`Found ${products.length} products in ${region}`);
      
      if (products.length > 0) {
        console.log(`Sample price in ${region}: ${products[0].price} ${products[0].currency}`);
      }
    } catch (error) {
      console.error(`Error testing ${region}:`, error.message);
    } finally {
      await crawler.close();
    }
  }
}

// Run tests
async function runTests() {
  console.log('🚀 Starting crawler tests...\n');
  
  await testCrawler();
  await testMultipleRegions();
  
  console.log('\n🎉 All tests completed!');
}

// Only run if called directly
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = { testCrawler, testMultipleRegions }; 