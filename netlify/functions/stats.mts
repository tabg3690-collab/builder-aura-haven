import type { Context, Config } from "@netlify/functions";
import { neon } from "@neondatabase/serverless";

export default async (req: Request, context: Context) => {
  // Add CORS headers
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
  };

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers });
  }

  try {
    // Initialize database connection
    const dbUrl = Netlify.env.get("NEON_DATABASE_URL");
    if (!dbUrl) {
      return new Response(
        JSON.stringify({ error: "Database not configured" }),
        {
          status: 500,
          headers: { ...headers, "Content-Type": "application/json" },
        },
      );
    }

    const sql = neon(dbUrl);

    if (req.method === "GET") {
      try {
        console.log("Executing database queries for stats...");
        // Get statistics
        const [membersCount, feedbackCount] = await Promise.all([
          sql`SELECT COUNT(*) as count FROM members`,
          sql`SELECT COUNT(*) as count FROM feedback`,
        ]);

        console.log("Query results:", { membersCount, feedbackCount });

        const stats = {
          totalMembers: parseInt(membersCount[0].count),
          totalZones: 5, // Fixed number
          totalMandals: 20, // Fixed number as calculated
          totalFeedback: parseInt(feedbackCount[0].count),
        };

        console.log("Returning stats:", stats);
        return new Response(JSON.stringify(stats), {
          headers: { ...headers, "Content-Type": "application/json" },
        });
      } catch (dbError) {
        console.error("Database query error:", dbError);
        // Return fallback stats if database queries fail
        const fallbackStats = {
          totalMembers: 0,
          totalZones: 5,
          totalMandals: 20,
          totalFeedback: 0,
          error: "Database query failed",
          message: "Using fallback data",
        };
        return new Response(JSON.stringify(fallbackStats), {
          headers: { ...headers, "Content-Type": "application/json" },
        });
      }
    }

    return new Response("Method not allowed", { status: 405, headers });
  } catch (error) {
    console.error("Stats API error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers,
    });
  }
};

export const config: Config = {
  path: "/api/stats",
};
