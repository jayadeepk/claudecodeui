import React from 'react';

const TaskProgressButton = ({ 
  isOpen, 
  onToggle, 
  hasActiveTodos,
  className = "" 
}) => {
  return (
    <button
      onClick={() => {
        if (onToggle) {
          onToggle(!isOpen);
          localStorage.setItem('todoPanelOpen', JSON.stringify(!isOpen));
        }
      }}
      className={`p-2.5 rounded-full touch-manipulation active:scale-95 flex-shrink-0 relative transition-colors ${
        isOpen 
          ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20' 
          : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
      } ${className}`}
      title={isOpen ? 'Hide Task Progress' : 'Show Task Progress'}
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
      {/* Show badge if there are active todos */}
      {hasActiveTodos && (
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse" />
      )}
    </button>
  );
};

export default TaskProgressButton;