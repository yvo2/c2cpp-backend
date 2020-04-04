import { Field, InputType } from '@nestjs/graphql';
import { MaxLength } from 'class-validator';

@InputType()
export class OrderNew {
  @Field()
  @MaxLength(30)
  text: string;

  @Field()
  sender: string;

  @Field()
  address: string;
}