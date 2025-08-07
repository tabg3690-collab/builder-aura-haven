import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { membersData, Member } from "@shared/members";
import { useAuth } from "@/contexts/AuthContext";

const Members = () => {
  const navigate = useNavigate();
  const { canEdit } = useAuth();

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Members</h1>
          <p className="mt-2 text-gray-600">Complete member directory</p>
        </div>
        {canEdit ? (
          <div className="flex space-x-3">
            <Button
              onClick={() => navigate('/members/import')}
              variant="outline"
              className="border-secondary text-secondary hover:bg-secondary hover:text-white"
            >
              <Upload className="h-4 w-4 mr-2" />
              Import Excel
            </Button>
            <Button
              onClick={() => navigate('/members/add')}
              className="bg-primary hover:bg-primary/90"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Member
            </Button>
          </div>
        ) : (
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Read-only access</p>
            <p className="text-xs text-muted-foreground">Contact admin to edit members</p>
          </div>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Member Directory</CardTitle>
          <p className="text-sm text-muted-foreground">
            Complete list of all registered members ({membersData.length} total)
          </p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Zone</TableHead>
                  <TableHead>Mandal</TableHead>
                  <TableHead>Date of Birth</TableHead>
                  <TableHead>Phone Number</TableHead>
                  <TableHead>Email</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {membersData.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell className="font-medium">{member.name}</TableCell>
                    <TableCell>{member.zone}</TableCell>
                    <TableCell>{member.mandal}</TableCell>
                    <TableCell>{new Date(member.dateOfBirth).toLocaleDateString()}</TableCell>
                    <TableCell>{member.phoneNumber}</TableCell>
                    <TableCell>{member.email}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Members;
