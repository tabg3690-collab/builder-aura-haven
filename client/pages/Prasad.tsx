import { useEffect, useState } from "react";
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
import { useAuth } from "@/contexts/AuthContext";
import { prasadAPI } from "@/lib/database";
import type { PrasadRecord } from "@shared/prasad";

const Prasad = () => {
  const { canEdit } = useAuth();
  const [rows, setRows] = useState<PrasadRecord[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      const data = await prasadAPI.getAll();
      setRows(data);
    };
    load();
  }, []);

  const updateCell = (
    idx: number,
    field: keyof Omit<PrasadRecord, "mandal">,
    value: string,
  ) => {
    setRows((prev) => {
      const next = [...prev];
      // @ts-expect-error - narrowing
      next[idx][field] = Number(value || 0);
      return next;
    });
  };

  const saveRow = async (idx: number) => {
    const row = rows[idx];
    try {
      setLoading(true);
      await prasadAPI.update(row.mandal, {
        pouch: row.pouch,
        smallBox: row.smallBox,
        bigBox: row.bigBox,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Prasad Distribution
        </h1>
        <p className="mt-2 text-gray-600">
          Counts per mandal for Pouch, Small Box, and Big Box. Users can view;
          admins can edit.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mandal</TableHead>
                  <TableHead>Pouch</TableHead>
                  <TableHead>Small Box</TableHead>
                  <TableHead>Big Box</TableHead>
                  {canEdit && <TableHead>Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((r, idx) => (
                  <TableRow key={r.mandal}>
                    <TableCell className="font-medium">{r.mandal}</TableCell>
                    <TableCell className="max-w-36">
                      {canEdit ? (
                        <Input
                          type="number"
                          min={0}
                          value={r.pouch}
                          onChange={(e) =>
                            updateCell(idx, "pouch", e.target.value)
                          }
                        />
                      ) : (
                        r.pouch
                      )}
                    </TableCell>
                    <TableCell className="max-w-36">
                      {canEdit ? (
                        <Input
                          type="number"
                          min={0}
                          value={r.smallBox}
                          onChange={(e) =>
                            updateCell(idx, "smallBox", e.target.value)
                          }
                        />
                      ) : (
                        r.smallBox
                      )}
                    </TableCell>
                    <TableCell className="max-w-36">
                      {canEdit ? (
                        <Input
                          type="number"
                          min={0}
                          value={r.bigBox}
                          onChange={(e) =>
                            updateCell(idx, "bigBox", e.target.value)
                          }
                        />
                      ) : (
                        r.bigBox
                      )}
                    </TableCell>
                    {canEdit && (
                      <TableCell>
                        <Button
                          size="sm"
                          onClick={() => saveRow(idx)}
                          disabled={loading}
                        >
                          {loading ? "Saving..." : "Save"}
                        </Button>
                      </TableCell>
                    )}
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

export default Prasad;
