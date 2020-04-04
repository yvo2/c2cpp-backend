import { ObjectType, Field } from "@nestjs/graphql";

@ObjectType()
export class Access {
    @Field()
    accessToken: String = '';

    @Field()
    error: String = '';
}