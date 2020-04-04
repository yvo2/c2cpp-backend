import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { OrderNew } from './dto/order.new';
import { Order } from './order.model';
import { OrderService } from './order.service';
import { CurrentUser } from '../../auth/gql-current-user';
import { GqlAuthGuard } from 'src/auth/jwt-auth.guard';
import { User } from '../user/user.model';
import { UserService } from '../user/user.service';

@Resolver(of => Order)
export class OrderResolver {
  constructor(
    private readonly userService: UserService,
    private readonly orderService: OrderService
  ) {}

  @Query(returns => Order)
  @UseGuards(GqlAuthGuard)
  async myOrders(@CurrentUser() user: User): Promise<User> {
    return await this.userService.findOneByEmail(user.email);
  }

  @Query(returns => [Order])
  async allOrders(): Promise<Order[]> {
    return await this.orderService.findAll();
  }

  @Mutation(returns => Order)
  async addOrder(
    @Args('newOrderData') newOrder: OrderNew,
  ): Promise<Order> {
    return await this.orderService.create(newOrder);
  }

  @Mutation(returns => Boolean)
  async deleteOrder(@CurrentUser() user: User) {
    return this.userService.remove(user.id);
  }
}