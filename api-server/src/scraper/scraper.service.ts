import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ScrapeJob, ScrapeJobStatus } from './entities/ScrapeJob.entity';
import { Repository } from 'typeorm';
import { CreateScrapeJobInputGqlDto } from './graphql/dto/CreateScrapeJobInputGQL.dto';
import { ScraperRunnerService } from './scraper_runner.service';
import { ScrapedContact } from './entities/ScrapedContact.entity';
import { ScrapedUrl } from './entities/ScrapedUrl.entity';

@Injectable()
export class ScraperService {
  constructor(
    @InjectRepository(ScrapeJob)
    private readonly jobRepository: Repository<ScrapeJob>,
    @InjectRepository(ScrapedContact)
    private readonly contactRepository: Repository<ScrapedContact>,
    @InjectRepository(ScrapedUrl)
    private readonly urlRepository: Repository<ScrapedUrl>,
    private readonly runner: ScraperRunnerService,
  ) {}

  async getJob(id: number): Promise<ScrapeJob | null> {
    return await this.jobRepository.findOneBy({ id: id });
  }

  async findAllJobs(): Promise<ScrapeJob[]> {
    return this.jobRepository.find({
      order: { id: 'DESC' },
    });
  }

  async createJob(input: CreateScrapeJobInputGqlDto): Promise<ScrapeJob> {
    const job = this.jobRepository.create({
      targetUrl: input.targetUrl,
      keywords: input.keywords,
      status: ScrapeJobStatus.PENDING,
      maxDepth: input.maxDepth,
      minRelevance: input.minRelevance,
    });

    await this.jobRepository.save(job);

    this.runner.submitJob(job);

    return job;
  }

  async findScrapedUrlsForJob(
    jobId: number,
    { limit }: { limit?: number } = {},
  ): Promise<ScrapedUrl[]> {
    return this.urlRepository.find({
      where: { job: { id: jobId } },
      order: { relevanceScore: 'DESC' },
      take: limit,
    });
  }

  async findScrapedContactsForJob(
    jobId: number,
    { limit }: { limit?: number } = {},
  ): Promise<ScrapedContact[]> {
    return this.contactRepository.find({
      where: { job: { id: jobId } },
      order: { relevanceScore: 'DESC' },
      take: limit,
    });
  }
}
