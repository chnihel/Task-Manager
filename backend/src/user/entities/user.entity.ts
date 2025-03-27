import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as argon2 from "argon2"
import mongoose, { Types } from "mongoose";

@Schema()
export class User {
    @Prop()
    name:string
    @Prop({unique:true})
    email:string
    @Prop()
    password:string
    @Prop()
    profile:string
    @Prop()
    refreshToken: string
    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'tasks' }] })
    task : Types.ObjectId[]
    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'comments' }] })
    comment : Types.ObjectId[]
}
export const userSchema=SchemaFactory.createForClass(User).pre('save', async function (){
    this.password = await argon2.hash(this.password);
})
