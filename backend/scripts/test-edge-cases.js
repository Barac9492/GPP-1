const { 
  CircuitBreaker, 
  GracefulDegradation, 
  ResourceManager, 
  DistributedLock, 
  AdaptiveTimeout, 
  HealthChecker, 
  PerformanceMonitor 
} = require('../utils/resilience');

const { 
  validateInput, 
  validationSchemas, 
  sanitizeInput, 
  preventSQLInjection, 
  preventXSS,
  validateURL,
  validateEmail
} = require('../utils/validation');

const { loggers } = require('../utils/logger');
const { ValidationError, CrawlerError } = require('../utils/error-handler');

const logger = loggers.app;

class EdgeCaseTester {
  constructor() {
    this.results = {
      resilience: {},
      validation: {},
      security: {},
      performance: {},
      overall: 'PENDING'
    };
  }

  async runAllTests() {
    logger.info('🧪 Starting Edge Case Testing');
    logger.info('=' .repeat(60));
    
    try {
      await this.testResilience();
      await this.testValidation();
      await this.testSecurity();
      await this.testPerformance();
      await this.generateReport();
    } catch (error) {
      logger.error('❌ Edge case testing failed:', error);
      this.results.overall = 'FAILED';
    }
  }

  // 1. Resilience Tests
  async testResilience() {
    logger.info('\n🔄 Testing Resilience Patterns');
    
    // Circuit Breaker Test
    await this.testCircuitBreaker();
    
    // Graceful Degradation Test
    await this.testGracefulDegradation();
    
    // Resource Management Test
    await this.testResourceManagement();
    
    // Distributed Lock Test
    await this.testDistributedLock();
    
    // Adaptive Timeout Test
    await this.testAdaptiveTimeout();
    
    // Health Checker Test
    await this.testHealthChecker();
  }

  async testCircuitBreaker() {
    logger.info('Testing Circuit Breaker Pattern');
    
    const circuitBreaker = new CircuitBreaker(3, 5000); // 3 failures, 5s reset
    
    // Test successful operations
    let successCount = 0;
    for (let i = 0; i < 5; i++) {
      try {
        await circuitBreaker.execute(() => Promise.resolve('success'));
        successCount++;
      } catch (error) {
        logger.error('Unexpected circuit breaker failure:', error);
      }
    }
    
    // Test failure handling
    let failureCount = 0;
    for (let i = 0; i < 5; i++) {
      try {
        await circuitBreaker.execute(() => Promise.reject(new Error('Simulated failure')));
      } catch (error) {
        failureCount++;
      }
    }
    
    const status = circuitBreaker.getStatus();
    
    this.results.resilience.circuitBreaker = {
      success: successCount === 5 && status.state === 'OPEN',
      message: `Circuit breaker working: ${successCount} successes, ${failureCount} failures, state: ${status.state}`,
      details: status
    };
    
    logger.info(`✅ Circuit Breaker: ${this.results.resilience.circuitBreaker.message}`);
  }

  async testGracefulDegradation() {
    logger.info('Testing Graceful Degradation');
    
    const graceful = new GracefulDegradation();
    
    // Test primary operation success
    let primarySuccess = false;
    try {
      const result = await graceful.executeWithFallback(
        'test_primary_success',
        () => Promise.resolve('primary result'),
        () => Promise.resolve('fallback result')
      );
      primarySuccess = result === 'primary result';
    } catch (error) {
      logger.error('Primary operation unexpectedly failed:', error);
    }
    
    // Test fallback operation
    let fallbackSuccess = false;
    try {
      const result = await graceful.executeWithFallback(
        'test_fallback',
        () => Promise.reject(new Error('Primary failed')),
        () => Promise.resolve('fallback result')
      );
      fallbackSuccess = result === 'fallback result';
    } catch (error) {
      logger.error('Fallback operation failed:', error);
    }
    
    // Test cache functionality
    let cacheSuccess = false;
    try {
      const result = await graceful.getCachedData(
        'test_cache',
        () => Promise.resolve({ data: 'cached data' }),
        60
      );
      cacheSuccess = result.data === 'cached data';
    } catch (error) {
      logger.error('Cache test failed:', error);
    }
    
    this.results.resilience.gracefulDegradation = {
      success: primarySuccess && fallbackSuccess && cacheSuccess,
      message: `Graceful degradation: Primary=${primarySuccess}, Fallback=${fallbackSuccess}, Cache=${cacheSuccess}`,
      details: { primarySuccess, fallbackSuccess, cacheSuccess }
    };
    
    logger.info(`✅ Graceful Degradation: ${this.results.resilience.gracefulDegradation.message}`);
  }

