import { ClientOnly } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Bell, BellOff } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { subscribeUser, unsubscribeUser } from "@/lib/actions";
import { urlBase64ToUint8Array } from "@/lib/url";
import { Button } from "./ui/button";

const PushNotificationManager = () => {
	const subscribeUserFn = useServerFn(subscribeUser);
	const unsubscribeUserFn = useServerFn(unsubscribeUser);

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
		// console.log(`SW loaded`);
	};

	const subscribeToPush = async () => {
		const registration = await navigator.serviceWorker.ready;
		const sub = await registration.pushManager.subscribe({
			userVisibleOnly: true,
			applicationServerKey: urlBase64ToUint8Array(
				import.meta.env.VITE_PUBLIC_VAPID_PUBLIC_KEY!,
			),
		});

		setSubscription(sub);

		const serializedSub = JSON.parse(JSON.stringify(sub));
		await subscribeUserFn({ data: serializedSub });

		toast("Subscription successful", {
			description: "You will now receive notifications about new posts.",
		});
	};

	const unsubscribeFromPush = async () => {
		const endpoint = subscription?.endpoint;

		await subscription?.unsubscribe();
		setSubscription(null);

		if (endpoint) {
			await unsubscribeUserFn({ data: endpoint });
		}

		toast("Unsubscribe successful", {
			description: "You will no longer receive notifications about new posts.",
		});
	};

	if (!isSupported) {
		return <p>Push notifications are not supported in this browser.</p>;
	}

	return (
		<ClientOnly>
			{subscription ? (
				<Button
					size="icon-lg"
					onClick={unsubscribeFromPush}
					variant="outline"
					aria-label="unsubscribe from notifications"
				>
					<BellOff />
				</Button>
			) : (
				<Button
					size="icon-lg"
					onClick={subscribeToPush}
					variant="outline"
					aria-label="subscribe from notifications"
				>
					<Bell />
				</Button>
			)}
		</ClientOnly>
	);
};

export default PushNotificationManager;
