const nodemailer = require('nodemailer');

async function sendReport(successes, failures) {
  try {
    console.log('📧 Sending email report...');
    
    const report = generateReport(successes, failures);
    await sendEmailReport(report);
    
    console.log('✅ Email report sent successfully');
    
  } catch (error) {
    console.error('❌ Failed to send report:', error);
  }
}

function generateReport(successes, failures) {
  const total = successes.length + failures.length;
  const successRate = total > 0 ? ((successes.length / total) * 100).toFixed(1) : 0;
  
  const report = {
    subject: `[GPP-Agent] Daily Report - ${new Date().toISOString().split('T')[0]}`,
    body: `
🚀 GPP Agent Daily Report

📊 Summary:
• Total Products Processed: ${total}
• Successful Scrapes: ${successes.length}
• Failed Scrapes: ${failures.length}
• Success Rate: ${successRate}%

✅ Successful Products:
${successes.map(product => `• ${product}`).join('\n')}

❌ Failed Products:
${failures.map(failure => `• ${failure.name}: ${failure.error}`).join('\n')}

📅 Generated: ${new Date().toISOString()}
🤖 Source: GPP Agent
    `.trim()
  };
  
  return report;
}

async function sendEmailReport(report) {
  try {
    console.log('📧 Creating email transporter...');
    
    // Create transporter with correct function name
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD
      }
    });
    
    console.log('📧 Email transporter created successfully');
    
    // Email options
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: 'ethancho12@gmail.com',
      subject: report.subject,
      text: report.body,
      html: report.body.replace(/\n/g, '<br>')
    };
    
    console.log('📧 Sending email...');
    
    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log(`📧 Email sent: ${info.messageId}`);
    
  } catch (error) {
    console.error('❌ Failed to send email:', error);
    throw error;
  }
}

module.exports = { sendReport }; 