import webpush from 'web-push';
import { pushDb } from '../database/db.js';

// VAPID keys for push notifications - these should be set in environment variables
// Generate with: npx web-push generate-vapid-keys
const VAPID_SUBJECT = process.env.VAPID_SUBJECT || 'mailto:your-email@example.com';
const VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY;
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY;

let pushNotificationsEnabled = false;

// Initialize web-push with VAPID details
export function initializePushService() {
  try {
    if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) {
      console.log('⚠️  Push notifications disabled: VAPID keys not configured');
      console.log('   Generate keys with: npx web-push generate-vapid-keys');
      console.log('   Then set VAPID_PUBLIC_KEY and VAPID_PRIVATE_KEY environment variables');
      return false;
    }

    webpush.setVapidDetails(
      VAPID_SUBJECT,
      VAPID_PUBLIC_KEY,
      VAPID_PRIVATE_KEY
    );

    pushNotificationsEnabled = true;
    console.log('✅ Push notifications service initialized');
    return true;
  } catch (error) {
    console.error('❌ Failed to initialize push notifications:', error);
    return false;
  }
}

// Get VAPID public key for client subscription
export function getVapidPublicKey() {
  return VAPID_PUBLIC_KEY;
}

// Send push notification to specific user
export async function sendPushNotificationToUser(userId, title, body, data = {}) {
  if (!pushNotificationsEnabled) {
    console.log('Push notifications disabled, skipping notification');
    return false;
  }

  try {
    const subscriptions = pushDb.getUserPushSubscriptions(userId);
    
    if (subscriptions.length === 0) {
      console.log(`No push subscriptions found for user ${userId}`);
      return false;
    }

    const payload = JSON.stringify({
      title: title || 'Claude Code',
      body: body || 'Task completed',
      icon: '/icon-192.png',
      badge: '/icon-192.png',
      tag: 'claude-response',
      data: {
        ...data,
        timestamp: Date.now()
      }
    });

    const results = await Promise.allSettled(
      subscriptions.map(async (subscription) => {
        try {
          await webpush.sendNotification(subscription, payload);
          console.log(`✅ Push notification sent to user ${userId}`);
          return { success: true };
        } catch (error) {
          console.error(`❌ Failed to send push notification to user ${userId}:`, error);
          
          // If subscription is invalid (410 Gone), remove it from database
          if (error.statusCode === 410) {
            console.log('Removing invalid push subscription');
            pushDb.removePushSubscription(userId, subscription.endpoint);
          }
          
          return { success: false, error };
        }
      })
    );

    // Return true if at least one notification was sent successfully
    return results.some(result => result.status === 'fulfilled' && result.value.success);
    
  } catch (error) {
    console.error('❌ Error sending push notification:', error);
    return false;
  }
}

// Send push notification to all users
export async function sendPushNotificationToAll(title, body, data = {}) {
  if (!pushNotificationsEnabled) {
    console.log('Push notifications disabled, skipping broadcast notification');
    return false;
  }

  try {
    const allSubscriptions = pushDb.getAllActivePushSubscriptions();
    
    if (allSubscriptions.length === 0) {
      console.log('No active push subscriptions found');
      return false;
    }

    const payload = JSON.stringify({
      title: title || 'Claude Code',
      body: body || 'Task completed',
      icon: '/icon-192.png',
      badge: '/icon-192.png',
      tag: 'claude-response',
      data: {
        ...data,
        timestamp: Date.now()
      }
    });

    let successCount = 0;
    
    for (const userSub of allSubscriptions) {
      try {
        await webpush.sendNotification(userSub.subscription, payload);
        console.log(`✅ Push notification sent to user ${userSub.username}`);
        successCount++;
      } catch (error) {
        console.error(`❌ Failed to send push notification to user ${userSub.username}:`, error);
        
        // If subscription is invalid (410 Gone), remove it from database
        if (error.statusCode === 410) {
          console.log(`Removing invalid push subscription for user ${userSub.username}`);
          pushDb.removePushSubscription(userSub.userId, userSub.subscription.endpoint);
        }
      }
    }

    console.log(`📊 Push notifications sent: ${successCount}/${allSubscriptions.length}`);
    return successCount > 0;
    
  } catch (error) {
    console.error('❌ Error sending broadcast push notification:', error);
    return false;
  }
}

// Check if push notifications are enabled
export function isPushNotificationsEnabled() {
  return pushNotificationsEnabled;
}