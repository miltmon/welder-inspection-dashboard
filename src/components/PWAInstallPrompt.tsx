import type React from 'react';
import { useState, useEffect } from 'react';
import { Download, X, Smartphone } from 'lucide-react';

const PWAInstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);

      // Show our custom install prompt after a delay
      setTimeout(() => {
        setShowPrompt(true);
      }, 5000);
    };

    const handleAppInstalled = () => {
      setDeferredPrompt(null);
      setShowPrompt(false);
      setIsInstallable(false);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setShowPrompt(false);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    // Don't show again for this session
    sessionStorage.setItem('pwa-prompt-dismissed', 'true');
  };

  // Don't show if already dismissed this session
  if (sessionStorage.getItem('pwa-prompt-dismissed')) {
    return null;
  }

  // Don't show if not installable or already dismissed
  if (!isInstallable || !showPrompt) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50">
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 shadow-2xl backdrop-blur-sm">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Smartphone className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-white font-semibold">Install WeldTrack™</h3>
              <p className="text-slate-300 text-sm">Get the full app experience</p>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="p-1 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-slate-400 text-sm mb-4">
          Install WeldTrack™ on your device for faster access, offline capability, and a native app experience.
        </p>

        <div className="flex space-x-3">
          <button
            onClick={handleInstallClick}
            className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Install</span>
          </button>
          <button
            onClick={handleDismiss}
            className="px-4 py-2 text-slate-400 hover:text-white transition-colors"
          >
            Not now
          </button>
        </div>
      </div>
    </div>
  );
};

export default PWAInstallPrompt;
