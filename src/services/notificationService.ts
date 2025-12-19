// Notification Service for ClauseMesh PWA
// Handles push notifications, background sync, and offline capabilities

export interface NotificationAction {
  action: string;
  title: string;
  icon?: string;
}

export interface ClauseMeshNotificationOptions {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  data?: Record<string, unknown>;
  actions?: NotificationAction[];
  requireInteraction?: boolean;
  silent?: boolean;
  vibrate?: number[];
}

export interface BackgroundSyncOptions {
  tag: string;
  data: Record<string, unknown>;
  cacheName?: string;
}

class NotificationService {
  private vapidPublicKey = 'BGr7m8o4k6XxpLlxWdA8vOJ5dqRnEkJlIrWp7lG2Mk8JhAz9k6TyFl2Wl8FiB5k7Wm3Nv1T6Q8PfL2Nm4Tg5Dw';
  private swRegistration: ServiceWorkerRegistration | null = null;

  constructor() {
    this.init();
  }

  async init() {
    if ('serviceWorker' in navigator) {
      try {
        this.swRegistration = await navigator.serviceWorker.ready;
        console.log('Notification service initialized');
      } catch (error) {
        console.error('Failed to initialize notification service:', error);
      }
    }
  }

  // Request notification permission
  async requestPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications');
      return 'denied';
    }

    if (Notification.permission === 'granted') {
      return 'granted';
    }

    if (Notification.permission === 'denied') {
      return 'denied';
    }

    const permission = await Notification.requestPermission();
    return permission;
  }

  // Subscribe to push notifications
  async subscribeToPush(): Promise<PushSubscription | null> {
    if (!this.swRegistration) {
      console.error('Service worker not registered');
      return null;
    }

    try {
      const permission = await this.requestPermission();
      if (permission !== 'granted') {
        console.warn('Notification permission not granted');
        return null;
      }

      const subscription = await this.swRegistration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(this.vapidPublicKey)
      });

      console.log('Push subscription successful:', subscription);
      return subscription;
    } catch (error) {
      console.error('Failed to subscribe to push notifications:', error);
      return null;
    }
  }

  // Unsubscribe from push notifications
  async unsubscribeFromPush(): Promise<boolean> {
    if (!this.swRegistration) {
      return false;
    }

    try {
      const subscription = await this.swRegistration.pushManager.getSubscription();
      if (subscription) {
        const result = await subscription.unsubscribe();
        console.log('Push unsubscription successful');
        return result;
      }
      return true;
    } catch (error) {
      console.error('Failed to unsubscribe from push notifications:', error);
      return false;
    }
  }

  // Show local notification
  async showNotification(options: ClauseMeshNotificationOptions): Promise<void> {
    const permission = await this.requestPermission();
    if (permission !== 'granted') {
      console.warn('Cannot show notification: permission not granted');
      return;
    }

    if (this.swRegistration) {
      const notificationOptions = {
        body: options.body,
        icon: options.icon || '/pwa-192x192.png',
        badge: options.badge || '/badge-72x72.png',
        data: options.data,
        requireInteraction: options.requireInteraction || false,
        silent: options.silent || false,
        vibrate: options.vibrate || [200, 100, 200]
      };

      // Add actions if supported
      if (options.actions && 'actions' in Notification.prototype) {
        (notificationOptions as any).actions = options.actions;
      }

      await this.swRegistration.showNotification(options.title, notificationOptions);
    } else {
      // Fallback to regular notification
      new Notification(options.title, {
        body: options.body,
        icon: options.icon || '/pwa-192x192.png',
        data: options.data
      });
    }
  }

  // Schedule background sync
  async scheduleBackgroundSync(options: BackgroundSyncOptions): Promise<void> {
    if (!this.swRegistration) {
      console.error('Service worker not registered');
      return;
    }

    if ('sync' in this.swRegistration) {
      try {
        await (this.swRegistration as any).sync.register(options.tag);

        // Store data for sync
        if (options.cacheName && options.data) {
          const cache = await caches.open(options.cacheName);
          const request = new Request(`/sync/${options.tag}`, {
            method: 'POST',
            body: JSON.stringify(options.data),
            headers: {
              'Content-Type': 'application/json'
            }
          });
          await cache.put(request, new Response(JSON.stringify(options.data)));
        }

        console.log(`Background sync scheduled: ${options.tag}`);
      } catch (error) {
        console.error('Failed to schedule background sync:', error);
      }
    } else {
      console.warn('Background sync not supported');
    }
  }

  // Certification expiry notifications
  async scheduleExpiryReminder(certificationName: string, expiryDate: Date, daysBeforeExpiry = 30): Promise<void> {
    const now = new Date();
    const timeDiff = expiryDate.getTime() - now.getTime();
    const daysRemaining = Math.ceil(timeDiff / (1000 * 3600 * 24));

    if (daysRemaining <= daysBeforeExpiry && daysRemaining > 0) {
      await this.showNotification({
        title: 'Certification Expiry Alert',
        body: `${certificationName} expires in ${daysRemaining} days`,
        data: {
          type: 'certification-expiry',
          certificationName,
          expiryDate,
          daysRemaining
        },
        actions: [
          {
            action: 'view',
            title: 'View Details'
          },
          {
            action: 'renew',
            title: 'Schedule Renewal'
          }
        ],
        requireInteraction: true
      });
    }
  }

  // Inspection reminder notifications
  async scheduleInspectionReminder(projectName: string, scheduledDate: Date): Promise<void> {
    await this.showNotification({
      title: 'Inspection Reminder',
      body: `Scheduled inspection for ${projectName}`,
      data: {
        type: 'inspection-reminder',
        projectName,
        scheduledDate
      },
      actions: [
        {
          action: 'start',
          title: 'Start Inspection'
        },
        {
          action: 'postpone',
          title: 'Postpone'
        }
      ]
    });
  }

  // Defect alert notifications
  async alertDefectLogged(defectType: string, severity: string, jointId: string): Promise<void> {
    const isHighSeverity = severity === 'high' || severity === 'critical';

    await this.showNotification({
      title: `${isHighSeverity ? 'CRITICAL ' : ''}Defect Logged`,
      body: `${defectType} detected in ${jointId}`,
      data: {
        type: 'defect-alert',
        defectType,
        severity,
        jointId
      },
      actions: [
        {
          action: 'view',
          title: 'View Details'
        },
        {
          action: 'repair',
          title: 'Schedule Repair'
        }
      ],
      requireInteraction: isHighSeverity,
      vibrate: isHighSeverity ? [300, 100, 300, 100, 300] : [200, 100, 200]
    });
  }

  // Cache inspection data for offline use
  async cacheInspectionData(inspectionData: Record<string, unknown>): Promise<void> {
    try {
      const cache = await caches.open('pending-inspections');
      const request = new Request(`/api/inspections/${inspectionData.id}`, {
        method: 'POST',
        body: JSON.stringify(inspectionData),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      await cache.put(request, new Response(JSON.stringify(inspectionData)));

      // Schedule background sync
      await this.scheduleBackgroundSync({
        tag: 'inspection-sync',
        data: inspectionData,
        cacheName: 'pending-inspections'
      });
    } catch (error) {
      console.error('Failed to cache inspection data:', error);
    }
  }

  // Cache defect data for offline use
  async cacheDefectData(defectData: Record<string, unknown>): Promise<void> {
    try {
      const cache = await caches.open('pending-defects');
      const request = new Request(`/api/defects/${defectData.id}`, {
        method: 'POST',
        body: JSON.stringify(defectData),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      await cache.put(request, new Response(JSON.stringify(defectData)));

      await this.scheduleBackgroundSync({
        tag: 'defect-sync',
        data: defectData,
        cacheName: 'pending-defects'
      });
    } catch (error) {
      console.error('Failed to cache defect data:', error);
    }
  }

  // Get cached data
  async getCachedData(cacheName: string): Promise<Record<string, unknown>[]> {
    try {
      const cache = await caches.open(cacheName);
      const requests = await cache.keys();
      const data = [];

      for (const request of requests) {
        const response = await cache.match(request);
        if (response) {
          const jsonData = await response.json();
          data.push(jsonData);
        }
      }

      return data;
    } catch (error) {
      console.error('Failed to get cached data:', error);
      return [];
    }
  }

  // Check if app is in standalone mode (installed as PWA)
  isStandalone(): boolean {
    return window.matchMedia('(display-mode: standalone)').matches ||
           (window.navigator as any).standalone === true ||
           document.referrer.includes('android-app://');
  }

  // Check if device supports push notifications
  isPushSupported(): boolean {
    return 'serviceWorker' in navigator && 'PushManager' in window;
  }

  // Check if device supports background sync
  isBackgroundSyncSupported(): boolean {
    return 'serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype;
  }

  // Utility function to convert VAPID key
  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }
}

// Export singleton instance
export const notificationService = new NotificationService();

// Export types
export default NotificationService;
