import { createTool } from "@mastra/core/tools";
import { nanoid } from "nanoid";
import { z } from "zod";

export const generateNanoidTool = createTool({
  id: "generate-nanoid",
  description: "Generate a nanoid for a id",
  outputSchema: z.object({
    id: z.nanoid().describe("id created with nanoid"),
  }),
  execute: async () => {
    return nanoid();
  },
});
