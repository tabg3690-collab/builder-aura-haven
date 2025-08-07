import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Database, AlertTriangle, ExternalLink, Copy } from "lucide-react";
// Check if Neon database is configured
const isNeonConfigured = !!import.meta.env.VITE_NEON_DATABASE_URL;
import { useState } from "react";

interface DatabaseStatusProps {
  showFullSetup?: boolean;
}

const DatabaseStatus = ({ showFullSetup = false }: DatabaseStatusProps) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isNeonConfigured) {
    return null; // Don't show anything if database is configured
  }

  return (
    <div className="mb-6">
      <Alert className="border-orange-200 bg-orange-50">
        <AlertTriangle className="h-4 w-4 text-orange-600" />
        <AlertDescription className="text-orange-800">
          <strong>Database Not Configured:</strong> Using demo mode. Your Netlify + Neon database needs the connection URL.
          {!showFullSetup && (
            <Button
              variant="link"
              className="p-0 h-auto ml-2 text-orange-600 underline"
              onClick={() =>
                window.scrollTo({
                  top: document.body.scrollHeight,
                  behavior: "smooth",
                })
              }
            >
              View Setup Instructions
            </Button>
          )}
        </AlertDescription>
      </Alert>

      {showFullSetup && (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Database className="h-5 w-5 mr-2" />
              Database Setup Required
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-3">
                Quick Setup Steps:
              </h4>
              <ol className="text-sm text-blue-800 space-y-2 list-decimal list-inside">
                <li>
                  <strong>Create Supabase Account:</strong>{" "}
                  <Button
                    variant="link"
                    className="p-0 h-auto text-blue-600 underline"
                    onClick={() =>
                      window.open("https://supabase.com/", "_blank")
                    }
                  >
                    supabase.com
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </Button>
                </li>
                <li>
                  <strong>Create a new project</strong> in your Supabase
                  dashboard
                </li>
                <li>
                  <strong>Get your credentials</strong> from Settings → API
                </li>
                <li>
                  <strong>Create .env file</strong> in your project root:
                </li>
              </ol>
            </div>

            <div className="bg-gray-100 border rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">
                  .env file content:
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    copyToClipboard(`VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here`)
                  }
                >
                  <Copy className="h-4 w-4" />
                  {copied ? "Copied!" : "Copy"}
                </Button>
              </div>
              <pre className="text-sm text-gray-800 font-mono">
                {`VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here`}
              </pre>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-semibold text-yellow-900 mb-2">
                📖 Complete Setup Guide
              </h4>
              <p className="text-sm text-yellow-800">
                For detailed instructions including database table creation, see
                the{" "}
                <code className="bg-yellow-200 px-1 rounded">
                  DATABASE_SETUP.md
                </code>{" "}
                file in your project.
              </p>
            </div>

            <div className="pt-2">
              <Button
                variant="outline"
                onClick={() => window.open("https://supabase.com/", "_blank")}
                className="mr-3"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Open Supabase
              </Button>
              <Button
                variant="outline"
                onClick={() => window.location.reload()}
              >
                Refresh After Setup
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DatabaseStatus;
