import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const Zones = () => {
  // Mock data for zones
  const zonesData = [
    { zoneName: "Amalsad", numberOfMandals: 3, totalMembers: 104 },
    { zoneName: "Dharampur", numberOfMandals: 5, totalMembers: 138 },
    { zoneName: "Gandevi", numberOfMandals: 6, totalMembers: 261 },
    { zoneName: "Valsad", numberOfMandals: 2, totalMembers: 62 },
    { zoneName: "Vapi", numberOfMandals: 4, totalMembers: 120 },
  ];

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Zones</h1>
        <p className="mt-2 text-gray-600">Overview of all organizational zones</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Zone Information</CardTitle>
          <p className="text-sm text-muted-foreground">
            Complete list of zones with mandal and member counts
          </p>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Zone Name</TableHead>
                <TableHead>Number of Mandals</TableHead>
                <TableHead>Total Members</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {zonesData.map((zone, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{zone.zoneName}</TableCell>
                  <TableCell>{zone.numberOfMandals}</TableCell>
                  <TableCell>{zone.totalMembers}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Zones;
