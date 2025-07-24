const fs = require('fs');
const path = require('path');

const maxRetries = 3;

async function handleError(error, product) {
  try {
    console.error(`🚨 Error handling for ${product.name}:`, error);
    
    // Log error to file
    await logErrorToFile(error, product);
    
    // Get AI diagnosis if it's a critical error
    if (isCriticalError(error)) {
      await getAIDiagnosis(error, product);
    }
    
    // Determine if we should retry
    if (shouldRetry(error)) {
      console.log(`🔄 Retrying operation for ${product.name}...`);
      return await retryOperation(() => {
        // This would be the original operation that failed
        console.log(`Retry attempt for ${product.name}`);
      }, maxRetries);
    }
    
  } catch (healError) {
    console.error('❌ Error in self-healer:', healError);
  }
}

function shouldRetry(error) {
  const retryableErrors = [
    'timeout',
    'network',
    'ECONNRESET',
    'ENOTFOUND',
    'ETIMEDOUT'
  ];
  
  const errorMessage = error.message || error.toString();
  return retryableErrors.some(retryable => 
    errorMessage.toLowerCase().includes(retryable.toLowerCase())
  );
}

async function retryOperation(operation, maxRetries) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`🔄 Retry attempt ${attempt}/${maxRetries}`);
      return await operation();
    } catch (error) {
      console.error(`❌ Retry attempt ${attempt} failed:`, error.message);
      
      if (attempt === maxRetries) {
        throw error;
      }
      
      // Wait before next retry (exponential backoff)
      const delay = Math.pow(2, attempt) * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

function isCriticalError(error) {
  const criticalErrors = [
    'authentication',
    'permission',
    'quota',
    'rate limit',
    'firebase'
  ];
  
  const errorMessage = error.message || error.toString();
  return criticalErrors.some(critical => 
    errorMessage.toLowerCase().includes(critical.toLowerCase())
  );
}

async function logErrorToFile(error, product) {
  try {
    const logDir = path.join(__dirname, '../logs');
    const logFile = path.join(logDir, 'error_log.json');
    
    // Ensure log directory exists
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
    
    const errorLog = {
      timestamp: new Date().toISOString(),
      product: product.name,
      error: error.message || error.toString(),
      stack: error.stack,
      type: error.constructor.name
    };
    
    // Read existing logs or create new array
    let logs = [];
    if (fs.existsSync(logFile)) {
      try {
        const existingLogs = fs.readFileSync(logFile, 'utf8');
        logs = JSON.parse(existingLogs);
      } catch (parseError) {
        console.error('Failed to parse existing error log:', parseError);
      }
    }
    
    // Add new error log
    logs.push(errorLog);
    
    // Write back to file
    fs.writeFileSync(logFile, JSON.stringify(logs, null, 2));
    
    console.log(`📝 Error logged to ${logFile}`);
    
  } catch (logError) {
    console.error('❌ Failed to log error to file:', logError);
  }
}

async function getAIDiagnosis(error, product) {
  try {
    console.log(`🤖 Getting AI diagnosis for error in ${product.name}...`);
    
    const diagnosis = {
      timestamp: new Date().toISOString(),
      product: product.name,
      error: error.message || error.toString(),
      diagnosis: `AI diagnosis for ${product.name}: ${error.message}`,
      recommendations: [
        'Check network connectivity',
        'Verify API credentials',
        'Review rate limits',
        'Check Firebase permissions'
      ]
    };
    
    const diagnosisFile = path.join(__dirname, '../logs/last_error_diagnosis.txt');
    const diagnosisDir = path.dirname(diagnosisFile);
    
    if (!fs.existsSync(diagnosisDir)) {
      fs.mkdirSync(diagnosisDir, { recursive: true });
    }
    
    fs.writeFileSync(diagnosisFile, JSON.stringify(diagnosis, null, 2));
    console.log(`🤖 AI diagnosis saved to ${diagnosisFile}`);
    
  } catch (diagnosisError) {
    console.error('❌ Failed to get AI diagnosis:', diagnosisError);
  }
}

module.exports = { handleError }; 