  async testResourceManagement() {
    logger.info('Testing Resource Management');
    
    const resourceManager = new ResourceManager();
    
    // Test resource creation and cleanup
    let resourceCount = 0;
    let cleanupSuccess = false;
    
    try {
      await resourceManager.withResource(
        () => Promise.resolve({ id: 'test-resource', close: () => Promise.resolve() }),
        async (resource) => {
          resourceCount = resourceManager.getResourceCount();
          return 'resource used';
        },
        async (resource) => {
          await resource.close();
        }
      );
      
      cleanupSuccess = resourceManager.getResourceCount() === 0;
    } catch (error) {
      logger.error('Resource management test failed:', error);
    }
    
    this.results.resilience.resourceManagement = {
      success: resourceCount === 1 && cleanupSuccess,
      message: `Resource management: Created=${resourceCount}, Cleaned=${cleanupSuccess}`,
      details: { resourceCount, cleanupSuccess }
    };
    
    logger.info(`✅ Resource Management: ${this.results.resilience.resourceManagement.message}`);
  }

  async testDistributedLock() {
    logger.info('Testing Distributed Lock');
    
    const distributedLock = new DistributedLock();
    
    let lockAcquired = false;
    let lockReleased = false;
    
    try {
      const lockId = await distributedLock.acquire('test-lock', 10000);
      lockAcquired = lockId !== null;
      
      if (lockAcquired) {
        lockReleased = await distributedLock.release('test-lock', lockId);
      }
    } catch (error) {
      logger.error('Distributed lock test failed:', error);
    }
    
    this.results.resilience.distributedLock = {
      success: lockAcquired && lockReleased,
      message: `Distributed lock: Acquired=${lockAcquired}, Released=${lockReleased}`,
      details: { lockAcquired, lockReleased }
    };
    
    logger.info(`✅ Distributed Lock: ${this.results.resilience.distributedLock.message}`);
  }

  async testAdaptiveTimeout() {
    logger.info('Testing Adaptive Timeout');
    
    const adaptiveTimeout = new AdaptiveTimeout();
    
    let fastOperationSuccess = false;
    let slowOperationSuccess = false;
    
    try {
      // Test fast operation
      await adaptiveTimeout.withTimeout(
        () => new Promise(resolve => setTimeout(resolve, 100)),
        1000
      );
      fastOperationSuccess = true;
    } catch (error) {
      logger.error('Fast operation timeout test failed:', error);
    }
    
    try {
      // Test slow operation (should timeout)
      await adaptiveTimeout.withTimeout(
        () => new Promise(resolve => setTimeout(resolve, 2000)),
        500
      );
    } catch (error) {
      slowOperationSuccess = error.message === 'Operation timed out';
    }
    
    this.results.resilience.adaptiveTimeout = {
      success: fastOperationSuccess && slowOperationSuccess,
      message: `Adaptive timeout: Fast=${fastOperationSuccess}, Slow=${slowOperationSuccess}`,
      details: { fastOperationSuccess, slowOperationSuccess }
    };
    
    logger.info(`✅ Adaptive Timeout: ${this.results.resilience.adaptiveTimeout.message}`);
  }

  async testHealthChecker() {
    logger.info('Testing Health Checker');
    
    const healthChecker = new HealthChecker();
    
    let healthCheckSuccess = false;
    let healthDetails = {};
    
    try {
      const health = await healthChecker.checkSystemHealth();
      healthCheckSuccess = typeof health.healthy === 'boolean';
      healthDetails = health;
    } catch (error) {
      logger.error('Health checker test failed:', error);
    }
    
    this.results.resilience.healthChecker = {
      success: healthCheckSuccess,
      message: `Health checker: Success=${healthCheckSuccess}`,
      details: healthDetails
    };
    
    logger.info(`✅ Health Checker: ${this.results.resilience.healthChecker.message}`);
  }

