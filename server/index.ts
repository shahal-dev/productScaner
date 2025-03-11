import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { setupAuth } from "./auth";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

// Load environment variables from .env file (with debug output)
console.log("Current working directory:", process.cwd());
const envPath = path.resolve(process.cwd(), '.env');
console.log("Looking for .env file at:", envPath);
console.log(".env file exists:", fs.existsSync(envPath));

// Try to load environment variables directly from file
if (fs.existsSync(envPath)) {
  const envConfig = dotenv.parse(fs.readFileSync(envPath));
  Object.keys(envConfig).forEach(key => {
    process.env[key] = envConfig[key];
  });
  console.log("Environment variables loaded directly from .env file");
  console.log("SESSION_SECRET available after direct loading:", !!process.env.SESSION_SECRET);
} else {
  // Fallback to standard dotenv loading
  dotenv.config();
  console.log("Tried standard dotenv loading");
}

// Hard-code SESSION_SECRET if not available (for development only)
if (!process.env.SESSION_SECRET) {
  console.log("Setting hardcoded SESSION_SECRET as fallback");
  process.env.SESSION_SECRET = "kergjfgejfgkqjwhfowgeqrhrfgqwiherfwqgfjvbjhwqe";
}

const app = express();
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false, limit: '50mb' }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  // Log authenticated user
  if (req.isAuthenticated && req.isAuthenticated() && req.user) {
    console.log(`Request by authenticated user: ${req.user.username} (ID: ${req.user.id})`);
  }

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

import { initEmailTransport } from "./lib/email";

(async () => {
  // Initialize email transport
  await initEmailTransport();
  
  // Setup authentication before registering routes
  setupAuth(app);

  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const port = process.env.PORT ? parseInt(process.env.PORT) : 5000;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();