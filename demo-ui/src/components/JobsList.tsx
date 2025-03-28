"use client";

import { graphql } from "@/graphql";
import { useQuery } from "@tanstack/react-query";
import { gqlClient } from "@/lib/gqlClient";
import request from "graphql-request";
import { LoaderCircle } from "lucide-react";
import { JobsAccordion } from "./JobsAccordion";

const allJobsQueryDocument = graphql(/* graphql */ `
  query AllScrapeJobs {
    scrapeJobs {
      id
      status
      createdAt
      updatedAt
      targetUrl
      maxDepth
      minRelevance
      keywords

      scrapedContacts(limit: 5) {
        contactName
        contactRole
        emailAddress
        phoneNumber
        physicalAddress
        relevanceReason
        relevanceScore
      }
      scrapedUrls(limit: 5) {
        relevanceScore
        relevanceReason
        absoluteUrl
        fileType
        isDownload
        linkText
      }
    }
  }
`);

export const JobsList = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["allScrapeJobs"],
    queryFn: async () => gqlClient.request(allJobsQueryDocument),
    refetchInterval: 90,
  });

  console.log("data", data);

  return (
    <div className="space-y-2 mt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Previous Jobs</h2>
      </div>

      {isLoading ? <LoaderCircle className="animate-spin" /> : null}

      {!isLoading && data?.scrapeJobs?.length ? (
        <JobsAccordion jobs={data.scrapeJobs} />
      ) : (
        <p className="text-muted-foreground text-center py-8">
          No jobs have been run yet. Submit a URL above to get started.
        </p>
      )}
    </div>
  );
};
