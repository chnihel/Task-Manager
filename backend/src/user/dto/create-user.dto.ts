import { IsNotEmpty, IsString } from "class-validator";
import { Types } from "mongoose";

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    name:string
    @IsString()
    @IsNotEmpty()
    email:string
    @IsString()
    @IsNotEmpty()
    password:string
    profile:string

    refreshToken:string | undefined
    task : Types.ObjectId[]
    comment : Types.ObjectId[]


}
