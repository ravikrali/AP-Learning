/// <reference types="vitest/config" />
import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import { BRAND, TRADEMARK_NOTICE } from './shared/brand.ts'

/** Fills the product name into index.html and admin.html (%BRAND_NAME% and friends) from shared/brand.ts. */
const brandHtml = (): Plugin => ({
  name: 'brand-html',
  transformIndexHtml: (html) =>
    html.replaceAll('%BRAND_NAME%', BRAND.name).replaceAll('%BRAND_DESCRIPTION%', BRAND.description).replaceAll('%TRADEMARK_NOTICE%', TRADEMARK_NOTICE),
})

// `vite build --mode artifact` makes a single-file preview build (no service worker, wasm inlined)
export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    brandHtml(),
    VitePWA({
      disable: mode === 'artifact',
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'apple-touch-icon.png'],
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,wasm,woff2}'],
        // the admin portal is a separate site (admin.aplearning.app) and is never cached in the app
        globIgnores: ['**/admin*'],
        // videos.json is fetched fresh when online so new videos show up without an app update
        runtimeCaching: [
          { urlPattern: /videos\.json$/, handler: 'NetworkFirst', options: { cacheName: 'videos-manifest' } },
          {
            urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/,
            handler: 'CacheFirst',
            options: { cacheName: 'fonts', expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 365 } },
          },
        ],
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
        // the backend is never served from the offline cache
        navigateFallbackDenylist: [/^\/api\//, /^\/admin/],
      },
      manifest: {
        name: BRAND.name,
        short_name: BRAND.name,
        description: `${BRAND.description} ${TRADEMARK_NOTICE}`,
        theme_color: '#12141c',
        background_color: '#12141c',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '.',
        icons: [
          { src: 'pwa-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'pwa-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
    }),
  ],
  build:
    mode === 'artifact'
      ? {
          outDir: 'dist-artifact',
          assetsInlineLimit: 100_000_000,
          cssCodeSplit: false,
          chunkSizeWarningLimit: 5000,
          rolldownOptions: { output: { codeSplitting: false } },
        }
      : {
          chunkSizeWarningLimit: 1200,
          rolldownOptions: { input: { main: 'index.html', admin: 'admin.html' } },
        },
  // in development, /api goes to the local Worker started by `npm run dev:api`
  server: { proxy: { '/api': 'http://localhost:8787' } },
  test: {
    include: ['tests/**/*.test.ts'],
  },
}))
