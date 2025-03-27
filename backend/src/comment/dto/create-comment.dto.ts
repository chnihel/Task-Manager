import { IsNotEmpty, IsString } from "class-validator";
import { Types } from "mongoose";

export class CreateCommentDto {
    @IsString()
    @IsNotEmpty()
    content:string
    task: Types.ObjectId;
    user: Types.ObjectId;

    
}
