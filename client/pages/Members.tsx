import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Plus,
  Upload,
  AlertCircle,
  Loader2,
  Search,
  Filter,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Member } from "@shared/members";
import { useAuth } from "@/contexts/AuthContext";
import { membersAPI } from "@/lib/database";
import * as XLSX from "xlsx";
// Check if Neon database is configured
const isNeonConfigured = !!import.meta.env.VITE_NEON_DATABASE_URL;
import DatabaseStatus from "@/components/DatabaseStatus";

const Members = () => {
  const navigate = useNavigate();
  const { canEdit } = useAuth();
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedZone, setSelectedZone] = useState<string>("all");
  const [selectedMandal, setSelectedMandal] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  useEffect(() => {
    loadMembers();
  }, []);

  const handleExportAll = () => {
    try {
      const rows = members.map((m) => ({
        "Member ID": m.memberId,
        Name: m.name,
        Zone: m.zone,
        Mandal: m.mandal,
        Address: m.address,
        "Date of Birth": m.dateOfBirth,
        "Dixa Date": m.dixaDate,
        Category: m.category,
        Status: m.status,
        Reference: m.reference,
        "Blood Group": m.bloodGroup,
        Education: m.education,
        Occupation: m.occupation,
        "Phone Number": m.phoneNumber,
        Email: m.email,
      }));
      const ws = XLSX.utils.json_to_sheet(rows);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Members");
      XLSX.writeFile(wb, "members_export.xlsx");
    } catch (e) {
      console.error("Export failed", e);
    }
  };

  const loadMembers = async () => {
    try {
      setLoading(true);
      setError(null);

      // If database is not configured, show empty state for regular users
      if (!isNeonConfigured) {
        if (!canEdit) {
          setMembers([]);
          setLoading(false);
          return;
        }
        // allow demo admin to access the in-memory members
      }

      const data = await membersAPI.getAll();
      setMembers(data);
    } catch (err) {
      console.error("Error loading members:", err);
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to load members. Please check your database connection.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Get unique zones and mandals for filter dropdowns
  const { uniqueZones, uniqueMandals } = useMemo(() => {
    const zones = Array.from(
      new Set(
        members.map((m) => (m.zone || "").trim()).filter((z) => z.length > 0),
      ),
    ).sort();
    const mandalSource =
      selectedZone === "all"
        ? members
        : members.filter((m) => m.zone === selectedZone);
    const mandals = Array.from(
      new Set(
        mandalSource
          .map((m) => (m.mandal || "").trim())
          .filter((z) => z.length > 0),
      ),
    ).sort();
    return { uniqueZones: zones, uniqueMandals: mandals };
  }, [members, selectedZone]);

  // Filter members based on search and filters
  const filteredMembers = useMemo(() => {
    return members.filter((member) => {
      const matchesSearch =
        searchTerm === "" ||
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.phoneNumber.includes(searchTerm) ||
        member.memberId.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesZone =
        selectedZone === "all" || member.zone === selectedZone;
      const matchesMandal =
        selectedMandal === "all" || member.mandal === selectedMandal;
      const matchesCategory =
        selectedCategory === "all" || member.category === selectedCategory;

      return matchesSearch && matchesZone && matchesMandal && matchesCategory;
    });
  }, [members, searchTerm, selectedZone, selectedMandal, selectedCategory]);

  if (loading) {
    return (
      <div className="px-4 py-6 sm:px-0">
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Loading members...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-4 py-6 sm:px-0">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Members</h1>
          <p className="mt-2 text-gray-600">Complete member directory</p>
        </div>

        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">{error}</AlertDescription>
        </Alert>

        <div className="mt-4">
          <Button onClick={loadMembers} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 sm:px-0">
      <DatabaseStatus />
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Members</h1>
          <p className="mt-2 text-gray-600">Complete member directory</p>
        </div>
        {canEdit ? (
          <div className="flex space-x-3">
            <Button onClick={handleExportAll} variant="outline">
              Export Excel
            </Button>
            <Button
              onClick={() => navigate("/members/import")}
              variant="outline"
              className="border-secondary text-secondary hover:bg-secondary hover:text-white"
            >
              <Upload className="h-4 w-4 mr-2" />
              Import Excel
            </Button>
            <Button
              onClick={() => navigate("/members/add")}
              className="bg-primary hover:bg-primary/90"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Member
            </Button>
          </div>
        ) : (
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Read-only access</p>
            <p className="text-xs text-muted-foreground">
              Contact admin to edit members
            </p>
          </div>
        )}
      </div>

      {/* Filters Section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search members..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select
              value={selectedZone}
              onValueChange={(v) => {
                setSelectedZone(v);
                setSelectedMandal("all");
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by Zone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Zones</SelectItem>
                {uniqueZones.map((zone) => (
                  <SelectItem key={zone} value={zone}>
                    {zone}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedMandal} onValueChange={setSelectedMandal}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by Mandal" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Mandals</SelectItem>
                {uniqueMandals.map((mandal) => (
                  <SelectItem key={mandal} value={mandal}>
                    {mandal}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="ambrish">Ambrish</SelectItem>
                <SelectItem value="Sadbhav">Sadbhav</SelectItem>
                <SelectItem value="Karyakarta">Karyakarta</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center text-sm text-muted-foreground">
              Showing {filteredMembers.length} of {members.length} members
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Member Directory</CardTitle>
          <p className="text-sm text-muted-foreground">
            {members.length > 0
              ? `Complete list of all registered members (${members.length} total)`
              : "No members found in the database"}
          </p>
        </CardHeader>
        <CardContent>
          {filteredMembers.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Zone</TableHead>
                    <TableHead>Mandal</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Date of Birth</TableHead>
                    <TableHead>Dixa Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Reference</TableHead>
                    <TableHead>Blood Group</TableHead>
                    <TableHead>Education</TableHead>
                    <TableHead>Occupation</TableHead>
                    <TableHead>Phone Number</TableHead>
                    <TableHead>Email</TableHead>
                    {canEdit && <TableHead>Actions</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMembers.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell className="font-medium">
                        {member.memberId}
                      </TableCell>
                      <TableCell className="font-medium">
                        {member.name}
                      </TableCell>
                      <TableCell>{member.zone}</TableCell>
                      <TableCell>{member.mandal}</TableCell>
                      <TableCell>{member.address}</TableCell>
                      <TableCell>
                        {(() => {
                          const d = new Date(member.dateOfBirth);
                          return isNaN(d.getTime())
                            ? ""
                            : d.toLocaleDateString();
                        })()}
                      </TableCell>
                      <TableCell>
                        {(() => {
                          const d = new Date(member.dixaDate);
                          return isNaN(d.getTime())
                            ? ""
                            : d.toLocaleDateString();
                        })()}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            member.category === "ambrish"
                              ? "bg-purple-100 text-purple-800"
                              : member.category === "Sadbhav"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-green-100 text-green-800"
                          }`}
                        >
                          {member.category}
                        </span>
                      </TableCell>
                      <TableCell>{member.status || ""}</TableCell>
                      <TableCell>{member.reference}</TableCell>
                      <TableCell>
                        <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs font-medium">
                          {member.bloodGroup}
                        </span>
                      </TableCell>
                      <TableCell>{member.education}</TableCell>
                      <TableCell>{member.occupation}</TableCell>
                      <TableCell>{member.phoneNumber}</TableCell>
                      <TableCell>{member.email}</TableCell>
                      {canEdit && (
                        <TableCell>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              navigate(`/members/${member.id}/edit`)
                            }
                          >
                            Edit
                          </Button>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-muted-foreground mb-4">
                {members.length === 0
                  ? "📝 No members found in the database"
                  : "🔍 No members match your filters"}
              </div>
              <p className="text-sm text-muted-foreground mb-6">
                {members.length === 0
                  ? canEdit
                    ? "Start by adding your first member or importing from Excel"
                    : "Contact an administrator to add members to the database"
                  : "Try adjusting your search terms or filters"}
              </p>
              {canEdit && members.length === 0 && (
                <div className="space-x-4">
                  <Button
                    onClick={() => navigate("/members/add")}
                    className="bg-primary hover:bg-primary/90"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add First Member
                  </Button>
                  <Button
                    onClick={() => navigate("/members/import")}
                    variant="outline"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Import from Excel
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Members;
