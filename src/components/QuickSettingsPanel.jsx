import React, { useState, useEffect } from 'react';
import { 
  Maximize2, 
  Eye, 
  Settings2,
  Moon,
  Sun,
  ArrowDown,
  Mic,
  Brain,
  Sparkles,
  FileText,
  Languages,
  Zap,
  ListTodo,
  Monitor
} from 'lucide-react';
import DarkModeToggle from './DarkModeToggle';
import { useTheme } from '../contexts/ThemeContext';

const QuickSettingsPanel = ({ 
  isOpen, 
  onToggle,
  autoExpandTools,
  onAutoExpandChange,
  showRawParameters,
  onShowRawParametersChange,
  autoScrollToBottom,
  onAutoScrollChange,
  sendByCtrlEnter,
  onSendByCtrlEnterChange,
  permissionMode,
  onPermissionModeChange,
  todoPanelOpen,
  onTodoPanelChange,
  isMobile
}) => {
  const [localIsOpen, setLocalIsOpen] = useState(isOpen);
  const [whisperMode, setWhisperMode] = useState(() => {
    return localStorage.getItem('whisperMode') || 'default';
  });
  const { isDarkMode, useBrowserTheme, toggleBrowserTheme } = useTheme();

  useEffect(() => {
    setLocalIsOpen(isOpen);
  }, [isOpen]);

  const handleToggle = () => {
    const newState = !localIsOpen;
    setLocalIsOpen(newState);
    onToggle(newState);
  };

  const handleModeSwitch = () => {
    if (!onPermissionModeChange) return;
    const modes = ['default', 'acceptEdits', 'bypassPermissions', 'plan'];
    const currentIndex = modes.indexOf(permissionMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    onPermissionModeChange(modes[nextIndex]);
  };

  return (
    <>
      {/* Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 shadow-xl transform transition-transform duration-150 ease-out z-40 ${
          localIsOpen ? 'translate-x-0' : 'translate-x-full'
        } ${isMobile ? 'h-screen' : ''}`}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Settings2 className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              Quick Settings
            </h3>
          </div>

          {/* Settings Content */}
          <div className={`flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-6 bg-white dark:bg-gray-900 ${isMobile ? 'pb-20' : ''}`}>
            {/* Appearance Settings */}
            <div className="space-y-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">Appearance</h4>
              
              <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border border-transparent hover:border-gray-300 dark:hover:border-gray-600">
                <span className="flex items-center gap-2 text-sm text-gray-900 dark:text-white">
                  {isDarkMode ? <Moon className="h-4 w-4 text-gray-600 dark:text-gray-400" /> : <Sun className="h-4 w-4 text-gray-600 dark:text-gray-400" />}
                  Dark Mode
                </span>
                <DarkModeToggle />
              </div>

              <label className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors border border-transparent hover:border-gray-300 dark:hover:border-gray-600">
                <span className="flex items-center gap-2 text-sm text-gray-900 dark:text-white">
                  <Monitor className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                  Use Browser Theme
                </span>
                <input
                  type="checkbox"
                  checked={useBrowserTheme}
                  onChange={toggleBrowserTheme}
                  className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-blue-600 dark:text-blue-500 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-800 dark:checked:bg-blue-600"
                />
              </label>
            </div>

            {/* Permission Mode Settings */}
            {permissionMode && (
              <div className="space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">Permission Mode</h4>
                
                <button
                  type="button"
                  onClick={handleModeSwitch}
                  className={`w-full p-3 rounded-lg text-sm font-medium border transition-all duration-200 text-left ${
                    permissionMode === 'default' 
                      ? 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600'
                      : permissionMode === 'acceptEdits'
                      ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-green-300 dark:border-green-600 hover:bg-green-100 dark:hover:bg-green-900/30'
                      : permissionMode === 'bypassPermissions'
                      ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 border-orange-300 dark:border-orange-600 hover:bg-orange-100 dark:hover:bg-orange-900/30'
                      : 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30'
                  }`}
                  title="Click to change permission mode"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${
                      permissionMode === 'default' 
                        ? 'bg-gray-500'
                        : permissionMode === 'acceptEdits'
                        ? 'bg-green-500'
                        : permissionMode === 'bypassPermissions'
                        ? 'bg-orange-500'
                        : 'bg-blue-500'
                    }`} />
                    <Zap className="h-4 w-4" />
                    <div className="flex-1">
                      <span className="font-medium">
                        {permissionMode === 'default' && 'Default Mode'}
                        {permissionMode === 'acceptEdits' && 'Accept Edits'}
                        {permissionMode === 'bypassPermissions' && 'Bypass Permissions'}
                        {permissionMode === 'plan' && 'Plan Mode'}
                      </span>
                    </div>
                  </div>
                </button>
                <p className="text-xs text-gray-500 dark:text-gray-400 ml-3">
                  Click to cycle through permission modes. You can also press Tab in the input field.
                </p>
              </div>
            )}

            {/* Tool Display Settings */}
            <div className="space-y-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">Tool Display</h4>
              
              <label className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors border border-transparent hover:border-gray-300 dark:hover:border-gray-600">
                <span className="flex items-center gap-2 text-sm text-gray-900 dark:text-white">
                  <Maximize2 className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                  Auto-expand tools
                </span>
                <input
                  type="checkbox"
                  checked={autoExpandTools}
                  onChange={(e) => onAutoExpandChange(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-blue-600 dark:text-blue-500 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-800 dark:checked:bg-blue-600"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors border border-transparent hover:border-gray-300 dark:hover:border-gray-600">
                <span className="flex items-center gap-2 text-sm text-gray-900 dark:text-white">
                  <Eye className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                  Show raw parameters
                </span>
                <input
                  type="checkbox"
                  checked={showRawParameters}
                  onChange={(e) => onShowRawParametersChange(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-blue-600 dark:text-blue-500 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-800 dark:checked:bg-blue-600"
                />
              </label>

              {!isMobile && (
                <label className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors border border-transparent hover:border-gray-300 dark:hover:border-gray-600">
                  <span className="flex items-center gap-2 text-sm text-gray-900 dark:text-white">
                    <ListTodo className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                    Show Task Progress
                  </span>
                  <input
                    type="checkbox"
                    checked={todoPanelOpen}
                    onChange={(e) => onTodoPanelChange(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-blue-600 dark:text-blue-500 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-800 dark:checked:bg-blue-600"
                  />
                </label>
              )}
            </div>
            {/* View Options */}
            <div className="space-y-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">View Options</h4>
              
              <label className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors border border-transparent hover:border-gray-300 dark:hover:border-gray-600">
                <span className="flex items-center gap-2 text-sm text-gray-900 dark:text-white">
                  <ArrowDown className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                  Auto-scroll to bottom
                </span>
                <input
                  type="checkbox"
                  checked={autoScrollToBottom}
                  onChange={(e) => onAutoScrollChange(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-blue-600 dark:text-blue-500 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-800 dark:checked:bg-blue-600"
                />
              </label>
            </div>

            {/* Input Settings */}
            <div className="space-y-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">Input Settings</h4>
              
              <label className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors border border-transparent hover:border-gray-300 dark:hover:border-gray-600">
                <span className="flex items-center gap-2 text-sm text-gray-900 dark:text-white">
                  <Languages className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                  Send by Ctrl+Enter
                </span>
                <input
                  type="checkbox"
                  checked={sendByCtrlEnter}
                  onChange={(e) => onSendByCtrlEnterChange(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-blue-600 dark:text-blue-500 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-800 dark:checked:bg-blue-600"
                />
              </label>
              <p className="text-xs text-gray-500 dark:text-gray-400 ml-3">
                When enabled, pressing Ctrl+Enter will send the message instead of just Enter. This is useful for IME users to avoid accidental sends.
              </p>
            </div>

            {/* Whisper Dictation Settings - HIDDEN */}
            <div className="space-y-2" style={{ display: 'none' }}>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">Whisper Dictation</h4>
              
              <div className="space-y-2">
                <label className="flex items-start p-3 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors border border-transparent hover:border-gray-300 dark:hover:border-gray-600">
                  <input
                    type="radio"
                    name="whisperMode"
                    value="default"
                    checked={whisperMode === 'default'}
                    onChange={() => {
                      setWhisperMode('default');
                      localStorage.setItem('whisperMode', 'default');
                      window.dispatchEvent(new Event('whisperModeChanged'));
                    }}
                    className="mt-0.5 h-4 w-4 border-gray-300 dark:border-gray-600 text-blue-600 dark:text-blue-500 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-800 dark:checked:bg-blue-600"
                  />
                  <div className="ml-3 flex-1">
                    <span className="flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-white">
                      <Mic className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                      Default Mode
                    </span>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Direct transcription of your speech
                    </p>
                  </div>
                </label>

                <label className="flex items-start p-3 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors border border-transparent hover:border-gray-300 dark:hover:border-gray-600">
                  <input
                    type="radio"
                    name="whisperMode"
                    value="prompt"
                    checked={whisperMode === 'prompt'}
                    onChange={() => {
                      setWhisperMode('prompt');
                      localStorage.setItem('whisperMode', 'prompt');
                      window.dispatchEvent(new Event('whisperModeChanged'));
                    }}
                    className="mt-0.5 h-4 w-4 border-gray-300 dark:border-gray-600 text-blue-600 dark:text-blue-500 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-800 dark:checked:bg-blue-600"
                  />
                  <div className="ml-3 flex-1">
                    <span className="flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-white">
                      <Sparkles className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                      Prompt Enhancement
                    </span>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Transform rough ideas into clear, detailed AI prompts
                    </p>
                  </div>
                </label>

                <label className="flex items-start p-3 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors border border-transparent hover:border-gray-300 dark:hover:border-gray-600">
                  <input
                    type="radio"
                    name="whisperMode"
                    value="vibe"
                    checked={whisperMode === 'vibe' || whisperMode === 'instructions' || whisperMode === 'architect'}
                    onChange={() => {
                      setWhisperMode('vibe');
                      localStorage.setItem('whisperMode', 'vibe');
                      window.dispatchEvent(new Event('whisperModeChanged'));
                    }}
                    className="mt-0.5 h-4 w-4 border-gray-300 dark:border-gray-600 text-blue-600 dark:text-blue-500 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-800 dark:checked:bg-blue-600"
                  />
                  <div className="ml-3 flex-1">
                    <span className="flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-white">
                      <FileText className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                      Vibe Mode
                    </span>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Format ideas as clear agent instructions with details
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Backdrop */}
      {localIsOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30 transition-opacity duration-150 ease-out"
          onClick={handleToggle}
        />
      )}
    </>
  );
};

export default QuickSettingsPanel;