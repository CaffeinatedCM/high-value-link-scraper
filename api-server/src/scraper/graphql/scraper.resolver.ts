import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { ScraperService } from '../scraper.service';
import { ScrapeJobGqlDTO } from './dto/ScrapeJobGQL.dto';
import { CreateScrapeJobPayloadGqlDto } from './dto/CreateScrapePayloadGql.dto';
import { CreateScrapeJobInputGqlDto } from './dto/CreateScrapeJobInputGQL.dto';
import { ScrapedUrlGqlDTO } from './dto/ScrapedUrlGQL.dto';
import { ScrapedContactGqlDTO } from './dto/ScrapedContactGQL.dto';

@Resolver(() => ScrapeJobGqlDTO)
export class ScraperResolver {
  constructor(private readonly scraperService: ScraperService) {}

  @Query(() => [ScrapeJobGqlDTO])
  async scrapeJobs(): Promise<ScrapeJobGqlDTO[]> {
    const jobs = await this.scraperService.findAllJobs();
    return jobs;
  }

  @Query(() => ScrapeJobGqlDTO, { nullable: true })
  async scrapeJob(@Args('id', { type: () => Int }) id: number) {
    return await this.scraperService.getJob(id);
  }

  @Mutation(() => CreateScrapeJobPayloadGqlDto, { nullable: true })
  async createScrapeJob(@Args('input') input: CreateScrapeJobInputGqlDto) {
    const job = await this.scraperService.createJob(input);
    return { job };
  }

  @ResolveField('scrapedUrls', () => [ScrapedUrlGqlDTO], { nullable: true })
  async scrapedUrls(
    @Parent() parent: ScrapeJobGqlDTO,
    @Args('limit', { nullable: true, type: () => Int }) limit?: number,
  ): Promise<ScrapedUrlGqlDTO[]> {
    return await this.scraperService.findScrapedUrlsForJob(parent.id, {
      limit,
    });
  }

  @ResolveField('scrapedContacts', () => [ScrapedContactGqlDTO], {
    nullable: true,
  })
  async scrapedContacts(
    @Parent() parent: ScrapeJobGqlDTO,
    @Args('limit', { nullable: true, type: () => Int }) limit?: number,
  ): Promise<ScrapedContactGqlDTO[]> {
    return await this.scraperService.findScrapedContactsForJob(parent.id, {
      limit,
    });
  }
}
