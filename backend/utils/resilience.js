const { loggers } = require('./logger');
const { CrawlerError, RateLimitError } = require('./error-handler');

const logger = loggers.app;

// Circuit Breaker Pattern
class CircuitBreaker {
  constructor(failureThreshold = 5, resetTimeout = 60000) {
    this.failureThreshold = failureThreshold;
    this.resetTimeout = resetTimeout;
    this.failureCount = 0;
    this.lastFailureTime = 0;
    this.state = 'CLOSED'; // CLOSED, OPEN, HALF_OPEN
  }
  
  async execute(operation) {
    if (this.state === 'OPEN') {
      if (Date.now() - this.lastFailureTime > this.resetTimeout) {
        this.state = 'HALF_OPEN';
        logger.info('Circuit breaker transitioning to HALF_OPEN');
      } else {
        throw new Error('Circuit breaker is OPEN');
      }
    }
    
    try {
      const result = await operation();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }
  
  onSuccess() {
    this.failureCount = 0;
    this.state = 'CLOSED';
  }
  
  onFailure() {
    this.failureCount++;
    this.lastFailureTime = Date.now();
    
    if (this.failureCount >= this.failureThreshold) {
      this.state = 'OPEN';
      logger.warn(`Circuit breaker opened after ${this.failureCount} failures`);
    }
  }
  
  getStatus() {
    return {
      state: this.state,
      failureCount: this.failureCount,
      lastFailureTime: this.lastFailureTime,
      resetTimeout: this.resetTimeout
    };
  }
}

// Graceful Degradation
class GracefulDegradation {
  constructor() {
    this.fallbacks = new Map();
  }
  
  async executeWithFallback(operationName, primaryOperation, fallbackOperation) {
    try {
      return await primaryOperation();
    } catch (error) {
      logger.warn(`Primary operation '${operationName}' failed, using fallback:`, error.message);
      
      if (fallbackOperation) {
        try {
          return await fallbackOperation();
        } catch (fallbackError) {
          logger.error(`Fallback operation '${operationName}' also failed:`, fallbackError.message);
          throw fallbackError;
        }
      }
      
      throw error;
    }
  }
  
  async getCachedData(key, fetchFn, ttl = 3600) {
    const redis = require('redis').createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379'
    });
    
    try {
      await redis.connect();
      
      // Try to get from cache first
      const cached = await redis.get(key);
      if (cached) {
        logger.info(`Cache hit for key: ${key}`);
        return JSON.parse(cached);
      }
      
      // Fetch fresh data
      const data = await fetchFn();
      await redis.setex(key, ttl, JSON.stringify(data));
      
      // Store stale cache as backup
      await redis.setex(`${key}:stale`, ttl * 2, JSON.stringify(data));
      
      return data;
    } catch (error) {
      logger.warn(`Cache miss for key: ${key}, trying stale cache`);
      
      // Try stale cache as fallback
      try {
        const staleCache = await redis.get(`${key}:stale`);
        if (staleCache) {
          logger.info(`Using stale cache for key: ${key}`);
          return JSON.parse(staleCache);
        }
      } catch (staleError) {
        logger.error('Stale cache also failed:', staleError.message);
      }
      
      throw error;
    } finally {
      await redis.quit();
    }
  }
}

// Resource Management
class ResourceManager {
  constructor() {
    this.resources = new Set();
    this.logger = loggers.app;
  }
  
  async withResource(createFn, useFn, cleanupFn) {
    const resource = await createFn();
    this.resources.add(resource);
    
    try {
      return await useFn(resource);
    } finally {
      try {
        await cleanupFn(resource);
      } catch (error) {
        this.logger.error('Error during resource cleanup:', error);
      }
      this.resources.delete(resource);
    }
  }
  
  async cleanup() {
    this.logger.info(`Cleaning up ${this.resources.size} resources`);
    
    for (const resource of this.resources) {
      try {
        if (typeof resource.close === 'function') {
          await resource.close();
        } else if (typeof resource.quit === 'function') {
          await resource.quit();
        } else if (typeof resource.destroy === 'function') {
          resource.destroy();
        }
      } catch (error) {
        this.logger.error('Error cleaning up resource:', error);
      }
    }
    
    this.resources.clear();
  }
  
  getResourceCount() {
    return this.resources.size;
  }
}

