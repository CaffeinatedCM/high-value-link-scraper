import { Injectable, Logger } from '@nestjs/common';
import { spawn, ChildProcess } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';
import { ScrapeJob, ScrapeJobStatus } from './entities/ScrapeJob.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ScrapedUrl } from './entities/ScrapedUrl.entity';
import { ScrapedContact } from './entities/ScrapedContact.entity';
import { ConfigService } from '@nestjs/config';

interface ScrapeTask {
  parentJob: ScrapeJob;
  targetUrl: string;
  depth: number;
  disableHeadless?: boolean;
}

interface ScrapeResultLink {
  absoluteUrl: string;
  htmlTag: string;
  linkText: string;
  context: string;
  attributes: { attribute: string; value: string }[];
  isDownload: boolean;
  fileType: string;
  relevanceScore: number;
  relevanceReason: string;
  keywords: string[];
}

interface ScrapeResultContact {
  contactName: string;
  contactRole: string;
  phoneNumber: string;
  emailAddress: string;
  physicalAddress: string;
  relevanceScore: number;
  relevanceReason: string;
  keywords: string[];
}

interface ScrapeResults {
  links?: ScrapeResultLink[];
  contacts?: ScrapeResultContact[];
  isForbidden?: boolean;
}

const scraperPath = path.resolve(__dirname, '../../../stagehand-scraper/');

@Injectable()
export class ScraperRunnerService {
  private readonly logger = new Logger(ScraperRunnerService.name);

  private maxConcurrentJobs: number;
  private maxConcurrentTasks: number;
  private activeJobs: Set<ScrapeJob> = new Set();
  private pendingJobs: ScrapeJob[] = [];
  private runningTasksForJob: Map<ScrapeJob, number> = new Map();
  private pendingScrapeTasks: ScrapeTask[] = [];
  private activeScrapeTasks: Map<ScrapeTask, ChildProcess> = new Map();
  private visitedUrlsForJob: Map<ScrapeJob, Set<string>> = new Map();

  constructor(
    @InjectRepository(ScrapeJob)
    private readonly jobRepository: Repository<ScrapeJob>,
    @InjectRepository(ScrapedUrl)
    private readonly urlRepository: Repository<ScrapedUrl>,
    @InjectRepository(ScrapedContact)
    private readonly contactRepository: Repository<ScrapedContact>,
    private configService: ConfigService,
  ) {
    // OPENAI_API_KEY is required
    this.maxConcurrentJobs = Number(
      configService.get('MAX_CONCURRENT_JOBS', '3'),
    );
    this.maxConcurrentTasks = Number(
      configService.get('MAX_CONCURRENT_TASKS', '5'),
    );

    if (isNaN(this.maxConcurrentJobs) || isNaN(this.maxConcurrentTasks)) {
      throw new Error(
        'MAX_CONCURRENT_JOBS and MAX_CONCURRENT_TASKS must be numbers (or undefiend for defaults)',
      );
    }

    // For the file passing that is used for communicating with scrapers right now
    if (!fs.existsSync(path.resolve(__dirname, '../../tmp'))) {
      fs.mkdirSync(path.resolve(__dirname, '../../tmp'));
    }
  }

  submitJob(job: ScrapeJob) {
    this.pendingJobs.push(job);
    this.visitedUrlsForJob.set(job, new Set());
    this.checkQueue();
  }

  private checkQueue() {
    this.logger.debug('Current state: ', {
      activeJobs: this.activeJobs.size,
      jobQueue: this.pendingJobs.length,
      scrapeQueue: this.pendingScrapeTasks.length,
      runningScrapes: this.activeScrapeTasks.size,
    });

    // Keep up to maxConcurrentJobs running
    while (
      this.activeJobs.size < this.maxConcurrentJobs &&
      this.pendingJobs.length > 0
    ) {
      const job = this.pendingJobs.shift();
      if (!job) {
        break;
      }
      this.activeJobs.add(job);
      this.jobRepository.update(
        { id: job.id },
        { status: ScrapeJobStatus.RUNNING },
      );
      this.enqueueTask(job, job.targetUrl, 1);
    }

    while (
      this.activeScrapeTasks.size < this.maxConcurrentTasks &&
      this.pendingScrapeTasks.length > 0
    ) {
      const task = this.pendingScrapeTasks.shift();
      if (!task) {
        break;
      }

      this.runTask(task);
    }
  }

