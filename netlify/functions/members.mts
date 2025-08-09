import type { Context, Config } from "@netlify/functions";
import { neon } from "@neondatabase/serverless";

export default async (req: Request, context: Context) => {
  console.log("Members function called:", req.method, req.url);

  // Add CORS headers
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  };

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    console.log("CORS preflight request");
    return new Response(null, { status: 200, headers });
  }

  try {
    // Initialize database connection
    const dbUrl = Netlify.env.get("NEON_DATABASE_URL");
    console.log("DB URL exists:", !!dbUrl);
    console.log("DB URL length:", dbUrl?.length || 0);

    if (!dbUrl) {
      console.log("No database URL found, returning error");
      return new Response(
        JSON.stringify({ error: "Database not configured" }),
        {
          status: 500,
          headers: { ...headers, "Content-Type": "application/json" },
        },
      );
    }

    console.log("Initializing Neon connection...");
    const sql = neon(dbUrl);
    console.log("Neon connection initialized");
    const url = new URL(req.url);
    const method = req.method;

    switch (method) {
      case "GET":
        try {
          if (url.searchParams.get("upcoming") === "true") {
            console.log("Getting upcoming birthdays...");
            // Get upcoming birthdays
            const days = parseInt(url.searchParams.get("days") || "30");
            const members = await sql`
              SELECT * FROM members
              ORDER BY
                CASE
                  WHEN EXTRACT(DOY FROM date_of_birth) >= EXTRACT(DOY FROM CURRENT_DATE)
                  THEN EXTRACT(DOY FROM date_of_birth) - EXTRACT(DOY FROM CURRENT_DATE)
                  ELSE (365 - EXTRACT(DOY FROM CURRENT_DATE)) + EXTRACT(DOY FROM date_of_birth)
                END
              LIMIT 10
            `;
            console.log("Found upcoming birthdays:", members.length);
            return new Response(JSON.stringify(members), {
              headers: { ...headers, "Content-Type": "application/json" },
            });
          } else {
            console.log("Getting all members...");
            // Get all members
            const members = await sql`SELECT * FROM members ORDER BY name`;
            console.log("Found members:", members.length);
            return new Response(JSON.stringify(members), {
              headers: { ...headers, "Content-Type": "application/json" },
            });
          }
        } catch (dbError) {
          console.error("Database query error in members:", dbError);
          return new Response(
            JSON.stringify({
              error: "Database query failed",
              message: dbError.message,
              members: [],
            }),
            {
              headers: { ...headers, "Content-Type": "application/json" },
            },
          );
        }

      case "POST":
        const memberData = await req.json();
        const newMember = await sql`
          INSERT INTO members (name, zone, mandal, date_of_birth, phone_number, email)
          VALUES (${memberData.name}, ${memberData.zone}, ${memberData.mandal}, 
                  ${memberData.dateOfBirth}, ${memberData.phoneNumber}, ${memberData.email})
          RETURNING *
        `;
        return new Response(JSON.stringify(newMember[0]), { headers });

      case "PUT":
        const memberId = url.searchParams.get("id");
        const updateData = await req.json();
        const updatedMember = await sql`
          UPDATE members 
          SET name = ${updateData.name}, zone = ${updateData.zone}, mandal = ${updateData.mandal},
              date_of_birth = ${updateData.dateOfBirth}, phone_number = ${updateData.phoneNumber},
              email = ${updateData.email}, updated_at = NOW()
          WHERE id = ${memberId}
          RETURNING *
        `;
        return new Response(JSON.stringify(updatedMember[0]), { headers });

      case "DELETE":
        const deleteId = url.searchParams.get("id");
        await sql`DELETE FROM members WHERE id = ${deleteId}`;
        return new Response(JSON.stringify({ success: true }), { headers });

      default:
        return new Response("Method not allowed", { status: 405, headers });
    }
  } catch (error) {
    console.error("Members API error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers,
    });
  }
};

export const config: Config = {
  path: "/api/members",
};
