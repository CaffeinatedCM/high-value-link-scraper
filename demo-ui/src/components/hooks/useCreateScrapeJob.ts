import { graphql } from "@/graphql";
import { CreateScrapeJobInput } from "@/graphql/graphql";
import { gqlClient } from "@/lib/gqlClient";
import { useMutation } from "@tanstack/react-query";

const createScrapeJobDocument = graphql(`
  mutation CreateScrapeJob($input: CreateScrapeJobInput!) {
    createScrapeJob(input: $input) {
      job {
        id
      }
    }
  }
`);

export const useCreateScrapeJob = () => {
  return useMutation({
    mutationFn: async (input: CreateScrapeJobInput) => {
      return gqlClient.request(createScrapeJobDocument, {
        input,
      });
    },
  });
};
