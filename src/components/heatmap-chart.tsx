"use client";

import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

// 🔹 Your log generator
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

export function HeatmapChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    // 🔹 Fetch fresh logs every 10s
    const fetchData = () => {
      const logs = get_logs(200);

      // Mark anomalies = failed login / port scan
      const anomalies = logs.filter(
        (log) =>
          log.event_type === "login_failed" || log.event_type === "port_scan"
      );

      // Group anomalies per hour
      const grouped = anomalies.reduce((acc, log) => {
        const hour = new Date(log.timestamp).getHours();
        acc[hour] = (acc[hour] || 0) + 1;
        return acc;
      }, {} as Record<number, number>);

      const chartData = Array.from({ length: 24 }, (_, hour) => ({
        hour: `${hour}:00`,
        count: grouped[hour] || 0,
      }));

      setData(chartData);
    };

    fetchData();
    const interval = setInterval(fetchData, 10000); // refresh every 10s
    return () => clearInterval(interval);
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Heatmap: Anomalies by Hour</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="hour" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#ef4444" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
