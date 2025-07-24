import nodemailer from 'nodemailer';

export async function sendReport(successes: string[], failures: { name: string; error: string }[]) {
  const transporter = nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER || 'your-email@gmail.com',
      pass: process.env.GMAIL_APP_PASSWORD || 'your-app-password'
    }
  });

  const subject = `[GPP-Agent] Daily Report - ${new Date().toISOString().split('T')[0]}`;
  const text = `✅ 성공: ${successes.length}건\n❌ 실패: ${failures.length}건\n\n` +
    successes.map(p => `- ${p}`).join('\n') +
    '\n\n실패 항목:\n' +
    failures.map(f => `- ${f.name}: ${f.error}`).join('\n');

  await transporter.sendMail({
    from: `Global Price Pulse <${process.env.GMAIL_USER || 'your-email@gmail.com'}>`,
    to: 'ethancho12@gmail.com',
    subject,
    text
  });

  console.log('📧 Email report sent successfully');
} 