// Test script to check API endpoints
const testEndpoints = async () => {
  const baseURL = "http://localhost:8888";
  const endpoints = ["/api/debug", "/api/members", "/api/stats", "/api/test"];

  for (const endpoint of endpoints) {
    try {
      console.log(`\n--- Testing ${endpoint} ---`);
      const response = await fetch(`${baseURL}${endpoint}`);
      console.log(`Status: ${response.status}`);
      console.log(`Headers:`, Object.fromEntries(response.headers.entries()));

      const text = await response.text();
      console.log(`Response:`, text);

      try {
        const json = JSON.parse(text);
        console.log(`Parsed JSON:`, json);
      } catch (e) {
        console.log(`Not JSON response`);
      }
    } catch (error) {
      console.error(`Error testing ${endpoint}:`, error.message);
    }
  }
};

// Run if this is a Node.js environment
if (typeof window === "undefined") {
  testEndpoints();
}
