import { Field, InputType } from '@nestjs/graphql';
import { MaxLength } from 'class-validator';

@InputType()
export class OrderNew {
  constructor(text: string = '', sender: string = '', address: string = '') {
    this.text = text;
    this.sender = sender;
    this.address = address;
  }

  @Field()
  @MaxLength(30)
  text: string;

  @Field()
  sender: string;

  @Field()
  address: string;
}