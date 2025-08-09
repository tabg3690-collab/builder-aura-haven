import type { Context, Config } from "@netlify/functions";
import { neon } from "@neondatabase/serverless";

export default async (req: Request, context: Context) => {
  // Add CORS headers
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
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
    const method = req.method;

    switch (method) {
      case "GET":
        // Get all feedback (admin only)
        const feedback =
          await sql`SELECT * FROM feedback ORDER BY created_at DESC`;
        return new Response(JSON.stringify(feedback), { headers });

      case "POST":
        const feedbackData = await req.json();
        const newFeedback = await sql`
          INSERT INTO feedback (name, email, subject, message)
          VALUES (${feedbackData.name}, ${feedbackData.email}, 
                  ${feedbackData.subject}, ${feedbackData.message})
          RETURNING *
        `;
        return new Response(JSON.stringify(newFeedback[0]), { headers });

      default:
        return new Response("Method not allowed", { status: 405, headers });
    }
  } catch (error) {
    console.error("Feedback API error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers,
    });
  }
};

export const config: Config = {
  path: "/api/feedback",
};
