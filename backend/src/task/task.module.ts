import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { taskSchema } from './entities/task.entity';
import { userSchema } from 'src/user/entities/user.entity';

@Module({
  imports:[MongooseModule.forFeature([{name:"tasks",schema:taskSchema},{name:"users",schema:userSchema}/* ,{name:"category",schema:categorySchema} */])],
  controllers: [TaskController],
  providers: [TaskService],
})
export class TaskModule {}
