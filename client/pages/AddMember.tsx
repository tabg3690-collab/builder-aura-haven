import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { membersAPI } from "@/lib/database";
import { isSupabaseConfigured } from "@/lib/supabase";

const AddMember = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    zone: "",
    mandal: "",
    dateOfBirth: "",
    phoneNumber: "",
    email: ""
  });

  const zones = ["Amalsad", "Dharampur", "Gandevi", "Valsad", "Vapi"];
  
  const mandalsByZone: Record<string, string[]> = {
    "Amalsad": ["Amalsad Central", "Amalsad North", "Amalsad South"],
    "Dharampur": ["Dharampur East", "Dharampur West", "Dharampur Central", "Dharampur North", "Dharampur South"],
    "Gandevi": ["Gandevi North", "Gandevi South", "Gandevi East", "Gandevi West", "Gandevi Central", "Gandevi Industrial"],
    "Valsad": ["Valsad Central", "Valsad East"],
    "Vapi": ["Vapi Central", "Vapi Industrial", "Vapi North", "Vapi South"]
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
      // Reset mandal when zone changes
      ...(field === 'zone' ? { mandal: '' } : {})
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      // Save member to database
      await membersAPI.create({
        name: formData.name,
        zone: formData.zone,
        mandal: formData.mandal,
        dateOfBirth: formData.dateOfBirth,
        phoneNumber: formData.phoneNumber,
        email: formData.email
      });

      // Navigate back to members list
      navigate("/members");
    } catch (error) {
      console.error("Error adding member:", error);
      alert("Failed to add member. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = formData.name && formData.zone && formData.mandal && 
                     formData.dateOfBirth && formData.phoneNumber && formData.email;

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/members")}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Members
        </Button>
        <h1 className="text-3xl font-bold text-gray-900">Add New Member</h1>
        <p className="mt-2 text-gray-600">Enter member details to add them to the directory</p>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle className="text-xl">Member Information</CardTitle>
          <p className="text-sm text-muted-foreground">
            All fields are required
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="Enter full name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter email address"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  placeholder="Enter phone number"
                  value={formData.phoneNumber}
                  onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="zone">Zone</Label>
                <Select 
                  value={formData.zone} 
                  onValueChange={(value) => handleInputChange("zone", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a zone" />
                  </SelectTrigger>
                  <SelectContent>
                    {zones.map((zone) => (
                      <SelectItem key={zone} value={zone}>
                        {zone}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="mandal">Mandal</Label>
                <Select 
                  value={formData.mandal} 
                  onValueChange={(value) => handleInputChange("mandal", value)}
                  disabled={!formData.zone}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a mandal" />
                  </SelectTrigger>
                  <SelectContent>
                    {formData.zone && mandalsByZone[formData.zone]?.map((mandal) => (
                      <SelectItem key={mandal} value={mandal}>
                        {mandal}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-6">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate("/members")}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!isFormValid || loading}
                className="bg-primary hover:bg-primary/90"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Adding Member...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Add Member
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddMember;
