importScripts(
  "https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js"
);

workbox.setConfig({
  debug: true
});

self.addEventListener("message", event => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

workbox.precaching.precacheAndRoute([]);

workbox.routing.registerNavigationRoute(
  workbox.precaching.getCacheKeyForURL("index.html"),
  {
    blacklist: [/\.[a-z]{2,4}$/i]
  }
);

const networkFirst = new workbox.strategies.NetworkFirst();

const cacheFirst = new workbox.strategies.CacheFirst({
  cacheName: 'font-awesome',
  plugins: [
    new workbox.expiration.Plugin({
      maxEntries: 100,
    }),
    new workbox.cacheableResponse.Plugin({
      statuses: [0, 200]
    }),
  ],
});

workbox.routing.registerRoute(
  new RegExp('.*fontawesome-webfont.*'),
  networkFirst,
);

workbox.routing.registerRoute(
  new RegExp('.*build\/svg\/.*'),
  networkFirst,
);

workbox.routing.registerRoute(
  new RegExp('^https:\/\/maxcdn\.bootstrapcdn\.com\/bootstrap'),
  networkFirst,
);

// const channel = new BroadcastChannel("app-channel");

// const bgSyncPlugin = new workbox.backgroundSync.Plugin("form-submissions", {
//   maxRetentionTime: 24 * 60, // Retry for max of 24 Hours
//   onSync: async ({ queue }) => {
//     console.log("Background sync started", queue);
//     const submissionsToResend = await queue.getAll();
//     await queue.replayRequests();
//     const submissionsUnsent = await queue.getAll();
//     const numberSent = submissionsToResend.length - submissionsUnsent.length;
//     if (numberSent) {
//       channel.postMessage({
//         message: `Submitted ${numberSent} saved form submission${
//           numberSent > 1 ? "s" : ""
//         }`,
//         color: "success"
//       });
//     } else {
//       console.log(
//         "numberSent == 0",
//         submissionsToResend.length,
//         submissionsUnsent.length
//       );
//     }
//   }
// });

// const route = workbox.routing.registerRoute(
//   new RegExp("^https://.*.form.io/(?!user).*"),
//   // 'https://bplegoghxwvcixb.form.io/attendees',
//   new workbox.strategies.NetworkOnly({
//     plugins: [bgSyncPlugin]
//   }),
//   "POST"
// );

console.log("Running service worker");
