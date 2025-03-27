import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { TaskModule } from './task/task.module';
import { CommentModule } from './comment/comment.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [MongooseModule.forRoot('mongodb://localhost:27017',{dbName: 'task-Manager'}), UserModule, TaskModule, CommentModule, AuthModule,ConfigModule.forRoot({isGlobal: true})],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
