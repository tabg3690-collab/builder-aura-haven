// Quick test of debug API endpoint
console.log("Testing debug API endpoint directly...");

fetch("http://localhost:8888/api/debug")
  .then((response) => {
    console.log("Status:", response.status);
    console.log("Headers:", Object.fromEntries(response.headers.entries()));
    return response.text();
  })
  .then((text) => {
    console.log("Raw response:", text);
    try {
      const json = JSON.parse(text);
      console.log("Parsed JSON:", json);
    } catch (e) {
      console.log("Not JSON response");
    }
  })
  .catch((error) => {
    console.error("Error:", error);
  });
