import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { IUser } from './interface/user.interface';
import mongoose, { Model, Types } from 'mongoose';
import { UpdatePasswordDto } from './dto/update-password.dto';
import * as argon2 from 'argon2';
import { Status } from 'src/task/entities/task.entity';


@Injectable()
export class UserService {
 constructor(@InjectModel("users") private userModel:Model<IUser>){}
 async createUser(createUser:CreateUserDto):Promise<IUser>{
  const newUser=await new this.userModel(createUser)
  return  newUser.save()
 }

 async getAllUser():Promise<IUser[]>{
  const getUser=await this.userModel.find().populate("task").exec()
  return getUser
 }

 async getOneUser(id:string):Promise<IUser>{
  const getOne=await this.userModel.findById(id).populate("task")
  if(!getOne){
    throw new NotFoundException(`user with this ${id} not found`)
  }
  return getOne
 }
 
 async deleteUser(id:string):Promise<IUser>{
  const deleteOne=await this.userModel.findByIdAndDelete(id)
  if(!deleteOne){
    throw new NotFoundException(`user with this ${id} not found`)
  }
  return deleteOne
 }
 async UpdateUser(id:string,updateUserDto:UpdateUserDto):Promise<IUser>{
  const deleteOne=await this.userModel.findByIdAndUpdate(id,updateUserDto,{new:true})
  if(!deleteOne){
    throw new NotFoundException(`user with this ${id} not found`)
  }
  return deleteOne
 }


 async findUserByEmail(email: string): Promise<IUser> {
  const getUserByEmail = await this.userModel.findOne({email})
  if (!getUserByEmail) {
    throw new NotFoundException(`User with Email ${email} Not Found`);
  }
  return getUserByEmail
}

async updateToken(id: any, token: string) {
  const user = await this.userModel.findByIdAndUpdate(id, {refreshToken: token},{ new: true })
  if (!user) {
    throw new NotFoundException(`User with ID ${id} Not Found`)
  }
  return user
}

//updatePassword
async hachPassword( userId: string,updatePasswordDto: UpdatePasswordDto): Promise<void> {
  const { oldPassword, newPassword } = updatePasswordDto;
  console.log('Old Password:', oldPassword);
  console.log('New Password:', newPassword);
  const existingUser = await this.userModel.findById(userId);
  if (!existingUser) {
    console.log('Error: Old password is incorrect');
    throw new NotFoundException('User not found');
  }
  const isPasswordValid = await argon2.verify(existingUser.password, oldPassword);
  if (!isPasswordValid) {
    throw new NotFoundException('Password is incorrect');
  }
  const hashedNewPassword = await argon2.hash(newPassword);
  console.log('Hashed New Password:', hashedNewPassword);
  existingUser.password = hashedNewPassword;
  await this.userModel.findByIdAndUpdate(userId, {password: hashedNewPassword}, {new: true}) 
   console.log('Password updated successfully');
}




}
