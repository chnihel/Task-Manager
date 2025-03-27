import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Types } from "mongoose";

@Schema({timestamps:true})
export class Comment {
    @Prop()
    content:string
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'tasks' })
    task: Types.ObjectId;
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'users' })
    user: Types.ObjectId;
}
export const commentSchema=SchemaFactory.createForClass(Comment)
