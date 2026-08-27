import { createServer } from "node:http";

import { z } from "zod";

import { postWriterAgentId } from "./mastra/agents/post-writer-agent.js";
import { mastra } from "./mastra/index.js";
import { fetchPost } from "./model/post.js";

const { PROTOCOL, HOST, PORT } = process.env;

const server = createServer(async (req, res) => {
  res.setHeader("content-type", "application/json");

  if (req.method === "GET" && req.url === "/posts") {
    try {
      const data = await fetchPost();

      res.writeHead(200);
      return res.end(JSON.stringify(data));
    } catch (error) {
      console.log(error);
      res.writeHead(500);
      return res.end(JSON.stringify(error.message));
    }
  }

  if (req.method === "POST" && req.url === "/posts/draft") {
    let bodyBuffered = [];
    req.on("data", (chunk) => bodyBuffered.push(chunk));
    req.on("end", async () => {
      try {
        const bodyString = Buffer.concat(bodyBuffered).toString();
        const bodyJSON = JSON.parse(bodyString);

        const { idea } = bodyJSON;

        const responseSchema = z.object({
          id: z.nanoid().describe("id created with nanoid"),
          title: z.string().describe("title of the post"),
          content: z.string().describe("content of the post"),
          published_at: z.coerce
            .date()
            .nullish()
            .describe("date when the post was published"),
          created_at: z.coerce
            .date()
            .nullish()
            .describe("date when the post was created"),
          approved_at: z.coerce
            .date()
            .nullish()
            .describe("date when the post was approved"),
          rejected_at: z.coerce
            .date()
            .nullish()
            .describe("date when the post was rejected"),
        });

        const agent = mastra.getAgentById(postWriterAgentId);
        const response = await agent.generate(idea, {
          structuredOutput: { schema: responseSchema },
        });

        const jsonResponse = JSON.parse(response.text);

        res.writeHead(200);
        return res.end(JSON.stringify({ data: jsonResponse }));
      } catch (error) {
        console.log(error);
        res.writeHead(500);
        return res.end(JSON.stringify(error.message));
      }
    });

    return;
  }

  res.writeHead(404);
  return res.end(JSON.stringify({ error: "Not Found" }));
});

server.listen(PORT, async () => {
  console.log(`🟢 Server running at ${PROTOCOL}://${HOST}:${PORT}`);
  console.log("Press ctrl+c to exit!");
});
