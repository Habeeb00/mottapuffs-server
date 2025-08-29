import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Log all environment variables
console.log("Environment variables:");
console.log("PORT:", process.env.PORT);
console.log("SUPABASE_URL:", process.env.SUPABASE_URL);
console.log("ADMIN_TOKEN:", process.env.ADMIN_TOKEN);
console.log("NODE_ENV:", process.env.NODE_ENV);
