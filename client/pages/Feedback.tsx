import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Send, CheckCircle, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { feedbackAPI } from "@/lib/database";
import { isSupabaseConfigured } from "@/lib/supabase";

interface FeedbackForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

type SubmissionStatus = 'idle' | 'submitting' | 'success' | 'error';

const Feedback = () => {
  const [formData, setFormData] = useState<FeedbackForm>({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const [status, setStatus] = useState<SubmissionStatus>('idle');
  const [errors, setErrors] = useState<Partial<FeedbackForm>>({});

  const subjectOptions = [
    "General Inquiry",
    "Technical Support",
    "Bug Report",
    "Feature Request",
    "Membership Issue",
    "Event Related",
    "Website Feedback",
    "Other"
  ];

  const handleInputChange = (field: keyof FeedbackForm, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<FeedbackForm> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters long";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setStatus('submitting');

    try {
      // Check if database is configured
      if (!isSupabaseConfigured) {
        // In demo mode, just show success without actually saving
        setStatus('success');
      } else {
        // Save feedback to database
        await feedbackAPI.create({
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message
        });

        setStatus('success');
      }

      // Reset form after successful submission
      setTimeout(() => {
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: ""
        });
        setStatus('idle');
      }, 3000);

    } catch (error) {
      console.error("Feedback submission error:", error);
      setStatus('error');
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      subject: "",
      message: ""
    });
    setErrors({});
    setStatus('idle');
  };

  if (status === 'success') {
    return (
      <div className="px-4 py-6 sm:px-0">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Feedback</h1>
          <p className="mt-2 text-gray-600">Submit your queries and feedback</p>
        </div>

        <Card className="max-w-2xl mx-auto text-center py-16">
          <CardContent>
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h2>
            <p className="text-gray-600 mb-6">
              Your feedback has been submitted successfully. We'll get back to you within 24-48 hours.
            </p>
            <Button onClick={resetForm} className="bg-primary hover:bg-primary/90">
              Submit Another Feedback
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Feedback</h1>
        <p className="mt-2 text-gray-600">Submit your queries and feedback</p>
      </div>

      {status === 'error' && (
        <Alert className="max-w-2xl mb-6 border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            There was an error submitting your feedback. Please try again.
          </AlertDescription>
        </Alert>
      )}

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle className="text-xl">Contact Us</CardTitle>
          <p className="text-sm text-muted-foreground">
            We value your feedback and are here to help with any questions or concerns.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">
                  Full Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className={errors.name ? "border-red-500" : ""}
                  required
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">
                  Email Address <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className={errors.email ? "border-red-500" : ""}
                  required
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">
                Subject <span className="text-red-500">*</span>
              </Label>
              <Select 
                value={formData.subject} 
                onValueChange={(value) => handleInputChange("subject", value)}
              >
                <SelectTrigger className={errors.subject ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select a subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjectOptions.map((subject) => (
                    <SelectItem key={subject} value={subject}>
                      {subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.subject && (
                <p className="text-sm text-red-500">{errors.subject}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">
                Message <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="message"
                placeholder="Please describe your query or feedback in detail..."
                value={formData.message}
                onChange={(e) => handleInputChange("message", e.target.value)}
                className={`min-h-[120px] resize-none ${errors.message ? "border-red-500" : ""}`}
                required
              />
              <div className="flex justify-between items-center">
                {errors.message && (
                  <p className="text-sm text-red-500">{errors.message}</p>
                )}
                <p className="text-sm text-muted-foreground ml-auto">
                  {formData.message.length} characters
                </p>
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-6">
              <Button 
                type="button" 
                variant="outline" 
                onClick={resetForm}
                disabled={status === 'submitting'}
              >
                Clear Form
              </Button>
              <Button 
                type="submit" 
                disabled={status === 'submitting'}
                className="bg-primary hover:bg-primary/90"
              >
                {status === 'submitting' ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Submit Feedback
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card className="max-w-2xl mt-8">
        <CardHeader>
          <CardTitle className="text-lg">Other Ways to Reach Us</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-primary mb-2">Email Support</h4>
              <p className="text-sm text-muted-foreground">
                support@organization.com
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-primary mb-2">Phone Support</h4>
              <p className="text-sm text-muted-foreground">
                +91 XXX XXX XXXX
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-primary mb-2">Office Hours</h4>
              <p className="text-sm text-muted-foreground">
                Monday - Friday: 9:00 AM - 6:00 PM
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-primary mb-2">Response Time</h4>
              <p className="text-sm text-muted-foreground">
                24-48 hours for email inquiries
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Feedback;
