import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_APIKEY,
    authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_MEASUREMENT_ID,
    vapidKey: process.env.NEXT_PUBLIC_VAPID_KEY,
};

const app = typeof window !== "undefined" ? initializeApp(firebaseConfig) : null;
const messaging = app ? getMessaging(app) : null;

export const requestFCMToken = async () => {
  if (!messaging || typeof window === "undefined") return;

  try {
    const token = await getToken(messaging, {
      vapidKey: "BLD8mKh6qdZzUmx4TKhBY1W3BMuKqy_TYL3icRYidrYVY51iaBCQ-c95JwyzZzjcqJ4BISaMW2SYYWFk9NpMWUs",
    });
    console.log("FCM Token:", token);
    return token;
  } catch (error) {
    console.error("Erreur lors de la récupération du token :", error);
  }
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    if (!messaging || typeof window === "undefined") return;
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });

export { messaging };