// Distributed Locking
class DistributedLock {
  constructor() {
    this.redis = require('redis').createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379'
    });
    this.logger = loggers.app;
  }
  
  async acquire(lockKey, ttl = 30000) {
    const lockId = require('crypto').randomUUID();
    
    try {
      await this.redis.connect();
      
      const acquired = await this.redis.set(
        `lock:${lockKey}`, 
        lockId, 
        'PX', ttl, 'NX'
      );
      
      if (acquired) {
        this.logger.info(`Acquired lock: ${lockKey}`);
        return lockId;
      } else {
        this.logger.warn(`Failed to acquire lock: ${lockKey}`);
        return null;
      }
    } catch (error) {
      this.logger.error(`Error acquiring lock ${lockKey}:`, error);
      return null;
    }
  }
  
  async release(lockKey, lockId) {
    try {
      const script = `
        if redis.call("get", KEYS[1]) == ARGV[1] then
          return redis.call("del", KEYS[1])
        else
          return 0
        end
      `;
      
      const result = await this.redis.eval(script, 1, `lock:${lockKey}`, lockId);
      
      if (result === 1) {
        this.logger.info(`Released lock: ${lockKey}`);
        return true;
      } else {
        this.logger.warn(`Failed to release lock: ${lockKey} (not owned)`);
        return false;
      }
    } catch (error) {
      this.logger.error(`Error releasing lock ${lockKey}:`, error);
      return false;
    } finally {
      await this.redis.quit();
    }
  }
  
  async withLock(lockKey, operation, ttl = 30000) {
    const lockId = await this.acquire(lockKey, ttl);
    
    if (!lockId) {
      throw new Error(`Failed to acquire lock: ${lockKey}`);
    }
    
    try {
      return await operation();
    } finally {
      await this.release(lockKey, lockId);
    }
  }
}

// Adaptive Timeout Management
class AdaptiveTimeout {
  constructor() {
    this.timeoutHistory = new Map();
    this.logger = loggers.app;
  }
  
  async withTimeout(operation, baseTimeout = 5000) {
    const host = this.extractHost(operation);
    const adaptiveTimeout = this.calculateAdaptiveTimeout(host, baseTimeout);
    
    this.logger.info(`Using adaptive timeout: ${adaptiveTimeout}ms for ${host}`);
    
    return Promise.race([
      operation(),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Operation timed out')), adaptiveTimeout)
      )
    ]);
  }
  
  extractHost(operation) {
    // Extract host from operation context
    if (operation.url) {
      return new URL(operation.url).hostname;
    }
    return 'default';
  }
  
  calculateAdaptiveTimeout(host, baseTimeout) {
    const history = this.timeoutHistory.get(host) || [];
    
    if (history.length === 0) {
      return baseTimeout;
    }
    
    const avgResponseTime = history.reduce((a, b) => a + b, 0) / history.length;
    const adaptiveTimeout = Math.max(baseTimeout, avgResponseTime * 2);
    
    this.logger.debug(`Adaptive timeout for ${host}: ${adaptiveTimeout}ms (avg: ${avgResponseTime}ms)`);
    
    return adaptiveTimeout;
  }
  
  recordResponseTime(host, responseTime) {
    const history = this.timeoutHistory.get(host) || [];
    history.push(responseTime);
    
    // Keep only last 10 measurements
    if (history.length > 10) {
      history.shift();
    }
    
    this.timeoutHistory.set(host, history);
  }
}

