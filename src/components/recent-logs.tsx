import React, { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Mock log generator
const get_logs = (size = 200) => {
  const events = [];
  const now = new Date();
  for (let i = 0; i < size; i++) {
    const minutesAgo = Math.floor(Math.random() * 500);
    const timestamp = new Date(
      now.getTime() - minutesAgo * 60 * 1000
    ).toISOString();

    events.push({
      id: i + 1,
      timestamp,
      source_ip: `192.168.1.${Math.floor(Math.random() * 255) + 1}`,
      destination_ip: `10.0.0.${Math.floor(Math.random() * 255) + 1}`,
      event_type: [
        "login_failed",
        "port_scan",
        "file_access",
        "user_login",
        "file_upload",
      ][Math.floor(Math.random() * 5)],
      status: ["success", "fail"][Math.floor(Math.random() * 2)],
    });
  }
  return events;
};

export default function LogsTable({ initialSize = 200 }) {
  const [logs, setLogs] = useState([]);
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState({ key: "timestamp", dir: "desc" });
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);

  // Load logs initially + refresh every 10s
  useEffect(() => {
    const loadLogs = () => {
      const data = get_logs(initialSize);
      setLogs(data);
      setPage(1); // reset to first page on refresh
    };

    loadLogs(); // initial
    const interval = setInterval(loadLogs, 10000);

    return () => clearInterval(interval);
  }, [initialSize]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let result = logs;
    if (q) {
      result = logs.filter((r) =>
        [r.timestamp, r.source_ip, r.destination_ip, r.event_type, r.status]
          .join(" ")
          .toLowerCase()
          .includes(q)
      );
    }

    const sorted = [...result].sort((a, b) => {
      const { key, dir } = sortBy;
      let va = a[key];
      let vb = b[key];
      if (key === "timestamp") {
        va = new Date(va).getTime();
        vb = new Date(vb).getTime();
      }
      if (va < vb) return dir === "asc" ? -1 : 1;
      if (va > vb) return dir === "asc" ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [logs, query, sortBy]);

  const total = filtered.length;
  const pages = Math.max(1, Math.ceil(total / perPage));
  const start = (page - 1) * perPage;
  const pageRows = filtered.slice(start, start + perPage);

  function toggleSort(key) {
    setSortBy((s) => {
      if (s.key === key) return { key, dir: s.dir === "asc" ? "desc" : "asc" };
      return { key, dir: "asc" };
    });
  }

  return (
    <Card className="p-4 sm:w-[1100px]">
      <CardHeader>
        <CardTitle>Logs Table</CardTitle>
      </CardHeader>
      <CardContent className="sm:w-[1100px]">
        <div className="flex gap-2 mb-4 flex-wrap items-center">
          <Input
            placeholder="Search timestamp, ip, type, status..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            className="w-64"
          />

          <Select
            value={perPage.toString()}
            onValueChange={(value) => {
              setPerPage(Number(value));
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10 / page</SelectItem>
              <SelectItem value="20">20 / page</SelectItem>
              <SelectItem value="50">50 / page</SelectItem>
              <SelectItem value="100">100 / page</SelectItem>
            </SelectContent>
          </Select>

          <div className="ml-auto text-sm text-muted-foreground">
            Showing <strong>{start + 1}</strong> -{" "}
            <strong>{Math.min(start + perPage, total)}</strong> of{" "}
            <strong>{total}</strong>
          </div>
        </div>

        <div className="overflow-auto border rounded">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead
                  onClick={() => toggleSort("timestamp")}
                  className="cursor-pointer"
                >
                  Timestamp{" "}
                  {sortBy.key === "timestamp"
                    ? sortBy.dir === "asc"
                      ? "▲"
                      : "▼"
                    : ""}
                </TableHead>
                <TableHead
                  onClick={() => toggleSort("source_ip")}
                  className="cursor-pointer"
                >
                  Source IP{" "}
                  {sortBy.key === "source_ip"
                    ? sortBy.dir === "asc"
                      ? "▲"
                      : "▼"
                    : ""}
                </TableHead>
                <TableHead
                  onClick={() => toggleSort("destination_ip")}
                  className="cursor-pointer"
                >
                  Destination IP{" "}
                  {sortBy.key === "destination_ip"
                    ? sortBy.dir === "asc"
                      ? "▲"
                      : "▼"
                    : ""}
                </TableHead>
                <TableHead
                  onClick={() => toggleSort("event_type")}
                  className="cursor-pointer"
                >
                  Event Type{" "}
                  {sortBy.key === "event_type"
                    ? sortBy.dir === "asc"
                      ? "▲"
                      : "▼"
                    : ""}
                </TableHead>
                <TableHead
                  onClick={() => toggleSort("status")}
                  className="cursor-pointer"
                >
                  Status{" "}
                  {sortBy.key === "status"
                    ? sortBy.dir === "asc"
                      ? "▲"
                      : "▼"
                    : ""}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pageRows.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>
                    {new Date(r.timestamp).toLocaleString()}
                  </TableCell>
                  <TableCell>{r.source_ip}</TableCell>
                  <TableCell>{r.destination_ip}</TableCell>
                  <TableCell>{r.event_type}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        r.status === "success"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {r.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
              {pageRows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6">
                    No records
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center gap-2 mt-3">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Prev
          </Button>
          <div className="text-sm">
            Page <strong>{page}</strong> of <strong>{pages}</strong>
          </div>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= pages}
            onClick={() => setPage((p) => Math.min(pages, p + 1))}
          >
            Next
          </Button>
          <div className="ml-auto text-xs text-muted-foreground">
            Tip: click column headers to sort
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
