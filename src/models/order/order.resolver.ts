import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { OrderNew } from './dto/order.new';
import { Order } from './order.model';
import { OrderService } from './order.service';
import { CurrentUser } from '../../auth/gql-current-user';
import { GqlAuthGuard } from 'src/auth/jwt-auth.guard';
import { User } from '../user/user.model';
import { UserService } from '../user/user.service';
import { OrderInterface } from './order.interface';

@Resolver(of => Order)
export class OrderResolver {
  constructor(
    private readonly userService: UserService,
    private readonly orderService: OrderService
  ) {}

  async convert(order: OrderInterface): Promise<Order> {
    const changed: Order = {
      address: order.address,
      id: order.id,
      sender: order.sender,
      status: order.status,
      text: order.text,
      assigned: null
    };

    if (order.assigned) {
      const user: User = await this.userService.findOneByEmail(order.assigned);
      changed.assigned = user;
    }

    return changed;
  }

  @Query(returns => [Order])
  @UseGuards(GqlAuthGuard)
  async myOrders(@CurrentUser() user: User): Promise<Order[]> {
    return await Promise.all((await this.orderService.findAllByEmail(user.email)).map(item => this.convert(item)));
  }

  @Query(returns => [Order])
  async allOrders(): Promise<Order[]> {
    return Promise.all((await this.orderService.findAll()).map(item => this.convert(item)));
  }

  @Mutation(returns => Order)
  async addOrder(
    @Args('newOrderData') newOrder: OrderNew,
  ): Promise<Order> {
    return await this.convert(await this.orderService.create(newOrder));
  }

  @Mutation(returns => Order)
  @UseGuards(GqlAuthGuard)
  async assignToMe(
    @Args('orderId') id: string,
    @CurrentUser() user: User,
  ): Promise<Order> {
    return await this.convert(await this.orderService.assign(id, user));
  }

  @Mutation(returns => Boolean)
  async deleteOrder(@CurrentUser() user: User) {
    return this.userService.remove(user.id);
  }
}