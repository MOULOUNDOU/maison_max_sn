const fs = require("fs");
const http = require("http");
const path = require("path");

const root = path.resolve(__dirname, "..");
const port = Number(process.env.PORT || 8888);

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".md": "text/markdown; charset=utf-8"
};

const loadEnv = () => {
  const envPath = path.join(root, ".env");
  if (!fs.existsSync(envPath)) return;

  const lines = fs.readFileSync(envPath, "utf8").split(/\r?\n/);
  lines.forEach((line) => {
    const clean = line.trim();
    if (!clean || clean.startsWith("#")) return;
    const index = clean.indexOf("=");
    if (index === -1) return;
    const key = clean.slice(0, index).trim();
    let value = clean.slice(index + 1).trim();
    value = value.replace(/^['"]|['"]$/g, "");
    if (key && process.env[key] == null) process.env[key] = value;
  });
};

const readBody = (request) =>
  new Promise((resolve, reject) => {
    const chunks = [];
    request.on("data", (chunk) => chunks.push(chunk));
    request.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    request.on("error", reject);
  });

const send = (response, statusCode, body, headers = {}) => {
  response.writeHead(statusCode, headers);
  response.end(body);
};

const getStaticPath = (urlPath) => {
  if (urlPath === "/") return path.join(root, "index.html");
  if (urlPath === "/admin") return path.join(root, "admin.html");
  if (urlPath === "/boutique") return path.join(root, "boutique.html");
  if (urlPath.startsWith("/produit/")) return path.join(root, "product.html");

  const decoded = decodeURIComponent(urlPath);
  const safePath = path.normalize(decoded).replace(/^(\.\.[/\\])+/, "");
  return path.join(root, safePath);
};

const serveStatic = (request, response) => {
  const { pathname } = new URL(request.url, `http://${request.headers.host || "localhost"}`);
  const filePath = getStaticPath(pathname);

  if (!filePath.startsWith(root) || !fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    send(response, 404, "Not found", { "Content-Type": "text/plain; charset=utf-8" });
    return;
  }

  const ext = path.extname(filePath).toLowerCase();
  send(response, 200, fs.readFileSync(filePath), {
    "Content-Type": mimeTypes[ext] || "application/octet-stream"
  });
};

const handleAiFunction = async (request, response) => {
  const functionPath = path.join(root, "netlify/functions/ai.js");
  delete require.cache[require.resolve(functionPath)];
  const { handler } = require(functionPath);
  const body = await readBody(request);
  const headers = Object.fromEntries(
    Object.entries(request.headers).map(([key, value]) => [key.toLowerCase(), Array.isArray(value) ? value.join(",") : value])
  );
  const result = await handler({
    httpMethod: request.method,
    headers,
    body
  });

  send(response, result.statusCode || 200, result.body || "", result.headers || {});
};

loadEnv();

const server = http.createServer(async (request, response) => {
  try {
    const { pathname } = new URL(request.url, `http://${request.headers.host || "localhost"}`);
    if (pathname === "/.netlify/functions/ai") {
      console.log(`${new Date().toLocaleTimeString()} ${request.method} ${pathname}`);
    }

    if (pathname === "/.netlify/functions/ai") {
      await handleAiFunction(request, response);
      return;
    }

    if (request.method !== "GET" && request.method !== "HEAD") {
      send(response, 405, "Method not allowed", { "Content-Type": "text/plain; charset=utf-8" });
      return;
    }

    serveStatic(request, response);
  } catch (error) {
    send(response, 500, error.message || "Local server error", { "Content-Type": "text/plain; charset=utf-8" });
  }
});

server.listen(port, () => {
  console.log(`Maison Max local dev: http://localhost:${port}`);
  console.log("OpenRouter key:", process.env.OPENROUTER_API_KEY ? "loaded" : "missing");
});
