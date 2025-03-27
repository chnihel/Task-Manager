import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus, Put, Query, BadRequestException, HttpException } from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Status } from './entities/task.entity';

@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
   async createTask(@Res() response, @Body() createTaskDto: CreateTaskDto) {
     try {
       const newTask = await this.taskService.createTask(createTaskDto)
       return response.status(HttpStatus.CREATED).json({
         message: 'Task Created Successfully',
         data: newTask
       })
     } catch (error) {
       return response.status(HttpStatus.BAD_REQUEST).json({
         message: `Task not created: ${error.message}`,
         error: 'Bad Request'
       })
     }
   }
 
   @Get('all')
   async findAllTask(@Res() response) {
     try {
       const listeTasks = await this.taskService.getAllTask()
       return response.status(HttpStatus.OK).json({
         message: 'Tasks disponibles: ',
         data: listeTasks
       })
     } catch (error) {
       return response.status(HttpStatus.NOT_FOUND).json({
         message: `Tasks non disponibles: ${error.message}`,
         error: 'Not Found'
       }) 
     }
   }
 
   @Get('/:id')
   async findOneTask(@Res() response, @Param('id') id: string) {
     try {
       const TaskID = await this.taskService.getOneTask(id)
       return response.status(HttpStatus.OK).json({
         message: `Task with ID ${id} is found`,
         data: TaskID
       })
     } catch (error) {
       return response.status(HttpStatus.NOT_FOUND).json({
         message: `Task with ID ${id} is not found: ${error.message}`,
         error: 'Not Found',
       })
     }
   }
 
   @Put('/:id')
   async updateTask(@Res() response, @Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
     try {
       const updateTaskID = await this.taskService.UpdateTask(id, updateTaskDto)
       return response.status(HttpStatus.OK).json({
         message: `Task with ID ${id} is updated Successfully`,
         data: updateTaskID
       })
     } catch (error) {
       return response.status(HttpStatus.BAD_REQUEST).json({
         message: `Task with ID ${id} is not updated: ${error.message}`,
         error: 'Bad Request'  
       })
     }
   }
 
   @Delete('/:id')
   async deleteTask(@Res() response, @Param('id') id: string) {
     try {
       const deleteTaskID = await this.taskService.deleteTask(id)
       return response.status(HttpStatus.OK).json({
         message: `Task with ID ${id} is deleted Successfully`,
         data: deleteTaskID
       })
     } catch (error) {
       return response.status(HttpStatus.BAD_REQUEST).json({
         message: `Task with ID ${id} is not deleted: ${error.message}`,
         error: 'Bad Request' 
       })
     }
   }

   @Get()
  async getTasksByStatus(@Query('status') status: Status) {
  if (!status) {
    throw new BadRequestException('Status is required');
  }
  return await this.taskService.getTasksByStatus(status);
}

@Put('status/:id')
async updateStatus(@Res() response,@Param('id') id: string) {
  try {
    const statusUpdate=await this.taskService.updateStatus(id)
    return response.status(HttpStatus.OK).json({
      message: `Task with ID ${id} is update her status Successfully`,
      data: statusUpdate
    })
  } catch (error) {
    return response.status(HttpStatus.BAD_REQUEST).json({
      message: `Task with ID ${id} is not updated: ${error.message}`,
      error: 'Bad Request' 
    })
  }
}


}
