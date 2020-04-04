import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UserResolver } from './user.resolver';
import { UserService } from './user.service';
import { UserSchema } from './user.schema';

@Module({
  imports: [MongooseModule.forFeature([{name: 'User', schema: UserSchema}])],
  providers: [UserResolver, UserService],
  exports: [UserService]
})
export class UserModule {}