import type { Context, Config } from "@netlify/functions";

export default async (req: Request, context: Context) => {
  console.log("🎯 SIMPLE TEST FUNCTION CALLED!");
  console.log("Method:", req.method);
  console.log("URL:", req.url);

  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
  };

  if (req.method === "OPTIONS") {
    console.log("CORS preflight for simple test");
    return new Response(null, { status: 200, headers });
  }

  try {
    const responseData = {
      message: "Simple test function works!",
      timestamp: new Date().toISOString(),
      method: req.method,
      url: req.url,
    };

    console.log("Returning response:", responseData);

    return new Response(JSON.stringify(responseData), {
      status: 200,
      headers: {
        ...headers,
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Simple test error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        ...headers,
        "Content-Type": "application/json",
      },
    });
  }
};

export const config: Config = {
  path: "/api/simple-test",
};
