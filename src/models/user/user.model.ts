import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Access } from './dto/access';

@ObjectType()
export class User {
  @Field()
  id: string;

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  email: string;
}

@ObjectType()
export class UserWithAccess extends User {
  constructor(user: User, access: Access) {
    super();
    this.id = user.id;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.email = user.email;
    this.access = access;
  }

  @Field()
  id: string;

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  email: string;

  @Field(type => Access)
  access: Access;
}