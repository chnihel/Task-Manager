import { Document, Types } from "mongoose";
import { Category, Priority, Status } from "../entities/task.entity";

export interface ITask extends Document{
    readonly title:string
    readonly description:string
     deadline:Date
    readonly status:Status
    readonly priority:Priority
    user: Types.ObjectId;
    categ: Category;
    comment : Types.ObjectId[]

}