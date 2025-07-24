const { loggers } = require('./logger');
const { ValidationError } = require('./error-handler');

const logger = loggers.app;

// Input sanitization
const sanitizeInput = (input, options = {}) => {
  if (typeof input !== 'string') {
    return input;
  }
  
  let sanitized = input;
  
  // Remove HTML tags
  if (options.removeHtml) {
    sanitized = sanitized.replace(/<[^>]*>/g, '');
  }
  
  // Remove script tags and dangerous content
  sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  sanitized = sanitized.replace(/javascript:/gi, '');
  sanitized = sanitized.replace(/on\w+\s*=/gi, '');
  
  // Trim whitespace
  sanitized = sanitized.trim();
  
  // Limit length
  if (options.maxLength && sanitized.length > options.maxLength) {
    sanitized = sanitized.substring(0, options.maxLength);
  }
  
  return sanitized;
};

// Validation schemas
const validationSchemas = {
  userInput: {
    query: { 
      type: 'string', 
      maxLength: 500, 
      pattern: /^[a-zA-Z0-9\s\-_.,]+$/,
      required: true,
      sanitize: { removeHtml: true, maxLength: 500 }
    },
    email: { 
      type: 'string', 
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      required: false,
      sanitize: { removeHtml: true, maxLength: 254 }
    },
    budget: { 
      type: 'number', 
      min: 0, 
      max: 1000000,
      required: true
    },
    region: { 
      type: 'string', 
      enum: ['US', 'UK', 'DE', 'JP', 'KR'],
      required: true
    },
    category: {
      type: 'string',
      enum: ['electronics', 'travel', 'fashion', 'home', 'books', 'sports'],
      required: true
    }
  },
  
  crawlerInput: {
    url: {
      type: 'string',
      pattern: /^https?:\/\/.+/,
      required: true,
      sanitize: { removeHtml: true, maxLength: 2048 }
    },
    query: {
      type: 'string',
      maxLength: 200,
      required: true,
      sanitize: { removeHtml: true, maxLength: 200 }
    },
    region: {
      type: 'string',
      enum: ['US', 'UK', 'DE', 'JP', 'KR'],
      required: true
    },
    maxPages: {
      type: 'number',
      min: 1,
      max: 10,
      required: false
    }
  },
  
  knowledgeGraphInput: {
    nodeType: {
      type: 'string',
      enum: ['product', 'user', 'market', 'retailer', 'category', 'trend', 'insight'],
      required: true
    },
    nodeId: {
      type: 'string',
      maxLength: 100,
      pattern: /^[a-zA-Z0-9\-_]+$/,
      required: true,
      sanitize: { removeHtml: true, maxLength: 100 }
    },
    properties: {
      type: 'object',
      required: false,
      maxDepth: 3,
      maxKeys: 20
    }
  },
  
  engagementInput: {
    userId: {
      type: 'string',
      maxLength: 100,
      pattern: /^[a-zA-Z0-9\-_]+$/,
      required: true,
      sanitize: { removeHtml: true, maxLength: 100 }
    },
    action: {
      type: 'string',
      enum: ['search', 'view_product', 'set_price_alert', 'share_deal', 'purchase'],
      required: true
    },
    data: {
      type: 'object',
      required: false,
      maxDepth: 2,
      maxKeys: 10
    }
  }
};

