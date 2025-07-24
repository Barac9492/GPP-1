const BaseCrawler = require('./base-crawler');
const { loggers } = require('../utils/logger');
const { validateInput, validationSchemas } = require('../utils/validation');
const { CircuitBreaker, GracefulDegradation } = require('../utils/resilience');
const config = require('../config/crawler-config');
const realSiteConfig = require('../config/real-site-selectors');

const logger = loggers.crawler;

class KoreaUSPriceCrawler extends BaseCrawler {
  constructor(options = {}) {
    super({
      ...options,
      delay: config.crawler.delay,
      maxRetries: config.crawler.maxRetries,
      timeout: config.crawler.timeout,
      userAgent: config.crawler.userAgent
    });
    
    this.circuitBreaker = new CircuitBreaker(5, 60000);
    this.graceful = new GracefulDegradation();
    
    // Use real site configuration
    this.koreanSites = realSiteConfig.koreanSites;
    this.usSites = realSiteConfig.usSites;
    this.trackedItems = config.products;
    
    // Exchange rate cache
    this.exchangeRate = config.exchangeRate.fallbackRate;
    this.lastExchangeRateUpdate = 0;
    
    // Initialize Redis connection
    this.initializeRedis();
  }

  // Initialize Redis connection
  async initializeRedis() {
    try {
      if (this.redis) {
        await this.redis.connect();
        logger.info('Redis connected successfully');
      }
    } catch (error) {
      logger.warn('Redis connection failed, continuing without Redis:', error.message);
      this.redis = null;
    }
  }

  // Main method to monitor Korea-US price disparities
  async monitorKoreaUSPrices() {
    logger.info('Starting Korea-US price disparity monitoring');
    
    const disparities = [];
    
    // Sort items by priority
    const sortedItems = this.trackedItems.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
    
    for (const item of sortedItems) {
      try {
        logger.info(`Analyzing disparity for ${item.name} (${item.category})`);
        const disparity = await this.analyzeItemDisparity(item);
        if (disparity) {
          disparities.push(disparity);
          await this.storeDisparity(disparity);
        }
        
        // Add delay between items to be respectful
        await this.delay(this.delay);
        
      } catch (error) {
        logger.error(`Error analyzing disparity for ${item.name}:`, error);
      }
    }
    
    logger.info(`Completed monitoring. Found ${disparities.length} disparities`);
    return disparities;
  }

  // Analyze price disparity for a specific item
  async analyzeItemDisparity(item) {
    logger.info(`Analyzing disparity for ${item.name}`);
    
    try {
      // Get Korean prices
      const krPrices = await this.getKoreanPrices(item);
      
      // Get US prices
      const usPrices = await this.getUSPrices(item);
      
      if (krPrices.length === 0 || usPrices.length === 0) {
        logger.warn(`Insufficient price data for ${item.name}`);
        return null;
      }
      
      // Calculate average prices
      const avgKRPrice = this.calculateAveragePrice(krPrices);
      const avgUSPrice = this.calculateAveragePrice(usPrices);
      
      // Calculate disparity
      const disparity = this.calculateDisparity(avgKRPrice, avgUSPrice, item);
      
      // Get best prices
      const bestKRPrice = Math.min(...krPrices.map(p => p.price));
      const bestUSPrice = Math.min(...usPrices.map(p => p.price));
      
      return {
        itemName: item.name,
        category: item.category,
        krPrice: avgKRPrice,
        usPrice: avgUSPrice,
        bestKRPrice: bestKRPrice,
        bestUSPrice: bestUSPrice,
        krSite: krPrices[0]?.site || 'Unknown',
        usSite: usPrices[0]?.site || 'Unknown',
        disparity: disparity.disparity,
        cheaperIn: disparity.cheaperIn,
        potentialSavings: disparity.potentialSavings,
        exchangeRate: this.exchangeRate,
        timestamp: new Date().toISOString(),
        confidence: this.calculateConfidence(krPrices.length, usPrices.length)
      };
      
    } catch (error) {
      logger.error(`Error analyzing disparity for ${item.name}:`, error);
      return null;
    }
  }

  // Get Korean prices for an item
  async getKoreanPrices(item) {
    const prices = [];
    
    for (const [siteName, siteConfig] of Object.entries(this.koreanSites)) {
      if (!siteConfig.enabled) continue;
      
      try {
        const sitePrices = await this.scrapeKoreanSite(siteName, siteConfig, item);
        prices.push(...sitePrices);
      } catch (error) {
        logger.error(`Error scraping ${siteName}:`, error);
      }
    }
    
    return prices;
  }

