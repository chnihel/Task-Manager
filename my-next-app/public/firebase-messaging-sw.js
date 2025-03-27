

importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js");

const firebaseConfig = {
  apiKey: "AIzaSyATPzwLNCt1iG8ZJ_AwxCQULrpsCdgdQkU",
  authDomain: "notification-task-33158.firebaseapp.com",
  projectId: "notification-task-33158",
  storageBucket: "notification-task-33158.firebasestorage.app",
  messagingSenderId: "858704891406",
  appId: "1:858704891406:web:c62547bcadbc8ad430365f",
  measurementId:"G-7319B5VBNT",
  vapidKey: "BLD8mKh6qdZzUmx4TKhBY1W3BMuKqy_TYL3icRYidrYVY51iaBCQ-c95JwyzZzjcqJ4BISaMW2SYYWFk9NpMWUs",
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("Notification en arrière-plan :", payload);

  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: "/logo192.png",
  });
});
