import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose'; 

import { OrderNew } from './dto/order.new';
import { OrderInterface } from './order.interface';
import TelegramBot from 'node-telegram-bot-api';
import { User } from '../user/user.model';

class Context {
  id: number = 0;
  text: string = '';
  state: string = '';
  sender: string = '';
  address: string = '';
}

@Injectable()
export class OrderService implements OnModuleInit {
  constructor(
    @InjectModel('Order') private orderModel: Model<OrderInterface>
  ) {}

  bot: TelegramBot;
  context: Context[] = [];

  onModuleInit() {
    if (process.env.TELEGRAM_BOT) {
      this.bot = new TelegramBot(process.env.TELEGRAM_BOT, { polling: true });

      this.bot.on('message', msg => {
        this.onMessage(msg);
      });

      this.bot.on('polling_error', (err) => console.log(err));
    }
  }

  async onMessage(msg: TelegramBot.Message) {
    if (msg.text.startsWith('/')) {
      return;
    }

    const getContext = (id: number): Context => {
      const list = this.context.filter(ctx => ctx.id === id);
      if (list.length === 0) {
        return null;
      }
      return list[0];
    }

    const setContext = (ctx: Context) => {
      this.context = [
        ...this.context.filter(existingCtx => ctx.id !== existingCtx.id),
        ctx
      ]
    }

    const deleteContext = (ctx: Context) => {
      this.context = this.context.filter(existingCtx => ctx.id !== existingCtx.id);
    }

    const answer = (ctx: Context, msg: string) => {
      this.bot.sendMessage(ctx.id, msg);
    }

    // Check if context is available
    let ctx = getContext(msg.from.id);

    if (!ctx) {
      ctx = new Context();
      ctx.id = msg.from.id;
      ctx.state = 'EXPECTING_ORDER';
      ctx.text = msg.text;
      ctx.sender = msg.from.first_name + '//' + msg.from.id;
      answer(ctx, "Thank you for reaching out! I've added that to the order list! Is there anything else you would like to receive? [Answer \"no\" to continue]")
      setContext(ctx);
    } else if (ctx.state === 'EXPECTING_ORDER' && msg.text.toLowerCase() !== 'no') {
      ctx.text = ctx.text + '\n' + msg.text;
      answer(ctx, "I've added that to the list! Is there anything else you would like to receive? [Answer \"no\" to continue]");
      setContext(ctx);
    } else if (ctx.state === 'EXPECTING_ORDER' && msg.text.toLowerCase() === 'no') {
      ctx.state = 'EXPECTING_ADDRESS';
      answer(ctx, "Thank you very much for your order! Please type your address now, that we can dispatch a helper to you!");
      setContext(ctx);
    } else if (ctx.state === 'EXPECTING_ADDRESS') {
      ctx.address = msg.text;
      // Submit
      await this.create(new OrderNew(ctx.text, ctx.sender, ctx.address))

      answer(ctx, "That's it! You will receive an update here as soon as someone accepts your request. Stay tuned!");
      deleteContext(ctx);
    }
  }

  async create(data: any): Promise<OrderInterface> {
    data.status = 'OPEN';
    const createdOrder = new this.orderModel(data);
    return createdOrder.save();
  }

  async findOneById(id: string): Promise<OrderInterface> {
    const list = (await this.findAll()).filter(order => order.id.toString() === id);
    if (list.length === 0) {
      return null;
    }

    return list[0];
  }

  async findAllByEmail(email: string): Promise<OrderInterface[]> {
    return (await this.findAll()).filter(order => order && order.assigned === email);
  }

  async findAll(): Promise<OrderInterface[]> {
    return await this.orderModel.find();
  }

  async assign(id: string, user: any, arrival: string): Promise<OrderInterface> {
    const order = await this.findOneById(id);

    if (!order) {
      throw Error("ORDER_NOT_FOUND");
    }

    if (order.assigned) {
      throw Error("ORDER_ALREADY_ASSIGNED");
    }

    // Send telegram message
    const telegramId = order.sender.split('//')[1];
    this.bot.sendMessage(telegramId, "Good news! " + user.payload.firstName + " " + user.payload.lastName + " just accepted your order, and it will be delivered in about " + arrival + ".");

    order.assigned = user.email;
    order.arrival = arrival;
    order.status = 'ASSIGNED';
    return order.save();
  }

  async complete(id: string, user: any): Promise<OrderInterface> {
    const order = await this.findOneById(id);

    if (!order) {
      throw Error("ORDER_NOT_FOUND");
    }

    if (!order.assigned || order.assigned !== user.email) {
      throw Error("NOT_YOUR_ORDER");
    }

    if (order.status !== 'OPEN') {
      throw Error("ORDER_NOT_OPEN");
    }

    // Send telegram message
    const telegramId = order.sender.split('//')[1];
    this.bot.sendMessage(telegramId, "Your order was completed by " + user.payload.firstName + " " + user.payload.lastName + "! Thank you for using this service, and stay healthy!");

    order.status = 'COMPLETED';
    return order.save();
  }

  /* async remove(id: string): Promise<boolean> {
    return true;
  } */
}