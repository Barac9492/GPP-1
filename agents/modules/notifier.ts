import { config } from '../config';
import nodemailer from 'nodemailer';

export interface ScrapingReport {
  successes: Array<{
    name: string;
    category: string;
    prices: any;
  }>;
  failures: Array<{
    name: string;
    category: string;
    error: string;
  }>;
  metadata: {
    totalProducts: number;
    duration: number;
    timestamp: string;
  };
}

export async function sendReport(
  successes: any[], 
  failures: any[], 
  metadata: any = {}
): Promise<void> {
  const report: ScrapingReport = {
    successes,
    failures,
    metadata: {
      totalProducts: metadata.totalProducts || 0,
      duration: metadata.duration || 0,
      timestamp: metadata.timestamp || new Date().toISOString()
    }
  };

  console.log('📊 Generating scraping report...');
  console.log(`✅ Successes: ${successes.length}`);
  console.log(`❌ Failures: ${failures.length}`);
  console.log(`⏱️ Duration: ${metadata.duration}s`);

  // Send to different notification channels
  await Promise.all([
    sendSlackReport(report),
    sendEmailReport(report),
    logReportToConsole(report)
  ]);
}

async function sendSlackReport(report: ScrapingReport): Promise<void> {
  if (!config.notification.webhookUrl) {
    console.log('📱 Slack webhook not configured, skipping Slack report');
    return;
  }

  try {
    const successRate = report.metadata.totalProducts > 0 
      ? Math.round((report.successes.length / report.metadata.totalProducts) * 100)
      : 0;

    const slackPayload = {
      text: `📊 GPP Agent Daily Report`,
      attachments: [
        {
          color: successRate >= 80 ? 'good' : successRate >= 60 ? 'warning' : 'danger',
          fields: [
            {
              title: '📈 Summary',
              value: `Total: ${report.metadata.totalProducts}\nSuccesses: ${report.successes.length}\nFailures: ${report.failures.length}\nSuccess Rate: ${successRate}%`,
              short: true
            },
            {
              title: '⏱️ Performance',
              value: `Duration: ${report.metadata.duration}s\nTimestamp: ${new Date(report.metadata.timestamp).toLocaleString()}`,
              short: true
            }
          ]
        }
      ]
    };

    // Add success details if any
    if (report.successes.length > 0) {
      const successText = report.successes
        .slice(0, 5) // Show first 5 successes
        .map(s => `• ${s.name} (${s.category})`)
        .join('\n');
      
      slackPayload.attachments.push({
        color: 'good',
        title: '✅ Successful Scrapes',
        text: successText + (report.successes.length > 5 ? '\n... and more' : ''),
        short: false
      });
    }

    // Add failure details if any
    if (report.failures.length > 0) {
      const failureText = report.failures
        .slice(0, 3) // Show first 3 failures
        .map(f => `• ${f.name}: ${f.error.substring(0, 100)}...`)
        .join('\n');
      
      slackPayload.attachments.push({
        color: 'danger',
        title: '❌ Failed Scrapes',
        text: failureText + (report.failures.length > 3 ? '\n... and more' : ''),
        short: false
      });
    }

    await fetch(config.notification.webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(slackPayload)
    });

    console.log('📱 Slack report sent successfully');
  } catch (error) {
    console.error('Failed to send Slack report:', error);
  }
}

async function sendEmailReport(report: ScrapingReport): Promise<void> {
  if (!config.notification.email) {
    console.log('📧 Email not configured, skipping email report');
    return;
  }

  try {
    const successRate = report.metadata.totalProducts > 0 
      ? Math.round((report.successes.length / report.metadata.totalProducts) * 100)
      : 0;

    const emailSubject = `[GPP-Agent] Daily Report - ${new Date().toISOString().split('T')[0]}`;
    
    const emailBody = `
GPP Agent Daily Report
=====================

Summary:
- Total Products: ${report.metadata.totalProducts}
- Successful Scrapes: ${report.successes.length}
- Failed Scrapes: ${report.failures.length}
- Success Rate: ${successRate}%
- Duration: ${report.metadata.duration}s
- Timestamp: ${new Date(report.metadata.timestamp).toLocaleString()}

${report.successes.length > 0 ? `
✅ Successful Scrapes:
${report.successes.map(s => `- ${s.name} (${s.category})`).join('\n')}
` : ''}

${report.failures.length > 0 ? `
❌ Failed Scrapes:
${report.failures.map(f => `- ${f.name}: ${f.error}`).join('\n')}
` : ''}
    `;

    // Create nodemailer transporter
    const transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env['GMAIL_USER'] || 'your-email@gmail.com',
        pass: process.env['GMAIL_APP_PASSWORD'] || 'your-app-password'
      }
    });

    await transporter.sendMail({
      from: `Global Price Pulse <${process.env['GMAIL_USER'] || 'your-email@gmail.com'}>`,
      to: config.notification.email,
      subject: emailSubject,
      text: emailBody
    });

    console.log('📧 Email report sent successfully');
    
  } catch (error) {
    console.error('Failed to send email report:', error);
  }
}

async function logReportToConsole(report: ScrapingReport): Promise<void> {
  const successRate = report.metadata.totalProducts > 0 
    ? Math.round((report.successes.length / report.metadata.totalProducts) * 100)
    : 0;

  console.log('\n' + '='.repeat(50));
  console.log('📊 GPP AGENT DAILY REPORT');
  console.log('='.repeat(50));
  console.log(`📈 Total Products: ${report.metadata.totalProducts}`);
  console.log(`✅ Successful Scrapes: ${report.successes.length}`);
  console.log(`❌ Failed Scrapes: ${report.failures.length}`);
  console.log(`📊 Success Rate: ${successRate}%`);
  console.log(`⏱️ Duration: ${report.metadata.duration}s`);
  console.log(`🕐 Timestamp: ${new Date(report.metadata.timestamp).toLocaleString()}`);
  
  if (report.successes.length > 0) {
    console.log('\n✅ SUCCESSFUL SCRAPES:');
    report.successes.forEach(s => {
      console.log(`  • ${s.name} (${s.category})`);
    });
  }
  
  if (report.failures.length > 0) {
    console.log('\n❌ FAILED SCRAPES:');
    report.failures.forEach(f => {
      console.log(`  • ${f.name}: ${f.error}`);
    });
  }
  
  console.log('='.repeat(50) + '\n');
} 