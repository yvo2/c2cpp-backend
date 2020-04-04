import { NotFoundException } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { UserNew } from './dto/user.new';
import { UserArgs } from './dto/user.args';
import { User } from './user.model';
import { UserService } from './user.service';

@Resolver(of => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(returns => User)
  async user(@Args('id') id: string): Promise<User> {
    const user = await this.userService.findOneById(id);
    if (!user) {
      throw new NotFoundException(id);
    }
    return user;
  }

  @Query(returns => [User])
  users(@Args() userArgs: UserArgs): Promise<User[]> {
    return this.userService.findAll(userArgs);
  }

  @Mutation(returns => User)
  async register(
    @Args('newUserData') newUserData: UserNew,
  ): Promise<User> {
    const user = await this.userService.create(newUserData);
    return user;
  }

  @Mutation(returns => Boolean)
  async deleteUser(@Args('id') id: string) {
    return this.userService.remove(id);
  }
}