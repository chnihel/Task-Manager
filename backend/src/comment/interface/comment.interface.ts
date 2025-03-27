import { Document, Types } from "mongoose";

export interface IComment extends Document{
    readonly content:string
    task: Types.ObjectId;
    user: Types.ObjectId;

}