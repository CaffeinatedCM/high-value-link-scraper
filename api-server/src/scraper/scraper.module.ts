import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScrapeJob } from './entities/ScrapeJob.entity';
import { ScrapedUrl } from './entities/ScrapedUrl.entity';
import { ScrapedContact } from './entities/ScrapedContact.entity';
import { ScraperRunnerService } from './scraper_runner.service';
import { ScraperService } from './scraper.service';
import { ScraperResolver } from './graphql/scraper.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([ScrapeJob, ScrapedUrl, ScrapedContact])],
  providers: [ScraperRunnerService, ScraperService, ScraperResolver],
  exports: [ScraperRunnerService], // if other modules need it
})
export class ScraperModule {}