// Enhanced validation function
const validateInput = (data, schema, options = {}) => {
  const errors = [];
  const sanitizedData = {};
  
  try {
    for (const [field, rules] of Object.entries(schema)) {
      const value = data[field];
      
      // Check required fields
      if (rules.required && (value === undefined || value === null || value === '')) {
        errors.push(new ValidationError(`${field} is required`, field));
        continue;
      }
      
      // Skip validation for optional empty fields
      if (!rules.required && (value === undefined || value === null || value === '')) {
        continue;
      }
      
      // Type validation
      if (rules.type && typeof value !== rules.type) {
        errors.push(new ValidationError(`${field} must be of type ${rules.type}`, field));
        continue;
      }
      
      // String-specific validations
      if (rules.type === 'string' && typeof value === 'string') {
        // Length validation
        if (rules.maxLength && value.length > rules.maxLength) {
          errors.push(new ValidationError(`${field} must be at most ${rules.maxLength} characters`, field));
          continue;
        }
        
        if (rules.minLength && value.length < rules.minLength) {
          errors.push(new ValidationError(`${field} must be at least ${rules.minLength} characters`, field));
          continue;
        }
        
        // Pattern validation
        if (rules.pattern && !rules.pattern.test(value)) {
          errors.push(new ValidationError(`${field} format is invalid`, field));
          continue;
        }
        
        // Enum validation
        if (rules.enum && !rules.enum.includes(value)) {
          errors.push(new ValidationError(`${field} must be one of: ${rules.enum.join(', ')}`, field));
          continue;
        }
        
        // Sanitization
        if (rules.sanitize) {
          sanitizedData[field] = sanitizeInput(value, rules.sanitize);
        } else {
          sanitizedData[field] = value;
        }
      }
      
      // Number-specific validations
      if (rules.type === 'number' && typeof value === 'number') {
        if (rules.min !== undefined && value < rules.min) {
          errors.push(new ValidationError(`${field} must be at least ${rules.min}`, field));
          continue;
        }
        
        if (rules.max !== undefined && value > rules.max) {
          errors.push(new ValidationError(`${field} must be at most ${rules.max}`, field));
          continue;
        }
        
        sanitizedData[field] = value;
      }
      
      // Object-specific validations
      if (rules.type === 'object' && typeof value === 'object' && value !== null) {
        // Check object depth
        if (rules.maxDepth && getObjectDepth(value) > rules.maxDepth) {
          errors.push(new ValidationError(`${field} object is too deep (max: ${rules.maxDepth})`, field));
          continue;
        }
        
        // Check object keys
        if (rules.maxKeys && Object.keys(value).length > rules.maxKeys) {
          errors.push(new ValidationError(`${field} object has too many keys (max: ${rules.maxKeys})`, field));
          continue;
        }
        
        sanitizedData[field] = value;
      }
      
      // If no specific type validation, just sanitize if it's a string
      if (typeof value === 'string' && rules.sanitize) {
        sanitizedData[field] = sanitizeInput(value, rules.sanitize);
      } else if (typeof value !== 'undefined') {
        sanitizedData[field] = value;
      }
    }
    
    if (errors.length > 0) {
      throw new ValidationError(`Validation failed: ${errors.map(e => e.message).join(', ')}`);
    }
    
    return sanitizedData;
  } catch (error) {
    if (error instanceof ValidationError) {
      throw error;
    }
    throw new ValidationError(`Validation error: ${error.message}`);
  }
};

// Helper function to get object depth
const getObjectDepth = (obj, depth = 0) => {
  if (typeof obj !== 'object' || obj === null) {
    return depth;
  }
  
  let maxDepth = depth;
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      maxDepth = Math.max(maxDepth, getObjectDepth(obj[key], depth + 1));
    }
  }
  
  return maxDepth;
};

// Rate limiting validation
const validateRateLimit = (key, limit, window, redis) => {
  return async (req, res, next) => {
    try {
      const clientId = req.ip || req.headers['x-forwarded-for'] || 'unknown';
      const rateLimitKey = `rate_limit:${key}:${clientId}`;
      
      const current = await redis.incr(rateLimitKey);
      if (current === 1) {
        await redis.expire(rateLimitKey, window);
      }
      
      if (current > limit) {
        return res.status(429).json({
          error: 'Rate limit exceeded',
          retryAfter: await redis.ttl(rateLimitKey)
        });
      }
      
      res.set('X-RateLimit-Limit', limit);
      res.set('X-RateLimit-Remaining', Math.max(0, limit - current));
      res.set('X-RateLimit-Reset', Date.now() + (window * 1000));
      
      next();
    } catch (error) {
      logger.error('Rate limit validation error:', error);
      next();
    }
  };
};

