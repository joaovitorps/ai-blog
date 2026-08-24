import { createServer } from "node:http";
import { postWriterAgentId } from "./mastra/agents/post-writer-agent.js";
import { z } from "zod";
import { mastra } from "./mastra/index.js";

const { PROTOCOL, HOST, PORT } = process.env;

const server = createServer((req, res) => {
  res.setHeader("content-type", "application/json");

  if (req.method === "POST" && req.url === "/posts/draft") {
    let bodyBuffered = [];
    req.on("data", (chunk) => bodyBuffered.push(chunk));
    req.on("end", async () => {
      try {
        const bodyString = Buffer.concat(bodyBuffered).toString();
        const bodyJSON = JSON.parse(bodyString);

        const { idea } = bodyJSON;

        const responseSchema = z.object({
          id: z.string(),
          title: z.string(),
          content: z.string(),
          published_at: z.coerce.date().nullish(),
          created_at: z.coerce.date(),
          approved_at: z.coerce.date().nullish(),
          rejected_at: z.coerce.date().nullish(),
        });

        const agent = mastra.getAgentById(postWriterAgentId);
        const response = await agent.generate(idea, {
          structuredOutput: { schema: responseSchema },
        });

        res.writeHead(200);
        return res.end(JSON.stringify({ data: JSON.parse(response.text) }));
      } catch (error) {
        console.log(error);
        res.writeHead(500);
        return res.end(JSON.stringify({ data: JSON.parse(response.text) }));
      }
    });

    return;
  }

  res.writeHead(404);
  return res.end(JSON.stringify({ error: "Not Found" }));
});

server.listen(PORT, () => {
  console.log(`🟢 Server running at ${PROTOCOL}://${HOST}:${PORT}`);
  console.log("Press ctrl+c to exit!");
});
