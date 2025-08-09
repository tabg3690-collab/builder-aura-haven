import { useState } from "react";

const ApiTest = () => {
  const [results, setResults] = useState<any>({});
  const [loading, setLoading] = useState<string>("");

  const testEndpoint = async (endpoint: string, name: string) => {
    setLoading(name);
    try {
      console.log(`Testing ${endpoint}...`);
      const response = await fetch(endpoint);
      console.log(`${name} Status:`, response.status);
      console.log(
        `${name} Headers:`,
        Object.fromEntries(response.headers.entries()),
      );

      const text = await response.text();
      console.log(`${name} Raw response:`, text);

      let data;
      try {
        data = JSON.parse(text);
      } catch {
        data = { rawText: text, error: "Not JSON" };
      }

      setResults((prev) => ({
        ...prev,
        [name]: {
          status: response.status,
          ok: response.ok,
          data,
          timestamp: new Date().toISOString(),
        },
      }));
    } catch (error) {
      console.error(`${name} Error:`, error);
      setResults((prev) => ({
        ...prev,
        [name]: {
          error: error.message,
          timestamp: new Date().toISOString(),
        },
      }));
    }
    setLoading("");
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">API Test Page</h1>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <button
          onClick={() => testEndpoint("/api/debug", "debug")}
          disabled={loading === "debug"}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading === "debug" ? "Testing..." : "Test Debug API"}
        </button>

        <button
          onClick={() => testEndpoint("/api/stats", "stats")}
          disabled={loading === "stats"}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
        >
          {loading === "stats" ? "Testing..." : "Test Stats API"}
        </button>

        <button
          onClick={() => testEndpoint("/api/members", "members")}
          disabled={loading === "members"}
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50"
        >
          {loading === "members" ? "Testing..." : "Test Members API"}
        </button>

        <button
          onClick={() => testEndpoint("/api/test", "test")}
          disabled={loading === "test"}
          className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 disabled:opacity-50"
        >
          {loading === "test" ? "Testing..." : "Test Function"}
        </button>
      </div>

      <div className="space-y-4">
        {Object.entries(results).map(([name, result]: [string, any]) => (
          <div key={name} className="border rounded p-4">
            <h3 className="font-bold text-lg mb-2">
              {name.toUpperCase()} Results:
            </h3>
            <pre className="text-sm bg-gray-100 p-2 rounded overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ApiTest;
