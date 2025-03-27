import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { IComment } from './interface/comment.interface';
import { ITask } from 'src/task/interface/task.interface';
import { IUser } from 'src/user/interface/user.interface';

@Injectable()
export class CommentService {
  constructor(@InjectModel("comments") private commentModel: Model<IComment>,
    @InjectModel("tasks") private taskModel: Model<ITask>,
    @InjectModel("users") private userModel: Model<IUser>
  ) { }

  async createComment(createComment: CreateCommentDto): Promise<IComment> {
    const newComment = await new this.commentModel(createComment)
    const savedComment = await newComment.save() as IComment
    const taskId = await this.taskModel.findById(createComment.task)
    if (taskId) {
      taskId.comment.push(savedComment._id as mongoose.Types.ObjectId)
      const savedTask = await taskId.save()
      console.log('task saved', savedTask)
    }
    else {
      console.log("task not found")
    }
    const userId = await this.userModel.findById(createComment.user)
    if (userId) {
      userId.comment.push(savedComment._id as mongoose.Types.ObjectId)
      const savedUser = await userId.save()
      console.log('comment saved', savedUser)
    }
    else {
      console.log("comment not found")
    }
    return newComment.save()
  }

  async getAllComment(): Promise<IComment[]> {
    const getComment = await this.commentModel.find().populate("user").populate('task').exec()
    return getComment
  }

  async getOneComment(id: string): Promise<IComment> {
    const getOne = await this.commentModel.findById(id)
    if (!getOne) {
      throw new NotFoundException(`Comment with this ${id} not found`)
    }
    return getOne
  }

  async deleteComment(id: string): Promise<IComment> {
    const deleteOne = await this.commentModel.findByIdAndDelete(id)
    if (!deleteOne) {
      throw new NotFoundException(`Comment with this ${id} not found`)
    }
    const task = await this.taskModel.findById(deleteOne.task)
    if (task) {
      task.comment = task.comment.filter(pubId => pubId.toString() !== id)

      await task.save()
      console.log("update task", task)

    } else { (console.log('task not found')) }

    const user = await this.userModel.findById(deleteOne.user)
    if (user) {
      user.comment = user.comment.filter(pubId => pubId.toString() !== id)

      await user.save()
      console.log("update user", task)

    } else { (console.log('user not found')) }
    return deleteOne
  }

  async UpdateComment(id: string, updateCommentDto: UpdateCommentDto): Promise<IComment> {
    const deleteOne = await this.commentModel.findByIdAndUpdate(id, updateCommentDto, { new: true })
    if (!deleteOne) {
      throw new NotFoundException(`Comment with this ${id} not found`)
    }
    return deleteOne
  }
}
