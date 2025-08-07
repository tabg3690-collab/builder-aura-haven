import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { getUpcomingBirthdays, getBirthdayInfo, membersData } from "@shared/members";
import { useAuth } from "@/contexts/AuthContext";

const Dashboard = () => {
  const { user, canEdit } = useAuth();

  // Get upcoming birthdays for the next 30 days
  const upcomingBirthdays = getUpcomingBirthdays(30);

  // Calculate total mandals from zones data
  const totalMandals = 3 + 5 + 6 + 2 + 4; // Amalsad + Dharampur + Gandevi + Valsad + Vapi

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">Overview of zones, mandals, and member activities</p>

        {!canEdit && (
          <Alert className="mt-4 border-blue-200 bg-blue-50">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              You have read-only access to the database. Contact an administrator to edit member data.
            </AlertDescription>
          </Alert>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-primary">Total Zones</CardTitle>
            <div className="h-4 w-4 text-primary">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4"
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">5</div>
            <p className="text-xs text-muted-foreground">Active zones across regions</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-secondary/10 to-secondary/5 border-secondary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-secondary">Total Mandals</CardTitle>
            <div className="h-4 w-4 text-secondary">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4"
              >
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-secondary">{totalMandals}</div>
            <p className="text-xs text-muted-foreground">Local mandals operating</p>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Birthdays Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Upcoming Birthdays</CardTitle>
          <p className="text-sm text-muted-foreground">
            Members celebrating birthdays in the next 30 days
            {upcomingBirthdays.length > 0 && ` (${upcomingBirthdays.length} upcoming)`}
          </p>
        </CardHeader>
        <CardContent>
          {upcomingBirthdays.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Mandal</TableHead>
                  <TableHead>Date of Birth</TableHead>
                  <TableHead>Days Remaining</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {upcomingBirthdays.map((member) => {
                  const birthdayInfo = getBirthdayInfo(member);
                  return (
                    <TableRow key={member.id}>
                      <TableCell className="font-medium">{member.name}</TableCell>
                      <TableCell>{member.mandal}</TableCell>
                      <TableCell>
                        {birthdayInfo.birthday.toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric'
                        })}
                      </TableCell>
                      <TableCell>
                        {birthdayInfo.isToday ? (
                          <Badge className="bg-red-500 hover:bg-red-600">
                            🎉 Today!
                          </Badge>
                        ) : birthdayInfo.daysRemaining === 1 ? (
                          <Badge className="bg-orange-500 hover:bg-orange-600">
                            Tomorrow
                          </Badge>
                        ) : birthdayInfo.daysRemaining <= 7 ? (
                          <Badge className="bg-yellow-500 hover:bg-yellow-600">
                            {birthdayInfo.daysRemaining} days
                          </Badge>
                        ) : (
                          <Badge variant="secondary">
                            {birthdayInfo.daysRemaining} days
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8">
              <div className="text-muted-foreground">
                🎂 No upcoming birthdays in the next 30 days
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Check back later or add more members to see upcoming celebrations!
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
