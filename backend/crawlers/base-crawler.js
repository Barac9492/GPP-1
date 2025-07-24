const axios = require('axios');
const UserAgent = require('user-agents');
const winston = require('winston');
const Redis = require('redis');

class BaseCrawler {
  constructor(options = {}) {
    this.delay = options.delay || 1000; // 1 second between requests
    this.maxRetries = options.maxRetries || 3;
    this.timeout = options.timeout || 30000; // 30 seconds
    this.userAgent = options.userAgent || new UserAgent().toString();
    
    // Initialize Redis for rate limiting
    this.redis = Redis.createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379'
    });
    
    // Setup logging
    this.logger = winston.createLogger({
      level: process.env.LOG_LEVEL || 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
      transports: [
        new winston.transports.File({ filename: 'logs/crawler.log' }),
        new winston.transports.Console()
      ]
    });
  }

  async delayRequest() {
    return new Promise(resolve => setTimeout(resolve, this.delay));
  }

  async checkRateLimit(url) {
    try {
      if (!this.redis || !this.redis.isOpen) {
        // If Redis is not available, skip rate limiting
        return true;
      }
      
      const key = `rate_limit:${url}`;
      const count = await this.redis.incr(key);
      
      if (count === 1) {
        await this.redis.expire(key, 60); // 1 minute window
      }
      
      return count <= this.maxRequestsPerMinute;
    } catch (error) {
      // If Redis fails, allow the request to proceed
      logger.warn(`Rate limiting disabled due to Redis error: ${error.message}`);
      return true;
    }
  }

  async makeRequest(url, options = {}) {
    const rateLimitKey = `rate_limit:${new URL(url).hostname}`;
    const canProceed = await this.checkRateLimit(rateLimitKey, 60, 60); // 60 requests per minute
    
    if (!canProceed) {
      this.logger.warn(`Rate limit exceeded for ${url}`);
      throw new Error('Rate limit exceeded');
    }

    const config = {
      url,
      timeout: this.timeout,
      headers: {
        'User-Agent': this.userAgent,
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        ...options.headers
      },
      ...options
    };

    let lastError;
    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        this.logger.info(`Making request to ${url} (attempt ${attempt})`);
        const response = await axios(config);
        
        // Check if response is valid
        if (response.status === 200 && response.data) {
          this.logger.info(`Successfully fetched ${url}`);
          return response;
        } else {
          throw new Error(`Invalid response: ${response.status}`);
        }
      } catch (error) {
        lastError = error;
        this.logger.error(`Request failed for ${url}: ${error.message}`);
        
        if (attempt < this.maxRetries) {
          const backoffDelay = Math.pow(2, attempt) * 1000; // Exponential backoff
          this.logger.info(`Retrying in ${backoffDelay}ms...`);
          await new Promise(resolve => setTimeout(resolve, backoffDelay));
        }
      }
    }
    
    throw lastError;
  }

  async checkRobotsTxt(domain) {
    try {
      const robotsUrl = `https://${domain}/robots.txt`;
      const response = await this.makeRequest(robotsUrl);
      const robotsContent = response.data;
      
      // Simple robots.txt parser
      const lines = robotsContent.split('\n');
      const userAgent = this.userAgent.split('/')[0];
      
      for (const line of lines) {
        if (line.toLowerCase().includes('user-agent:') && 
            (line.toLowerCase().includes('*') || line.toLowerCase().includes(userAgent.toLowerCase()))) {
          // Check next lines for Disallow rules
          const disallowRules = [];
          let i = lines.indexOf(line) + 1;
          while (i < lines.length && !lines[i].toLowerCase().includes('user-agent:')) {
            if (lines[i].toLowerCase().includes('disallow:')) {
              disallowRules.push(lines[i].split(':')[1].trim());
            }
            i++;
          }
          return disallowRules;
        }
      }
      return [];
    } catch (error) {
      this.logger.warn(`Could not fetch robots.txt for ${domain}: ${error.message}`);
      return [];
    }
  }

  async isAllowed(url) {
    const domain = new URL(url).hostname;
    const disallowRules = await this.checkRobotsTxt(domain);
    
    for (const rule of disallowRules) {
      if (url.includes(rule)) {
        this.logger.warn(`URL ${url} is disallowed by robots.txt`);
        return false;
      }
    }
    return true;
  }

  async crawl(url, options = {}) {
    // Check robots.txt first
    if (!(await this.isAllowed(url))) {
      throw new Error('URL not allowed by robots.txt');
    }

    // Make the request
    const response = await this.makeRequest(url, options);
    
    // Add delay between requests
    await this.delayRequest();
    
    return response;
  }

  async close() {
    await this.redis.quit();
  }
}

module.exports = BaseCrawler; 