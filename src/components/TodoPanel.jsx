import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, ListTodo, CheckCircle2, Clock, Circle, X } from 'lucide-react';
import { Badge } from './ui/badge';

const TodoPanel = ({ todos, isOpen, onToggle, isMobile }) => {
  const [isCollapsed, setIsCollapsed] = useState(!isOpen);

  useEffect(() => {
    setIsCollapsed(!isOpen);
  }, [isOpen]);

  const handleToggle = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    onToggle(!newState);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-4 h-4 text-green-500 dark:text-green-400" />;
      case 'in_progress':
        return <Clock className="w-4 h-4 text-blue-500 dark:text-blue-400 animate-pulse" />;
      case 'pending':
      default:
        return <Circle className="w-4 h-4 text-gray-400 dark:text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200';
      case 'in_progress':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200';
      case 'pending':
      default:
        return 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400';
    }
  };

  const completedCount = todos?.filter(t => t.status === 'completed').length || 0;
  const totalCount = todos?.length || 0;
  const progressPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  // Mobile drawer/modal view
  if (isMobile) {
    if (isCollapsed) return null;
    
    return (
      <div className="fixed inset-0 z-40 flex">
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm"
          onClick={handleToggle}
        />
        <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 max-h-[70vh] flex flex-col animate-slide-up">
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <ListTodo className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <h3 className="font-semibold text-gray-900 dark:text-white">Task Progress</h3>
              <Badge variant="outline" className="text-xs">
                {completedCount}/{totalCount}
              </Badge>
            </div>
            <button
              onClick={handleToggle}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {totalCount > 0 && (
            <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700">
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-blue-600 dark:bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
          )}
          
          <div className="flex-1 overflow-y-auto p-4 pb-20">
            {todos && todos.length > 0 ? (
              <div className="space-y-2">
                {todos.map((todo, index) => (
                  <div
                    key={todo.id || index}
                    className={`flex items-start gap-3 p-3 rounded-lg border ${
                      todo.status === 'in_progress' 
                        ? 'border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20' 
                        : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
                    }`}
                  >
                    <div className="flex-shrink-0 mt-0.5">
                      {getStatusIcon(todo.status)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm ${
                        todo.status === 'completed' 
                          ? 'line-through text-gray-500 dark:text-gray-400' 
                          : todo.status === 'in_progress'
                          ? 'font-medium text-gray-900 dark:text-white'
                          : 'text-gray-700 dark:text-gray-300'
                      }`}>
                        {todo.status === 'in_progress' && todo.activeForm ? todo.activeForm : todo.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <ListTodo className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No active tasks</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Desktop side panel view
  return (
    <div className={`relative transition-all duration-300 ${
      isCollapsed ? 'w-0' : 'w-80'
    } border-l border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800`}>
      {/* Toggle button */}
      <button
        onClick={handleToggle}
        className="absolute -left-10 top-24 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 border-r-0 rounded-l-md px-2.5 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center justify-center group shadow-lg transition-colors"
        title={isCollapsed ? 'Show todo panel' : 'Hide todo panel'}
      >
        <svg className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      </button>

      {/* Panel content */}
      <div className={`h-full flex flex-col overflow-hidden ${
        isCollapsed ? 'invisible' : 'visible'
      }`}>
        {/* Header */}
        <div className="flex-shrink-0 p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <ListTodo className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <h3 className="font-semibold text-gray-900 dark:text-white">Task Progress</h3>
            </div>
            <Badge variant="outline" className="text-xs">
              {completedCount}/{totalCount}
            </Badge>
          </div>
          
          {totalCount > 0 && (
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-blue-600 dark:bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          )}
        </div>

        {/* Todo list */}
        <div className="flex-1 overflow-y-auto p-4">
          {todos && todos.length > 0 ? (
            <div className="space-y-2">
              {todos.map((todo, index) => (
                <div
                  key={todo.id || index}
                  className={`flex items-start gap-3 p-3 rounded-lg border transition-all ${
                    todo.status === 'in_progress' 
                      ? 'border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20 shadow-sm' 
                      : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
                  }`}
                >
                  <div className="flex-shrink-0 mt-0.5">
                    {getStatusIcon(todo.status)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm ${
                      todo.status === 'completed' 
                        ? 'line-through text-gray-500 dark:text-gray-400' 
                        : todo.status === 'in_progress'
                        ? 'font-medium text-gray-900 dark:text-white'
                        : 'text-gray-700 dark:text-gray-300'
                    }`}>
                      {todo.status === 'in_progress' && todo.activeForm ? todo.activeForm : todo.content}
                    </p>
                    {todo.status === 'in_progress' && (
                      <div className="mt-1">
                        <span className="inline-flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400">
                          <Clock className="w-3 h-3 animate-pulse" />
                          In progress...
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <ListTodo className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm">No active tasks</p>
              <p className="text-xs mt-1">Tasks will appear here when Claude is working</p>
            </div>
          )}
        </div>

        {/* Footer with stats */}
        {todos && todos.length > 0 && (
          <div className="flex-shrink-0 p-3 border-t border-gray-200 dark:border-gray-700">
            <div className="flex justify-around text-xs">
              <div className="text-center">
                <div className="font-semibold text-gray-600 dark:text-gray-400">Pending</div>
                <div className="text-gray-900 dark:text-white">
                  {todos.filter(t => t.status === 'pending').length}
                </div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-blue-600 dark:text-blue-400">Active</div>
                <div className="text-gray-900 dark:text-white">
                  {todos.filter(t => t.status === 'in_progress').length}
                </div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-green-600 dark:text-green-400">Done</div>
                <div className="text-gray-900 dark:text-white">
                  {todos.filter(t => t.status === 'completed').length}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TodoPanel;