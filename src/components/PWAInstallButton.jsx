import React, { useState, useEffect } from 'react';

const PWAInstallButton = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallButton, setShowInstallButton] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    const checkInstalled = () => {
      if (window.matchMedia('(display-mode: standalone)').matches || 
          window.navigator.standalone === true) {
        setIsInstalled(true);
        setShowInstallButton(false);
      }
    };

    // Check if it's iOS (which doesn't support beforeinstallprompt)
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isInStandaloneMode = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;

    // Listen for beforeinstallprompt event (Android Chrome/Edge)
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Show install button immediately for better UX
      setShowInstallButton(true);
    };

    // Listen for appinstalled event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowInstallButton(false);
      setDeferredPrompt(null);
    };

    // Check if already installed
    checkInstalled();

    // For iOS, show a manual install instruction after delay
    if (isIOS && !isInStandaloneMode) {
      setTimeout(() => {
        setShowInstallButton(true);
      }, 3000);
    }

    // Also show for Android if no beforeinstallprompt event fires after 5 seconds
    setTimeout(() => {
      if (!isIOS && !isInStandaloneMode && !showInstallButton) {
        setShowInstallButton(true);
      }
    }, 5000);

    // Add event listeners
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Check periodically if app gets installed
    const checkInterval = setInterval(checkInstalled, 1000);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      clearInterval(checkInterval);
    };
  }, []);

  const handleInstallClick = async () => {
    // Check if it's iOS
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    
    if (isIOS) {
      // For iOS, show instructions
      alert('To install this app on iOS:\n\n1. Tap the Share button (square with arrow up)\n2. Scroll down and tap "Add to Home Screen"\n3. Tap "Add" to confirm');
      return;
    }

    if (!deferredPrompt) return;

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;

        if (outcome === 'accepted') {
          // User accepted the install prompt
        } else {
          // User dismissed the install prompt
        }

    // Clear the deferredPrompt
    setDeferredPrompt(null);
    setShowInstallButton(false);
  };

  const handleDismiss = () => {
    setShowInstallButton(false);
    // Hide for this session
    sessionStorage.setItem('pwa-install-dismissed', 'true');
  };

  // Don't show if already installed or dismissed this session
  if (isInstalled || !showInstallButton || sessionStorage.getItem('pwa-install-dismissed')) {
    return null;
  }

  return (
    <div className="fixed bottom-32 left-1/2 transform -translate-x-1/2 z-40 animate-in slide-in-from-bottom duration-500 sm:bottom-28">
      <div className="bg-gradient-to-r from-accent-blue/95 to-accent-purple/95 backdrop-blur-md rounded-xl p-2 border border-accent-purple/30 shadow-2xl max-w-xs w-full mx-4 sm:max-w-sm">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-sm">📱</span>
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-white font-bold text-xs truncate">Install Stellar Tales</h3>
              <p className="text-white/80 text-xs truncate">
                {/iPad|iPhone|iPod/.test(navigator.userAgent) 
                  ? 'Add to Home Screen' 
                  : 'Install app'
                }
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            <button
              onClick={handleInstallClick}
              className="bg-white/20 hover:bg-white/30 text-white px-2 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 hover:scale-105 whitespace-nowrap"
            >
              {/iPad|iPhone|iPod/.test(navigator.userAgent) ? 'How' : 'Install'}
            </button>
            <button
              onClick={handleDismiss}
              className="text-white/60 hover:text-white/80 text-base transition-colors duration-200 flex-shrink-0"
            >
              ×
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PWAInstallButton;
