import { Page } from "@browserbasehq/stagehand";
import { z } from "zod";
import dotenv from "dotenv";
import * as fs from "fs";

dotenv.config();

export async function main({ page }: { page: Page }) {
  const { TARGET_URL, KEYWORDS, OUTPUT_FILE } = process.env;

  if (!TARGET_URL) {
    throw new Error("TARGET_URL environment variable not set");
  }

  if (!KEYWORDS) {
    throw new Error("KEYWORDS environmentn variable not set");
  }

  const response = await page.goto(TARGET_URL);

  // Report to the API that we're being forbidden
  if (response?.status() === 403) {
    const resp = {
      isForbidden: true,
    };
    if (OUTPUT_FILE) {
      fs.writeFileSync(OUTPUT_FILE, JSON.stringify(resp));
    } else {
      // Running independently, just log the results
      console.log(JSON.stringify(resp, undefined, 2));
    }
    return;
  }

  const keywords = KEYWORDS;
  const extractInstruction = `
    The current page base URL is: ${page.url()}
    Extract all hyperlinks and elements that behave like hyperlinks (including but not limited to <a> tags, elements with attributes like 'data-href' or 'data-url', or elements marked explicitly with 'role="link"' or similar patterns).

    In addition to the hyperlinks, extract any contact information. If a piece of information is not available for that contact, do not specify it in your output.

    For each extracted element you will assign a relevance score between 0.0 and 1.0 indicating the liklihood of this link leading to relevant contacts or information regarding the following keywords: ${keywords}
      - 1.0 = highly relevant; clearly related to the provided keywords
      - 0.0 = clearly irrelevant or unrelated
      - Provide accurate intermediate scores (e.g., 0.7, 0.4) based on the strength of the context and metadata match.
      - Use a precision of up to two decimal places (e.g., 0.7, 0.71, 0.4, 0.65)


    To avoid mistakes:
      - ONLY return links and contacts that are clearly visible and explicitly defined in the HTML content of this page.
      - DO NOT fabricate or infer names, emails, links, or any other data.
      - If no valid contact or high-value link is found, return an empty array for that field.
      - Treat this as a strict extraction task, not a creative one.
      - You will be evaluated on your precision. It is better to return fewer results than to guess or invent ones that are not found in the HTML content.
      - If the page contains access denied, 403, or error messages, return no links or contacts. Do not attempt to extract information from error or placeholder pages.
  `;

  const results = await page.extract({
    instruction: extractInstruction,
    schema: z.object({
      links: z.array(
        z.object({
          absoluteUrl: z
            .string()
            .describe(
              "The full URL of the link. Convert relative URLs to absolute URLs.",
            ),
          htmlTag: z
            .string()
            .describe("HTML Tag name (eg. 'a', 'button', 'div')"),
          linkText: z.string().describe("The exact text content of the link"),
          context: z
            .string()
            .optional()
            .describe(
              "Brief snippet (2-3 sentences maximum) of the text surrounding the link in the HTML document to help clarify its purpose.",
            ),
          attributes: z
            .array(z.object({ attribute: z.string(), value: z.string() }))
            .describe(
              "Relevant attributes on the HTML element (e.g., href, onclick, role, aria-label, data-href, data-url, class, etc.).",
            ),
          isDownload: z
            .boolean()
            .describe(
              "Boolean (true/false), true if the link points to a downloadable file (PDF, DOCX, XLSX, etc.), false otherwise.",
            ),
          fileType: z
            .string()
            .optional()
            .describe(
              "The file type if the link points to a downloadable file (PDF, DOCX, XLSX, etc.).",
            ),
          relevanceScore: z
            .number()
            .describe(
              "Float between 0.0 and 1.0 indicating the relevance score of this link based on the specified keywords",
            ),
          relevanceReason: z
            .string()
            .describe(
              "Briefly explain (one sentence) why you assigned the relevance score you did.",
            ),
          keywords: z
            .array(z.string())
            .describe(
              "Keywords related to this element. Limit to target keywords or ones similar to the target keywords.",
            ),
        }),
      ),
      contacts: z.array(
        z.object({
          contactName: z
            .string()
            .describe("Name of the contact, person or organization"),
          contactRole: z
            .string()
            .describe(
              "Role of the contact (e.g. CEO, Financial Director, or other title)",
            )
            .optional(),
          phoneNumber: z.string().describe("Contact phone number").optional(),
          emailAddress: z.string().describe("Contact email address").optional(),
          physicalAddress: z
            .string()
            .describe("Contacts physical mail address")
            .optional(),
          relevanceScore: z
            .number()
            .describe(
              "Float beween 0.0 and 1.0 indicating the relevance score of this contact based on the specified keywords.",
            ),
          relevanceReason: z
            .string()
            .describe(
              "Briefly explain (one sentence) why you assigned the relevance score you did.",
            ),
          keywords: z
            .array(z.string())
            .describe(
              "Keywords related to this element. Limit to target keywords or ones similar to the target keywords.",
            ),
        }),
      ),
    }),
  });

  // This is how the results end up back to the service that spawned it for now.
  // Could be done differently if this was running in a different way (like serverless) but for now this works well.
  if (OUTPUT_FILE) {
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(results));
  } else {
    // Running independently, just log the results
    console.log(JSON.stringify(results, undefined, 2));
  }
}
