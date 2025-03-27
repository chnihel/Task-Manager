"use client";

import { useState, useEffect, createContext, ReactNode } from "react";
import { requestFCMToken, onMessageListener } from "@/app/firebase"; 

interface NotificationPayload {
  notification: {
    title: string;
    body: string;
  };
}

interface NotificationContextType {
  fcmToken: string | null;
}

export const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

interface NotificationProviderProps {
  children: ReactNode;
}

const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [fcmToken, setFcmToken] = useState<string | null>(null);

  useEffect(() => {
    requestFCMToken().then((token) => {
      if (token) {
        console.log("FCM Token:", token);
        setFcmToken(token);
      }
    });

    onMessageListener()
      .then((payload: unknown) => {  
        const notificationPayload = payload as NotificationPayload; 

        if (notificationPayload.notification) {
          alert(`Notification reçue : ${notificationPayload.notification.title}`);
        } else {
          console.log("Pas de notification dans le message", notificationPayload);
        }
      })
      .catch((err) => console.error("Erreur:", err));
  }, []);

  return (
    <NotificationContext.Provider value={{ fcmToken }}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;
