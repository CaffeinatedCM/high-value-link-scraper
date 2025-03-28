import { Field, Float, ID, ObjectType, Int } from '@nestjs/graphql';
import { ScrapeJobStatus } from '../../entities/ScrapeJob.entity';
import { ScrapedUrlGqlDTO } from './ScrapedUrlGQL.dto';
import { ScrapedContactGqlDTO } from './ScrapedContactGQL.dto';

@ObjectType('ScrapeJob')
export class ScrapeJobGqlDTO {
  @Field(() => ID)
  id: number;

  @Field()
  targetUrl: string;

  @Field(() => [String])
  keywords: string[];

  @Field(() => ScrapeJobStatus)
  status: ScrapeJobStatus;

  @Field(() => Int)
  maxDepth: number;

  @Field(() => Float)
  minRelevance: number;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field(() => [ScrapedUrlGqlDTO], { nullable: true })
  scrapedUrls: ScrapedUrlGqlDTO[] | null;

  @Field(() => [ScrapedContactGqlDTO], { nullable: true })
  scrapedContacts: ScrapedContactGqlDTO[] | null;
}
