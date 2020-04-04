import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose'; 

import { UserNew } from './dto/user.new';
import { UserArgs } from './dto/user.args';
import { User } from './user.model';
import { UserInterface } from './user.interface';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private userModel: Model<UserInterface>) {}

  async create(data: UserNew): Promise<User> {
    return {
      id: 1337
    } as any;
  }

  async findOneById(id: string): Promise<User> {
    return {} as any;
  }

  async findOneByEmail(email: string): Promise<User | undefined> {
    return this.userModel.findOne(user => user.email === email);
  }

  async findAll(recipesArgs: UserArgs): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async remove(id: string): Promise<boolean> {
    return true;
  }
}