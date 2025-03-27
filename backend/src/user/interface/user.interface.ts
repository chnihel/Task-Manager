import { Document, Types } from "mongoose";

export interface IUser extends Document{
    readonly name:string
    readonly email:string
     password:string
     profile:string

    refreshToken:string
    task : Types.ObjectId[]
    comment : Types.ObjectId[]

}