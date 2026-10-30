self.addEventListener("push", (event) => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: data.icon || "/icon.png",
      badge: "/badge.png",
      vibrate: [100, 50, 100],
      data: {
        url: data.url,
        dateOfArrival: Date.now(),
        primaryKey: "2",
      },
    };
    event.waitUntil(self.registration.showNotification(data.title, options));
  }
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  let destination = new URL("/", self.location.origin).href;
  const url = event.notification.data?.url;
  if (typeof url === "string" && url.trim()) {
    try {
      const parsed = new URL(url, self.location.origin);
      if (parsed.origin === self.location.origin) destination = parsed.href;
    } catch {
      // Invalid payload URLs fall back to the homepage.
    }
  }
  event.waitUntil(clients.openWindow(destination));
});
