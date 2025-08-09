import { useState } from "react";

const DebugTest = () => {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/test");
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ error: error.message });
    }
    setLoading(false);
  };

  const testMembers = async () => {
    setLoading(true);
    try {
      console.log("Testing /api/members endpoint...");
      const response = await fetch("/api/members");
      console.log("Response status:", response.status);
      console.log(
        "Response headers:",
        Object.fromEntries(response.headers.entries()),
      );

      const text = await response.text();
      console.log("Raw response:", text);

      try {
        const data = JSON.parse(text);
        setResult({
          status: response.status,
          headers: Object.fromEntries(response.headers.entries()),
          data,
        });
      } catch (parseError) {
        setResult({
          status: response.status,
          headers: Object.fromEntries(response.headers.entries()),
          rawResponse: text,
          parseError: parseError.message,
        });
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setResult({
        error: error.message,
        stack: error.stack,
      });
    }
    setLoading(false);
  };

  const testDebug = async () => {
    setLoading(true);
    try {
      console.log("Testing /api/debug endpoint...");
      const response = await fetch("/api/debug");
      console.log("Response status:", response.status);
      console.log(
        "Response headers:",
        Object.fromEntries(response.headers.entries()),
      );

      const text = await response.text();
      console.log("Raw response:", text);

      try {
        const data = JSON.parse(text);
        setResult({
          status: response.status,
          headers: Object.fromEntries(response.headers.entries()),
          data,
        });
      } catch (parseError) {
        setResult({
          status: response.status,
          headers: Object.fromEntries(response.headers.entries()),
          rawResponse: text,
          parseError: parseError.message,
        });
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setResult({
        error: error.message,
        stack: error.stack,
      });
    }
    setLoading(false);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Database Debug Test</h1>

      <div className="space-y-4">
        <button
          onClick={testConnection}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? "Testing..." : "Test Database Connection"}
        </button>

        <button
          onClick={testMembers}
          disabled={loading}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
        >
          {loading ? "Testing..." : "Test Members API"}
        </button>

        <button
          onClick={testDebug}
          disabled={loading}
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50"
        >
          {loading ? "Testing..." : "Test Debug API"}
        </button>
      </div>

      {result && (
        <div className="mt-6 p-4 bg-gray-100 rounded">
          <h3 className="font-bold mb-2">Result:</h3>
          <pre className="text-sm overflow-auto">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}

      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded">
        <h3 className="font-bold text-yellow-800 mb-2">Environment Check:</h3>
        <p className="text-sm text-yellow-700">
          VITE_NEON_DATABASE_URL is{" "}
          {import.meta.env.VITE_NEON_DATABASE_URL ? "SET" : "NOT SET"}
        </p>
      </div>
    </div>
  );
};

export default DebugTest;
