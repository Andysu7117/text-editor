const { offlineFallback, warmStrategyCache } = require("workbox-recipes");
const { CacheFirst, StaleWhileRevalidate } = require("workbox-strategies");
const { registerRoute } = require("workbox-routing");
const { CacheableResponsePlugin } = require("workbox-cacheable-response");
const { ExpirationPlugin } = require("workbox-expiration");
const { precacheAndRoute } = require("workbox-precaching/precacheAndRoute");

// Precache assets
precacheAndRoute([...self.__WB_MANIFEST]);

const pageCache = new CacheFirst({
  cacheName: "page-cache",
  plugins: [
    new CacheableResponsePlugin({
      statuses: [0, 200],
    }),
    new ExpirationPlugin({
      maxAgeSeconds: 30 * 24 * 60 * 60,
    }),
  ],
});

warmStrategyCache({
  urls: ["/index.html", "/"],
  strategy: pageCache,
});

registerRoute(({ request }) => request.mode === "navigate", pageCache);

// TODO: Implement asset caching
// Define the asset caching strategy
const assetCache = new CacheFirst({
  cacheName: "asset-cache",
  plugins: [
    new CacheableResponsePlugin({
      statuses: [0, 200],
    }),
    new ExpirationPlugin({
      // Cache assets for 30 days
      maxAgeSeconds: 30 * 24 * 60 * 60,
      // Only cache 60 assets
      maxEntries: 60,
    }),
  ],
});

// Register routes for styles, scripts, and images
registerRoute(/\.(?:js|css)$/, assetCache, "GET"); // Cache JS and CSS files
registerRoute(/\.(?:png|jpg|jpeg|svg|gif)$/, assetCache, "GET"); // Cache image files