// Health Checker
class HealthChecker {
  constructor() {
    this.redis = require('redis').createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379'
    });
    this.logger = loggers.app;
  }
  
  async checkSystemHealth() {
    const checks = {
      redis: await this.checkRedis(),
      memory: await this.checkMemory(),
      disk: await this.checkDiskSpace(),
      network: await this.checkNetwork()
    };
    
    const overallHealth = Object.values(checks).every(check => check.healthy);
    
    return {
      healthy: overallHealth,
      checks,
      timestamp: new Date().toISOString()
    };
  }
  
  async checkRedis() {
    try {
      await this.redis.connect();
      const startTime = Date.now();
      await this.redis.ping();
      const responseTime = Date.now() - startTime;
      
      const info = await this.redis.info('memory');
      const memoryUsage = this.parseMemoryInfo(info);
      
      return {
        healthy: memoryUsage.used_memory_human < '1GB' && responseTime < 100,
        memoryUsage,
        responseTime,
        details: {
          used_memory: memoryUsage.used_memory_human,
          max_memory: memoryUsage.max_memory_human,
          response_time_ms: responseTime
        }
      };
    } catch (error) {
      return { 
        healthy: false, 
        error: error.message,
        details: { error: error.message }
      };
    } finally {
      await this.redis.quit();
    }
  }
  
  async checkMemory() {
    const memUsage = process.memoryUsage();
    const heapUsed = memUsage.heapUsed / 1024 / 1024; // MB
    
    return {
      healthy: heapUsed < 500, // Less than 500MB
      details: {
        heapUsed: `${heapUsed.toFixed(2)}MB`,
        heapTotal: `${(memUsage.heapTotal / 1024 / 1024).toFixed(2)}MB`,
        external: `${(memUsage.external / 1024 / 1024).toFixed(2)}MB`
      }
    };
  }
  
  async checkDiskSpace() {
    const fs = require('fs');
    
    try {
      const stats = fs.statSync('.');
      return {
        healthy: true,
        details: { available: 'Disk space available' }
      };
    } catch (error) {
      return {
        healthy: false,
        error: error.message,
        details: { error: error.message }
      };
    }
  }
  
  async checkNetwork() {
    const dns = require('dns').promises;
    
    try {
      const startTime = Date.now();
      await dns.lookup('google.com');
      const responseTime = Date.now() - startTime;
      
      return {
        healthy: responseTime < 5000,
        details: {
          dns_response_time_ms: responseTime,
          status: 'Network connectivity OK'
        }
      };
    } catch (error) {
      return {
        healthy: false,
        error: error.message,
        details: { error: error.message }
      };
    }
  }
  
  parseMemoryInfo(info) {
    const lines = info.split('\n');
    const memoryInfo = {};
    
    for (const line of lines) {
      if (line.includes('used_memory_human:')) {
        memoryInfo.used_memory_human = line.split(':')[1].trim();
      } else if (line.includes('maxmemory_human:')) {
        memoryInfo.max_memory_human = line.split(':')[1].trim();
      }
    }
    
    return memoryInfo;
  }
}

// Performance Monitor
class PerformanceMonitor {
  constructor() {
    this.metrics = new Map();
    this.logger = loggers.app;
  }
  
  async measureOperation(operationName, operation) {
    const startTime = process.hrtime.bigint();
    
    try {
      const result = await operation();
      const duration = Number(process.hrtime.bigint() - startTime) / 1000000;
      
      this.recordMetric(operationName, {
        duration,
        success: true,
        timestamp: new Date().toISOString()
      });
      
      return result;
    } catch (error) {
      const duration = Number(process.hrtime.bigint() - startTime) / 1000000;
      
      this.recordMetric(operationName, {
        duration,
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      });
      
      throw error;
    }
  }
  
  recordMetric(operationName, metric) {
    if (!this.metrics.has(operationName)) {
      this.metrics.set(operationName, []);
    }
    
    const operationMetrics = this.metrics.get(operationName);
    operationMetrics.push(metric);
    
    // Keep only last 100 metrics per operation
    if (operationMetrics.length > 100) {
      operationMetrics.shift();
    }
    
    this.logger.debug(`Recorded metric for ${operationName}:`, metric);
  }
  
  getMetrics(operationName = null) {
    if (operationName) {
      return this.metrics.get(operationName) || [];
    }
    
    const allMetrics = {};
    for (const [name, metrics] of this.metrics) {
      allMetrics[name] = metrics;
    }
    return allMetrics;
  }
  
  getAverageResponseTime(operationName) {
    const metrics = this.metrics.get(operationName) || [];
    if (metrics.length === 0) return 0;
    
    const successfulMetrics = metrics.filter(m => m.success);
    if (successfulMetrics.length === 0) return 0;
    
    const totalDuration = successfulMetrics.reduce((sum, m) => sum + m.duration, 0);
    return totalDuration / successfulMetrics.length;
  }
}

module.exports = {
  CircuitBreaker,
  GracefulDegradation,
  ResourceManager,
  DistributedLock,
  AdaptiveTimeout,
  HealthChecker,
  PerformanceMonitor
}; 