import { Injectable } from '@nestjs/common';
import * as firebase from 'firebase-admin';
import { sendNotificationDTO } from './dto/send-notification.dto';
@Injectable()
export class NotificationService {
  async sendNotif(notification: sendNotificationDTO) {
    try {
      console.log('Token Firebase reçu:', notification.deviceId);
      await firebase
        .messaging()
        .send({
    
          notification: {
            title: notification.title,
            body: notification.body,
          },
          token: notification.deviceId,
          data: {},
        })
        .catch((error: any) => {
          console.error(error);
        });
    } catch (error) {
      console.log(error);
      return error;
    }
  }

 
}