workbox.core.skipWaiting();
workbox.core.clientsClaim();

workbox.routing.registerRoute(
  new RegExp("https:.*min.(css|js)"),
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: "cdn-cache",
  })
);

workbox.routing.registerRoute(
  new RegExp("http://.*:4567.*.json"),
  new workbox.strategies.NetworkFirst()
);

self.addEventListener("fetch", (event) => {
  console.log(event.request)
  if (event.request.method === "POST" || event.request.method === "DELETE") {
    event.respondWith(
      fetch(event.request).catch((error) => {
        return new Response(
          JSON.stringify({
            error: "This action is disabled while the app is offline",
          }),
          {
            headers: { "Content-Type": "application/json" },
          }
        );
      })
    );
  }
});

workbox.precaching.precacheAndRoute(self.__precacheManifest || []);
