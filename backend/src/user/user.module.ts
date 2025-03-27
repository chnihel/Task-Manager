import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { userSchema } from './entities/user.entity';

@Module({
  imports:[MongooseModule.forFeature([{name:"users",schema:userSchema}])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService] 
})
export class UserModule {}
