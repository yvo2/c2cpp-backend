import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose'; 

import { UserNew } from './dto/user.new';
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

  async create(data: UserNew): Promise<UserInterface> {
    const createdUser = new this.userModel(data);
    return createdUser.save();
  }

  async findOneByEmail(email: string): Promise<UserInterface | undefined> {
    return await this.userModel.findOne(user => user && user.email === email);
  }

  async remove(id: string): Promise<UserInterface> {
    return this.userModel.findOneAndDelete(user => user && user.id === id);
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