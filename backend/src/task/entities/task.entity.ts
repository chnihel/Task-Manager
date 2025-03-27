import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Types } from "mongoose";

export enum Status {
    Pending = "pending",
    Completed = "completed",
}
export enum Priority {
    Low = "low",
    Medium = "medium",
    High = "high"
}
export enum Category{
    WORK = "Work",
    PERSONAL = "Personal",
    STUDY = "Study",
    OTHER = "Other"
}
@Schema({timestamps:true})
export class Task {
    @Prop()
    title:string
    @Prop()
    description:string
    @Prop()
    startDate: Date;
    @Prop()
    deadline:Date
    @Prop({ enum: Status, default: Status.Pending })
    status: Status;
    @Prop({ enum: Priority, default: Priority.Medium })
    priority: Priority;
    @Prop({ enum: Category,})
    categ: Category 

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'users' })
    user: Types.ObjectId;
    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'comments' }] })
    comment : Types.ObjectId[]

}
export const taskSchema=SchemaFactory.createForClass(Task)
