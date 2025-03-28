import { JobStatusBadge } from "@/components/JobStatusBadge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { graphql } from "@/graphql";
import { gqlClient } from "@/lib/gqlClient";
import { ArrowLeft, Info } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatDistanceToNow, format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RelevanceScore } from "@/components/RelevanceScore";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { AutoRefresh } from "@/components/AutoRefresh";
import { Checkbox } from "@/components/ui/checkbox";

interface JobDetailsProps {
  params: Promise<{
    jobId: string;
  }>;
}

const jobDetailsQueryDocument = graphql(`
  query JobDetails($id: Int!) {
    scrapeJob(id: $id) {
      id
      status
      keywords
      createdAt
      updatedAt
      maxDepth
      minRelevance
      targetUrl
      scrapedContacts {
        contactName
        contactRole
        emailAddress
        phoneNumber
        physicalAddress
        relevanceReason
        relevanceScore
      }
      scrapedUrls {
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

export default async function JobDetails({ params }: JobDetailsProps) {
  const { jobId } = await params;

  if (!jobId || isNaN(Number(jobId))) {
    throw notFound();
  }

  const data = await gqlClient.request(jobDetailsQueryDocument, {
    id: Number(jobId),
  });

  if (!data.scrapeJob) {
    throw notFound();
  }

  const {
    id,
    targetUrl,
    status,
    keywords,
    createdAt,
    updatedAt,
    scrapedUrls,
    scrapedContacts,
    maxDepth,
    minRelevance,
  } = data.scrapeJob!;

  return (
    <main className="container mx-auto py-6 px-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Button asChild variant="ghost" className="mr-4">
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">Job Details</h1>
        </div>
        {/* Ideally I'd save their preference for refresh or not, but... time */}
        <AutoRefresh interval={90} initialEnabled={true} />
      </div>
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center text-2xl">
            <CardTitle>
              Job #{id}: {targetUrl}
            </CardTitle>
            <JobStatusBadge status={status} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium mb-1">Target URL</h3>
              <p className="text-sm break-all mb-4">{targetUrl}</p>

              <h3 className="text-sm font-medium mb-1">Keywords</h3>
              <div className="flex flex-wrap gap-1 mb-4">
                {keywords.length > 0 ? (
                  keywords.map((keyword) => (
                    <Badge key={keyword} variant="outline" className="text-xs">
                      {keyword}
                    </Badge>
                  ))
                ) : (
                  <span className="text-sm text-muted-foreground">
                    No keywords specified
                  </span>
                )}
              </div>

              <h3 className="text-sm font-medium mb-1">Max Depth</h3>
              <p className="text-sm text-muted-foreground break-all mb-4">
                {maxDepth}
              </p>

              <h3 className="text-sm font-medium mb-1">
                Minimum Relevance
                <Info className="ml-1 inline" size="0.8rem" />
              </h3>
              <p className="text-sm text-muted-foreground break-all mb-4">
                {minRelevance} ({minRelevance * 100}%)
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-1">Created</h3>
              <p className="text-sm text-muted-foreground mb-1">
                {formatDistanceToNow(new Date(createdAt), {
                  addSuffix: true,
                })}
              </p>
              <p className="text-xs text-muted-foreground mb-4">
                {format(new Date(createdAt), "PPpp")}
              </p>

              <h3 className="text-sm font-medium mb-1">Last Updated</h3>
              <p className="text-sm text-muted-foreground mb-1">
                {formatDistanceToNow(new Date(updatedAt), {
                  addSuffix: true,
                })}
              </p>
              <p className="text-xs text-muted-foreground">
                {format(new Date(updatedAt), "PPpp")}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Extracted Contacts</CardTitle>
          </CardHeader>
          <CardContent>
            {scrapedContacts?.length ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Relevance Score</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Email Address</TableHead>
                    <TableHead>Phone Number</TableHead>
                    <TableHead>Physical Address</TableHead>
                    <TableHead>Relevance Reason</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {scrapedContacts.map((contact, idx) => (
                    <TableRow key={idx}>
                      <TableCell>
                        <RelevanceScore
                          score={contact.relevanceScore}
                          size="sm"
                        />
                      </TableCell>
                      <TableCell>{contact.contactName}</TableCell>
                      <TableCell>{contact.contactRole || "-"}</TableCell>
                      <TableCell>{contact.emailAddress || "-"}</TableCell>
                      <TableCell>{contact.phoneNumber || "-"}</TableCell>
                      <TableCell>{contact.physicalAddress || "-"}</TableCell>
                      <TableCell>{contact.relevanceReason || "-"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-sm text-muted-foreground py-4">
                No contacts found
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Extracted Links</CardTitle>
          </CardHeader>
          <CardContent>
            {scrapedUrls?.length ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Relevance Score</TableHead>
                    <TableHead>Link</TableHead>
                    <TableHead>Is Download?</TableHead>
                    <TableHead>File Type</TableHead>
                    <TableHead>Relevance Reason</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {scrapedUrls.map((scrapedUrl, idx) => (
                    <TableRow key={idx}>
                      <TableCell>
                        <RelevanceScore
                          score={scrapedUrl.relevanceScore}
                          size="sm"
                        />
                      </TableCell>
                      <TableCell>
                        <Tooltip delayDuration={1000}>
                          <TooltipTrigger asChild>
                            <a
                              href={scrapedUrl.absoluteUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block max-w-[200px] truncate hover:underline text-blue-300 hover:text-blue-500"
                            >
                              {scrapedUrl.linkText}
                            </a>
                          </TooltipTrigger>
                          <TooltipContent>
                            <span>{scrapedUrl.linkText}</span>
                          </TooltipContent>
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        <Checkbox checked={scrapedUrl.isDownload} disabled />
                      </TableCell>
                      <TableCell>{scrapedUrl.fileType}</TableCell>
                      <TableCell>{scrapedUrl.relevanceReason}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-sm text-muted-foreground py-4">
                No links found
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
