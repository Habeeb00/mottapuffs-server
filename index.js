import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Log environment variables for debugging
console.log("Environment variables loaded:", {
  PORT: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV,
  ADMIN_TOKEN_SET: process.env.ADMIN_TOKEN ? "YES" : "NO",
});

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const adminToken = process.env.ADMIN_TOKEN || "admin"; // Default to "admin" if not set

let supabase;
if (!supabaseUrl || !supabaseServiceKey) {
  console.warn(
    "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment. Some API features will be disabled."
  );
} else {
  supabase = createClient(supabaseUrl, supabaseServiceKey);
}

app.use(
  cors({
    origin: "*", // Allow all origins in development
    credentials: true, // Allow cookies to be sent
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

function requireAdmin(req, res, next) {
  const auth = req.headers["authorization"] || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;

  // For debugging
  console.log("Auth check:", {
    receivedToken: token,
    configuredAdminToken: adminToken,
    hasAdminToken: !!adminToken,
  });

  if (!adminToken) {
    return res
      .status(500)
      .json({ error: "Server not configured: ADMIN_TOKEN missing" });
  }

  if (!token || token !== adminToken) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  next();
}

function parseCounts(body) {
  const allowed = ["chicken", "motta", "meat"];
  const updates = {};
  for (const key of allowed) {
    if (body[key] !== undefined) {
      const value = Number(body[key]);
      if (!Number.isInteger(value) || value < 0) {
        return { error: `${key} must be a non-negative integer` };
      }
      updates[key] = value;
    }
  }
  if (Object.keys(updates).length === 0) {
    return { error: "Provide at least one of: chicken, motta, meat" };
  }
  return { updates };
}

app.post("/api/stats/set", requireAdmin, async (req, res) => {
  const { updates, error } = parseCounts(req.body || {});
  if (error) return res.status(400).json({ error });

  // Check if we're using mock Supabase settings
  const isMockEnv = supabaseUrl === "https://example.com" || !supabase;

  if (isMockEnv) {
    // In mock/development environment, return a mock successful response
    console.log("Mock environment detected. Returning mock response.");
    console.log("Updates requested:", updates);

    return res.json({
      ok: true,
      stats: {
        id: 1,
        chicken: updates.chicken || 10,
        motta: updates.motta || 15,
        meat: updates.meat || 20,
        updated_at: new Date().toISOString(),
      },
      mock: true,
    });
  }

  try {
    const { data, error: dbError } = await supabase
      .from("stats")
      .update(updates)
      .eq("id", 1)
      .select("*")
      .single();

    if (dbError) {
      return res.status(500).json({ error: dbError.message });
    }

    return res.json({ ok: true, stats: data });
  } catch (err) {
    console.error("Database error:", err);
    return res
      .status(500)
      .json({ error: "Database operation failed", details: err.message });
  }
});

app.get("/", (_req, res) => {
  res.json({
    message: "Mottapuffs Admin Server",
    status: "running",
    endpoints: {
      health: "/health",
      stats: "/api/stats/set (POST, requires admin token)",
      admin: "/admin (Admin UI)",
    },
  });
});

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

// Serve static files for the admin panel
app.use("/admin", express.static(path.join(__dirname, "dist")));

// For admin panel routes, serve the main index.html
app.get("/admin/*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// Export the Express app for Vercel
export default app;

// Start the server
const PORT = process.env.PORT || 4002;
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Mottapuffs Admin Server running on http://localhost:${PORT}`);
    console.log(`Admin interface available at http://localhost:${PORT}/admin`);
  });
}
