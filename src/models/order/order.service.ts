import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose'; 

import { OrderNew } from './dto/order.new';
import { Order } from './order.model';
import { OrderInterface } from './order.interface';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel('Order') private orderModel: Model<OrderInterface>
  ) {}

  async create(data: any): Promise<Order> {
    data.status = 'OPEN';
    const createdOrder = new this.orderModel(data);
    return createdOrder.save();
  }

  async findOneById(id: string): Promise<Order> {
    return this.orderModel.findOne(order => order && order.id.toString() === id);
  }

  async findAllByUser(userId: string): Promise<Order[]> {
    return this.orderModel.find(order => order && order.assigned === userId);
  }

  async findAll(): Promise<Order[]> {
    return this.orderModel.find();
  }

  /* async remove(id: string): Promise<boolean> {
    return true;
  } */
}