  // Get US prices for an item
  async getUSPrices(item) {
    const prices = [];
    
    for (const [siteName, siteConfig] of Object.entries(this.usSites)) {
      if (!siteConfig.enabled) continue;
      
      try {
        const sitePrices = await this.scrapeUSSite(siteName, siteConfig, item);
        prices.push(...sitePrices);
      } catch (error) {
        logger.error(`Error scraping ${siteName}:`, error);
      }
    }
    
    return prices;
  }

  // Scrape Korean e-commerce site with improved error handling
  async scrapeKoreanSite(siteName, siteConfig, item) {
    const prices = [];
    
    for (const keyword of item.krKeywords) {
      try {
        const url = `${siteConfig.url}${siteConfig.searchPath}?q=${encodeURIComponent(keyword)}`;
        
        // Check rate limit
        if (!(await this.checkRateLimit(url))) {
          logger.warn(`Rate limit exceeded for ${siteName}`);
          continue;
        }
        
        // Add site-specific delay
        if (siteConfig.delay) {
          await this.delay(siteConfig.delay);
        }
        
        const response = await this.makeRequest(url);
        const extractedPrices = this.extractKoreanPrice(response.data, siteName, siteConfig);
        
        if (extractedPrices.length > 0) {
          prices.push(...extractedPrices.map(price => ({
            ...price,
            keyword: keyword
          })));
        }
        
      } catch (error) {
        logger.error(`Error scraping ${siteName} for ${keyword}:`, error.message);
      }
    }
    
    return prices;
  }

  // Scrape US e-commerce site with improved error handling
  async scrapeUSSite(siteName, siteConfig, item) {
    const prices = [];
    
    for (const keyword of item.usKeywords) {
      try {
        const url = `${siteConfig.url}${siteConfig.searchPath}?q=${encodeURIComponent(keyword)}`;
        
        // Check rate limit
        if (!(await this.checkRateLimit(url))) {
          logger.warn(`Rate limit exceeded for ${siteName}`);
          continue;
        }
        
        // Add site-specific delay
        if (siteConfig.delay) {
          await this.delay(siteConfig.delay);
        }
        
        const response = await this.makeRequest(url);
        const extractedPrices = this.extractUSPrice(response.data, siteName, siteConfig);
        
        if (extractedPrices.length > 0) {
          prices.push(...extractedPrices.map(price => ({
            ...price,
            keyword: keyword
          })));
        }
        
      } catch (error) {
        logger.error(`Error scraping ${siteName} for ${keyword}:`, error.message);
      }
    }
    
    return prices;
  }

  // Add delay method
  async delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Extract Korean prices from HTML with multiple selectors
  extractKoreanPrice(html, siteName, siteConfig) {
    const prices = [];
    const $ = require('cheerio').load(html);
    
    try {
      // Try multiple price selectors
      for (const priceSelector of siteConfig.priceSelectors) {
        $(priceSelector).each((i, element) => {
          const priceText = $(element).text().trim();
          const price = this.parseKoreanPrice(priceText);
          
          if (price && price > 0 && price >= realSiteConfig.validation.minPrice && price <= realSiteConfig.validation.maxPrice) {
            // Find corresponding title
            let title = '';
            for (const titleSelector of siteConfig.titleSelectors) {
              const titleElement = $(element).closest('div').find(titleSelector);
              if (titleElement.length > 0) {
                title = titleElement.text().trim();
                break;
              }
            }
            
            if (title) {
              prices.push({
                price: price,
                title: title,
                currency: 'KRW',
                site: siteName
              });
            }
          }
        });
        
        // If we found prices, break
        if (prices.length > 0) break;
      }
    } catch (error) {
      logger.error(`Error extracting prices from ${siteName}:`, error);
    }
    
    return prices;
  }

