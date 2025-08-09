import type { Context, Config } from "@netlify/functions";
import { neon } from "@neondatabase/serverless";

const sql = neon(Netlify.env.get("NEON_DATABASE_URL") || "");

export default async (req: Request, context: Context) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
  };

  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers });
  }

  try {
    // Test basic connection
    const dbUrl = Netlify.env.get("NEON_DATABASE_URL");
    console.log("Database URL exists:", !!dbUrl);
    
    // Test simple query
    const result = await sql`SELECT 1 as test`;
    console.log("Query result:", result);
    
    // Test if tables exist
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;
    
    return new Response(JSON.stringify({
      success: true,
      hasDbUrl: !!dbUrl,
      testQuery: result,
      tables: tables.map(t => t.table_name)
    }), { 
      status: 200, 
      headers: {
        ...headers,
        "Content-Type": "application/json"
      }
    });
    
  } catch (error) {
    console.error("Database test error:", error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message,
      hasDbUrl: !!Netlify.env.get("NEON_DATABASE_URL")
    }), { 
      status: 500, 
      headers: {
        ...headers,
        "Content-Type": "application/json"
      }
    });
  }
};

export const config: Config = {
  path: "/api/test",
};
