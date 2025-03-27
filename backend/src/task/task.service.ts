import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, Types } from 'mongoose';
import { ITask } from './interface/task.interface';
import { IUser } from 'src/user/interface/user.interface';
import { Status } from './entities/task.entity';

@Injectable()
export class TaskService {
  constructor(@InjectModel("tasks") private taskModel: Model<ITask>,
    @InjectModel("users") private userModel: Model<IUser>,
   /*  @InjectModel("category") private categoryModel: Model<ICategory> */) { }

  async createTask(createTask: CreateTaskDto): Promise<ITask> {
    const newTask = await new this.taskModel(createTask)
    const savedTask = await newTask.save() as ITask
    const userId = await this.userModel.findById(createTask.user)
    if (userId) {
      userId.task.push(savedTask._id as mongoose.Types.ObjectId)
      const savedUser = await userId.save()
     // console.log('user saved', savedUser)
    }
    else {
      console.log("user not found")
    }


    return savedTask
  }

  async getAllTask(): Promise<ITask[]> {
    const getTask = await this.taskModel.find().populate("user").populate('category').populate('comment').exec()
    return getTask
  }

  async getOneTask(id: string): Promise<ITask> {
    const getOne = await this.taskModel.findById(id)
    if (!getOne) {
      throw new NotFoundException(`Task with this ${id} not found`)
    }
    return getOne
  }

  async deleteTask(id: string): Promise<ITask> {
    const deleteOne = await this.taskModel.findByIdAndDelete(id)
    if (!deleteOne) {
      throw new NotFoundException(`Task with this ${id} not found`)
    }
    const user = await this.userModel.findById(deleteOne.user)
    if (user) {
      user.task = user.task.filter(pubId => pubId.toString() !== id)

      await user.save()
      console.log("update user", user)

    } else { (console.log('user not found')) }
    //const category = await this.categoryModel.findById(deleteOne.category)
   /*  if (category) {
      category.task = category.task.filter(pubId => pubId.toString() !== id)
      await category.save()
      console.log("update category", category)

    } else (console.log('category not found')) */
    return deleteOne
  }


  async UpdateTask(id: string, updateTaskDto: UpdateTaskDto): Promise<ITask> {
    const deleteOne = await this.taskModel.findByIdAndUpdate(id, updateTaskDto, { new: true })
    if (!deleteOne) {
      throw new NotFoundException(`Task with this ${id} not found`)
    }
    return deleteOne
  }

  async getTasksByStatus(status: Status): Promise<ITask[]> {
    const query = status ? { status } : {}; 
    console.log(query);
    return await this.taskModel.find(query).exec();
  }

  async updateStatus(id:string):Promise<ITask>{
     const newStatus=await this.taskModel.findByIdAndUpdate(id,{status:'completed'},{new:true})
     if(!newStatus){
      throw new NotFoundException("task not found")
     } 
     return newStatus
  
    }
    
   
}
