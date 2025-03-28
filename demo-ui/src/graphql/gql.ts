/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "\n  query JobDetails($id: Int!) {\n    scrapeJob(id: $id) {\n      id\n      status\n      keywords\n      createdAt\n      updatedAt\n      maxDepth\n      minRelevance\n      targetUrl\n      scrapedContacts {\n        contactName\n        contactRole\n        emailAddress\n        phoneNumber\n        physicalAddress\n        relevanceReason\n        relevanceScore\n      }\n      scrapedUrls {\n        relevanceScore\n        relevanceReason\n        absoluteUrl\n        fileType\n        isDownload\n        linkText\n      }\n    }\n  }\n": typeof types.JobDetailsDocument,
    "\n  query AllScrapeJobs {\n    scrapeJobs {\n      id\n      status\n      createdAt\n      updatedAt\n      targetUrl\n      maxDepth\n      minRelevance\n      keywords\n\n      scrapedContacts(limit: 5) {\n        contactName\n        contactRole\n        emailAddress\n        phoneNumber\n        physicalAddress\n        relevanceReason\n        relevanceScore\n      }\n      scrapedUrls(limit: 5) {\n        relevanceScore\n        relevanceReason\n        absoluteUrl\n        fileType\n        isDownload\n        linkText\n      }\n    }\n  }\n": typeof types.AllScrapeJobsDocument,
    "\n  mutation CreateScrapeJob($input: CreateScrapeJobInput!) {\n    createScrapeJob(input: $input) {\n      job {\n        id\n      }\n    }\n  }\n": typeof types.CreateScrapeJobDocument,
};
const documents: Documents = {
    "\n  query JobDetails($id: Int!) {\n    scrapeJob(id: $id) {\n      id\n      status\n      keywords\n      createdAt\n      updatedAt\n      maxDepth\n      minRelevance\n      targetUrl\n      scrapedContacts {\n        contactName\n        contactRole\n        emailAddress\n        phoneNumber\n        physicalAddress\n        relevanceReason\n        relevanceScore\n      }\n      scrapedUrls {\n        relevanceScore\n        relevanceReason\n        absoluteUrl\n        fileType\n        isDownload\n        linkText\n      }\n    }\n  }\n": types.JobDetailsDocument,
    "\n  query AllScrapeJobs {\n    scrapeJobs {\n      id\n      status\n      createdAt\n      updatedAt\n      targetUrl\n      maxDepth\n      minRelevance\n      keywords\n\n      scrapedContacts(limit: 5) {\n        contactName\n        contactRole\n        emailAddress\n        phoneNumber\n        physicalAddress\n        relevanceReason\n        relevanceScore\n      }\n      scrapedUrls(limit: 5) {\n        relevanceScore\n        relevanceReason\n        absoluteUrl\n        fileType\n        isDownload\n        linkText\n      }\n    }\n  }\n": types.AllScrapeJobsDocument,
    "\n  mutation CreateScrapeJob($input: CreateScrapeJobInput!) {\n    createScrapeJob(input: $input) {\n      job {\n        id\n      }\n    }\n  }\n": types.CreateScrapeJobDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query JobDetails($id: Int!) {\n    scrapeJob(id: $id) {\n      id\n      status\n      keywords\n      createdAt\n      updatedAt\n      maxDepth\n      minRelevance\n      targetUrl\n      scrapedContacts {\n        contactName\n        contactRole\n        emailAddress\n        phoneNumber\n        physicalAddress\n        relevanceReason\n        relevanceScore\n      }\n      scrapedUrls {\n        relevanceScore\n        relevanceReason\n        absoluteUrl\n        fileType\n        isDownload\n        linkText\n      }\n    }\n  }\n"): (typeof documents)["\n  query JobDetails($id: Int!) {\n    scrapeJob(id: $id) {\n      id\n      status\n      keywords\n      createdAt\n      updatedAt\n      maxDepth\n      minRelevance\n      targetUrl\n      scrapedContacts {\n        contactName\n        contactRole\n        emailAddress\n        phoneNumber\n        physicalAddress\n        relevanceReason\n        relevanceScore\n      }\n      scrapedUrls {\n        relevanceScore\n        relevanceReason\n        absoluteUrl\n        fileType\n        isDownload\n        linkText\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query AllScrapeJobs {\n    scrapeJobs {\n      id\n      status\n      createdAt\n      updatedAt\n      targetUrl\n      maxDepth\n      minRelevance\n      keywords\n\n      scrapedContacts(limit: 5) {\n        contactName\n        contactRole\n        emailAddress\n        phoneNumber\n        physicalAddress\n        relevanceReason\n        relevanceScore\n      }\n      scrapedUrls(limit: 5) {\n        relevanceScore\n        relevanceReason\n        absoluteUrl\n        fileType\n        isDownload\n        linkText\n      }\n    }\n  }\n"): (typeof documents)["\n  query AllScrapeJobs {\n    scrapeJobs {\n      id\n      status\n      createdAt\n      updatedAt\n      targetUrl\n      maxDepth\n      minRelevance\n      keywords\n\n      scrapedContacts(limit: 5) {\n        contactName\n        contactRole\n        emailAddress\n        phoneNumber\n        physicalAddress\n        relevanceReason\n        relevanceScore\n      }\n      scrapedUrls(limit: 5) {\n        relevanceScore\n        relevanceReason\n        absoluteUrl\n        fileType\n        isDownload\n        linkText\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateScrapeJob($input: CreateScrapeJobInput!) {\n    createScrapeJob(input: $input) {\n      job {\n        id\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation CreateScrapeJob($input: CreateScrapeJobInput!) {\n    createScrapeJob(input: $input) {\n      job {\n        id\n      }\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;