import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus, Put, UseInterceptors, UploadedFile } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import {diskStorage} from 'multer'
import { extname } from 'path';
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post()
  @UseInterceptors(FileInterceptor("profile", {
    storage:diskStorage({
      destination: './storage',
      filename: (req, file, cb) => {
        cb(null , `${new Date().getTime()}${extname(file.originalname)}`)}
    })
  }))
  async createUser(@Res() response, @Body() createUserDto: CreateUserDto, @UploadedFile() file) {
    try {
      createUserDto.profile = file ? file.filename : null ;
      const newUser = await this.userService.createUser(createUserDto)
      return response.status(HttpStatus.CREATED).json({
        message: 'User Created Successfully',
        data: newUser
      })
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: `User not created: ${error.message}`,
        error: 'Bad Request'
      })
    }
  }

  @Get()
  async findAllUser(@Res() response) {
    try {
      const listeUsers = await this.userService.getAllUser()
      return response.status(HttpStatus.OK).json({
        message: 'Users disponibles: ',
        data: listeUsers
      })
    } catch (error) {
      return response.status(HttpStatus.NOT_FOUND).json({
        message: `Users non disponibles: ${error.message}`,
        error: 'Not Found'
      }) 
    }
  }

  @Get('/:id')
  async findOneUser(@Res() response, @Param('id') id: string) {
    try {
      const UserID = await this.userService.getOneUser(id)
      return response.status(HttpStatus.OK).json({
        message: `User with ID ${id} is found`,
        data: UserID
      })
    } catch (error) {
      return response.status(HttpStatus.NOT_FOUND).json({
        message: `User with ID ${id} is not found: ${error.message}`,
        error: 'Not Found',
      })
    }
  }

  @Put('/:id')
  async updateUser(@Res() response, @Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    try {
      const updateUserID = await this.userService.UpdateUser(id, updateUserDto)
      return response.status(HttpStatus.OK).json({
        message: `User with ID ${id} is updated Successfully`,
        data: updateUserID
      })
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: `User with ID ${id} is not updated: ${error.message}`,
        error: 'Bad Request'  
      })
    }
  }

  @Delete('/:id')
  async deleteUser(@Res() response, @Param('id') id: string) {
    try {
      const deleteUserID = await this.userService.deleteUser(id)
      return response.status(HttpStatus.OK).json({
        message: `User with ID ${id} is deleted Successfully`,
        data: deleteUserID
      })
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: `User with ID ${id} is not deleted: ${error.message}`,
        error: 'Bad Request' 
      })
    }
  }

  @Put('updatePassword/:id')
async updatePassword(@Res() response,@Param('id') id: string,@Body() updatePasswordDto: UpdatePasswordDto) {
  try {
    await this.userService.hachPassword(id, updatePasswordDto);
    return response.status(HttpStatus.NO_CONTENT).send();
  } catch (error) {
    return response.status(HttpStatus.BAD_REQUEST).json({
      statusCode: 400,
      message: 'Error: User password not updated',
      error: error.message || error.toString(),
    });
  }
}



 
}