  // 2. Validation Tests
  async testValidation() {
    logger.info('\n✅ Testing Input Validation');
    
    // Test user input validation
    await this.testUserInputValidation();
    
    // Test crawler input validation
    await this.testCrawlerInputValidation();
    
    // Test knowledge graph input validation
    await this.testKnowledgeGraphInputValidation();
    
    // Test engagement input validation
    await this.testEngagementInputValidation();
  }

  async testUserInputValidation() {
    logger.info('Testing User Input Validation');
    
    const validInput = {
      query: 'iPhone 15 Pro',
      email: 'test@example.com',
      budget: 1000,
      region: 'US',
      category: 'electronics'
    };
    
    const invalidInput = {
      query: '<script>alert("xss")</script>',
      email: 'invalid-email',
      budget: -100,
      region: 'INVALID',
      category: 'invalid-category'
    };
    
    let validSuccess = false;
    let invalidSuccess = false;
    
    try {
      const validated = validateInput(validInput, validationSchemas.userInput);
      validSuccess = validated.query === 'iPhone 15 Pro' && validated.email === 'test@example.com';
    } catch (error) {
      logger.error('Valid input validation failed:', error);
    }
    
    try {
      validateInput(invalidInput, validationSchemas.userInput);
    } catch (error) {
      invalidSuccess = error instanceof ValidationError;
    }
    
    this.results.validation.userInput = {
      success: validSuccess && invalidSuccess,
      message: `User input validation: Valid=${validSuccess}, Invalid=${invalidSuccess}`,
      details: { validSuccess, invalidSuccess }
    };
    
    logger.info(`✅ User Input Validation: ${this.results.validation.userInput.message}`);
  }

  async testCrawlerInputValidation() {
    logger.info('Testing Crawler Input Validation');
    
    const validInput = {
      url: 'https://amazon.com/search?q=iphone',
      query: 'iPhone 15',
      region: 'US',
      maxPages: 3
    };
    
    const invalidInput = {
      url: 'not-a-url',
      query: 'a'.repeat(300), // Too long
      region: 'INVALID',
      maxPages: 20 // Too high
    };
    
    let validSuccess = false;
    let invalidSuccess = false;
    
    try {
      const validated = validateInput(validInput, validationSchemas.crawlerInput);
      validSuccess = validated.url === 'https://amazon.com/search?q=iphone';
    } catch (error) {
      logger.error('Valid crawler input validation failed:', error);
    }
    
    try {
      validateInput(invalidInput, validationSchemas.crawlerInput);
    } catch (error) {
      invalidSuccess = error instanceof ValidationError;
    }
    
    this.results.validation.crawlerInput = {
      success: validSuccess && invalidSuccess,
      message: `Crawler input validation: Valid=${validSuccess}, Invalid=${invalidSuccess}`,
      details: { validSuccess, invalidSuccess }
    };
    
    logger.info(`✅ Crawler Input Validation: ${this.results.validation.crawlerInput.message}`);
  }

  async testKnowledgeGraphInputValidation() {
    logger.info('Testing Knowledge Graph Input Validation');
    
    const validInput = {
      nodeType: 'product',
      nodeId: 'iphone-15-pro',
      properties: {
        name: 'iPhone 15 Pro',
        price: 999
      }
    };
    
    const invalidInput = {
      nodeType: 'invalid-type',
      nodeId: '<script>alert("xss")</script>',
      properties: {
        name: 'Test',
        nested: {
          deep: {
            object: 'too deep'
          }
        }
      }
    };
    
    let validSuccess = false;
    let invalidSuccess = false;
    
    try {
      const validated = validateInput(validInput, validationSchemas.knowledgeGraphInput);
      validSuccess = validated.nodeType === 'product' && validated.nodeId === 'iphone-15-pro';
    } catch (error) {
      logger.error('Valid knowledge graph input validation failed:', error);
    }
    
    try {
      validateInput(invalidInput, validationSchemas.knowledgeGraphInput);
    } catch (error) {
      invalidSuccess = error instanceof ValidationError;
    }
    
    this.results.validation.knowledgeGraphInput = {
      success: validSuccess && invalidSuccess,
      message: `Knowledge graph input validation: Valid=${validSuccess}, Invalid=${invalidSuccess}`,
      details: { validSuccess, invalidSuccess }
    };
    
    logger.info(`✅ Knowledge Graph Input Validation: ${this.results.validation.knowledgeGraphInput.message}`);
  }

