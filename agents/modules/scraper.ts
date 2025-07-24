import { Browser, Page } from 'puppeteer';
import { config } from '../config';

export interface PriceData {
  korea?: {
    price: number;
    currency: string;
    site: string;
    url: string;
    available: boolean;
  };
  us?: {
    price: number;
    currency: string;
    site: string;
    url: string;
    available: boolean;
  };
  scrapedAt: string;
}

export async function scrapePrices(productName: string, browser: Browser): Promise<PriceData> {
  const priceData: PriceData = {
    scrapedAt: new Date().toISOString()
  };

  try {
    // Scrape Korean sites
    const koreaPrice = await scrapeKoreaSites(productName, browser);
    if (koreaPrice) {
      priceData.korea = koreaPrice;
    }

    // Scrape US sites
    const usPrice = await scrapeUSSites(productName, browser);
    if (usPrice) {
      priceData.us = usPrice;
    }

    return priceData;
  } catch (error) {
    console.error(`Error scraping prices for ${productName}:`, error);
    throw error;
  }
}

async function scrapeKoreaSites(productName: string, browser: Browser) {
  const sites = config.sites.korea;
  
  for (const site of sites) {
    try {
      const price = await scrapeSite(productName, site, browser);
      if (price) {
        return {
          ...price,
          site,
          currency: 'KRW'
        };
      }
    } catch (error) {
      console.error(`Failed to scrape ${site} for ${productName}:`, error);
      continue;
    }
  }
  
  return null;
}

async function scrapeUSSites(productName: string, browser: Browser) {
  const sites = config.sites.us;
  
  for (const site of sites) {
    try {
      const price = await scrapeSite(productName, site, browser);
      if (price) {
        return {
          ...price,
          site,
          currency: 'USD'
        };
      }
    } catch (error) {
      console.error(`Failed to scrape ${site} for ${productName}:`, error);
      continue;
    }
  }
  
  return null;
}

async function scrapeSite(productName: string, site: string, browser: Browser) {
  const page = await browser.newPage();
  
  try {
    await page.setViewport({ width: 1280, height: 720 });
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
    
    // Set timeout
    await page.setDefaultTimeout(config.scraping.timeout);
    
    const searchUrl = getSearchUrl(site, productName);
    await page.goto(searchUrl, { waitUntil: 'networkidle2' });
    
    // Wait for price elements to load
    await page.waitForTimeout(2000);
    
    const price = await extractPrice(page, site);
    const url = page.url();
    
    return {
      price,
      url,
      available: price > 0
    };
  } finally {
    await page.close();
  }
}

function getSearchUrl(site: string, productName: string): string {
  const encodedName = encodeURIComponent(productName);
  
  switch (site) {
    case 'amazon.com':
      return `https://www.amazon.com/s?k=${encodedName}`;
    case 'coupang.com':
      return `https://www.coupang.com/np/search?q=${encodedName}`;
    case '11st.co.kr':
      return `https://search.11st.co.kr/Search.tmall?kwd=${encodedName}`;
    case 'gmarket.co.kr':
      return `https://browse.gmarket.co.kr/search?keyword=${encodedName}`;
    case 'bestbuy.com':
      return `https://www.bestbuy.com/site/searchpage.jsp?st=${encodedName}`;
    case 'walmart.com':
      return `https://www.walmart.com/search?q=${encodedName}`;
    case 'target.com':
      return `https://www.target.com/s?searchTerm=${encodedName}`;
    default:
      return `https://www.google.com/search?q=${encodedName}+site:${site}`;
  }
}

async function extractPrice(page: Page, site: string): Promise<number> {
  try {
    const selectors = getPriceSelectors(site);
    
    for (const selector of selectors) {
      try {
        const element = await page.$(selector);
        if (element) {
          const text = await page.evaluate(el => el.textContent, element);
          const price = parsePrice(text);
          if (price > 0) {
            return price;
          }
        }
      } catch (error) {
        continue;
      }
    }
    
    return 0;
  } catch (error) {
    console.error(`Error extracting price from ${site}:`, error);
    return 0;
  }
}

function getPriceSelectors(site: string): string[] {
  switch (site) {
    case 'amazon.com':
      return [
        '.a-price-whole',
        '.a-price .a-offscreen',
        '[data-a-color="price"] .a-price-whole',
        '.a-price-range .a-price-whole'
      ];
    case 'coupang.com':
      return [
        '.price-value',
        '.price',
        '.sale-price',
        '.product-price'
      ];
    case '11st.co.kr':
      return [
        '.price',
        '.sale_price',
        '.product_price'
      ];
    case 'gmarket.co.kr':
      return [
        '.price',
        '.sale_price',
        '.product_price'
      ];
    case 'bestbuy.com':
      return [
        '.priceView-customer-price span',
        '.priceView-layout-large .priceView-customer-price',
        '.priceView-hero-price'
      ];
    case 'walmart.com':
      return [
        '.price-characteristic',
        '.price-main',
        '.price-current'
      ];
    case 'target.com':
      return [
        '[data-test="product-price"]',
        '.price-current',
        '.price'
      ];
    default:
      return [
        '.price',
        '.product-price',
        '.sale-price',
        '[class*="price"]'
      ];
  }
}

function parsePrice(text: string): number {
  if (!text) return 0;
  
  // Remove currency symbols and non-numeric characters except decimal point
  const cleaned = text.replace(/[^\d.,]/g, '');
  
  // Handle different decimal separators
  const normalized = cleaned.replace(',', '.');
  
  const price = parseFloat(normalized);
  return isNaN(price) ? 0 : price;
} 