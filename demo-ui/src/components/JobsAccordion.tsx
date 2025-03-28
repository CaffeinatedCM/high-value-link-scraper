import { AllScrapeJobsQuery } from "@/graphql/graphql";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import Link from "next/link";
import { Badge } from "./ui/badge";
import { JobStatusBadge } from "./JobStatusBadge";
import { formatDistanceToNow } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RelevanceScore } from "./RelevanceScore";
import { Checkbox } from "./ui/checkbox";

export const JobsAccordion = ({
  jobs,
}: {
  jobs: AllScrapeJobsQuery["scrapeJobs"];
}) => {
  return (
    <Accordion type="multiple" className="w-full">
      {jobs.map((job) => (
        <AccordionItem key={job.id} value={`job-${job.id}`}>
          <AccordionTrigger className="px-4 py-2 hover:bg-muted/50 rounded-md group">
            <div className="flex justify-between items-center w-full">
              <span className="font-medium text-left flex items-center">
                {job.id}: {job.targetUrl}
                <Link
                  href={`/job/${job.id}`}
                  className="ml-2 text-xs text-blue-300 hover:text-blue-500 hover:underline"
                >
                  View Details
                </Link>
              </span>
              <JobStatusBadge status={job.status} />
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pt-2 pb-4">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium mb-1">Target URL</h3>
                  <p className="text-sm break-all">{job.targetUrl}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-1">Keywords</h3>
                  <div className="flex flex-wrap gap-1">
                    {job.keywords.length > 0 ? (
                      job.keywords.map((keyword) => (
                        <Badge
                          key={keyword}
                          variant="outline"
                          className="text-xs"
                        >
                          {keyword}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-sm text-muted-foreground">
                        No keywords specified
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium mb-1">Created</h3>
                  <p className="text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(job.createdAt), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-1">Last Updated</h3>
                  <p className="text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(job.updatedAt), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">Top Contacts Found</h3>
                {job.scrapedContacts?.length ? (
                  <div className="border rounded-md">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Relevance</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Phone</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {job.scrapedContacts.map((contact, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              <RelevanceScore
                                score={contact.relevanceScore}
                                size="sm"
                              />
                            </TableCell>
                            <TableCell>{contact.contactName}</TableCell>
                            <TableCell>{contact.emailAddress || "—"}</TableCell>
                            <TableCell>{contact.phoneNumber || "—"}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No contacts found
                  </p>
                )}
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">Top Links Found</h3>
                {job.scrapedUrls?.length ? (
                  <div className="border rounded-md">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Relevance</TableHead>
                          <TableHead>Link</TableHead>
                          <TableHead>Is Download</TableHead>
                          <TableHead>File Type</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {job.scrapedUrls.map((link, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              <RelevanceScore
                                score={link.relevanceScore}
                                size="sm"
                              />
                            </TableCell>
                            <TableCell className="break-all">
                              <a
                                href={link.absoluteUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-300 hover:text-blue-500 hover:underline"
                              >
                                {link.linkText}
                              </a>
                            </TableCell>
                            <TableCell>
                              <Checkbox checked={link.isDownload} disabled />
                            </TableCell>
                            <TableCell>{link.fileType || "-"}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No links found
                  </p>
                )}
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};
