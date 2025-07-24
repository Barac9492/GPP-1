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
    
    // Improved price extraction logic
    const price = await page.evaluate(() => {
      const selectors = [
        '.a-price .a-offscreen', // Amazon
        '.priceView-hero-price span', // BestBuy
        '.prod-sale-price .total-price strong', // Coupang
        '.price', '.prd_price', '.price_info', '.price-value', // Olive Young, Lotte
      ];
      for (const sel of selectors) {
        const el = document.querySelector(sel);
        if (el && el.innerText.match(/[$₩]\d+/)) return el.innerText.trim();
      }
      // Fallback: 모든 엘리먼트에서 $/₩ 포함 텍스트 탐색
      const priceElems = Array.from(document.querySelectorAll('*')).filter(el => el.textContent?.match(/[$₩]\d+/));
      return priceElems[0]?.textContent?.trim() || null;
    });
    if (price) console.log(`Found price: ${price}`);
    
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

module.exports = { scrapePrices }; 