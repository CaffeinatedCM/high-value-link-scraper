/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
  DateTime: { input: any; output: any; }
};

export type CreateScrapeJobInput = {
  keywords: Array<Scalars['String']['input']>;
  maxDepth?: InputMaybe<Scalars['Int']['input']>;
  minRelevance?: InputMaybe<Scalars['Float']['input']>;
  targetUrl: Scalars['String']['input'];
};

export type CreateScrapeJobPayload = {
  __typename?: 'CreateScrapeJobPayload';
  job: ScrapeJob;
};

export type Mutation = {
  __typename?: 'Mutation';
  createScrapeJob?: Maybe<CreateScrapeJobPayload>;
};


export type MutationCreateScrapeJobArgs = {
  input: CreateScrapeJobInput;
};

export type Query = {
  __typename?: 'Query';
  scrapeJob?: Maybe<ScrapeJob>;
  scrapeJobs: Array<ScrapeJob>;
};


export type QueryScrapeJobArgs = {
  id: Scalars['Int']['input'];
};

export type ScrapeJob = {
  __typename?: 'ScrapeJob';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  keywords: Array<Scalars['String']['output']>;
  maxDepth: Scalars['Int']['output'];
  minRelevance: Scalars['Float']['output'];
  scrapedContacts?: Maybe<Array<ScrapedContact>>;
  scrapedUrls?: Maybe<Array<ScrapedUrl>>;
  status: ScrapeJobStatus;
  targetUrl: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};


export type ScrapeJobScrapedContactsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
};


export type ScrapeJobScrapedUrlsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
};

export enum ScrapeJobStatus {
  Done = 'DONE',
  Pending = 'PENDING',
  Running = 'RUNNING'
}

export type ScrapedContact = {
  __typename?: 'ScrapedContact';
  contactName: Scalars['String']['output'];
  contactRole?: Maybe<Scalars['String']['output']>;
  emailAddress?: Maybe<Scalars['String']['output']>;
  keywords?: Maybe<Array<Scalars['String']['output']>>;
  phoneNumber?: Maybe<Scalars['String']['output']>;
  physicalAddress?: Maybe<Scalars['String']['output']>;
  relevanceReason: Scalars['String']['output'];
  relevanceScore: Scalars['Float']['output'];
};

export type ScrapedUrl = {
  __typename?: 'ScrapedUrl';
  absoluteUrl: Scalars['String']['output'];
  context?: Maybe<Scalars['String']['output']>;
  fileType?: Maybe<Scalars['String']['output']>;
  htmlTag: Scalars['String']['output'];
  isDownload: Scalars['Boolean']['output'];
  keywords?: Maybe<Array<Scalars['String']['output']>>;
  linkText: Scalars['String']['output'];
  relevanceReason: Scalars['String']['output'];
  relevanceScore: Scalars['Float']['output'];
};

export type JobDetailsQueryVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type JobDetailsQuery = { __typename?: 'Query', scrapeJob?: { __typename?: 'ScrapeJob', id: string, status: ScrapeJobStatus, keywords: Array<string>, createdAt: any, updatedAt: any, maxDepth: number, minRelevance: number, targetUrl: string, scrapedContacts?: Array<{ __typename?: 'ScrapedContact', contactName: string, contactRole?: string | null, emailAddress?: string | null, phoneNumber?: string | null, physicalAddress?: string | null, relevanceReason: string, relevanceScore: number }> | null, scrapedUrls?: Array<{ __typename?: 'ScrapedUrl', relevanceScore: number, relevanceReason: string, absoluteUrl: string, fileType?: string | null, isDownload: boolean, linkText: string }> | null } | null };

export type AllScrapeJobsQueryVariables = Exact<{ [key: string]: never; }>;


