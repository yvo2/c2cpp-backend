import { ObjectType, Field } from "@nestjs/graphql";
import { User } from "../user.model";

@ObjectType()
export class Access {
    @Field()
    accessToken: String = '';

    @Field()
    error: String = '';
}