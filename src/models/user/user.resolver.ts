import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserNew } from './dto/user.new';
import { User } from './user.model';
import { UserService } from './user.service';
import { CurrentUser } from '../../auth/gql-current-user';
import { GqlAuthGuard } from 'src/auth/jwt-auth.guard';
import { Access } from './dto/access';
import { hash } from 'bcrypt';

@Resolver(of => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(returns => Access)
  async login(
    @Args('email') email: string,
    @Args('password') password: string
  ): Promise<Access> {
    const user = await this.userService.validateUser(email, password);
    if (user) {
      return this.userService.login(user);
    }

    const access = new Access();
    access.error = 'WRONG';

    return access;
  }

  @Query(returns => User)
  @UseGuards(GqlAuthGuard)
  async self(@CurrentUser() user: User): Promise<User> {
    const userDb = await this.userService.findOneByEmail(user.email);
    return userDb;
  }

  @Mutation(returns => User)
  async register(
    @Args('newUserData') newUserData: UserNew,
  ): Promise<User> {
    const existingUser = await this.userService.findOneByEmail(newUserData.email);

    if (existingUser) {
      throw Error("EMAIL_EXIST");
    }

    newUserData.password = await hash(newUserData.password, 10);

    const user = await this.userService.create(newUserData);
    return user;
  }

  @Mutation(returns => Boolean)
  async delete(@CurrentUser() user: User) {
    return this.userService.remove(user.id);
  }
}