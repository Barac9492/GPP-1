const BaseCrawler = require('./base-crawler');
const cheerio = require('cheerio');
const winston = require('winston');

class AmazonCrawler extends BaseCrawler {
  constructor(options = {}) {
    super({
      ...options,
      delay: 2000, // Amazon is more sensitive to rate limiting
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    });
    
    this.regions = {
      'US': 'amazon.com',
      'UK': 'amazon.co.uk',
      'DE': 'amazon.de',
      'JP': 'amazon.co.jp',
      'CA': 'amazon.ca'
    };
  }

  async extractProductData(html, region = 'US') {
    const $ = cheerio.load(html);
    const products = [];

    // Amazon product selectors (these may need updates as Amazon changes their structure)
    $('[data-component-type="s-search-result"]').each((index, element) => {
      try {
        const $el = $(element);
        
        // Extract product information
        const title = $el.find('h2 a span').text().trim();
        const priceElement = $el.find('.a-price-whole');
        const price = priceElement.length ? parseFloat(priceElement.text().replace(/[^\d.]/g, '')) : null;
        
        const originalPriceElement = $el.find('.a-price.a-text-price .a-offscreen');
        const originalPrice = originalPriceElement.length ? 
          parseFloat(originalPriceElement.text().replace(/[^\d.]/g, '')) : null;
        
        const rating = $el.find('.a-icon-alt').text().match(/(\d+\.?\d*)/);
        const ratingValue = rating ? parseFloat(rating[1]) : null;
        
        const reviewCount = $el.find('.a-size-base').text().match(/(\d+)/);
        const reviewCountValue = reviewCount ? parseInt(reviewCount[1]) : null;
        
        const imageUrl = $el.find('img.s-image').attr('src');
        const productUrl = $el.find('h2 a').attr('href');
        
        if (title && price) {
          products.push({
            title,
            price,
            originalPrice,
            currency: this.getCurrency(region),
            region,
            retailer: 'Amazon',
            rating: ratingValue,
            reviewCount: reviewCountValue,
            imageUrl,
            productUrl: productUrl ? `https://${this.regions[region]}${productUrl}` : null,
            timestamp: new Date().toISOString()
          });
        }
      } catch (error) {
        this.logger.error(`Error extracting product data: ${error.message}`);
      }
    });

    return products;
  }

  getCurrency(region) {
    const currencies = {
      'US': 'USD',
      'UK': 'GBP',
      'DE': 'EUR',
      'JP': 'JPY',
      'CA': 'CAD'
    };
    return currencies[region] || 'USD';
  }

  async searchProducts(query, region = 'US', maxPages = 3) {
    const products = [];
    const domain = this.regions[region];
    
    for (let page = 1; page <= maxPages; page++) {
      try {
        const searchUrl = `https://${domain}/s?k=${encodeURIComponent(query)}&page=${page}`;
        this.logger.info(`Searching Amazon ${region} for "${query}" page ${page}`);
        
        const response = await this.crawl(searchUrl);
        const pageProducts = await this.extractProductData(response.data, region);
        
        products.push(...pageProducts);
        
        // If no products found, stop pagination
        if (pageProducts.length === 0) {
          this.logger.info(`No more products found on page ${page}`);
          break;
        }
        
        this.logger.info(`Found ${pageProducts.length} products on page ${page}`);
        
      } catch (error) {
        this.logger.error(`Error searching Amazon ${region}: ${error.message}`);
        break;
      }
    }
    
    return products;
  }

  async getProductDetails(productUrl) {
    try {
      this.logger.info(`Getting product details from ${productUrl}`);
      
      const response = await this.crawl(productUrl);
      const $ = cheerio.load(response.data);
      
      // Extract detailed product information
      const title = $('#productTitle').text().trim();
      const priceElement = $('#priceblock_ourprice, #priceblock_dealprice, .a-price .a-offscreen');
      const price = priceElement.length ? 
        parseFloat(priceElement.first().text().replace(/[^\d.]/g, '')) : null;
      
      const originalPriceElement = $('.a-price.a-text-price .a-offscreen');
      const originalPrice = originalPriceElement.length ? 
        parseFloat(originalPriceElement.text().replace(/[^\d.]/g, '')) : null;
      
      const rating = $('.a-icon-alt').text().match(/(\d+\.?\d*)/);
      const ratingValue = rating ? parseFloat(rating[1]) : null;
      
      const reviewCount = $('[data-csa-c-type="review"]').text().match(/(\d+)/);
      const reviewCountValue = reviewCount ? parseInt(reviewCount[1]) : null;
      
      const availability = $('#availability').text().trim();
      const description = $('#productDescription p').text().trim();
      
      return {
        title,
        price,
        originalPrice,
        rating: ratingValue,
        reviewCount: reviewCountValue,
        availability,
        description,
        url: productUrl,
        timestamp: new Date().toISOString()
      };
      
    } catch (error) {
      this.logger.error(`Error getting product details: ${error.message}`);
      return null;
    }
  }

  async monitorPriceChanges(productUrl, region = 'US') {
    try {
      const productDetails = await this.getProductDetails(productUrl);
      
      if (productDetails && productDetails.price) {
        // Store price history in database
        // This would integrate with your database
        this.logger.info(`Price for ${productDetails.title}: ${productDetails.price} ${this.getCurrency(region)}`);
        
        return {
          currentPrice: productDetails.price,
          originalPrice: productDetails.originalPrice,
          savings: productDetails.originalPrice ? 
            ((productDetails.originalPrice - productDetails.price) / productDetails.originalPrice) * 100 : 0,
          lastChecked: new Date().toISOString()
        };
      }
      
      return null;
    } catch (error) {
      this.logger.error(`Error monitoring price changes: ${error.message}`);
      return null;
    }
  }
}

module.exports = AmazonCrawler; 