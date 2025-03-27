import { IsDateString, IsEnum, IsNotEmpty, IsString } from "class-validator";
import { Priority, Status } from "../entities/task.entity";
import { Types } from "mongoose";

export class CreateTaskDto {
    @IsString()
    @IsNotEmpty()
    title:string
    @IsString()
    @IsNotEmpty()
    description:string
    @IsDateString()
    @IsNotEmpty()
    startDate:Date
    @IsDateString()
    @IsNotEmpty()
    deadline:Date

    status?: Status;
    @IsEnum(Priority)
    @IsNotEmpty()
    priority: Priority;
    user: Types.ObjectId;
    comment : Types.ObjectId[]

    
}
