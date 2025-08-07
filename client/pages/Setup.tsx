import DatabaseStatus from "@/components/DatabaseStatus";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Setup = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto py-8 px-4">
        <Button variant="ghost" onClick={() => navigate("/")} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Database Setup</h1>
          <p className="mt-2 text-gray-600">
            Configure your Supabase database to enable persistent data storage
          </p>
        </div>

        <DatabaseStatus showFullSetup />

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Why Set Up a Database?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-green-700 mb-2">
                  ✅ With Database:
                </h4>
                <ul className="text-sm space-y-1 text-green-600">
                  <li>• Members data saved permanently</li>
                  <li>• Excel imports work fully</li>
                  <li>• Feedback submissions stored</li>
                  <li>• Multi-user collaboration</li>
                  <li>• Real-time birthday tracking</li>
                  <li>• Data backup and security</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-orange-700 mb-2">
                  ⚠️ Demo Mode (Current):
                </h4>
                <ul className="text-sm space-y-1 text-orange-600">
                  <li>• Data resets on page refresh</li>
                  <li>• Excel import shows preview only</li>
                  <li>• Feedback not actually saved</li>
                  <li>• Limited to single session</li>
                  <li>• No persistent member tracking</li>
                  <li>• Cannot scale for real use</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Setup;
