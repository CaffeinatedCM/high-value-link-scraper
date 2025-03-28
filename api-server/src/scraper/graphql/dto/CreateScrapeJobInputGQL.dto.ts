import { Field, InputType, Int, Float } from '@nestjs/graphql';
import { IsArray, IsUrl, IsOptional, Min, Max } from 'class-validator';

@InputType('CreateScrapeJobInput')
export class CreateScrapeJobInputGqlDto {
  @Field()
  @IsUrl()
  targetUrl: string;

  @Field(() => [String])
  @IsArray()
  keywords: string[];

  @Field(() => Int, { nullable: true, defaultValue: 1 })
  @IsOptional()
  @Min(1)
  @Max(5)
  maxDepth: number;

  @Field(() => Float, { nullable: true, defaultValue: 0.5 })
  @IsOptional()
  @Min(0)
  @Max(1)
  minRelevance: number;
}
