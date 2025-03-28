import { Field, ObjectType } from '@nestjs/graphql';
import { ScrapeJobGqlDTO } from './ScrapeJobGQL.dto';

@ObjectType('CreateScrapeJobPayload')
export class CreateScrapeJobPayloadGqlDto {
  @Field(() => ScrapeJobGqlDTO)
  job: ScrapeJobGqlDTO;
}