  async testEngagementInputValidation() {
    logger.info('Testing Engagement Input Validation');
    
    const validInput = {
      userId: 'user123',
      action: 'search',
      data: {
        query: 'iPhone 15'
      }
    };
    
    const invalidInput = {
      userId: '<script>alert("xss")</script>',
      action: 'invalid-action',
      data: {
        query: 'Test',
        nested: {
          deep: {
            object: 'too deep'
          }
        }
      }
    };
    
    let validSuccess = false;
    let invalidSuccess = false;
    
    try {
      const validated = validateInput(validInput, validationSchemas.engagementInput);
      validSuccess = validated.userId === 'user123' && validated.action === 'search';
    } catch (error) {
      logger.error('Valid engagement input validation failed:', error);
    }
    
    try {
      validateInput(invalidInput, validationSchemas.engagementInput);
    } catch (error) {
      invalidSuccess = error instanceof ValidationError;
    }
    
    this.results.validation.engagementInput = {
      success: validSuccess && invalidSuccess,
      message: `Engagement input validation: Valid=${validSuccess}, Invalid=${invalidSuccess}`,
      details: { validSuccess, invalidSuccess }
    };
    
    logger.info(`✅ Engagement Input Validation: ${this.results.validation.engagementInput.message}`);
  }

  // 3. Security Tests
  async testSecurity() {
    logger.info('\n🔒 Testing Security Measures');
    
    // Test SQL injection prevention
    await this.testSQLInjectionPrevention();
    
    // Test XSS prevention
    await this.testXSSPrevention();
    
    // Test URL validation
    await this.testURLValidation();
    
    // Test email validation
    await this.testEmailValidation();
  }

  async testSQLInjectionPrevention() {
    logger.info('Testing SQL Injection Prevention');
    
    const maliciousInputs = [
      "'; DROP TABLE users; --",
      "1' OR '1'='1",
      "admin'--",
      "'; INSERT INTO users VALUES ('hacker', 'password'); --"
    ];
    
    let allPrevented = true;
    
    for (const input of maliciousInputs) {
      const sanitized = preventSQLInjection(input);
      if (sanitized.includes('DROP') || sanitized.includes('INSERT') || sanitized.includes('OR')) {
        allPrevented = false;
        logger.warn(`SQL injection not fully prevented: ${input} -> ${sanitized}`);
      }
    }
    
    this.results.security.sqlInjection = {
      success: allPrevented,
      message: `SQL injection prevention: ${allPrevented ? 'All prevented' : 'Some failed'}`,
      details: { allPrevented }
    };
    
    logger.info(`✅ SQL Injection Prevention: ${this.results.security.sqlInjection.message}`);
  }

  async testXSSPrevention() {
    logger.info('Testing XSS Prevention');
    
    const maliciousInputs = [
      '<script>alert("xss")</script>',
      '<img src="x" onerror="alert(\'xss\')">',
      'javascript:alert("xss")',
      '<iframe src="javascript:alert(\'xss\')"></iframe>'
    ];
    
    let allPrevented = true;
    
    for (const input of maliciousInputs) {
      const sanitized = preventXSS(input);
      if (sanitized.includes('<script>') || sanitized.includes('javascript:') || sanitized.includes('onerror=')) {
        allPrevented = false;
        logger.warn(`XSS not fully prevented: ${input} -> ${sanitized}`);
      }
    }
    
    this.results.security.xssPrevention = {
      success: allPrevented,
      message: `XSS prevention: ${allPrevented ? 'All prevented' : 'Some failed'}`,
      details: { allPrevented }
    };
    
    logger.info(`✅ XSS Prevention: ${this.results.security.xssPrevention.message}`);
  }

