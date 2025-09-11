// Extract meaningful content from todo list for notifications
export const getTodoNotificationContent = (todos) => {
  console.log('📋 getTodoNotificationContent called with todos:', todos);
  
  if (!todos || !Array.isArray(todos) || todos.length === 0) {
    console.log('📋 No todos available');
    return null;
  }
  
  // Find the last completed or in-progress todo with meaningful content
  const meaningfulTodos = todos.filter(todo => 
    todo.content && 
    todo.content.trim() && 
    (todo.status === 'completed' || todo.status === 'in_progress')
  );
  
  console.log('📋 Meaningful todos found:', meaningfulTodos);
  
  if (meaningfulTodos.length === 0) {
    console.log('📋 No meaningful todos found');
    return null;
  }
  
  const lastTodo = meaningfulTodos[meaningfulTodos.length - 1];
  console.log('📋 Last todo:', lastTodo);
  
  // Use activeForm for in-progress todos, content for completed todos
  if (lastTodo.status === 'in_progress' && lastTodo.activeForm) {
    console.log('📋 Using activeForm:', lastTodo.activeForm);
    return lastTodo.activeForm;
  }
  
  console.log('📋 Using content:', lastTodo.content);
  return lastTodo.content;
};

// Create smart notification body based on message content
const createNotificationBody = (content) => {
  if (!content || !content.trim()) {
    return 'Task completed';
  }

  // Clean up the content and get first meaningful line
  const cleanContent = content
    .replace(/^\s*```[\s\S]*?```\s*/gm, '[Code block] ') // Replace code blocks with placeholder
    .replace(/^\s*<function_calls>[\s\S]*?<\/antml:function_calls>\s*/gm, '[Tool use] ') // Replace tool calls
    .replace(/^\s*-\s+/gm, '') // Remove bullet points
    .replace(/^\s*\d+\.\s+/gm, '') // Remove numbered lists
    .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold formatting
    .replace(/\*(.*?)\*/g, '$1') // Remove italic formatting
    .replace(/`(.*?)`/g, '$1') // Remove inline code formatting
    .replace(/\n+/g, ' ') // Replace multiple newlines with spaces
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();

  // Get first sentence or up to 80 characters
  let summary = cleanContent;
  
  // Try to find first sentence
  const sentenceMatch = cleanContent.match(/^[^.!?]*[.!?]/);
  if (sentenceMatch) {
    summary = sentenceMatch[0].trim();
  }
  
  // If still too long, truncate at word boundary
  if (summary.length > 80) {
    const truncated = summary.substring(0, 77);
    const lastSpace = truncated.lastIndexOf(' ');
    summary = (lastSpace > 40 ? truncated.substring(0, lastSpace) : truncated) + '...';
  }
  
  return summary || 'Task completed';
};

// Centralized notification utility
export const sendNotification = (title = 'Claude Code', body = 'Task completed', content = null) => {
  // Use smart body generation if content is provided
  const notificationBody = content ? createNotificationBody(content) : body;
  console.log('🔔 sendNotification called');
  console.log('📋 Notification params:', { title, body, content });
  console.log('📋 Final notification body:', notificationBody);
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
          body: notificationBody,
          icon: '/icon-192.png',
          badge: '/icon-192.png',
          tag: 'claude-response'
        }
      });
    } else {
      // Use direct Notification API for browser mode
      console.log('📳 Using direct Notification API for browser');
      const notification = new Notification(title, {
        body: notificationBody,
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