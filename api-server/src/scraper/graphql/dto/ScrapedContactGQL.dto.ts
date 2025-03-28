import { Field, Float, ObjectType } from '@nestjs/graphql';

@ObjectType('ScrapedContact')
export class ScrapedContactGqlDTO {
  @Field()
  contactName: string;

  @Field(() => String, { nullable: true })
  contactRole: string | null;

  @Field(() => String, { nullable: true })
  phoneNumber: string | null;

  @Field(() => String, { nullable: true })
  emailAddress: string | null;

  @Field(() => String, { nullable: true })
  physicalAddress: string | null;

  @Field(() => Float)
  relevanceScore: number;

  @Field()
  relevanceReason: string;

  @Field(() => [String], { nullable: true })
  keywords: string[] | null;
}
