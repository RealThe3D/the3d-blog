"use client";

import { subscribeUser, unsubscribeUser } from "@/app/actions";
import { urlBase64ToUint8Array } from "@/lib/url";
import { useState, useEffect } from "react";
import { toast } from "./ui/toast";
import { Button } from "./ui/button";
import { Bell, BellOff } from "lucide-react";

const PushNotificationManager = () => {
  const [isSupported, setIsSupported] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(
    null,
  );

  useEffect(() => {
    if ("serviceWorker" in navigator && "PushManager" in window) {
      setIsSupported(true);
      registerServiceWorker();
    }
  }, []);

  const registerServiceWorker = async () => {
    const registration = await navigator.serviceWorker.register(
      "/service-worker.js",
      {
        scope: "/",
        updateViaCache: "none",
      },
    );
    const sub = await registration.pushManager.getSubscription();
    setSubscription(sub);
  };

  const subscribeToPush = async () => {
    const registration = await navigator.serviceWorker.ready;
    const sub = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(
        process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
      ),
    });

    setSubscription(sub);

    const serializedSub = JSON.parse(JSON.stringify(sub));
    await subscribeUser(serializedSub);

    toast.add({
      title: "Subscription successful",
      description: "You will now receive notifications about new posts.",
    });
  };

  const unsubscribeFromPush = async () => {
    const endpoint = subscription?.endpoint;

    await subscription?.unsubscribe();
    setSubscription(null);
    if (endpoint) {
      await unsubscribeUser(endpoint);
    }
  };

  if (!isSupported) {
    return <p>Push notifications are not supported in this browser.</p>;
  }

  return (
    <>
      {subscription ? (
        <Button size="icon-lg" onClick={unsubscribeFromPush}>
          <BellOff />
        </Button>
      ) : (
        <Button size="icon-lg" onClick={subscribeToPush}>
          <Bell />
        </Button>
      )}
    </>
  );
};

export default PushNotificationManager;
