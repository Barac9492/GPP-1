import { Anthropic } from '@anthropic-ai/sdk';
import * as fs from 'fs';
import * as path from 'path';

const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY,
});

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

  // Log error to file
  await logErrorToFile(error, errorContext);

  // Get AI diagnosis for critical errors
  if (isCriticalError(error)) {
    await getAIDiagnosis(error, errorContext);
  }

  // Implement retry logic for certain types of errors
  if (shouldRetry(error, errorContext)) {
    await retryOperation(error, errorContext);
  }
}

function shouldRetry(error: any, context: ErrorContext): boolean {
  // Don't retry if we've already retried too many times
  if (context.retryCount >= 3) {
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
  
  console.log(`🔄 Retrying operation in ${retryDelay}ms (attempt ${context.retryCount + 1}/3)`);
  
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

async function logErrorToFile(error: any, context: ErrorContext): Promise<void> {
  try {
    const logsDir = path.join(__dirname, '../logs');
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
    }

    const errorLog = {
      message: error.message || String(error),
      stack: error.stack,
      context,
      timestamp: new Date().toISOString()
    };

    const logFile = path.join(logsDir, 'error_log.json');
    const existingLogs = fs.existsSync(logFile) 
      ? JSON.parse(fs.readFileSync(logFile, 'utf8')) 
      : [];
    
    existingLogs.push(errorLog);
    fs.writeFileSync(logFile, JSON.stringify(existingLogs, null, 2));
    
    console.log('📝 Error logged to file:', logFile);
  } catch (logError) {
    console.error('Failed to log error to file:', logError);
  }
}

async function getAIDiagnosis(error: any, context: ErrorContext): Promise<void> {
  try {
    const prompt = `You are an expert debugging assistant. Analyze this error and provide a diagnosis:

Error: ${error.message || String(error)}
Context: ${JSON.stringify(context, null, 2)}
Stack: ${error.stack || 'No stack trace'}

Please provide:
1. Root cause analysis
2. Suggested fixes
3. Prevention strategies
4. Severity level (LOW/MEDIUM/HIGH/CRITICAL)

Format your response as JSON:
{
  "diagnosis": "Brief diagnosis",
  "rootCause": "Root cause explanation",
  "suggestedFixes": ["fix1", "fix2"],
  "prevention": "How to prevent this",
  "severity": "HIGH"
}`;

    const response = await anthropic.messages.create({
      model: 'claude-3-sonnet-20240229',
      max_tokens: 1000,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    });

    const content = response.content[0];
    if (content.type === 'text') {
      try {
        const diagnosis = JSON.parse(content.text);
        
        // Save diagnosis to file
        const logsDir = path.join(__dirname, '../logs');
        if (!fs.existsSync(logsDir)) {
          fs.mkdirSync(logsDir, { recursive: true });
        }

        const diagnosisFile = path.join(logsDir, 'last_error_diagnosis.txt');
        const diagnosisText = `
=== AI Error Diagnosis ===
Timestamp: ${new Date().toISOString()}
Error: ${error.message || String(error)}
Context: ${JSON.stringify(context, null, 2)}

Diagnosis: ${diagnosis.diagnosis}
Root Cause: ${diagnosis.rootCause}
Severity: ${diagnosis.severity}

Suggested Fixes:
${diagnosis.suggestedFixes.map((fix: string, i: number) => `${i + 1}. ${fix}`).join('\n')}

Prevention: ${diagnosis.prevention}
=====================
        `;

        fs.writeFileSync(diagnosisFile, diagnosisText);
        console.log('🤖 AI diagnosis saved to:', diagnosisFile);
        
        // Log to console for immediate visibility
        console.log('🚨 CRITICAL ERROR DIAGNOSIS:');
        console.log(`Severity: ${diagnosis.severity}`);
        console.log(`Diagnosis: ${diagnosis.diagnosis}`);
        console.log(`Root Cause: ${diagnosis.rootCause}`);
        
      } catch (parseError) {
        console.error('Failed to parse AI diagnosis:', parseError);
      }
    }
  } catch (aiError) {
    console.error('Failed to get AI diagnosis:', aiError);
  }
} 