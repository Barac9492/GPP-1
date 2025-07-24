const { logError } = require('./logger');

// Custom error classes
class CrawlerError extends Error {
  constructor(message, context = {}) {
    super(message);
    this.name = 'CrawlerError';
    this.context = context;
    this.timestamp = new Date().toISOString();
  }
}

class KnowledgeGraphError extends Error {
  constructor(message, context = {}) {
    super(message);
    this.name = 'KnowledgeGraphError';
    this.context = context;
    this.timestamp = new Date().toISOString();
  }
}

class EngagementError extends Error {
  constructor(message, context = {}) {
    super(message);
    this.name = 'EngagementError';
    this.context = context;
    this.timestamp = new Date().toISOString();
  }
}

class ValidationError extends Error {
  constructor(message, field = null) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
    this.timestamp = new Date().toISOString();
  }
}

class RateLimitError extends Error {
  constructor(message, retryAfter = null) {
    super(message);
    this.name = 'RateLimitError';
    this.retryAfter = retryAfter;
    this.timestamp = new Date().toISOString();
  }
}

// Error handling utilities
const handleError = (error, logger, context = {}) => {
  // Log the error
  logError(logger, error, context);
  
  // Determine if error is retryable
  const isRetryable = isRetryableError(error);
  
  // Create standardized error response
  const errorResponse = {
    success: false,
    error: {
      message: error.message,
      type: error.name,
      timestamp: error.timestamp || new Date().toISOString(),
      retryable: isRetryable,
      context
    }
  };
  
  return errorResponse;
};

const isRetryableError = (error) => {
  const retryableErrors = [
    'NetworkError',
    'TimeoutError',
    'RateLimitError',
    'ECONNRESET',
    'ETIMEDOUT',
    'ENOTFOUND'
  ];
  
  return retryableErrors.some(type => 
    error.name === type || 
    error.code === type || 
    error.message.includes(type)
  );
};

const retryOperation = async (operation, maxRetries = 3, delay = 1000, logger = null) => {
  let lastError;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      
      if (logger) {
        logger.warn(`Operation failed (attempt ${attempt}/${maxRetries}): ${error.message}`);
      }
      
      if (attempt < maxRetries && isRetryableError(error)) {
        const backoffDelay = delay * Math.pow(2, attempt - 1);
        if (logger) {
          logger.info(`Retrying in ${backoffDelay}ms...`);
        }
        await new Promise(resolve => setTimeout(resolve, backoffDelay));
      } else {
        break;
      }
    }
  }
  
  throw lastError;
};

const validateInput = (data, schema, logger = null) => {
  try {
    // Basic validation - can be extended with Joi or similar
    for (const [field, rules] of Object.entries(schema)) {
      const value = data[field];
      
      if (rules.required && (value === undefined || value === null || value === '')) {
        throw new ValidationError(`${field} is required`, field);
      }
      
      if (value !== undefined && value !== null) {
        if (rules.type && typeof value !== rules.type) {
          throw new ValidationError(`${field} must be of type ${rules.type}`, field);
        }
        
        if (rules.min && value < rules.min) {
          throw new ValidationError(`${field} must be at least ${rules.min}`, field);
        }
        
        if (rules.max && value > rules.max) {
          throw new ValidationError(`${field} must be at most ${rules.max}`, field);
        }
        
        if (rules.pattern && !rules.pattern.test(value)) {
          throw new ValidationError(`${field} format is invalid`, field);
        }
      }
    }
    
    return true;
  } catch (error) {
    if (logger) {
      logError(logger, error, { data, schema });
    }
    throw error;
  }
};

const createErrorResponse = (error, includeStack = false) => {
  const response = {
    success: false,
    error: {
      message: error.message,
      type: error.name,
      timestamp: error.timestamp || new Date().toISOString()
    }
  };
  
  if (includeStack && error.stack) {
    response.error.stack = error.stack;
  }
  
  if (error.context) {
    response.error.context = error.context;
  }
  
  return response;
};

// Async error wrapper
const asyncHandler = (fn) => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      const errorResponse = createErrorResponse(error);
      res.status(500).json(errorResponse);
    }
  };
};

module.exports = {
  // Custom error classes
  CrawlerError,
  KnowledgeGraphError,
  EngagementError,
  ValidationError,
  RateLimitError,
  
  // Error handling utilities
  handleError,
  isRetryableError,
  retryOperation,
  validateInput,
  createErrorResponse,
  asyncHandler
}; 