  private enqueueTask(
    parentJob: ScrapeJob,
    url: string,
    depth: number,
    disableHeadless?: boolean,
  ) {
    this.logger.log('Queueing task', { url, depth, disableHeadless });
    const visitedUrls = this.visitedUrlsForJob.get(parentJob);
    if (visitedUrls!.has(url)) {
      return;
    }
    const task: ScrapeTask = {
      parentJob,
      targetUrl: url,
      depth,
      disableHeadless,
    };
    this.pendingScrapeTasks.push(task);

    const currentCount = this.runningTasksForJob.get(parentJob) ?? 0;
    this.runningTasksForJob.set(parentJob, currentCount + 1);
  }

  private runTask(task: ScrapeTask) {
    const taskName = `${task.parentJob.id}__${Buffer.from(task.targetUrl).toString('base64')}`;
    this.logger.log(
      `Starting scrape task ${taskName} (url: ${task.targetUrl})`,
    );

    const tmpFile = path.resolve(__dirname, '../../tmp', taskName);
    const taskProcess = spawn('pnpm', ['run', 'start'], {
      cwd: scraperPath,
      env: {
        ...process.env,
        OUTPUT_FILE: tmpFile,
        TARGET_URL: task.targetUrl,
        KEYWORDS: task.parentJob.keywords.join(', '),
        DISABLE_HEADLESS: `${task.disableHeadless}`,
      },
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    this.activeScrapeTasks.set(task, taskProcess);

    taskProcess.stdout?.on('data', (data) => {
      //this.logger.log(`Task ${taskName} stdout: ${data}`);
    });

    taskProcess.stderr?.on('data', (data) => {
      this.logger.log(`Task ${taskName} stdout: ${data}`);
    });

    taskProcess.on('exit', (code) => {
      this.logger.log(`Task ${taskName} finished with status code ${code}`);

      if (fs.existsSync(tmpFile)) {
        const resultRaw = fs.readFileSync(tmpFile, 'utf-8');
        const result: ScrapeResults = JSON.parse(resultRaw);
        fs.unlinkSync(tmpFile);

        this.finishTask(task, result);
        return;
      } else {
        this.logger.error(`Task ${taskName} tmp file not found.`);
      }

      this.finishTask(task);
    });

    taskProcess.on('error', (err) => {
      this.logger.error(`Task ${taskName} failed with error ${err}`);
      this.finishTask(task);
    });
  }

  private async saveTaskResults(task: ScrapeTask, results: ScrapeResults) {
    const { parentJob: job } = task;

    const { links = [], contacts = [] } = results;
    await this.urlRepository.save(
      links.map<Omit<ScrapedUrl, 'id'>>((r) => ({
        job,
        ...r,
      })),
    );
    this.logger.log(`Saved ${links.length} links for job ${job.id}`);
    await this.contactRepository.save(
      contacts.map<Omit<ScrapedContact, 'id'>>((r) => ({
        job,
        ...r,
      })),
    );
    this.logger.log(`Saved ${contacts.length} contacts for job ${job.id}`);
  }

  private async finishTask(
    task: ScrapeTask,
    results?: ScrapeResults,
  ): Promise<void> {
    const { parentJob, depth } = task;
    this.activeScrapeTasks.delete(task);

    if (results) {
      // Some sites don't like headless mode, run with a head
      // if we weren't already running with a head
      if (!task.disableHeadless && results.isForbidden) {
        this.logger.log('Got forbidden message, trying with a head');
        this.visitedUrlsForJob.get(parentJob)?.delete(task.targetUrl);
        this.enqueueTask(parentJob, task.targetUrl, depth, true);
      } else {
        await this.saveTaskResults(task, results);
      }

      // Queue up some more scrapes
      if (depth + 1 < parentJob.maxDepth) {
        for (const link of results.links ?? []) {
          if (link.isDownload || !link.absoluteUrl.startsWith('http')) {
            continue;
          }

          if (link.relevanceScore >= parentJob.minRelevance) {
            this.enqueueTask(parentJob, link.absoluteUrl, depth + 1);
          }
        }
      }
    }

    const currentCountForJob = this.runningTasksForJob.get(parentJob) ?? 0;
    if (currentCountForJob <= 1) {
      this.logger.log(`All tasks for ${parentJob.id} completed`);
      this.runningTasksForJob.delete(parentJob);
      this.visitedUrlsForJob.delete(parentJob);
      this.activeJobs.delete(parentJob);

      this.jobRepository.update(
        { id: parentJob.id },
        { status: ScrapeJobStatus.DONE },
      );
    } else {
      this.runningTasksForJob.set(parentJob, currentCountForJob - 1);
    }
    this.checkQueue();
  }
}
