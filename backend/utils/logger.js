const winston = require('winston');
const path = require('path');

// Create logs directory if it doesn't exist
const fs = require('fs');
const logsDir = path.join(__dirname, '..', 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Unified logger configuration
const createLogger = (module = 'app', level = process.env.LOG_LEVEL || 'info') => {
  return winston.createLogger({
    level,
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.errors({ stack: true }),
      winston.format.json()
    ),
    defaultMeta: { module },
    transports: [
      // Console transport for development
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.simple(),
          winston.format.printf(({ timestamp, level, message, module, ...meta }) => {
            return `${timestamp} [${module}] ${level}: ${message} ${Object.keys(meta).length ? JSON.stringify(meta) : ''}`;
          })
        )
      }),
      // File transport for production
      new winston.transports.File({
        filename: path.join(logsDir, `${module}.log`),
        maxsize: 5242880, // 5MB
        maxFiles: 5,
        tailable: true
      }),
      // Error file transport
      new winston.transports.File({
        filename: path.join(logsDir, `${module}-error.log`),
        level: 'error',
        maxsize: 5242880, // 5MB
        maxFiles: 5,
        tailable: true
      })
    ]
  });
};

// Pre-configured loggers for common modules
const loggers = {
  app: createLogger('app'),
  crawler: createLogger('crawler'),
  knowledgeGraph: createLogger('knowledge-graph'),
  engagement: createLogger('engagement'),
  deployment: createLogger('deployment'),
  api: createLogger('api')
};

// Utility functions
const logError = (logger, error, context = {}) => {
  logger.error('Error occurred', {
    message: error.message,
    stack: error.stack,
    ...context
  });
};

const logPerformance = (logger, operation, duration, metadata = {}) => {
  logger.info('Performance metric', {
    operation,
    duration: `${duration}ms`,
    ...metadata
  });
};

const logUserAction = (logger, userId, action, data = {}) => {
  logger.info('User action', {
    userId,
    action,
    data,
    timestamp: new Date().toISOString()
  });
};

// Export both the factory function and pre-configured loggers
module.exports = {
  createLogger,
  loggers,
  logError,
  logPerformance,
  logUserAction
}; 