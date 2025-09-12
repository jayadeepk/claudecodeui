import { api } from './api';

let pushSubscription = null;

// Check if push notifications are supported
export function isPushNotificationSupported() {
  return 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
}

// Get current push subscription status
export function getPushSubscriptionStatus() {
  return {
    supported: isPushNotificationSupported(),
    permission: Notification?.permission,
    subscribed: pushSubscription !== null
  };
}

// Request notification permission
export async function requestNotificationPermission() {
  if (!isPushNotificationSupported()) {
    throw new Error('Push notifications not supported');
  }

  if (Notification.permission === 'denied') {
    throw new Error('Notification permission denied. Please enable in browser settings.');
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  const permission = await Notification.requestPermission();
  return permission === 'granted';
}

// Subscribe to push notifications
export async function subscribeToPushNotifications() {
  try {
    console.log('🔔 Starting push notification subscription process');

    // Check support
    if (!isPushNotificationSupported()) {
      throw new Error('Push notifications not supported');
    }

    // Request permission
    const hasPermission = await requestNotificationPermission();
    if (!hasPermission) {
      throw new Error('Notification permission not granted');
    }

    // Get service worker registration
    const registration = await navigator.serviceWorker.ready;
    console.log('✅ Service worker ready');

    // Get VAPID public key from server
    const response = await api('/push/vapid-public-key');
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to get VAPID public key');
    }
    const { publicKey } = await response.json();
    console.log('✅ Got VAPID public key');

    // Subscribe to push service
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicKey)
    });

    console.log('✅ Push subscription created:', subscription.endpoint);

    // Send subscription to server
    const subscribeResponse = await api('/push/subscribe', {
      method: 'POST',
      body: JSON.stringify({ subscription })
    });

    if (!subscribeResponse.ok) {
      const error = await subscribeResponse.json();
      throw new Error(error.error || 'Failed to save push subscription');
    }

    pushSubscription = subscription;
    console.log('✅ Push notification subscription successful');
    
    return subscription;

  } catch (error) {
    console.error('❌ Push notification subscription failed:', error);
    throw error;
  }
}

// Unsubscribe from push notifications
export async function unsubscribeFromPushNotifications() {
  try {
    if (!pushSubscription) {
      console.log('No push subscription to unsubscribe from');
      return true;
    }

    // Unsubscribe from push service
    const success = await pushSubscription.unsubscribe();
    
    if (success) {
      // Remove from server
      await api('/push/unsubscribe', {
        method: 'POST',
        body: JSON.stringify({ endpoint: pushSubscription.endpoint })
      });

      pushSubscription = null;
      console.log('✅ Push notification unsubscription successful');
    }

    return success;
  } catch (error) {
    console.error('❌ Push notification unsubscription failed:', error);
    throw error;
  }
}

// Test push notification
export async function testPushNotification(title = 'Test Notification', body = 'This is a test push notification') {
  try {
    const response = await api('/push/test', {
      method: 'POST',
      body: JSON.stringify({ title, body })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to send test notification');
    }

    console.log('✅ Test push notification sent');
    return true;
  } catch (error) {
    console.error('❌ Test push notification failed:', error);
    throw error;
  }
}

// Initialize push notifications (check existing subscription)
export async function initializePushNotifications() {
  try {
    if (!isPushNotificationSupported()) {
      console.log('Push notifications not supported');
      return false;
    }

    const registration = await navigator.serviceWorker.ready;
    const existingSubscription = await registration.pushManager.getSubscription();
    
    if (existingSubscription) {
      pushSubscription = existingSubscription;
      console.log('✅ Existing push subscription found');
      return true;
    }

    console.log('No existing push subscription found');
    return false;
  } catch (error) {
    console.error('❌ Failed to initialize push notifications:', error);
    return false;
  }
}

// Utility function to convert VAPID key
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}