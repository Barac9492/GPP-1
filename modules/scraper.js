const puppeteer = require('puppeteer');

// Site configurations
const SITES = {
  korea: [
    'https://www.oliveyoung.co.kr',
    'https://www.lotte.com',
    'https://www.gmarket.co.kr',
    'https://www.coupang.com'
  ],
  us: [
    'https://www.amazon.com',
    'https://www.bestbuy.com', 
    'https://www.newegg.com',
    'https://www.walmart.com'
  ]
};

async function scrapePrices(productName, browser) {
  try {
    console.log(`🔍 Scraping prices for: ${productName}`);
    
    const priceData = {};
    
    // Scrape Korean sites for cosmetics
    if (productName.toLowerCase().includes('cosmetic') || 
        productName.toLowerCase().includes('skincare') ||
        productName.toLowerCase().includes('serum') ||
        productName.toLowerCase().includes('cream') ||
        productName.toLowerCase().includes('mask')) {
      
      console.log('🇰🇷 Scraping Korean cosmetic sites...');
      const koreaPrices = await scrapeKoreaSites(productName, browser);
      Object.assign(priceData, koreaPrices);
    }
    
    // Scrape US sites for IT products
    if (productName.toLowerCase().includes('phone') ||
        productName.toLowerCase().includes('laptop') ||
        productName.toLowerCase().includes('computer') ||
        productName.toLowerCase().includes('headphone') ||
        productName.toLowerCase().includes('mouse') ||
        productName.toLowerCase().includes('samsung') ||
        productName.toLowerCase().includes('apple') ||
        productName.toLowerCase().includes('dell') ||
        productName.toLowerCase().includes('sony')) {
      
      console.log('🇺🇸 Scraping US IT sites...');
      const usPrices = await scrapeUSSites(productName, browser);
      Object.assign(priceData, usPrices);
    }
    
    return priceData;
    
  } catch (error) {
    console.error(`❌ Error scraping prices for ${productName}:`, error);
    return {};
  }
}

async function scrapeKoreaSites(productName, browser) {
  const prices = {};
  
  for (const site of SITES.korea) {
    try {
      const price = await scrapeSite(site, productName, browser);
      if (price) {
        prices[`${site}_korea`] = price;
      }
    } catch (error) {
      console.error(`❌ Failed to scrape ${site}:`, error.message);
    }
  }
  
  return prices;
}

async function scrapeUSSites(productName, browser) {
  const prices = {};
  
  for (const site of SITES.us) {
    try {
      const price = await scrapeSite(site, productName, browser);
      if (price) {
        prices[`${site}_us`] = price;
      }
    } catch (error) {
      console.error(`❌ Failed to scrape ${site}:`, error.message);
    }
  }
  
  return prices;
}

async function scrapeSite(site, productName, browser) {
  let page = null;
  
  try {
    page = await browser.newPage();
    
    // Set realistic user agent and viewport
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36');
    await page.setViewport({ width: 1280, height: 800 });
    
    // Set extra headers to avoid detection
    await page.setExtraHTTPHeaders({
      'Accept-Language': 'en-US,en;q=0.9',
      'Accept-Encoding': 'gzip, deflate, br',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache'
    });
    
    // Navigate to search page with retry logic
    const searchUrl = getSearchUrl(site, productName);
    console.log(`🌐 Navigating to: ${searchUrl}`);
    
    let retryCount = 0;
    const maxRetries = 3;
    
    while (retryCount < maxRetries) {
      try {
        await page.goto(searchUrl, { 
          waitUntil: 'networkidle2', 
          timeout: 30000 
        });
        break;
      } catch (error) {
        retryCount++;
        console.log(`⚠️ Retry ${retryCount}/${maxRetries} for ${site}: ${error.message}`);
        if (retryCount >= maxRetries) {
          throw error;
        }
        await page.waitForTimeout(2000);
      }
    }
    
    // Wait for content to load
    await page.waitForTimeout(3000);
    
    // Extract price using selectors
    const price = await extractPrice(page, site);
    
    return price;
    
  } catch (error) {
    console.error(`❌ Error scraping ${site}:`, error.message);
    return null;
  } finally {
    if (page) {
      await page.close();
    }
  }
}

function getSearchUrl(site, productName) {
  const encodedProduct = encodeURIComponent(productName);
  
  if (site.includes('amazon.com')) {
    return `https://www.amazon.com/s?k=${encodedProduct}`;
  } else if (site.includes('bestbuy.com')) {
    return `https://www.bestbuy.com/site/searchpage.jsp?st=${encodedProduct}`;
  } else if (site.includes('oliveyoung.co.kr')) {
    return `https://www.oliveyoung.co.kr/store/search/getSearchMain.do?query=${encodedProduct}`;
  } else if (site.includes('lotte.com')) {
    return `https://www.lotte.com/search/search.do?search=${encodedProduct}`;
  } else if (site.includes('coupang.com')) {
    return `https://www.coupang.com/np/search?q=${encodedProduct}`;
  } else {
    return `${site}/search?q=${encodedProduct}`;
  }
}

async function extractPrice(page, site) {
  try {
    const selectors = getPriceSelectors(site);
    
    for (const selector of selectors) {
      try {
        const element = await page.$(selector);
        if (element) {
          const text = await page.evaluate(el => el.textContent, element);
          const price = parsePrice(text);
          if (price) {
            console.log(`💰 Found price on ${site}: ${price}`);
            return price;
          }
        }
      } catch (error) {
        continue;
      }
    }
    
    // Debug: log page content if no price found
    console.log(`🔍 No price found on ${site}, checking page content...`);
    const pageContent = await page.content();
    console.log(`📄 Page content length: ${pageContent.length} characters`);
    
    return null;
    
  } catch (error) {
    console.error(`❌ Error extracting price from ${site}:`, error.message);
    return null;
  }
}

function getPriceSelectors(site) {
  if (site.includes('amazon.com')) {
    return [
      '.a-price-whole',
      '.a-price .a-offscreen',
      '[data-a-color="price"] .a-offscreen',
      '.a-price-range .a-offscreen'
    ];
  } else if (site.includes('bestbuy.com')) {
    return [
      '.priceView-customer-price span',
      '.priceView-layout-large .priceView-price',
      '.priceView-hero-price'
    ];
  } else if (site.includes('oliveyoung.co.kr')) {
    return [
      '.price',
      '.prd_price',
      '.price_info',
      '.price-value'
    ];
  } else if (site.includes('coupang.com')) {
    return [
      '.price-value',
      '.price',
      '.price-info',
      '.product-price'
    ];
  } else {
    return [
      '.price',
      '[class*="price"]',
      '[class*="Price"]',
      '.product-price'
    ];
  }
}

function parsePrice(text) {
  if (!text) return null;
  
  // Extract numbers and currency symbols
  const priceMatch = text.match(/[\$₩]?[\d,]+\.?\d*/);
  if (priceMatch) {
    const price = priceMatch[0].replace(/[^\d.]/g, '');
    const numPrice = parseFloat(price);
    return isNaN(numPrice) ? null : numPrice;
  }
  
  return null;
}

module.exports = { scrapePrices }; 