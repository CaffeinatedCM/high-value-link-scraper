# AI Link Scraper

> **Note:** This project was created as a coding assessment for a job interview and developed within a limited timeframe. While fully functional, some features and optimizations may be simplified or abbreviated due to time constraints.

## Prerequisites
- node 22+
- pnpm  (`npm i -g pnpm`)
- OpenAI API Key

## Folders
- `api-server/` - Nest.js service running GraphQL API for the scraper
- `demo-ui/` - Next.js app that interacts with `api-server` to create scrape jobs and view results
- `stagehand-scraper/` - Web scraper using playwright + stagehand to scrape sites with an OpenAI LLM (gpt-4o)

## Running

1. Run `bootstrap.sh`  OR run `pnpm install` in `api-server/` , `demo-ui/`, and `stagehand-scraper/`  (you may need to run `pnpm accept-builds` if manually running pnpm install)
2. Set up the `.env` file in `api-server/` , see `api-server/env.example` , only `OPENAI_API_KEY` is required
3. Start `api-server` with `pnpm run start` or `pnpm run start:dev` in `api-server/` (uses port 3000)
   - If you just want the API, then you can stop here
4. (Optional) Run `demo-ui` with `pnpm dev` (uses port 3001)

## Usage (API)
1. `api-server` is available on port 3000 (http://localhost:3000)
2. The graphql endpoint is http://localhost:3000/graphql
3. An API Playground can be used at http://localhost:3000/graphql in a browser

## Usage (UI)
- The `demo-ui` is accessible by default on port 3001, (http://localhost:3001) next will assign a different port if that port is occupied. 
- There should be a pre-populated list of jobs to view, and a create job form to create your own jobs.

## API Docs

- New scrape jobs can be created with the `createScrapeJob` mutation
- A list of scrape jobs can be queried with the `scrapeJobs` query
- A single scrape job can be queried with the `scrapeJob` query

```graphql
type ScrapedUrl {
  absoluteUrl: String!
  htmlTag: String!
  linkText: String!
  context: String
  relevanceScore: Float!
  relevanceReason: String!
  isDownload: Boolean!
  fileType: String
  keywords: [String!]
}

type ScrapedContact {
  contactName: String!
  contactRole: String
  phoneNumber: String
  emailAddress: String
  physicalAddress: String
  relevanceScore: Float!
  relevanceReason: String!
  keywords: [String!]
}

type ScrapeJob {
  id: ID!
  targetUrl: String!
  keywords: [String!]!
  status: ScrapeJobStatus!
  maxDepth: Int!
  minRelevance: Float!
  createdAt: DateTime!
  updatedAt: DateTime!
  scrapedUrls(limit: Int): [ScrapedUrl!]
  scrapedContacts(limit: Int): [ScrapedContact!]
}

enum ScrapeJobStatus {
  PENDING
  RUNNING
  DONE
}

input CreateScrapeJobInput {
  targetUrl: String!
  keywords: [String!]!
  maxDepth: Int = 1
  minRelevance: Float = 0.5
}

type CreateScrapeJobPayload {
  job: ScrapeJob!
}

type Query {
  scrapeJobs: [ScrapeJob!]!
  scrapeJob(id: Int!): ScrapeJob
}

type Mutation {
  createScrapeJob(input: CreateScrapeJobInput!): CreateScrapeJobPayload
}
```
