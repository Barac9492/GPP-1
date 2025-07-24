const puppeteer = require('puppeteer');

// Import modules with explicit error handling
let fetchTrendingProducts, scrapePrices, uploadToFirestore, handleError, sendReport;

try {
  console.log('📦 Loading modules...');
  
  const openaiModule = require('../modules/openai_product_ideator');
  fetchTrendingProducts = openaiModule.fetchTrendingProducts;
  console.log('✅ OpenAI product ideator module loaded');
  
  const scraperModule = require('../modules/scraper');
  scrapePrices = scraperModule.scrapePrices;
  console.log('✅ Scraper module loaded');
  
  const firestoreModule = require('../modules/firestore_writer');
  uploadToFirestore = firestoreModule.uploadToFirestore;
  console.log('✅ Firestore module loaded');
  
  const healerModule = require('../modules/self_healer');
  handleError = healerModule.handleError;
  console.log('✅ Self-healer module loaded');
  
  const notifierModule = require('../modules/notifier');
  sendReport = notifierModule.sendReport;
  console.log('✅ Notifier module loaded');
  
} catch (error) {
  console.error('❌ Failed to load modules:', error);
  throw error;
}

async function runGPPAgent() {
  console.log('🚀 Starting GPP Agent...');

  try {
    // Get trending products from OpenAI
    console.log('📊 Fetching trending products...');
    const products = await fetchTrendingProducts();
    console.log(`Found ${products.length} trending products`);

    // Launch browser with improved configuration for CI/CD
    const browser = await puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu',
        '--disable-web-security',
        '--disable-features=VizDisplayCompositor',
        '--disable-http2',
        '--disable-background-timer-throttling',
        '--disable-backgrounding-occluded-windows',
        '--disable-renderer-backgrounding',
        '--disable-features=TranslateUI',
        '--disable-ipc-flooding-protection'
      ]
    });

    const successes = [];
    const failures = [];
    const startTime = Date.now();

    console.log('🔍 Starting price scraping...');

    for (const [index, product] of products.entries()) {
      console.log(`Processing ${index + 1}/${products.length}: ${product}`);

      try {
        const priceData = await scrapePrices(product, browser);

        if (priceData && Object.keys(priceData).length > 0) {
          // Create a proper product object with category detection
          const productObj = {
            name: product,
            category: detectProductCategory(product),
            description: `Scraped product data for ${product}`,
            source: 'gpp-agent'
          };
          
          await uploadToFirestore(productObj, priceData);
          successes.push(product);
          console.log(`✅ Successfully processed: ${product}`);
        } else {
          throw new Error('No price data retrieved');
        }
      } catch (err) {
        const error = String(err);
        failures.push({
          name: product,
          error
        });
        console.error(`❌ Failed to process ${product}:`, error);
        await handleError(err, { name: product });
      }

      // Add delay between requests to avoid rate limiting
      if (index < products.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
    }

    const endTime = Date.now();
    const duration = Math.round((endTime - startTime) / 1000);

    console.log(`📈 Scraping completed in ${duration}s`);
    console.log(`✅ Successes: ${successes.length}`);
    console.log(`❌ Failures: ${failures.length}`);

    // Send comprehensive report
    await sendReport(successes, failures);

    await browser.close();
    console.log('🎉 GPP Agent completed successfully');

    return {
      success: true,
      summary: {
        total: products.length,
        successes: successes.length,
        failures: failures.length,
        duration
      }
    };

  } catch (error) {
    console.error('💥 Critical error in GPP Agent:', error);
    await handleError(error, { name: 'GPP_AGENT_CRITICAL_ERROR' });
    throw error;
  }
}

// Run the agent if this file is executed directly
if (require.main === module) {
  runGPPAgent().catch(console.error);
}

module.exports = { runGPPAgent };

// Helper function to detect product category
function detectProductCategory(productName) {
  const name = productName.toLowerCase();
  
  // Korean cosmetics
  if (name.includes('cosmetic') || name.includes('skincare') || 
      name.includes('serum') || name.includes('cream') || name.includes('mask') ||
      name.includes('essence') || name.includes('toner') || name.includes('lotion') ||
      name.includes('innisfree') || name.includes('laneige') || name.includes('missha') ||
      name.includes('etude') || name.includes('cosrx') || name.includes('the face shop')) {
    return 'cosmetic';
  }
  
  // US IT products
  if (name.includes('phone') || name.includes('laptop') || name.includes('computer') ||
      name.includes('headphone') || name.includes('mouse') || name.includes('keyboard') ||
      name.includes('samsung') || name.includes('apple') || name.includes('dell') ||
      name.includes('sony') || name.includes('logitech') || name.includes('macbook') ||
      name.includes('galaxy') || name.includes('iphone') || name.includes('xps')) {
    return 'electronics';
  }
  
  return 'unknown';
} 