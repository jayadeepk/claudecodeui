// Centralized notification utility
export const sendNotification = (title = 'Claude Code', body = 'Response completed') => {
  console.log('🔔 sendNotification called');
  console.log('HTTPS context:', window.location.protocol === 'https:');
  console.log('Notification available:', 'Notification' in window);
  console.log('Notification permission:', Notification?.permission);
  console.log('Document has focus:', document.hasFocus());
  
  // Check if notifications are supported and permitted
  if (!('Notification' in window) || Notification.permission !== 'granted') {
    console.log('❌ Notifications not supported or permission not granted');
    return false;
  }
  
  // Check for secure context
  if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost') {
    console.log('❌ Notifications require HTTPS or localhost');
    return false;
  }
  
  try {
    console.log('📳 Sending notification...');
    
    // Check if we're in PWA mode and service worker is available
    const isPWA = window.matchMedia('(display-mode: standalone)').matches;
    
    if (isPWA && 'serviceWorker' in navigator && navigator.serviceWorker.controller) {
      // Use service worker for PWA notifications (better Android compatibility)
      console.log('📳 Using service worker for PWA notification');
      navigator.serviceWorker.controller.postMessage({
        type: 'SHOW_NOTIFICATION',
        payload: {
          title,
          body,
          icon: '/icon-192.png',
          badge: '/icon-192.png',
          tag: 'claude-response'
        }
      });
    } else {
      // Use direct Notification API for browser mode
      console.log('📳 Using direct Notification API for browser');
      const notification = new Notification(title, {
        body,
        icon: '/icon-192.png',
        badge: '/icon-192.png',
        tag: 'claude-response',
        renotify: true
      });
      
      // Auto-close after 3 seconds
      setTimeout(() => {
        notification.close();
      }, 3000);
    }
    
    console.log('Notification sent successfully');
    return true;
  } catch (error) {
    console.error('Notification error:', error);
    return false;
  }
};