  async testURLValidation() {
    logger.info('Testing URL Validation');
    
    const validURLs = [
      'https://amazon.com',
      'https://www.google.com/search?q=test',
      'http://localhost:3000'
    ];
    
    const invalidURLs = [
      'not-a-url',
      'ftp://malicious.com',
      'http://192.168.1.1',
      'javascript:alert("xss")'
    ];
    
    let validSuccess = true;
    let invalidSuccess = true;
    
    for (const url of validURLs) {
      try {
        validateURL(url, { allowedProtocols: ['http:', 'https:'] });
      } catch (error) {
        validSuccess = false;
        logger.error(`Valid URL failed validation: ${url}`, error);
      }
    }
    
    for (const url of invalidURLs) {
      try {
        validateURL(url, { allowedProtocols: ['http:', 'https:'] });
        invalidSuccess = false;
        logger.warn(`Invalid URL passed validation: ${url}`);
      } catch (error) {
        // Expected to fail
      }
    }
    
    this.results.security.urlValidation = {
      success: validSuccess && invalidSuccess,
      message: `URL validation: Valid=${validSuccess}, Invalid=${invalidSuccess}`,
      details: { validSuccess, invalidSuccess }
    };
    
    logger.info(`✅ URL Validation: ${this.results.security.urlValidation.message}`);
  }

  async testEmailValidation() {
    logger.info('Testing Email Validation');
    
    const validEmails = [
      'test@example.com',
      'user.name@domain.co.uk',
      'user+tag@example.org'
    ];
    
    const invalidEmails = [
      'not-an-email',
      'test@',
      '@example.com',
      'test@10minutemail.com' // Disposable
    ];
    
    let validSuccess = true;
    let invalidSuccess = true;
    
    for (const email of validEmails) {
      try {
        validateEmail(email, { preventDisposableEmails: true });
      } catch (error) {
        validSuccess = false;
        logger.error(`Valid email failed validation: ${email}`, error);
      }
    }
    
    for (const email of invalidEmails) {
      try {
        validateEmail(email, { preventDisposableEmails: true });
        invalidSuccess = false;
        logger.warn(`Invalid email passed validation: ${email}`);
      } catch (error) {
        // Expected to fail
      }
    }
    
    this.results.security.emailValidation = {
      success: validSuccess && invalidSuccess,
      message: `Email validation: Valid=${validSuccess}, Invalid=${invalidSuccess}`,
      details: { validSuccess, invalidSuccess }
    };
    
    logger.info(`✅ Email Validation: ${this.results.security.emailValidation.message}`);
  }

  // 4. Performance Tests
  async testPerformance() {
    logger.info('\n⚡ Testing Performance Monitoring');
    
    const performanceMonitor = new PerformanceMonitor();
    
    // Test fast operation
    let fastOperationSuccess = false;
    try {
      await performanceMonitor.measureOperation('fast_operation', async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
        return 'fast result';
      });
      fastOperationSuccess = true;
    } catch (error) {
      logger.error('Fast operation performance test failed:', error);
    }
    
    // Test slow operation
    let slowOperationSuccess = false;
    try {
      await performanceMonitor.measureOperation('slow_operation', async () => {
        await new Promise(resolve => setTimeout(resolve, 500));
        return 'slow result';
      });
      slowOperationSuccess = true;
    } catch (error) {
      logger.error('Slow operation performance test failed:', error);
    }
    
    // Test failed operation
    let failedOperationSuccess = false;
    try {
      await performanceMonitor.measureOperation('failed_operation', async () => {
        throw new Error('Simulated failure');
      });
    } catch (error) {
      failedOperationSuccess = error.message === 'Simulated failure';
    }
    
    // Get metrics
    const metrics = performanceMonitor.getMetrics();
    const avgResponseTime = performanceMonitor.getAverageResponseTime('fast_operation');
    
