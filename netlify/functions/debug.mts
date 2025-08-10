import type { Context, Config } from "@netlify/functions";

export default async (req: Request, context: Context) => {
  console.log("🔥 DEBUG FUNCTION CALLED!");
  console.log("Method:", req.method);
  console.log("URL:", req.url);

  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
  };

  if (req.method === "OPTIONS") {
    console.log("Handling CORS preflight");
    return new Response(null, { status: 200, headers });
  }

  try {
    // Check environment variables
    const neonUrl = process.env.NEON_DATABASE_URL;
    console.log("Neon URL exists:", !!neonUrl);

    const debugInfo = {
      timestamp: new Date().toISOString(),
      method: req.method,
      url: req.url,
      hasNeonUrl: !!neonUrl,
      neonUrlLength: neonUrl?.length || 0,
      neonUrlPrefix: neonUrl?.substring(0, 20) + "..." || "N/A",
      environmentKeys: Object.keys(process.env),
      message: "Function is working",
      nodeVersion: process.version,
      platform: process.platform,
    };

    return new Response(JSON.stringify(debugInfo, null, 2), {
      status: 200,
      headers: {
        ...headers,
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString(),
      }),
      {
        status: 500,
        headers: {
          ...headers,
          "Content-Type": "application/json",
        },
      },
    );
  }
};

export const config: Config = {
  path: "/api/debug",
};
