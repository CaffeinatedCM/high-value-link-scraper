import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ScrapeJob } from './ScrapeJob.entity';

@Entity()
export class ScrapedUrl {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ScrapeJob, (job) => job.scrapedUrls)
  job: ScrapeJob;

  @Column()
  absoluteUrl: string;

  @Column()
  htmlTag: string;

  @Column()
  linkText: string;

  @Column('text', { nullable: true })
  context: string | null;

  @Column('float')
  relevanceScore: number;

  @Column('text')
  relevanceReason: string;

  @Column({ default: false })
  isDownload: boolean;

  @Column('text', { nullable: true })
  fileType: string | null;

  @Column('simple-json', { nullable: true })
  keywords: string[];

  @Column('simple-json', { nullable: true })
  attributes: { attribute: string; value: string }[];
}
