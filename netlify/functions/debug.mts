import type { Context, Config } from "@netlify/functions";

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
    // Check environment variables
    const neonUrl = Netlify.env.get("NEON_DATABASE_URL");

    const debugInfo = {
      timestamp: new Date().toISOString(),
      method: req.method,
      url: req.url,
      hasNeonUrl: !!neonUrl,
      neonUrlLength: neonUrl?.length || 0,
      environmentKeys: Object.keys(Netlify.env.getAll() || {}),
      message: "Function is working",
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
