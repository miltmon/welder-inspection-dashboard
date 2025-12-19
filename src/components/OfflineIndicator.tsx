import type React from 'react';
import { useState, useEffect } from 'react';
import { Wifi, WifiOff, Cloud, CloudOff, Loader2 } from 'lucide-react';

const OfflineIndicator: React.FC = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isConnected, setIsConnected] = useState(true);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setSyncing(true);

      // Simulate sync process
      setTimeout(() => {
        setSyncing(false);
        setIsConnected(true);
      }, 2000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setIsConnected(false);
      setSyncing(false);
    };

    // Test actual connectivity
    const checkConnectivity = async () => {
      if (!navigator.onLine) {
        setIsConnected(false);
        return;
      }

      try {
        // Try to fetch a small resource to test connectivity
        const response = await fetch('/favicon.ico', {
          method: 'HEAD',
          cache: 'no-cache'
        });
        setIsConnected(response.ok);
      } catch {
        setIsConnected(false);
      }
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check connectivity every 30 seconds when online
    const interval = setInterval(checkConnectivity, 30000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, []);

  // Don't show indicator if everything is working normally
  if (isOnline && isConnected && !syncing) {
    return null;
  }

  const getStatusInfo = () => {
    if (syncing) {
      return {
        icon: <Loader2 className="w-4 h-4 animate-spin" />,
        text: 'Syncing...',
        bgColor: 'bg-blue-600',
        textColor: 'text-white'
      };
    }

    if (!isOnline) {
      return {
        icon: <WifiOff className="w-4 h-4" />,
        text: 'Offline Mode',
        bgColor: 'bg-orange-600',
        textColor: 'text-white'
      };
    }

    if (!isConnected) {
      return {
        icon: <CloudOff className="w-4 h-4" />,
        text: 'Connection Lost',
        bgColor: 'bg-red-600',
        textColor: 'text-white'
      };
    }

    return {
      icon: <Cloud className="w-4 h-4" />,
      text: 'Connected',
      bgColor: 'bg-green-600',
      textColor: 'text-white'
    };
  };

  const { icon, text, bgColor, textColor } = getStatusInfo();

  return (
    <div className={`fixed bottom-4 right-4 z-40 ${bgColor} ${textColor} px-3 py-2 rounded-full shadow-lg flex items-center space-x-2 text-sm font-medium backdrop-blur-sm`}>
      {icon}
      <span>{text}</span>
      {!isOnline && (
        <div className="text-xs opacity-75 ml-2">
          Data saved locally
        </div>
      )}
    </div>
  );
};

export default OfflineIndicator;
