import { Field, Int, ObjectType } from '@nestjs/graphql';
import { User } from '../user/user.model';

@ObjectType()
export class Order {
  @Field()
  id: string;

  @Field()
  text: string;

  @Field()
  sender: string;

  @Field()
  status: string;

  @Field()
  address: string;

  @Field(type => User, { nullable: true })
  assigned?: User;
}