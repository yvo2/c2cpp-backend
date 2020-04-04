import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose'; 

import { UserNew } from './dto/user.new';
import { UserArgs } from './dto/user.args';
import { User } from './user.model';
import { UserInterface } from './user.interface';
import { JwtService } from '@nestjs/jwt';
import { Access } from './dto/access';
import { compare } from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private userModel: Model<UserInterface>,
    private jwtService: JwtService
  ) {}

  async create(data: UserNew): Promise<User> {
    // TODO hash password

    const createdUser = new this.userModel(data);
    return createdUser.save();
  }

  async findOneById(id: string): Promise<User> {
    return {} as any;
  }

  async findOneByEmail(email: string): Promise<User | undefined> {
    return this.userModel.findOne(user => user && user.email === email);
  }

  async findAll(args: UserArgs): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async remove(id: string): Promise<boolean> {
    return true;
  }

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.findOneByEmail(email);
    if (user && await compare(pass, user.password)) {
      return user;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, firstName: user.firstName, lastName: user.lastName };

    const access = new Access();
    access.accessToken = this.jwtService.sign(payload);

    return access;
  }
}