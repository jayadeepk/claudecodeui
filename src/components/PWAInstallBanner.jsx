import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';

const PWAInstallBanner = () => {
  const { isInstallable, isInstalled, installPWA } = usePWAInstall();
  const [isDismissed, setIsDismissed] = useState(() => {
    return localStorage.getItem('pwa-install-dismissed') === 'true';
  });

  const handleInstall = async () => {
    const installed = await installPWA();
    if (installed) {
      setIsDismissed(true);
      localStorage.setItem('pwa-install-dismissed', 'true');
    }
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    localStorage.setItem('pwa-install-dismissed', 'true');
  };

  // Don't show banner if app is already installed, not installable, or dismissed
  if (isInstalled || !isInstallable || isDismissed) {
    return null;
  }

  return (
    <div className="bg-blue-600 text-white p-3 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
          </svg>
        </div>
        <div>
          <p className="text-sm font-medium">Install Claude Code UI</p>
          <p className="text-xs opacity-90">Add to your home screen for quick access</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={handleInstall}
          className="px-3 py-1.5 bg-white text-blue-600 text-sm font-medium rounded-md hover:bg-gray-100 transition-colors"
        >
          Install
        </button>
        <button
          onClick={handleDismiss}
          className="p-1 text-white/80 hover:text-white rounded-md hover:bg-white/10 transition-colors"
          aria-label="Dismiss"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default PWAInstallBanner;