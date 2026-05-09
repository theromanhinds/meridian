/**
 * Meridian VPS Bridge — vps-bridge/index.js
 *
 * Watches Convex for files with status "spec_ready" and writes them
 * to the local filesystem for further agent processing.
 *
 * Setup on VPS (86.48.21.241):
 *   npm install
 *   export CONVEX_URL=https://fine-wolverine-17.convex.cloud
 *   export VPS_SECRET=<shared secret — must match CONVEX env var VPS_SECRET>
 *   pm2 start index.js --name meridian-bridge
 */

import { ConvexClient } from "convex/browser";
import { api } from "../convex/_generated/api.js";
import fs from "fs/promises";
import path from "path";
import http from "http";

const CONVEX_URL = process.env.CONVEX_URL ?? "https://fine-wolverine-17.convex.cloud";
const VPS_SECRET = process.env.VPS_SECRET ?? "";
const OUTPUT_DIR = process.env.OUTPUT_DIR ?? "./meridian-specs";
const BRIDGE_PORT = parseInt(process.env.BRIDGE_PORT ?? "3210", 10);

// ── Convex listener ──────────────────────────────────────────────────────────

const client = new ConvexClient(CONVEX_URL);

async function ensureOutputDir() {
  await fs.mkdir(OUTPUT_DIR, { recursive: true });
}

async function writeSpecFile(file) {
  const filename = `${file.slug ?? file._id}.md`;
  const filepath = path.join(OUTPUT_DIR, filename);
  await fs.writeFile(filepath, file.content ?? "", "utf-8");
  console.log(`[bridge] wrote spec: ${filepath}`);
  return filepath;
}

// Subscribe to all spec_ready files and write them to disk
function startConvexWatcher() {
  client.onUpdate(api.files.listByFolder, {}, async (files) => {
    if (!files) return;
    const specReady = files.filter((f) => f.status === "spec_ready");
    for (const file of specReady) {
      try {
        await writeSpecFile(file);
      } catch (err) {
        console.error(`[bridge] error writing ${file._id}:`, err);
      }
    }
  });
  console.log("[bridge] watching Convex for spec_ready files…");
}

// ── HTTP health + webhook endpoint ───────────────────────────────────────────

function startHttpServer() {
  const server = http.createServer(async (req, res) => {
    // Health check
    if (req.method === "GET" && req.url === "/health") {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ status: "ok", convexUrl: CONVEX_URL }));
      return;
    }

    // Agent result webhook — POST /result with shared secret in header
    if (req.method === "POST" && req.url === "/result") {
      const secret = req.headers["x-vps-secret"] ?? "";
      if (VPS_SECRET && secret !== VPS_SECRET) {
        res.writeHead(401);
        res.end("Unauthorized");
        return;
      }

      let body = "";
      req.on("data", (chunk) => (body += chunk));
      req.on("end", async () => {
        try {
          const payload = JSON.parse(body);
          // payload: { fileId, content, agentType }
          const { fileId, content } = payload;
          if (!fileId || typeof content !== "string") {
            res.writeHead(400);
            res.end("Bad Request: fileId and content required");
            return;
          }
          await client.mutation(api.files.updateContent, { id: fileId, content });
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ ok: true }));
        } catch (err) {
          console.error("[bridge] /result error:", err);
          res.writeHead(500);
          res.end("Internal Server Error");
        }
      });
      return;
    }

    res.writeHead(404);
    res.end("Not Found");
  });

  server.listen(BRIDGE_PORT, "0.0.0.0", () => {
    console.log(`[bridge] HTTP server listening on :${BRIDGE_PORT}`);
  });
}

// ── Main ─────────────────────────────────────────────────────────────────────

await ensureOutputDir();
startHttpServer();
startConvexWatcher();
