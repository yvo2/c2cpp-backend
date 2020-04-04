import { Injectable } from '@nestjs/common';
import { UserNew } from './dto/user.new';
import { UserArgs } from './dto/user.args';
import { User } from './user.model';

@Injectable()
export class UserService {
  /**
   * MOCK
   * Put some real business logic here
   * Left for demonstration purposes
   */

  async create(data: UserNew): Promise<User> {
    return {
      id: 1337
    } as any;
  }

  async findOneById(id: string): Promise<User> {
    return {} as any;
  }

  async findAll(recipesArgs: UserArgs): Promise<User[]> {
    return [] as User[];
  }

  async remove(id: string): Promise<boolean> {
    return true;
  }
}