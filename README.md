# AI Link Scraper

## Preqrequisits
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
3. Start `api-server` with `pnpm run start` or `pnpm run start:dev` in `api-server/`
   - If you just want the API, then you can stop here
4. Run `demo-ui` with `pnpm dev`