export type AllScrapeJobsQuery = { __typename?: 'Query', scrapeJobs: Array<{ __typename?: 'ScrapeJob', id: string, status: ScrapeJobStatus, createdAt: any, updatedAt: any, targetUrl: string, maxDepth: number, minRelevance: number, keywords: Array<string>, scrapedContacts?: Array<{ __typename?: 'ScrapedContact', contactName: string, contactRole?: string | null, emailAddress?: string | null, phoneNumber?: string | null, physicalAddress?: string | null, relevanceReason: string, relevanceScore: number }> | null, scrapedUrls?: Array<{ __typename?: 'ScrapedUrl', relevanceScore: number, relevanceReason: string, absoluteUrl: string, fileType?: string | null, isDownload: boolean, linkText: string }> | null }> };

export type CreateScrapeJobMutationVariables = Exact<{
  input: CreateScrapeJobInput;
}>;


export type CreateScrapeJobMutation = { __typename?: 'Mutation', createScrapeJob?: { __typename?: 'CreateScrapeJobPayload', job: { __typename?: 'ScrapeJob', id: string } } | null };


export const JobDetailsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"JobDetails"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"scrapeJob"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"keywords"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"maxDepth"}},{"kind":"Field","name":{"kind":"Name","value":"minRelevance"}},{"kind":"Field","name":{"kind":"Name","value":"targetUrl"}},{"kind":"Field","name":{"kind":"Name","value":"scrapedContacts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"contactName"}},{"kind":"Field","name":{"kind":"Name","value":"contactRole"}},{"kind":"Field","name":{"kind":"Name","value":"emailAddress"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}},{"kind":"Field","name":{"kind":"Name","value":"physicalAddress"}},{"kind":"Field","name":{"kind":"Name","value":"relevanceReason"}},{"kind":"Field","name":{"kind":"Name","value":"relevanceScore"}}]}},{"kind":"Field","name":{"kind":"Name","value":"scrapedUrls"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"relevanceScore"}},{"kind":"Field","name":{"kind":"Name","value":"relevanceReason"}},{"kind":"Field","name":{"kind":"Name","value":"absoluteUrl"}},{"kind":"Field","name":{"kind":"Name","value":"fileType"}},{"kind":"Field","name":{"kind":"Name","value":"isDownload"}},{"kind":"Field","name":{"kind":"Name","value":"linkText"}}]}}]}}]}}]} as unknown as DocumentNode<JobDetailsQuery, JobDetailsQueryVariables>;
export const AllScrapeJobsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AllScrapeJobs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"scrapeJobs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"targetUrl"}},{"kind":"Field","name":{"kind":"Name","value":"maxDepth"}},{"kind":"Field","name":{"kind":"Name","value":"minRelevance"}},{"kind":"Field","name":{"kind":"Name","value":"keywords"}},{"kind":"Field","name":{"kind":"Name","value":"scrapedContacts"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"5"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"contactName"}},{"kind":"Field","name":{"kind":"Name","value":"contactRole"}},{"kind":"Field","name":{"kind":"Name","value":"emailAddress"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}},{"kind":"Field","name":{"kind":"Name","value":"physicalAddress"}},{"kind":"Field","name":{"kind":"Name","value":"relevanceReason"}},{"kind":"Field","name":{"kind":"Name","value":"relevanceScore"}}]}},{"kind":"Field","name":{"kind":"Name","value":"scrapedUrls"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"5"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"relevanceScore"}},{"kind":"Field","name":{"kind":"Name","value":"relevanceReason"}},{"kind":"Field","name":{"kind":"Name","value":"absoluteUrl"}},{"kind":"Field","name":{"kind":"Name","value":"fileType"}},{"kind":"Field","name":{"kind":"Name","value":"isDownload"}},{"kind":"Field","name":{"kind":"Name","value":"linkText"}}]}}]}}]}}]} as unknown as DocumentNode<AllScrapeJobsQuery, AllScrapeJobsQueryVariables>;
export const CreateScrapeJobDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateScrapeJob"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateScrapeJobInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createScrapeJob"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"job"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<CreateScrapeJobMutation, CreateScrapeJobMutationVariables>;