import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ScrapeJob } from './ScrapeJob.entity';

@Entity()
export class ScrapedContact {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ScrapeJob, (job) => job.scrapedContacts)
  job: ScrapeJob;

  @Column()
  contactName: string;

  @Column('text', { nullable: true })
  contactRole: string | null;

  @Column('text', { nullable: true })
  phoneNumber: string | null;

  @Column('text', { nullable: true })
  emailAddress: string | null;

  @Column('text', { nullable: true })
  physicalAddress: string | null;

  @Column('float')
  relevanceScore: number;

  @Column('text')
  relevanceReason: string;

  @Column('simple-json', { nullable: true })
  keywords: string[];
}
