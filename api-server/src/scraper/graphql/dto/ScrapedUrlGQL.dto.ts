import { Field, Float, ObjectType } from '@nestjs/graphql';

@ObjectType('ScrapedUrl')
export class ScrapedUrlGqlDTO {
  @Field()
  absoluteUrl: string;

  @Field()
  htmlTag: string;

  @Field()
  linkText: string;

  @Field(() => String, { nullable: true })
  context: string | null;

  @Field(() => Float)
  relevanceScore: number;

  @Field()
  relevanceReason: string;

  @Field()
  isDownload: boolean;

  @Field(() => String, { nullable: true })
  fileType: string | null;

  @Field(() => [String], { nullable: true })
  keywords: string[] | null;
}
