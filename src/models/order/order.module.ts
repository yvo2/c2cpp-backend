import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TelegramModule } from 'nestjs-telegram';

import { OrderResolver } from './order.resolver';
import { OrderService } from './order.service';
import { OrderSchema } from './order.schema';
import { AuthModule } from '../../auth/auth.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([{name: 'Order', schema: OrderSchema}]), 
    TelegramModule.forRoot({
      botKey: process.env.TELEGRAM_BOT
    }),

    AuthModule,
    UserModule],
  providers: [OrderResolver, OrderService],
  exports: [OrderService]
})
export class OrderModule {}