  // Extract US prices from HTML with multiple selectors
  extractUSPrice(html, siteName, siteConfig) {
    const prices = [];
    const $ = require('cheerio').load(html);
    
    try {
      // Try multiple price selectors
      for (const priceSelector of siteConfig.priceSelectors) {
        $(priceSelector).each((i, element) => {
          const priceText = $(element).text().trim();
          const price = this.parseUSPrice(priceText);
          
          if (price && price > 0) {
            // Find corresponding title
            let title = '';
            for (const titleSelector of siteConfig.titleSelectors) {
              const titleElement = $(element).closest('div').find(titleSelector);
              if (titleElement.length > 0) {
                title = titleElement.text().trim();
                break;
              }
            }
            
            if (title) {
              prices.push({
                price: price,
                title: title,
                currency: 'USD',
                site: siteName
              });
            }
          }
        });
        
        // If we found prices, break
        if (prices.length > 0) break;
      }
    } catch (error) {
      logger.error(`Error extracting prices from ${siteName}:`, error);
    }
    
    return prices;
  }

  // Parse Korean price from text
  parseKoreanPrice(priceText) {
    // Remove currency symbols and commas
    const cleanText = priceText.replace(/[₩,]/g, '').trim();
    const match = cleanText.match(/(\d+(?:,\d+)*)/);
    
    if (match) {
      return parseInt(match[1].replace(/,/g, ''));
    }
    
    return null;
  }

  // Parse US price from text
  parseUSPrice(priceText) {
    // Remove currency symbols and commas
    const cleanText = priceText.replace(/[$,]/g, '').trim();
    const match = cleanText.match(/(\d+(?:\.\d+)?)/);
    
    if (match) {
      return parseFloat(match[1]);
    }
    
    return null;
  }

  // Calculate average price from array of prices
  calculateAveragePrice(prices) {
    if (prices.length === 0) return 0;
    
    const validPrices = prices.filter(p => p.price > 0);
    if (validPrices.length === 0) return 0;
    
    const sum = validPrices.reduce((acc, p) => acc + p.price, 0);
    return sum / validPrices.length;
  }

  // Calculate disparity between Korean and US prices
  calculateDisparity(krPrice, usPrice, item) {
    if (krPrice === 0 || usPrice === 0) {
      return {
        disparity: 0,
        cheaperIn: 'unknown',
        potentialSavings: 0
      };
    }
    
    // Convert KRW to USD for comparison
    const krPriceUSD = krPrice / this.exchangeRate;
    const disparity = ((usPrice - krPriceUSD) / usPrice) * 100;
    
    let cheaperIn = 'US';
    let potentialSavings = 0;
    
    if (krPriceUSD < usPrice) {
      cheaperIn = 'Korea';
      potentialSavings = usPrice - krPriceUSD;
    } else {
      potentialSavings = krPriceUSD - usPrice;
    }
    
    return {
      disparity: Math.abs(disparity),
      cheaperIn: cheaperIn,
      potentialSavings: potentialSavings
    };
  }

  // Calculate confidence score based on data quality
  calculateConfidence(krCount, usCount) {
    const totalSites = Object.keys(this.koreanSites).length + Object.keys(this.usSites).length;
    const totalFound = krCount + usCount;
    
    return Math.min(100, (totalFound / totalSites) * 100);
  }

  // Store disparity data
  async storeDisparity(disparity) {
    try {
      if (!this.redis || !this.redis.isOpen) return;
      
      const key = `disparity:${disparity.itemName}:${new Date().toISOString().split('T')[0]}`;
      await this.redis.setEx(key, 86400, JSON.stringify(disparity)); // 24 hours
      
      logger.info(`Stored disparity for ${disparity.itemName}`);
    } catch (error) {
      logger.error('Error storing disparity:', error);
    }
  }

  // Get current exchange rate
  async getExchangeRate() {
    try {
      const now = Date.now();
      
      // Update exchange rate if needed
      if (now - this.lastExchangeRateUpdate > config.exchangeRate.updateInterval) {
        // In a real implementation, you'd fetch from an API
        // For now, we'll use a static rate
        this.exchangeRate = config.exchangeRate.fallbackRate;
        this.lastExchangeRateUpdate = now;
      }
      
      return this.exchangeRate;
    } catch (error) {
      logger.error('Error getting exchange rate:', error);
      return config.exchangeRate.fallbackRate;
    }
  }

