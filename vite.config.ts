import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

// base "./" keeps every asset path relative, so the same build works at a
// domain root or under a GitHub Pages project path like /castmaker/.
export default defineConfig({
  base: "./",
  build: {
    outDir: "dist",
    sourcemap: true,
    target: "es2022",
  },
  plugins: [
    // Generates the web app manifest and a service worker that precaches the
    // whole build, so the app installs and works offline. Updates install in
    // the background and apply on the next visit.
    VitePWA({
      registerType: "autoUpdate",
      injectRegister: false,
      includeAssets: ["icons/icon.svg"],
      manifest: {
        name: "Castmaker",
        short_name: "Castmaker",
        description: "Generate original characters for tabletop games and fiction.",
        start_url: "./",
        scope: "./",
        display: "standalone",
        background_color: "#eef1ee",
        theme_color: "#1f6f66",
        icons: [
          { src: "icons/icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "icons/icon-512.png", sizes: "512x512", type: "image/png" },
          { src: "icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
          { src: "icons/icon.svg", sizes: "any", type: "image/svg+xml" },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,svg,png,woff2}"],
        // Google Fonts: cache the stylesheet and font files after first use.
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/i,
            handler: "StaleWhileRevalidate",
            options: { cacheName: "google-fonts", expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 365 } },
          },
        ],
      },
    }),
  ],
});
