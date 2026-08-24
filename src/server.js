import { createServer } from "node:http";

const { PROTOCOL, HOST, PORT } = process.env;

const server = createServer((req, res) => {
  res.setHeader("content-type", "application/json");

  if (req.method === "POST" && req.url === "/posts/draft") {
    let bodyBuffered = [];
    req.on("data", (chunk) => bodyBuffered.push(chunk));
    req.on("end", () => {
      const bodyString = Buffer.concat(bodyBuffered).toString();
      const bodyJSON = JSON.parse(bodyString);

      return res.end(JSON.stringify({ data: bodyJSON }));
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