  // Generate comprehensive disparity report
  async generateDisparityReport() {
    try {
      const report = {
        timestamp: new Date().toISOString(),
        summary: {
          totalItems: this.trackedItems.length,
          itemsWithDisparities: 0,
          averageDisparity: 0,
          totalPotentialSavings: 0
        },
        disparities: [],
        recommendations: []
      };
      
      // Get stored disparities
      if (this.redis) {
        const keys = await this.redis.keys('disparity:*');
        for (const key of keys) {
          const data = await this.redis.get(key);
          if (data) {
            const disparity = JSON.parse(data);
            report.disparities.push(disparity);
          }
        }
      }
      
      // Calculate summary
      if (report.disparities.length > 0) {
        report.summary.itemsWithDisparities = report.disparities.length;
        report.summary.averageDisparity = report.disparities.reduce((acc, d) => acc + d.disparity, 0) / report.disparities.length;
        report.summary.totalPotentialSavings = report.disparities.reduce((acc, d) => acc + d.potentialSavings, 0);
      }
      
      // Generate recommendations
      report.recommendations = this.generateRecommendations(report.disparities);
      
      return report;
    } catch (error) {
      logger.error('Error generating report:', error);
      return null;
    }
  }

  // Generate recommendations based on disparities
  generateRecommendations(disparities) {
    const recommendations = [];
    
    if (disparities.length === 0) return recommendations;
    
    // Sort by potential savings
    const sortedDisparities = disparities.sort((a, b) => b.potentialSavings - a.potentialSavings);
    
    // Top savings opportunity
    const topSaving = sortedDisparities[0];
    if (topSaving.potentialSavings > 50) {
      recommendations.push({
        title: `Save $${topSaving.potentialSavings.toFixed(2)} on ${topSaving.itemName}`,
        description: `Buy ${topSaving.itemName} from ${topSaving.cheaperIn === 'Korea' ? 'Korea' : 'US'} instead of ${topSaving.cheaperIn === 'Korea' ? 'US' : 'Korea'}`,
        estimatedSavings: topSaving.potentialSavings,
        category: topSaving.category,
        priority: 'high'
      });
    }
    
    // Category-based recommendations
    const categorySavings = {};
    disparities.forEach(d => {
      if (!categorySavings[d.category]) {
        categorySavings[d.category] = 0;
      }
      categorySavings[d.category] += d.potentialSavings;
    });
    
    const bestCategory = Object.entries(categorySavings)
      .sort(([,a], [,b]) => b - a)[0];
    
    if (bestCategory && bestCategory[1] > 100) {
      recommendations.push({
        title: `${bestCategory[0]} offers the best savings`,
        description: `Focus on ${bestCategory[0]} products for maximum savings`,
        estimatedSavings: bestCategory[1],
        category: bestCategory[0],
        priority: 'medium'
      });
    }
    
    return recommendations;
  }

  // Handle user submissions for price updates
  async handleUserSubmission(submission) {
    try {
      // Validate submission
      const validatedSubmission = validateInput(submission, {
        category: { type: 'string', required: true },
        name: { type: 'string', required: true },
        krPrice: { type: 'number', required: true },
        usPrice: { type: 'number', required: true },
        source: { type: 'string', required: true },
        userId: { type: 'string', required: true }
      });
      
      // Calculate disparity
      const disparity = this.calculateDisparity(
        validatedSubmission.krPrice,
        validatedSubmission.usPrice,
        { shippingKR: 0, shippingUS: 0 }
      );
      
      // Store user submission
      const userDisparity = {
        ...validatedSubmission,
        name: validatedSubmission.name, // Ensure name is included
        disparity: disparity.disparity,
        cheaperIn: disparity.cheaperIn,
        userSubmitted: true,
        submissionDate: new Date().toISOString(),
        verificationStatus: 'pending'
      };
      
      // Calculate points
      const points = this.calculatePoints(disparity);
      
      logger.info(`User submission processed: ${validatedSubmission.name}, Points: ${points}`);
      
      return {
        success: true,
        disparity: disparity,
        pointsAwarded: points,
        message: 'Submission received successfully'
      };
      
    } catch (error) {
      logger.error('Error processing user submission:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Calculate points for user submission
  calculatePoints(disparity) {
    let points = 15; // Base points
    
    // Bonus for high disparity
    if (disparity.disparity > 50) {
      points += 30;
    } else if (disparity.disparity > 20) {
      points += 10;
    }
    
    // Bonus for new category (simplified)
    points += 5; // Source bonus
    
    return points;
  }

  // Close crawler and cleanup
  async close() {
    try {
      if (this.redis && this.redis.isOpen) {
        await this.redis.quit();
      }
      logger.info('Crawler closed successfully');
    } catch (error) {
      logger.error('Error closing crawler:', error);
    }
  }
}

module.exports = KoreaUSPriceCrawler; 