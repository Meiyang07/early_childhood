import http from "node:http";
import { readFile } from "node:fs/promises";

const rawPort = process.env.SWAGGER_DOCS_PORT ?? "8787";
const port = Number(rawPort);
if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error("SWAGGER_DOCS_PORT must be an integer from 1 to 65535");
}
const routes = new Map([
  ["/", ["index.html", "text/html; charset=utf-8"]],
  ["/index.html", ["index.html", "text/html; charset=utf-8"]],
  ["/openapi.json", ["openapi.json", "application/json; charset=utf-8"]],
  ["/README.md", ["README.md", "text/plain; charset=utf-8"]]
]);
const server = http.createServer(async (req, res) => {
  if (req.method !== "GET" && req.method !== "HEAD") {
    res.writeHead(405, { Allow: "GET, HEAD" }); res.end("Method not allowed"); return;
  }
  const pathname = new URL(req.url ?? "/", "http://localhost").pathname;
  const target = routes.get(pathname);
  if (!target) { res.writeHead(404); res.end("Not found"); return; }
  try {
    const bytes = await readFile(new URL(target[0], import.meta.url));
    res.writeHead(200, { "Content-Type": target[1], "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" });
    res.end(req.method === "HEAD" ? undefined : bytes);
  } catch {
    res.writeHead(500); res.end("Unable to read documentation file");
  }
});
server.listen(port, "127.0.0.1", () => {
  console.log("Swagger reference: http://localhost:" + port);
  console.log("OpenAPI contract: http://localhost:" + port + "/openapi.json");
  console.log("This server serves documentation only; start the API separately.");
});
