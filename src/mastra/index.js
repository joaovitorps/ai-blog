import { Mastra } from "@mastra/core/mastra";
import { PinoLogger } from "@mastra/loggers";

import { postWriterAgent } from "./agents/post-writer-agent.js";

export const mastra = new Mastra({
  agents: { postWriterAgent },
  logger: new PinoLogger({
    name: "Mastra",
    level: "info",
  }),
});
