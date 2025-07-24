import { config } from '../config';

export interface ErrorContext {
  productName?: string;
  category?: string;
  site?: string;
  operation?: string;
  timestamp: string;
  retryCount: number;
}

export async function handleError(error: any, context: any = {}): Promise<void> {
  const errorContext: ErrorContext = {
    productName: context.name,
    category: context.category,
    site: context.site,
    operation: context.operation || 'unknown',
    timestamp: new Date().toISOString(),
    retryCount: context.retryCount || 0
  };

  console.error('🚨 Error occurred:', {
    error: error.message || String(error),
    context: errorContext
  });

  // Log error to external service if configured
  await logErrorToService(error, errorContext);

  // Implement retry logic for certain types of errors
  if (shouldRetry(error, errorContext)) {
    await retryOperation(error, errorContext);
  }

  // Send alert for critical errors
  if (isCriticalError(error)) {
    await sendCriticalAlert(error, errorContext);
  }
}

function shouldRetry(error: any, context: ErrorContext): boolean {
  // Don't retry if we've already retried too many times
  if (context.retryCount >= config.scraping.maxRetries) {
    return false;
  }

  // Retry on network errors, timeouts, and temporary failures
  const retryableErrors = [
    'ECONNRESET',
    'ETIMEDOUT',
    'ENOTFOUND',
    'ECONNREFUSED',
    'timeout',
    'network',
    'temporary'
  ];

  const errorMessage = error.message?.toLowerCase() || '';
  return retryableErrors.some(retryableError => 
    errorMessage.includes(retryableError.toLowerCase())
  );
}

async function retryOperation(error: any, context: ErrorContext): Promise<void> {
  const retryDelay = Math.pow(2, context.retryCount) * 1000; // Exponential backoff
  
  console.log(`🔄 Retrying operation in ${retryDelay}ms (attempt ${context.retryCount + 1}/${config.scraping.maxRetries})`);
  
  await new Promise(resolve => setTimeout(resolve, retryDelay));
  
  // Update retry count
  context.retryCount++;
}

function isCriticalError(error: any): boolean {
  const criticalErrors = [
    'authentication',
    'permission',
    'quota',
    'rate limit',
    'firebase',
    'firestore'
  ];

  const errorMessage = error.message?.toLowerCase() || '';
  return criticalErrors.some(criticalError => 
    errorMessage.includes(criticalError.toLowerCase())
  );
}

async function logErrorToService(error: any, context: ErrorContext): Promise<void> {
  try {
    // You can integrate with external logging services here
    // For now, we'll just log to console
    const errorLog = {
      message: error.message || String(error),
      stack: error.stack,
      context,
      timestamp: new Date().toISOString()
    };

    console.error('📝 Error logged:', errorLog);
    
    // Example: Send to external service
    // await fetch('https://your-logging-service.com/api/logs', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(errorLog)
    // });
  } catch (logError) {
    console.error('Failed to log error:', logError);
  }
}

async function sendCriticalAlert(error: any, context: ErrorContext): Promise<void> {
  try {
    const alertMessage = {
      type: 'CRITICAL_ERROR',
      error: error.message || String(error),
      context,
      timestamp: new Date().toISOString()
    };

    console.error('🚨 CRITICAL ERROR ALERT:', alertMessage);

    // Send to notification service
    if (config.notification.webhookUrl) {
      await sendSlackAlert(alertMessage);
    }

    if (config.notification.email) {
      await sendEmailAlert(alertMessage);
    }
  } catch (alertError) {
    console.error('Failed to send critical alert:', alertError);
  }
}

async function sendSlackAlert(alertMessage: any): Promise<void> {
  try {
    const slackPayload = {
      text: `🚨 GPP Agent Critical Error`,
      attachments: [
        {
          color: 'danger',
          fields: [
            {
              title: 'Error',
              value: alertMessage.error,
              short: false
            },
            {
              title: 'Context',
              value: JSON.stringify(alertMessage.context, null, 2),
              short: false
            },
            {
              title: 'Timestamp',
              value: alertMessage.timestamp,
              short: true
            }
          ]
        }
      ]
    };

    await fetch(config.notification.webhookUrl!, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(slackPayload)
    });
  } catch (error) {
    console.error('Failed to send Slack alert:', error);
  }
}

async function sendEmailAlert(alertMessage: any): Promise<void> {
  // Implement email alert logic here
  // You can use services like SendGrid, AWS SES, etc.
  console.log('📧 Email alert would be sent:', alertMessage);
} 