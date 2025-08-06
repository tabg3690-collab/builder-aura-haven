import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Feedback = () => {
  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Feedback</h1>
        <p className="mt-2 text-gray-600">Submit your queries and feedback</p>
      </div>

      <Card className="text-center py-16">
        <CardHeader>
          <CardTitle className="text-xl text-muted-foreground">Feedback Form</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-6">
            This page will include a feedback form with fields for:
            Name, Email, Subject, and Message.
          </p>
          <p className="text-sm text-muted-foreground">
            Continue prompting to implement the complete feedback form functionality.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Feedback;
