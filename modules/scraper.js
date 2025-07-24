const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

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
    const category = detectCategory(productName);
    
    // Scrape Korean sites for cosmetics
    if (category === 'cosmetic' || category === 'skincare') {
      console.log('🇰🇷 Scraping Korean cosmetic sites...');
      const koreaPrices = await scrapeKoreaSites(productName, browser);
      Object.assign(priceData, koreaPrices);
    }
    
    // Scrape US sites for IT products
    if (category === 'electronics' || category === 'it') {
      console.log('🇺🇸 Scraping US IT sites...');
      const usPrices = await scrapeUSSites(productName, browser);
      Object.assign(priceData, usPrices);
    }
    
    // If no specific category detected, try both
    if (category === 'unknown') {
      console.log('🌍 Scraping both Korean and US sites...');
      const koreaPrices = await scrapeKoreaSites(productName, browser);
      const usPrices = await scrapeUSSites(productName, browser);
      Object.assign(priceData, koreaPrices, usPrices);
    }
    
    return priceData;
    
  } catch (error) {
    console.error(`❌ Error scraping prices for ${productName}:`, error);
    return {};
  }
}

function detectCategory(productName) {
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

async function scrapeKoreaSites(productName, browser) {
  const prices = {};
  
  for (const site of SITES.korea) {
    try {
      const result = await scrapeSite(site, productName, browser);
      if (result.price) {
        prices[`${site}_korea`] = {
          price: result.price,
          category: result.category || 'unknown',
          title: result.title || productName
        };
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
      const result = await scrapeSite(site, productName, browser);
      if (result.price) {
        prices[`${site}_us`] = {
          price: result.price,
          category: result.category || 'unknown',
          title: result.title || productName
        };
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
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36');
    await page.setViewport({ width: 1280, height: 800 });
    page.setDefaultNavigationTimeout(60000);
    await page.setExtraHTTPHeaders({
      'Accept-Language': 'en-US,en;q=0.9',
      'Accept-Encoding': 'gzip, deflate, br',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache'
    });
    
    // Random delay and mouse movement to mimic human
    await page.waitForTimeout(Math.random() * 2000 + 1000);
    await page.mouse.move(Math.random() * 500, Math.random() * 500);
    
    // Navigate to search page with retry logic
    const searchUrl = getSearchUrl(site, productName);
    console.log(`🌐 Navigating to: ${searchUrl}`);
    
    let retryCount = 0;
    const maxRetries = 3;
    
    while (retryCount < maxRetries) {
      try {
        await page.goto(searchUrl, { 
          waitUntil: 'networkidle2', 
          timeout: 60000 
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
    await page.waitForTimeout(Math.random() * 2000 + 1000);
    
    // Enhanced price and category extraction
    const result = await page.evaluate(() => {
      // Price extraction with more selectors
      const priceSelectors = [
        '.a-price .a-offscreen', // Amazon
        '.priceView-hero-price span', // BestBuy
        '.prod-sale-price .total-price strong', // Coupang
        '.price', '.prd_price', '.price_info', '.price-value', // General
        '.sale-price', '.current-price', '.product-price', // More general
        '[data-price]', '[class*="price"]', // Attribute-based
      ];
      
      let price = null;
      for (const sel of priceSelectors) {
        const el = document.querySelector(sel);
        if (el && el.innerText.match(/[$₩]\d+/)) {
          price = el.innerText.trim();
          break;
        }
      }
      
      // Fallback: 모든 엘리먼트에서 $/₩ 포함 텍스트 탐색
      if (!price) {
        const priceElems = Array.from(document.querySelectorAll('*')).filter(el => 
          el.textContent?.match(/[$₩]\d+/) && el.textContent.length < 50
        );
        price = priceElems[0]?.textContent?.trim() || null;
      }
      
      // Category extraction
      const categorySelectors = [
        '.breadcrumb', '.breadcrumbs', '.category-path',
        '[data-category]', '.product-category', '.category-name',
        'nav[aria-label*="breadcrumb"]', '.breadcrumb-item'
      ];
      
      let category = null;
      for (const sel of categorySelectors) {
        const el = document.querySelector(sel);
        if (el && el.innerText.trim()) {
          category = el.innerText.trim();
          break;
        }
      }
      
      // Product title extraction
      const titleSelectors = [
        'h1', '.product-title', '.product-name', '[data-product-name]',
        '.title', '.product-heading', '.item-title'
      ];
      
      let title = null;
      for (const sel of titleSelectors) {
        const el = document.querySelector(sel);
        if (el && el.innerText.trim()) {
          title = el.innerText.trim();
          break;
        }
      }
      
      return { price, category, title };
    });
    
    if (result.price) {
      console.log(`Found price: ${result.price}`);
      if (result.category) console.log(`Found category: ${result.category}`);
      if (result.title) console.log(`Found title: ${result.title}`);
    }
    
    return result;
    
  } catch (error) {
    console.error(`❌ Error scraping ${site}:`, error.message);
    return { price: null, category: null, title: null };
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

module.exports = { scrapePrices }; 