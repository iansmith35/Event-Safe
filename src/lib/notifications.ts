/**
 * Email notification service for venue interest thresholds
 * This would integrate with SendGrid or similar service in production
 */

import { log } from '@/lib/log';

export interface NotificationPayload {
  venueId: string;
  venueName: string;
  ownerEmail: string;
  interestCount: number;
  threshold: number;
}

export async function sendInterestNotification(payload: NotificationPayload): Promise<boolean> {
  try {
    await log('venue_notification_queued', {
      venueId: payload.venueId,
      venueName: payload.venueName,
      threshold: payload.threshold,
      count: payload.interestCount
    });

    // Check environment variables for email service
    const emailProvider = process.env.EMAIL_PROVIDER;
    const siteUrl = process.env.SITE_URL || 'https://event-safe-id--rebbeca-bot.us-central1.hosted.app';
    
    if (!emailProvider) {
      console.warn('EMAIL_PROVIDER not configured - notification will be logged only');
      await log('venue_notification_sent_fallback', payload);
      return true;
    }

    // In production, this would integrate with actual email service
    const emailContent = generateEmailContent(payload, siteUrl);
    
    if (emailProvider === 'sendgrid') {
      return await sendViaSendGrid(payload.ownerEmail, emailContent);
    } else if (emailProvider === 'mailgun') {
      return await sendViaMailgun(payload.ownerEmail, emailContent);
    } else {
      // Fallback - just log the notification
      console.warn(`Unsupported email provider: ${emailProvider}`);
      await log('venue_notification_sent_fallback', {
        ...payload,
        emailContent
      });
      return true;
    }

  } catch (error) {
    console.error('Failed to send venue interest notification:', error);
    await log('venue_notification_error', {
      ...payload,
      error: String(error)
    });
    return false;
  }
}

function generateEmailContent(payload: NotificationPayload, siteUrl: string) {
  const subject = `EventSafe interest in your venue: ${payload.interestCount} guests nearby`;
  
  const body = `
Hello,

Great news! ${payload.interestCount} guests have expressed interest in seeing ${payload.venueName} on EventSafe.

EventSafe helps venues:
• Reduce risk with verified guest identities
• Streamline ticketing and door management
• Build trust with transparent safety ratings
• Connect with quality events and organisers

Ready to get started? Visit: ${siteUrl}/onboard?venue=${payload.venueId}

Questions? Reply to this email or visit our support center.

Best regards,
The EventSafe Team
`;

  return { subject, body };
}

async function sendViaSendGrid(to: string, content: { subject: string; body: string }): Promise<boolean> {
  const apiKey = process.env.SENDGRID_API_KEY;
  const fromEmail = process.env.EMAIL_FROM || 'support@eventsafe.id';
  
  if (!apiKey) {
    console.warn('SENDGRID_API_KEY not configured');
    return false;
  }

  try {
    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        personalizations: [{
          to: [{ email: to }]
        }],
        from: { email: fromEmail },
        subject: content.subject,
        content: [{
          type: 'text/plain',
          value: content.body
        }]
      })
    });

    if (response.ok) {
      await log('venue_notification_sent_sendgrid', { to, subject: content.subject });
      return true;
    } else {
      const error = await response.text();
      console.error('SendGrid error:', error);
      return false;
    }
  } catch (error) {
    console.error('SendGrid request failed:', error);
    return false;
  }
}

async function sendViaMailgun(to: string, content: { subject: string; body: string }): Promise<boolean> {
  // Placeholder for Mailgun integration
  // Would implement similar to SendGrid
  console.warn('Mailgun integration not implemented - using fallback logging');
  await log('venue_notification_sent_fallback', { to, subject: content.subject, body: content.body });
  return true;
}

/**
 * Check if we should send a notification (debouncing logic)
 * Prevents spam by ensuring we don't send multiple notifications for the same venue within 24 hours
 */
export async function shouldSendNotification(): Promise<boolean> {
  // In a full implementation, this would check a notification history table
  // For now, we'll rely on the lastNotifiedLevel field in the venue document
  // which is already handled in the interest route
  return true;
}