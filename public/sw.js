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

// Handle push messages (for future push notification support)
self.addEventListener('push', event => {
  console.log('📳 Service Worker: Push received');
  
  const options = {
    body: event.data ? event.data.text() : 'Default notification body',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    tag: 'claude-response',
    renotify: true,
    data: {
      url: '/'
    }
  };
  
  event.waitUntil(
    self.registration.showNotification('Claude Code', options)
  );
});

// Message handler for communication with main app
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SHOW_NOTIFICATION') {
    console.log('📳 Service Worker: Showing notification via message');
    
    const { title, body, icon, badge, tag } = event.data.payload;
    
    self.registration.showNotification(title || 'Claude Code', {
      body: body || 'Response completed',
      icon: icon || '/icon-192.png',
      badge: badge || '/icon-192.png',
      tag: tag || 'claude-response',
      renotify: true,
      requireInteraction: false,
      silent: false
    });
  }
});