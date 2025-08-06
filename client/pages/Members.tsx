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
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Member {
  id: number;
  name: string;
  zone: string;
  mandal: string;
  dateOfBirth: string;
  phoneNumber: string;
  email: string;
}

const Members = () => {
  const navigate = useNavigate();

  // Sample member data
  const membersData: Member[] = [
    {
      id: 1,
      name: "Rajesh Patel",
      zone: "Vapi",
      mandal: "Vapi Central",
      dateOfBirth: "1985-03-15",
      phoneNumber: "+91 98765 43210",
      email: "rajesh.patel@email.com"
    },
    {
      id: 2,
      name: "Priya Shah",
      zone: "Gandevi",
      mandal: "Gandevi North",
      dateOfBirth: "1990-07-22",
      phoneNumber: "+91 87654 32109",
      email: "priya.shah@email.com"
    },
    {
      id: 3,
      name: "Amit Kumar",
      zone: "Valsad",
      mandal: "Valsad East",
      dateOfBirth: "1988-11-08",
      phoneNumber: "+91 76543 21098",
      email: "amit.kumar@email.com"
    },
    {
      id: 4,
      name: "Kavita Desai",
      zone: "Dharampur",
      mandal: "Dharampur West",
      dateOfBirth: "1992-12-03",
      phoneNumber: "+91 65432 10987",
      email: "kavita.desai@email.com"
    },
    {
      id: 5,
      name: "Suresh Mehta",
      zone: "Amalsad",
      mandal: "Amalsad South",
      dateOfBirth: "1987-05-18",
      phoneNumber: "+91 54321 09876",
      email: "suresh.mehta@email.com"
    },
    {
      id: 6,
      name: "Nisha Joshi",
      zone: "Vapi",
      mandal: "Vapi Industrial",
      dateOfBirth: "1995-09-12",
      phoneNumber: "+91 43210 98765",
      email: "nisha.joshi@email.com"
    },
    {
      id: 7,
      name: "Vikram Singh",
      zone: "Gandevi",
      mandal: "Gandevi South",
      dateOfBirth: "1983-01-27",
      phoneNumber: "+91 32109 87654",
      email: "vikram.singh@email.com"
    },
    {
      id: 8,
      name: "Meera Agarwal",
      zone: "Valsad",
      mandal: "Valsad Central",
      dateOfBirth: "1991-04-14",
      phoneNumber: "+91 21098 76543",
      email: "meera.agarwal@email.com"
    }
  ];

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Members</h1>
          <p className="mt-2 text-gray-600">Complete member directory</p>
        </div>
        <Button 
          onClick={() => navigate('/members/add')}
          className="bg-primary hover:bg-primary/90"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Member
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Member Directory</CardTitle>
          <p className="text-sm text-muted-foreground">
            Complete list of all registered members
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