    this.results.performance.monitoring = {
      success: fastOperationSuccess && slowOperationSuccess && failedOperationSuccess,
      message: `Performance monitoring: Fast=${fastOperationSuccess}, Slow=${slowOperationSuccess}, Failed=${failedOperationSuccess}`,
      details: { 
        fastOperationSuccess, 
        slowOperationSuccess, 
        failedOperationSuccess,
        metricsCount: Object.keys(metrics).length,
        avgResponseTime: avgResponseTime.toFixed(2) + 'ms'
      }
    };
    
    logger.info(`✅ Performance Monitoring: ${this.results.performance.monitoring.message}`);
  }

  // 5. Report Generation
  async generateReport() {
    logger.info('\n📊 Edge Case Testing Report');
    logger.info('=' .repeat(60));
    
    const categories = ['resilience', 'validation', 'security', 'performance'];
    let totalTests = 0;
    let passedTests = 0;
    
    for (const category of categories) {
      const tests = this.results[category];
      const categoryTests = Object.keys(tests).length;
      const categoryPassed = Object.values(tests).filter(test => test.success).length;
      
      totalTests += categoryTests;
      passedTests += categoryPassed;
      
      logger.info(`\n${category.toUpperCase()}: ${categoryPassed}/${categoryTests} passed`);
      
      for (const [test, result] of Object.entries(tests)) {
        const status = result.success ? '✅' : '❌';
        logger.info(`  ${status} ${test}: ${result.message}`);
      }
    }
    
    const successRate = (passedTests / totalTests) * 100;
    this.results.overall = successRate >= 90 ? 'PASSED' : successRate >= 70 ? 'WARNING' : 'FAILED';
    
    logger.info('\n' + '=' .repeat(60));
    logger.info(`OVERALL RESULT: ${this.results.overall}`);
    logger.info(`Success Rate: ${successRate.toFixed(1)}% (${passedTests}/${totalTests})`);
    
    if (this.results.overall === 'PASSED') {
      logger.info('🎉 Edge case testing passed! System is resilient and secure.');
    } else if (this.results.overall === 'WARNING') {
      logger.info('⚠️ Edge case testing has warnings. Review failed tests.');
    } else {
      logger.info('❌ Edge case testing failed. Fix critical issues.');
    }
    
    // Save detailed report
    await this.saveDetailedReport();
  }

  async saveDetailedReport() {
    const fs = require('fs');
    const path = require('path');
    
    const reportPath = path.join(__dirname, 'edge-case-testing-report.json');
    const report = {
      timestamp: new Date().toISOString(),
      results: this.results,
      summary: this.generateSummary()
    };
    
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    logger.info(`📄 Detailed report saved to: ${reportPath}`);
  }

  generateSummary() {
    const recommendations = [];
    
    const categories = ['resilience', 'validation', 'security', 'performance'];
    
    for (const category of categories) {
      const tests = this.results[category];
      const failedTests = Object.entries(tests).filter(([_, result]) => !result.success);
      
      for (const [test, result] of failedTests) {
        recommendations.push({
          category,
          test,
          issue: result.message,
          priority: this.getPriority(category, test),
          action: this.getAction(category, test)
        });
      }
    }
    
    return recommendations.sort((a, b) => b.priority - a.priority);
  }

  getPriority(category, test) {
    const critical = ['circuitBreaker', 'sqlInjection', 'xssPrevention'];
    const high = ['gracefulDegradation', 'distributedLock', 'userInput'];
    
    if (critical.includes(test)) return 3;
    if (high.includes(test)) return 2;
    return 1;
  }

  getAction(category, test) {
    const actions = {
      'circuitBreaker': 'Review circuit breaker configuration and thresholds',
      'sqlInjection': 'Enhance SQL injection prevention patterns',
      'xSSPrevention': 'Improve XSS prevention sanitization',
      'gracefulDegradation': 'Add more fallback mechanisms',
      'distributedLock': 'Verify Redis connection for distributed locking',
      'userInput': 'Review input validation schemas'
    };
    
    return actions[test] || 'Review and improve the failing test';
  }
}

// Run tests if called directly
if (require.main === module) {
  const tester = new EdgeCaseTester();
  tester.runAllTests().catch(console.error);
}

module.exports = EdgeCaseTester; 