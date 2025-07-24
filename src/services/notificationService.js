// Automated Notification Service for Arbitrage Alerts
import { collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

class NotificationService {
  constructor() {
    this.alertTypes = {
      'high_savings': {
        threshold: 30,
        message: '🔥 High savings opportunity detected!',
        priority: 'high'
      },
      'tariff_change': {
        threshold: 0,
        message: '⚠️ Tariff changes affecting prices',
        priority: 'high'
      },
      'price_drop': {
        threshold: 20,
        message: '📉 Significant price drop detected',
        priority: 'medium'
      },
      'new_opportunity': {
        threshold: 15,
        message: '✨ New arbitrage opportunity found',
        priority: 'medium'
      }
    };
  }

  // Check for new arbitrage opportunities and send alerts
  async checkAndSendAlerts(opportunities) {
    const alerts = [];
    
    for (const opportunity of opportunities) {
      // Check for high savings
      if (opportunity.netSavings >= this.alertTypes.high_savings.threshold) {
        alerts.push({
          type: 'high_savings',
          product: opportunity.name,
          savings: opportunity.netSavings,
          message: `${this.alertTypes.high_savings.message} Save ${opportunity.netSavings}% on ${opportunity.name}`,
          priority: 'high',
          data: opportunity
        });
      }
      
      // Check for new opportunities
      if (opportunity.netSavings >= this.alertTypes.new_opportunity.threshold) {
        alerts.push({
          type: 'new_opportunity',
          product: opportunity.name,
          savings: opportunity.netSavings,
          message: `${this.alertTypes.new_opportunity.message} ${opportunity.name} - ${opportunity.netSavings}% savings`,
          priority: 'medium',
          data: opportunity
        });
      }
    }

    // Send alerts to subscribers
    if (alerts.length > 0) {
      await this.sendAlertsToSubscribers(alerts);
    }

    return alerts;
  }

  // Send alerts to newsletter subscribers
  async sendAlertsToSubscribers(alerts) {
    try {
      // Get active subscribers
      const subscribersQuery = query(
        collection(db, 'newsletter_subscribers'),
        where('status', '==', 'active')
      );
      
      const subscribersSnapshot = await getDocs(subscribersQuery);
      const subscribers = subscribersSnapshot.docs.map(doc => doc.data());

      // Create alert records
      for (const alert of alerts) {
        await addDoc(collection(db, 'alerts'), {
          ...alert,
          timestamp: serverTimestamp(),
          sentTo: subscribers.length,
          status: 'sent'
        });
      }

      console.log(`Sent ${alerts.length} alerts to ${subscribers.length} subscribers`);
      
    } catch (error) {
      console.error('Error sending alerts:', error);
    }
  }

  // Generate email content for alerts
  generateEmailContent(alerts) {
    const highPriorityAlerts = alerts.filter(alert => alert.priority === 'high');
    const mediumPriorityAlerts = alerts.filter(alert => alert.priority === 'medium');

    let content = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1f2937;">🚀 Arbitrage Alert</h2>
        <p style="color: #6b7280;">New opportunities detected in the market!</p>
    `;

    if (highPriorityAlerts.length > 0) {
      content += `
        <h3 style="color: #dc2626;">🔥 High Priority Alerts</h3>
        <ul>
      `;
      highPriorityAlerts.forEach(alert => {
        content += `<li style="margin-bottom: 10px;"><strong>${alert.product}</strong> - Save ${alert.savings}%</li>`;
      });
      content += '</ul>';
    }

    if (mediumPriorityAlerts.length > 0) {
      content += `
        <h3 style="color: #d97706;">✨ New Opportunities</h3>
        <ul>
      `;
      mediumPriorityAlerts.forEach(alert => {
        content += `<li style="margin-bottom: 10px;"><strong>${alert.product}</strong> - Save ${alert.savings}%</li>`;
      });
      content += '</ul>';
    }

    content += `
        <div style="margin-top: 20px; padding: 15px; background-color: #f3f4f6; border-radius: 8px;">
          <p style="margin: 0; color: #374151;">
            <strong>💡 Tip:</strong> Act quickly on these opportunities as prices can change rapidly!
          </p>
        </div>
        <p style="color: #6b7280; font-size: 12px; margin-top: 20px;">
          You're receiving this because you subscribed to arbitrage alerts. 
          <a href="#" style="color: #3b82f6;">Unsubscribe</a>
        </p>
      </div>
    `;

    return content;
  }

  // Schedule recurring alerts
  async scheduleRecurringAlerts() {
    // This would integrate with a cron job or cloud function
    // For now, we'll simulate scheduling
    const schedule = {
      daily: '0 9 * * *', // 9 AM daily
      weekly: '0 9 * * 1', // 9 AM every Monday
      monthly: '0 9 1 * *' // 9 AM on the 1st of every month
    };

    return schedule;
  }

  // Get alert statistics
  async getAlertStats() {
    try {
      const alertsQuery = query(
        collection(db, 'alerts'),
        where('timestamp', '>=', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)) // Last 7 days
      );
      
      const alertsSnapshot = await getDocs(alertsQuery);
      const alerts = alertsSnapshot.docs.map(doc => doc.data());

      return {
        totalAlerts: alerts.length,
        highPriority: alerts.filter(alert => alert.priority === 'high').length,
        mediumPriority: alerts.filter(alert => alert.priority === 'medium').length,
        averageSavings: Math.round(
          alerts.reduce((sum, alert) => sum + alert.savings, 0) / alerts.length
        )
      };
    } catch (error) {
      console.error('Error getting alert stats:', error);
      return null;
    }
  }
}

export default new NotificationService(); 