// SQL injection prevention
const preventSQLInjection = (input) => {
  if (typeof input !== 'string') {
    return input;
  }
  
  // Remove common SQL injection patterns
  const sqlPatterns = [
    /(\b(union|select|insert|update|delete|drop|create|alter)\b)/gi,
    /(--|#|\/\*|\*\/)/g,
    /(\b(and|or)\b\s+\d+\s*=\s*\d+)/gi,
    /(\b(and|or)\b\s+['"][^'"]*['"]\s*=\s*['"][^'"]*['"])/gi
  ];
  
  let sanitized = input;
  for (const pattern of sqlPatterns) {
    sanitized = sanitized.replace(pattern, '');
  }
  
  return sanitized;
};

// XSS prevention
const preventXSS = (input) => {
  if (typeof input !== 'string') {
    return input;
  }
  
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

// File upload validation
const validateFileUpload = (file, options = {}) => {
  const errors = [];
  
  // Check file size
  if (options.maxSize && file.size > options.maxSize) {
    errors.push(new ValidationError(`File size exceeds maximum allowed size of ${options.maxSize} bytes`));
  }
  
  // Check file type
  if (options.allowedTypes && !options.allowedTypes.includes(file.mimetype)) {
    errors.push(new ValidationError(`File type ${file.mimetype} is not allowed`));
  }
  
  // Check file extension
  if (options.allowedExtensions) {
    const extension = file.originalname.split('.').pop().toLowerCase();
    if (!options.allowedExtensions.includes(extension)) {
      errors.push(new ValidationError(`File extension .${extension} is not allowed`));
    }
  }
  
  // Check for malicious content
  if (options.scanForMalware) {
    // This would integrate with a malware scanning service
    // For now, we'll just check for common malicious patterns
    const maliciousPatterns = [
      /<script/i,
      /javascript:/i,
      /vbscript:/i,
      /on\w+\s*=/i
    ];
    
    const fileContent = file.buffer.toString();
    for (const pattern of maliciousPatterns) {
      if (pattern.test(fileContent)) {
        errors.push(new ValidationError('File contains potentially malicious content'));
        break;
      }
    }
  }
  
  if (errors.length > 0) {
    throw new ValidationError(`File validation failed: ${errors.map(e => e.message).join(', ')}`);
  }
  
  return true;
};

// URL validation
const validateURL = (url, options = {}) => {
  try {
    const parsedUrl = new URL(url);
    
    // Check protocol
    if (options.allowedProtocols && !options.allowedProtocols.includes(parsedUrl.protocol)) {
      throw new ValidationError(`Protocol ${parsedUrl.protocol} is not allowed`);
    }
    
    // Check domain
    if (options.allowedDomains && !options.allowedDomains.includes(parsedUrl.hostname)) {
      throw new ValidationError(`Domain ${parsedUrl.hostname} is not allowed`);
    }
    
    // Check for private IP addresses
    if (options.preventPrivateIPs) {
      const ipPattern = /^(10\.|172\.(1[6-9]|2[0-9]|3[01])\.|192\.168\.)/;
      if (ipPattern.test(parsedUrl.hostname)) {
        throw new ValidationError('Private IP addresses are not allowed');
      }
    }
    
    return parsedUrl.toString();
  } catch (error) {
    if (error instanceof ValidationError) {
      throw error;
    }
    throw new ValidationError('Invalid URL format');
  }
};

// Email validation
const validateEmail = (email, options = {}) => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!emailPattern.test(email)) {
    throw new ValidationError('Invalid email format');
  }
  
  // Check for disposable email domains
  if (options.preventDisposableEmails) {
    const disposableDomains = [
      '10minutemail.com',
      'tempmail.org',
      'guerrillamail.com',
      'mailinator.com'
    ];
    
    const domain = email.split('@')[1];
    if (disposableDomains.includes(domain)) {
      throw new ValidationError('Disposable email addresses are not allowed');
    }
  }
  
  return email.toLowerCase();
};

module.exports = {
  sanitizeInput,
  validationSchemas,
  validateInput,
  validateRateLimit,
  preventSQLInjection,
  preventXSS,
  validateFileUpload,
  validateURL,
  validateEmail,
  getObjectDepth
}; 