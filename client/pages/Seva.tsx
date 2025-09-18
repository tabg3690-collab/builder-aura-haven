import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { useAuth } from "@/contexts/AuthContext";
import { membersAPI, sevaAPI } from "@/lib/database";
import type { Member } from "@shared/members";
import type { SevaRecord, SevaType } from "@shared/seva";

const Seva = () => {
  const { isAdmin } = useAuth();
  const [members, setMembers] = useState<Member[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");
  const [record, setRecord] = useState<SevaRecord | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadMembers = async () => {
      const list = await membersAPI.getAll();
      setMembers(list);
      if (list.length && !selectedId) setSelectedId(String(list[0].id));
    };
    loadMembers();
  }, []);

  useEffect(() => {
    const load = async () => {
      if (!selectedId) return;
      const rec = await sevaAPI.getByMember(selectedId);
      setRecord(rec);
    };
    load();
  }, [selectedId]);

  const onChange = (
    type: SevaType,
    field: keyof SevaRecord[SevaType],
    value: string,
  ) => {
    setRecord((prev) => {
      if (!prev) return prev;
      const next = {
        ...prev,
        [type]: {
          ...prev[type],
          [field]: field === "amount" ? Number(value || 0) : value,
        },
      } as SevaRecord;
      return next;
    });
  };

  const save = async () => {
    if (!selectedId || !record) return;
    try {
      setLoading(true);
      await sevaAPI.update(selectedId, record);
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Seva (Donations)</h1>
        <p className="mt-2 text-gray-600">
          Manage donation entries per member. Admins only.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Select Member</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-4 items-end">
          <div className="w-80">
            <Label>Member</Label>
            <Select value={selectedId} onValueChange={setSelectedId}>
              <SelectTrigger>
                <SelectValue placeholder="Select member" />
              </SelectTrigger>
              <SelectContent>
                {members.map((m) => (
                  <SelectItem key={m.id} value={String(m.id)}>
                    {m.name} — {m.mandal}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            onClick={save}
            disabled={!record || loading}
            className="ml-auto bg-primary hover:bg-primary/90"
          >
            {loading ? "Saving..." : "Save"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Seva Entries</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Note</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {record &&
                  (Object.keys(record) as SevaType[]).map((type) => (
                    <TableRow key={type}>
                      <TableCell className="font-medium">{type}</TableCell>
                      <TableCell className="max-w-40">
                        <Input
                          type="number"
                          value={record[type].amount}
                          onChange={(e) =>
                            onChange(type, "amount", e.target.value)
                          }
                          min={0}
                        />
                      </TableCell>
                      <TableCell className="max-w-40">
                        <Input
                          type="date"
                          value={record[type].date}
                          onChange={(e) =>
                            onChange(type, "date", e.target.value)
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          placeholder="Add a note"
                          value={record[type].note}
                          onChange={(e) =>
                            onChange(type, "note", e.target.value)
                          }
                        />
                      </TableCell>
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

export default Seva;
