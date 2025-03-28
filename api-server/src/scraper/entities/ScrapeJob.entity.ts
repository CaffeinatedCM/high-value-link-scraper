import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ScrapedUrl } from './ScrapedUrl.entity';
import { ScrapedContact } from './ScrapedContact.entity';
import { registerEnumType } from '@nestjs/graphql';

export enum ScrapeJobStatus {
  PENDING = 'pending',
  RUNNING = 'running',
  DONE = 'done',
}

registerEnumType(ScrapeJobStatus, {
  name: 'ScrapeJobStatus',
});

@Entity()
export class ScrapeJob {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  targetUrl: string;

  @Column('simple-json')
  keywords: string[];

  @Column('int', { default: 1 })
  maxDepth: number;

  @Column('float', { default: 0.4 })
  minRelevance: number;

  @OneToMany(() => ScrapedUrl, (url) => url.job)
  scrapedUrls: ScrapedUrl[];

  @OneToMany(() => ScrapedContact, (contact) => contact.job)
  scrapedContacts: ScrapedContact[];

  @Column({
    type: 'simple-enum',
    enum: ScrapeJobStatus,
    default: ScrapeJobStatus.PENDING,
  })
  status: ScrapeJobStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
