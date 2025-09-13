import React, { useEffect, useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
} from "recharts";

type LogEvent = {
  timestamp: string;
  source_ip: string;
  destination_ip: string;
  event_type: string;
  status: string;
  anomaly?: boolean;
};

const eventTypes = [
  "login_failed",
  "port_scan",
  "file_access",
  "user_login",
  "file_upload",
];

function generateLogs(size = 200): LogEvent[] {
  const events: LogEvent[] = [];
  const now = new Date();
  for (let i = 0; i < size; i++) {
    const time = new Date(
      now.getTime() - Math.floor(Math.random() * 500) * 60000
    );
    events.push({
      timestamp: time.toISOString(),
      source_ip: `192.168.1.${Math.floor(Math.random() * 255) + 1}`,
      destination_ip: `10.0.0.${Math.floor(Math.random() * 255) + 1}`,
      event_type: eventTypes[Math.floor(Math.random() * eventTypes.length)],
      status: Math.random() > 0.5 ? "success" : "fail",
      anomaly: false,
    });
  }

  // Inject anomalies
  for (let i = 0; i < 20; i++) {
    events.push({
      timestamp: new Date(
        now.getTime() - Math.floor(Math.random() * 5) * 60000
      ).toISOString(),
      source_ip: "45.83.23.9",
      destination_ip: "10.0.0.5",
      event_type: "brute_force",
      status: "fail",
      anomaly: true,
    });
  }

  return events;
}

export default function SIEMDashboard() {
  const [logs, setLogs] = useState<LogEvent[]>([]);
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    const fetchLogs = () => setLogs(generateLogs());
    fetchLogs();
    const interval = setInterval(fetchLogs, 10000); // refresh every 10s
    return () => clearInterval(interval);
  }, []);

  const anomalies = logs.filter((log) => log.anomaly);
  const totalLogs = logs.length;
  const totalAnomalies = anomalies.length;
  const anomalyPercent = ((totalAnomalies / totalLogs) * 100).toFixed(2);

  const filteredAnomalies = anomalies.filter(
    (log) =>
      (filterType === "all" || log.event_type === filterType) &&
      (filterStatus === "all" || log.status === filterStatus)
  );

  // Chart data: logs over time
  const logVolumeData = logs.reduce<Record<string, number>>((acc, log) => {
    const minute = new Date(log.timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    acc[minute] = (acc[minute] || 0) + 1;
    return acc;
  }, {});

  const chartData = Object.entries(logVolumeData).map(([minute, count]) => ({
    minute,
    count,
  }));

  // Event distribution
  const eventDistData = eventTypes.map((type) => ({
    type,
    count: logs.filter((l) => l.event_type === type).length,
  }));

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 space-y-8">
      {/* Header */}
      <header className="bg-black text-red-500 text-center text-2xl font-bold py-4 rounded-xl shadow-md">
        🚨 Team Matrix Pvt Ltd - AI SIEM Dashboard
      </header>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Logs</CardTitle>
          </CardHeader>
          <CardContent className="text-center text-2xl font-bold">
            {totalLogs}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Anomalies</CardTitle>
          </CardHeader>
          <CardContent className="text-center text-2xl font-bold text-red-500">
            {totalAnomalies}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Anomaly %</CardTitle>
          </CardHeader>
          <CardContent className="text-center text-2xl font-bold text-orange-400">
            {anomalyPercent}%
          </CardContent>
        </Card>
      </div>

      {/* Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle>📋 Recent Logs</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>Source IP</TableHead>
                <TableHead>Destination IP</TableHead>
                <TableHead>Event</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.slice(0, 15).map((log, idx) => (
                <TableRow key={idx} className={log.anomaly ? "bg-red-950" : ""}>
                  <TableCell>
                    {new Date(log.timestamp).toLocaleString()}
                  </TableCell>
                  <TableCell>{log.source_ip}</TableCell>
                  <TableCell>{log.destination_ip}</TableCell>
                  <TableCell>{log.event_type}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        log.status === "success" ? "default" : "destructive"
                      }
                    >
                      {log.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>📈 Log Volume Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <XAxis dataKey="minute" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#22c55e"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>📊 Event Types Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={eventDistData}>
                <XAxis dataKey="type" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#38bdf8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Anomalies Table with Filters */}
      <Card>
        <CardHeader>
          <CardTitle>⚠️ Detected Anomalies</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <Select onValueChange={setFilterType}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by Event Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {eventTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
                <SelectItem value="brute_force">brute_force</SelectItem>
              </SelectContent>
            </Select>

            <Select onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="success">Success</SelectItem>
                <SelectItem value="fail">Fail</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>Source IP</TableHead>
                <TableHead>Destination IP</TableHead>
                <TableHead>Event</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAnomalies.map((log, idx) => (
                <TableRow key={idx} className="bg-red-900">
                  <TableCell>
                    {new Date(log.timestamp).toLocaleString()}
                  </TableCell>
                  <TableCell>{log.source_ip}</TableCell>
                  <TableCell>{log.destination_ip}</TableCell>
                  <TableCell>{log.event_type}</TableCell>
                  <TableCell>
                    <Badge variant="destructive">{log.status}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredAnomalies.length === 0 && (
            <p className="text-green-400 mt-2">✅ No anomalies detected</p>
          )}
        </CardContent>
      </Card>

      {/* Footer */}
      <footer className="bg-black text-red-500 text-center text-sm py-3 rounded-xl">
        ©️ 2025 Team Matrix Pvt Ltd | Powered by AI-SIEM Dashboard
      </footer>
    </div>
  );
}
