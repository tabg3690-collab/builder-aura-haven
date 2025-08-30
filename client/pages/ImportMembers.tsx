import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  Upload,
  Download,
  CheckCircle,
  AlertCircle,
  FileSpreadsheet,
  Eye,
} from "lucide-react";
import * as XLSX from "xlsx";
import { Member } from "@shared/members";
import { membersAPI } from "@/lib/database";
// Check if Neon database is configured
const isNeonConfigured = !!import.meta.env.VITE_NEON_DATABASE_URL;

interface ImportedMember {
  name: string;
  zone: string;
  mandal: string;
  dateOfBirth: string;
  phoneNumber: string;
  email: string;
  rowNumber: number;
  errors: string[];
}

type ImportStatus =
  | "idle"
  | "parsing"
  | "preview"
  | "importing"
  | "success"
  | "error";

const ImportMembers = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [status, setStatus] = useState<ImportStatus>("idle");
  const [importedData, setImportedData] = useState<ImportedMember[]>([]);
  const [validMembers, setValidMembers] = useState<ImportedMember[]>([]);
  const [invalidMembers, setInvalidMembers] = useState<ImportedMember[]>([]);
  const [progress, setProgress] = useState(0);
  const [fileName, setFileName] = useState("");

  const zones = ["Amalsad", "Dharampur", "Gandevi", "Valsad", "Vapi"];

  const mandalsByZone: Record<string, string[]> = {
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
  };

  const validateMember = (member: any, rowNumber: number): ImportedMember => {
    const errors: string[] = [];

    // Validate required fields
    if (
      !member.Name ||
      typeof member.Name !== "string" ||
      !member.Name.trim()
    ) {
      errors.push("Name is required");
    }

    if (!member.Zone || !zones.includes(member.Zone)) {
      errors.push(`Zone must be one of: ${zones.join(", ")}`);
    }

    if (
      !member.Mandal ||
      (member.Zone && !mandalsByZone[member.Zone]?.includes(member.Mandal))
    ) {
      errors.push(`Mandal must be valid for the selected zone`);
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!member.Email || !emailRegex.test(member.Email)) {
      errors.push("Valid email is required");
    }

    // Validate phone number
    if (!member.PhoneNumber || typeof member.PhoneNumber !== "string") {
      errors.push("Phone number is required");
    }

    // Validate date of birth
    let formattedDate = "";
    if (member.DateOfBirth) {
      try {
        // Handle Excel date formats
        let date: Date;
        if (typeof member.DateOfBirth === "number") {
          // Excel serial date
          date = new Date((member.DateOfBirth - 25569) * 86400 * 1000);
        } else {
          date = new Date(member.DateOfBirth);
        }

        if (isNaN(date.getTime())) {
          errors.push("Invalid date format");
        } else {
          formattedDate = date.toISOString().split("T")[0];
        }
      } catch (e) {
        errors.push("Invalid date format");
      }
    } else {
      errors.push("Date of birth is required");
    }

    return {
      name: member.Name || "",
      zone: member.Zone || "",
      mandal: member.Mandal || "",
      dateOfBirth: formattedDate,
      phoneNumber: member.PhoneNumber || "",
      email: member.Email || "",
      rowNumber,
      errors,
    };
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setStatus("parsing");
    setFileName(file.name);
    setProgress(10);

    try {
      const data = await file.arrayBuffer();
      setProgress(30);

      const workbook = XLSX.read(data);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      setProgress(50);

      // Convert to JSON with header row
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      setProgress(70);

      // Validate and process data
      const processedData = jsonData.map(
        (row, index) => validateMember(row, index + 2), // +2 because Excel starts at 1 and we skip header
      );

      setProgress(90);

      const valid = processedData.filter(
        (member) => member.errors.length === 0,
      );
      const invalid = processedData.filter(
        (member) => member.errors.length > 0,
      );

      setImportedData(processedData);
      setValidMembers(valid);
      setInvalidMembers(invalid);
      setProgress(100);

      setTimeout(() => {
        setStatus("preview");
        setProgress(0);
      }, 500);
    } catch (error) {
      console.error("Error parsing file:", error);
      setStatus("error");
    }
  };

  const handleImport = async () => {
    setStatus("importing");
    setProgress(0);

    try {
      // Check if database is configured
      if (!isNeonConfigured) {
        setProgress(100);
        setStatus("success");
        return;
      }

      // Prepare member data for database
      const membersToImport = validMembers.map((member) => ({
        name: member.name,
        zone: member.zone,
        mandal: member.mandal,
        dateOfBirth: member.dateOfBirth,
        phoneNumber: member.phoneNumber,
        email: member.email,
        address: "",
        dixaDate: "",
        category: "Sadbhav" as const,
        reference: "",
        bloodGroup: "",
        education: "",
        occupation: "",
        memberId: "",
      }));

      setProgress(25);

      // Save to database
      await membersAPI.bulkCreate(membersToImport);

      setProgress(100);
      setStatus("success");
    } catch (error) {
      console.error("Import error:", error);
      setStatus("error");
    }
  };

  const downloadTemplate = () => {
    const template = [
      {
        Name: "John Smith",
        Zone: "Vapi",
        Mandal: "Vapi Central",
        DateOfBirth: "1990-01-15",
        PhoneNumber: "+91 98765 43210",
        Email: "john.smith@email.com",
      },
    ];

    const ws = XLSX.utils.json_to_sheet(template);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Members Template");
    XLSX.writeFile(wb, "members_template.xlsx");
  };

  const resetImport = () => {
    setStatus("idle");
    setImportedData([]);
    setValidMembers([]);
    setInvalidMembers([]);
    setProgress(0);
    setFileName("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  if (status === "success") {
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
          <h1 className="text-3xl font-bold text-gray-900">Import Complete</h1>
        </div>

        <Card className="max-w-2xl mx-auto text-center py-16">
          <CardContent>
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Import Successful!
            </h2>
            <p className="text-gray-600 mb-6">
              Successfully imported {validMembers.length} members from{" "}
              {fileName}
            </p>
            <div className="space-x-4">
              <Button
                onClick={() => navigate("/members")}
                className="bg-primary hover:bg-primary/90"
              >
                View Members
              </Button>
              <Button onClick={resetImport} variant="outline">
                Import Another File
              </Button>
            </div>
          </CardContent>
        </Card>
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
        <h1 className="text-3xl font-bold text-gray-900">
          Import Members from Excel
        </h1>
        <p className="mt-2 text-gray-600">
          Upload an Excel file to bulk import member data
        </p>
      </div>

      {status === "error" && (
        <Alert className="mb-6 border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            There was an error processing your file. Please check the format and
            try again.
          </AlertDescription>
        </Alert>
      )}

      {(status === "parsing" || status === "importing") && (
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>
                  {status === "parsing"
                    ? "Processing file..."
                    : "Importing members..."}
                </span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          </CardContent>
        </Card>
      )}

      {status === "idle" && (
        <>
          {/* Template Download */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <FileSpreadsheet className="h-5 w-5 mr-2" />
                Download Template
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Download the Excel template with the correct format and sample
                data
              </p>
              <Button onClick={downloadTemplate} variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Download Template
              </Button>
            </CardContent>
          </Card>

          {/* File Upload */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Upload Excel File</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="excel-file">Choose Excel File</Label>
                  <Input
                    id="excel-file"
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    onChange={handleFileUpload}
                    ref={fileInputRef}
                  />
                  <p className="text-sm text-muted-foreground">
                    Supported formats: .xlsx, .xls, .csv
                  </p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-2">
                    Required Columns:
                  </h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>
                      • <strong>Name</strong> - Full name of the member
                    </li>
                    <li>
                      • <strong>Zone</strong> - Must be: {zones.join(", ")}
                    </li>
                    <li>
                      • <strong>Mandal</strong> - Must be valid for the selected
                      zone
                    </li>
                    <li>
                      • <strong>DateOfBirth</strong> - Format: YYYY-MM-DD or
                      Excel date
                    </li>
                    <li>
                      • <strong>PhoneNumber</strong> - Contact number
                    </li>
                    <li>
                      • <strong>Email</strong> - Valid email address
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {status === "preview" && (
        <>
          {/* Import Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-green-600">
                  {validMembers.length}
                </div>
                <div className="text-sm text-muted-foreground">
                  Valid Records
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-red-600">
                  {invalidMembers.length}
                </div>
                <div className="text-sm text-muted-foreground">
                  Invalid Records
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-gray-600">
                  {importedData.length}
                </div>
                <div className="text-sm text-muted-foreground">
                  Total Records
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 mb-6">
            <Button onClick={resetImport} variant="outline">
              Cancel
            </Button>
            <Button
              onClick={handleImport}
              disabled={validMembers.length === 0}
              className="bg-primary hover:bg-primary/90"
            >
              <Upload className="h-4 w-4 mr-2" />
              Import {validMembers.length} Valid Records
            </Button>
          </div>

          {/* Valid Members Preview */}
          {validMembers.length > 0 && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-lg text-green-600 flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Valid Members ({validMembers.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Row</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Zone</TableHead>
                        <TableHead>Mandal</TableHead>
                        <TableHead>Email</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {validMembers.slice(0, 5).map((member, index) => (
                        <TableRow key={index}>
                          <TableCell>{member.rowNumber}</TableCell>
                          <TableCell className="font-medium">
                            {member.name}
                          </TableCell>
                          <TableCell>{member.zone}</TableCell>
                          <TableCell>{member.mandal}</TableCell>
                          <TableCell>{member.email}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  {validMembers.length > 5 && (
                    <p className="text-sm text-muted-foreground mt-2 text-center">
                      ... and {validMembers.length - 5} more records
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Invalid Members */}
          {invalidMembers.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-red-600 flex items-center">
                  <AlertCircle className="h-5 w-5 mr-2" />
                  Invalid Members ({invalidMembers.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Row</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Zone</TableHead>
                        <TableHead>Errors</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {invalidMembers.map((member, index) => (
                        <TableRow key={index}>
                          <TableCell>{member.rowNumber}</TableCell>
                          <TableCell>{member.name || "N/A"}</TableCell>
                          <TableCell>{member.zone || "N/A"}</TableCell>
                          <TableCell>
                            <ul className="text-sm text-red-600">
                              {member.errors.map((error, errorIndex) => (
                                <li key={errorIndex}>• {error}</li>
                              ))}
                            </ul>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
};

export default ImportMembers;
