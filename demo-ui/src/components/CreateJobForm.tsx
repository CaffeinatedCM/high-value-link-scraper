"use client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent } from "./ui/card";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { KeywordInput } from "./KeywordInput";
import { useCreateScrapeJob } from "./hooks/useCreateScrapeJob";
import { toast } from "sonner";
import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";

const formSchema = z.object({
  targetUrl: z.string().url(),
  keywords: z.array(z.string()).min(1),
  maxDepth: z
    .union([z.string(), z.number()])
    .transform((val) => Number(val))
    .pipe(z.number().min(1).max(5))
    .default(2),
  minRelevance: z
    .union([z.string(), z.number()])
    .transform((val) => Number(val))
    .pipe(z.number().min(0).max(1))
    .default(0.5),
});

export const CreateJobForm = () => {
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      targetUrl: "",
      keywords: [],
      maxDepth: 2,
      minRelevance: 0.5,
    },
  });

  const createJob = useCreateScrapeJob();

  function onSubmit(values: z.infer<typeof formSchema>) {
    createJob.mutate(
      {
        ...values,
      },
      {
        onSuccess: (data) => {
          console.log("Job created!", data);

          queryClient.invalidateQueries({
            queryKey: ["allScrapeJobs"],
          });

          toast.success("Job made!", {
            action: (
              <Button type="button" className="ml-auto" variant="link" asChild>
                <Link href={`job/${data.createScrapeJob?.job.id}`}>View</Link>
              </Button>
            ),
          });

          form.reset();
        },
        onError: (err) => {
          console.error("Something bad", err);

          toast.error("Something went wrong :(");
        },
      },
    );
  }

  return (
    <Card>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid gap-2 grid-cols-2 grid-rows-4 items-baseline"
          >
            <FormField
              control={form.control}
              name="targetUrl"
              render={({ field }) => (
                <FormItem className="col-span-2 row-span-1">
                  <FormLabel>Target URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://example.com"
                      type="url"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>The URL you want to scrape.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="keywords"
              render={({ field }) => (
                <FormItem className="col-span-2 row-span-1">
                  <FormLabel>Keywords</FormLabel>
                  <FormControl>
                    <KeywordInput {...field} />
                  </FormControl>
                  <FormDescription>
                    Keywords you want to prioritize.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="maxDepth"
              render={({ field }) => (
                <FormItem className="col-span-1 row-span-1">
                  <FormLabel>Maximum Depth</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="2"
                      type="number"
                      step={1}
                      min={1}
                      max={5}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    How far should we follow links?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="minRelevance"
              render={({ field }) => (
                <FormItem className="col-span-1 row-span-1">
                  <FormLabel>Minimum Relevance</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="0.5"
                      type="number"
                      step={0.1}
                      min={0}
                      max={1}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    How relevant (between 0.0-1.0) should a link be for us to
                    follow it?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              className="row-span-1 col-start-2 self-center"
              type="submit"
            >
              Run Job
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
