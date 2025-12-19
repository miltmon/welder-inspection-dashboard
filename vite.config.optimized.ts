import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), VitePWA({
    registerType: 'autoUpdate',
    workbox: {
      clientsClaim: true,
      skipWaiting: true,
      globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
      runtimeCaching: [{
        urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
        handler: 'CacheFirst',
        options: {
          cacheName: 'google-fonts-cache',
          expiration: {
            maxEntries: 10,
            maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
          }
        }
      }, {
        urlPattern: /^https:\/\/firebasestorage\.googleapis\.com\/.*/i,
        handler: 'CacheFirst',
        options: {
          cacheName: 'firebase-images-cache',
          expiration: {
            maxEntries: 100,
            maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
          }
        }
      }]
    },
    includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
    manifest: {
      name: 'WeldTrack™ — Welding Inspection & WPS Tool',
      short_name: 'WeldTrack',
      description: 'Professional welding inspection and compliance platform with AWS D1.1 Clause 6 support',
      start_url: '/',
      display: 'standalone',
      orientation: 'portrait-primary',
      background_color: '#0f172a',
      theme_color: '#1e40af',
      categories: ['productivity', 'business', 'utilities'],
      screenshots: [{
        src: 'screenshot-wide.png',
        sizes: '1280x720',
        type: 'image/png',
        form_factor: 'wide'
      }, {
        src: 'screenshot-narrow.png',
        sizes: '390x844',
        type: 'image/png',
        form_factor: 'narrow'
      }],
      icons: [{
        src: 'pwa-64x64.png',
        sizes: '64x64',
        type: 'image/png'
      }, {
        src: 'pwa-192x192.png',
        sizes: '192x192',
        type: 'image/png'
      }, {
        src: 'pwa-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any'
      }, {
        src: 'maskable-icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable'
      }]
    },
    devOptions: {
      enabled: true
    }
  })],
  server: {
    host: '0.0.0.0',
    port: 5173
  },
  optimizeDeps: {
    exclude: ["bippy/dist/jsx-runtime", "bippy/dist/jsx-dev-runtime"]
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Split vendor chunks for better caching and faster initial loads
          if (id.includes('node_modules')) {
            // React core libraries
            if (id.includes('react') || id.includes('react-dom')) {
              return 'vendor-react';
            }
            // Firebase libraries
            if (id.includes('firebase')) {
              return 'vendor-firebase';
            }
            // Charting/visualization libraries
            if (id.includes('recharts') || id.includes('@reduxjs') || id.includes('chart')) {
              return 'vendor-charts';
            }
            // UI libraries
            if (id.includes('@mui') || id.includes('@emotion')) {
              return 'vendor-ui';
            }
            // PDF/export libraries
            if (id.includes('jspdf') || id.includes('html2canvas') || id.includes('pdf')) {
              return 'vendor-pdf';
            }
            // All other node_modules
            return 'vendor';
          }
        }
      }
    },
    chunkSizeWarningLimit: 600, // Increase limit after splitting
  }
});


