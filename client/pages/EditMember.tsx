import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import { useAuth } from "@/contexts/AuthContext";
import type { Member } from "@shared/members";

const isNeonConfigured = !!import.meta.env.VITE_NEON_DATABASE_URL;

const formatForDateInput = (value: string) => {
  const d = new Date(value);
  if (isNaN(d.getTime())) return "";
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

const EditMember = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { canEdit } = useAuth();
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [member, setMember] = useState<Member | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    zone: "",
    mandal: "",
    dateOfBirth: "",
    phoneNumber: "",
    email: "",
    address: "",
    dixaDate: "",
    category: "Sadbhav" as "ambrish" | "Sadbhav" | "Karyakarta",
    status: "",
    reference: "",
    bloodGroup: "",
    education: "",
    occupation: "",
    memberId: "",
  });

  const zones = ["Amalsad", "Dharampur", "Gandevi", "Valsad", "Vapi"];

  const mandalsByZone: Record<string, string[]> = useMemo(
    () => ({
      Amalsad: ["Amalsad Central", "Amalsad North", "Amalsad South"],
      Dharampur: [
        "Dharampur East",
        "Dharampur West",
        "Dharampur Central",
        "Dharampur North",
        "Dharampur South",
      ],
      Gandevi: [
        "Gandevi North",
        "Gandevi South",
        "Gandevi East",
        "Gandevi West",
        "Gandevi Central",
        "Gandevi Industrial",
      ],
      Valsad: ["Valsad Central", "Valsad East"],
      Vapi: ["Vapi Central", "Vapi Industrial", "Vapi North", "Vapi South"],
    }),
    [],
  );

  useEffect(() => {
    const load = async () => {
      try {
        if (!id) {
          navigate("/members");
          return;
        }
        // In demo mode, allow admin to edit using in-memory data
        if (!isNeonConfigured && !canEdit) {
          alert(
            "Database not configured. Please set up your Neon database connection.",
          );
          navigate("/members");
          return;
        }
        const all = await membersAPI.getAll();
        const found = all.find((m) => String(m.id) === String(id));
        if (!found) {
          alert("Member not found");
          navigate("/members");
          return;
        }
        setMember(found);
        setFormData({
          name: found.name,
          zone: found.zone,
          mandal: found.mandal,
          dateOfBirth: formatForDateInput(found.dateOfBirth),
          phoneNumber: found.phoneNumber,
          email: found.email,
          address: found.address,
          dixaDate: formatForDateInput(found.dixaDate),
          category: found.category as "ambrish" | "Sadbhav" | "Karyakarta",
          status: found.status || "",
          reference: found.reference,
          bloodGroup: found.bloodGroup,
          education: found.education,
          occupation: found.occupation,
          memberId: found.memberId,
        });
      } catch (e) {
        console.error(e);
        alert("Failed to load member");
        navigate("/members");
      } finally {
        setInitializing(false);
      }
    };
    load();
  }, [id, navigate, canEdit]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
      ...(field === "zone" ? { mandal: "" } : {}),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (!id) return;
      if (!isNeonConfigured && !canEdit) {
        alert(
          "Database not configured. Please set up your Neon database connection.",
        );
        navigate("/members");
        return;
      }
      await membersAPI.update(String(id), {
        name: formData.name,
        zone: formData.zone,
        mandal: formData.mandal,
        dateOfBirth: formData.dateOfBirth,
        phoneNumber: formData.phoneNumber,
        email: formData.email,
        address: formData.address,
        dixaDate: formData.dixaDate,
        category: formData.category,
        status: formData.status,
        reference: formData.reference,
        bloodGroup: formData.bloodGroup,
        education: formData.education,
        occupation: formData.occupation,
        memberId: formData.memberId,
      });
      navigate("/members");
    } catch (error) {
      console.error("Error updating member:", error);
      alert("Failed to update member. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const isFormValid =
    formData.name &&
    formData.zone &&
    formData.mandal &&
    formData.dateOfBirth &&
    formData.phoneNumber &&
    formData.email &&
    formData.address &&
    formData.dixaDate &&
    formData.category &&
    formData.memberId;

  if (initializing) {
    return (
      <div className="px-4 py-6 sm:px-0">
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Loading member...</p>
          </div>
        </div>
      </div>
    );
  }

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
        <h1 className="text-3xl font-bold text-gray-900">Edit Member</h1>
        <p className="mt-2 text-gray-600">Update existing member details</p>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle className="text-xl">Member Information</CardTitle>
          <p className="text-sm text-muted-foreground">
            All fields are required
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <h3 className="text-lg font-medium mb-4">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="memberId">Member ID *</Label>
                  <Input
                    id="memberId"
                    placeholder="Enter unique member ID"
                    value={formData.memberId}
                    onChange={(e) =>
                      handleInputChange("memberId", e.target.value)
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    placeholder="Enter full name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) =>
                      handleInputChange("dateOfBirth", e.target.value)
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dixaDate">Dixa Date *</Label>
                  <Input
                    id="dixaDate"
                    type="date"
                    value={formData.dixaDate}
                    onChange={(e) =>
                      handleInputChange("dixaDate", e.target.value)
                    }
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    placeholder="Enter phone number"
                    value={formData.phoneNumber}
                    onChange={(e) =>
                      handleInputChange("phoneNumber", e.target.value)
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter email address"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    required
                  />
                </div>

                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="address">Address *</Label>
                  <Input
                    id="address"
                    placeholder="Enter full address"
                    value={formData.address}
                    onChange={(e) =>
                      handleInputChange("address", e.target.value)
                    }
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4">
                Location & Organization
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="zone">Zone *</Label>
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
                  <Label htmlFor="mandal">Mandal *</Label>
                  <Select
                    value={formData.mandal}
                    onValueChange={(value) =>
                      handleInputChange("mandal", value)
                    }
                    disabled={!formData.zone}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a mandal" />
                    </SelectTrigger>
                    <SelectContent>
                      {formData.zone &&
                        mandalsByZone[formData.zone]?.map((mandal) => (
                          <SelectItem key={mandal} value={mandal}>
                            {mandal}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(
                      value: "ambrish" | "Sadbhav" | "Karyakarta",
                    ) => handleInputChange("category", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ambrish">Ambrish</SelectItem>
                      <SelectItem value="Sadbhav">Sadbhav</SelectItem>
                      <SelectItem value="Karyakarta">Karyakarta</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Input
                    id="status"
                    placeholder="Enter status"
                    value={formData.status}
                    onChange={(e) =>
                      handleInputChange("status", e.target.value)
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reference">Reference</Label>
                  <Input
                    id="reference"
                    placeholder="Enter reference person"
                    value={formData.reference}
                    onChange={(e) =>
                      handleInputChange("reference", e.target.value)
                    }
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4">
                Additional Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bloodGroup">Blood Group</Label>
                  <Select
                    value={formData.bloodGroup}
                    onValueChange={(value) =>
                      handleInputChange("bloodGroup", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select blood group" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A+">A+</SelectItem>
                      <SelectItem value="A-">A-</SelectItem>
                      <SelectItem value="B+">B+</SelectItem>
                      <SelectItem value="B-">B-</SelectItem>
                      <SelectItem value="AB+">AB+</SelectItem>
                      <SelectItem value="AB-">AB-</SelectItem>
                      <SelectItem value="O+">O+</SelectItem>
                      <SelectItem value="O-">O-</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="education">Education</Label>
                  <Input
                    id="education"
                    placeholder="Enter education level"
                    value={formData.education}
                    onChange={(e) =>
                      handleInputChange("education", e.target.value)
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="occupation">Job/Occupation</Label>
                  <Input
                    id="occupation"
                    placeholder="Enter occupation"
                    value={formData.occupation}
                    onChange={(e) =>
                      handleInputChange("occupation", e.target.value)
                    }
                  />
                </div>
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
                    Saving Changes...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
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

export default EditMember;
