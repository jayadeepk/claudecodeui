// Service Worker for Claude Code UI PWA
const CACHE_NAME = 'claude-ui-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json'
];

// Install event
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting();
});

// Fetch event
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached response if found
        if (response) {
          return response;
        }
        // Otherwise fetch from network
        return fetch(event.request);
      }
    )
  );
});

// Activate event
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Notification event handlers for Android PWA
self.addEventListener('notificationshow', event => {
  console.log('📳 Service Worker: Notification shown', event.notification.tag);
});

self.addEventListener('notificationclick', event => {
  console.log('📳 Service Worker: Notification clicked', event.notification.tag);
  
  event.notification.close();
  
  // Focus or open the PWA when notification is clicked
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      // If there's already a window open, focus it
      for (const client of clientList) {
        if (client.url === self.registration.scope && 'focus' in client) {
          return client.focus();
        }
      }
      // Otherwise open a new window
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});

// Handle push messages from server
self.addEventListener('push', event => {
  console.log('📳 Service Worker: Push received');
  
  let notificationData = {
    title: 'Claude Code',
    body: 'Task completed',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    tag: 'claude-response',
    renotify: true,
    requireInteraction: false,
    silent: false,
    data: {
      url: '/',
      timestamp: Date.now()
    }
  };
  
  // Parse push data if available
  if (event.data) {
    try {
      const pushData = event.data.json();
      notificationData = {
        ...notificationData,
        ...pushData
      };
    } catch (error) {
      console.error('Failed to parse push data:', error);
      // Fall back to text if JSON parsing fails
      notificationData.body = event.data.text();
    }
  }
  
  console.log('📳 Service Worker: Showing notification:', notificationData.title);
  
  event.waitUntil(
    self.registration.showNotification(notificationData.title, {
      body: notificationData.body,
      icon: notificationData.icon,
      badge: notificationData.badge,
      tag: notificationData.tag,
      renotify: notificationData.renotify,
      requireInteraction: notificationData.requireInteraction,
      silent: notificationData.silent,
      data: notificationData.data
    })
  );
});

// Message handler for communication with main app
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SHOW_NOTIFICATION') {
    console.log('📳 Service Worker: Showing notification via message');
    
    const { title, body, icon, badge, tag } = event.data.payload;
    
    self.registration.showNotification(title || 'Claude Code', {
      body: body || 'Task completed',
      icon: icon || '/icon-192.png',
      badge: badge || '/icon-192.png',
      tag: tag || 'claude-response',
      renotify: true,
      requireInteraction: false,
      silent: false
    });
  }
});