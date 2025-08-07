import { useState, useEffect } from "react";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Plus, Upload, AlertCircle, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Member } from "@shared/members";
import { useAuth } from "@/contexts/AuthContext";
import { membersAPI } from "@/lib/database";
import { isSupabaseConfigured } from "@/lib/supabase";
import DatabaseStatus from "@/components/DatabaseStatus";

const Members = () => {
  const navigate = useNavigate();
  const { canEdit } = useAuth();
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await membersAPI.getAll();
      setMembers(data);
    } catch (err) {
      console.error('Error loading members:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to load members. Please check your database connection.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

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
          <AlertDescription className="text-red-800">
            {error}
          </AlertDescription>
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
            {members.length > 0 
              ? `Complete list of all registered members (${members.length} total)`
              : "No members found in the database"
            }
          </p>
        </CardHeader>
        <CardContent>
          {members.length > 0 ? (
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
                  {members.map((member) => (
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
          ) : (
            <div className="text-center py-16">
              <div className="text-muted-foreground mb-4">
                📝 No members found in the database
              </div>
              <p className="text-sm text-muted-foreground mb-6">
                {canEdit 
                  ? "Start by adding your first member or importing from Excel"
                  : "Contact an administrator to add members to the database"
                }
              </p>
              {canEdit && (
                <div className="space-x-4">
                  <Button 
                    onClick={() => navigate('/members/add')}
                    className="bg-primary hover:bg-primary/90"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add First Member
                  </Button>
                  <Button 
                    onClick={() => navigate('/members/import')}
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
