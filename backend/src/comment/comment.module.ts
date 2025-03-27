import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { commentSchema } from './entities/comment.entity';
import { taskSchema } from 'src/task/entities/task.entity';
import { userSchema } from 'src/user/entities/user.entity';

@Module({
  imports:[MongooseModule.forFeature([{name:"comments",schema:commentSchema},{name:"tasks",schema:taskSchema},{name:"users",schema:userSchema}])],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule {}
