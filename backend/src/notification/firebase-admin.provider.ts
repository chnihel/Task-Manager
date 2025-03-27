import * as admin from 'firebase-admin';
import { ServiceAccount } from 'firebase-admin';
import serviceAccount from '../../notification-task-33158-firebase-adminsdk-fbsvc-b70aa8e3d2.json';
export const firebaseAdminProvider = {
    provide: 'FIREBASE_ADMIN',
    useFactory: () => {
      const defaultApp = admin.initializeApp({
        credential: admin.credential.cert(
          serviceAccount as ServiceAccount
        ),
      });
      return { defaultApp };
    },
}