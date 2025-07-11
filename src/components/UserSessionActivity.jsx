import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

// Jours en français
const dayLabels = ["L", "M", "M", "J", "V", "S", "D"];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload?.length) {
    return (
      <div style={{ background: "white", padding: "5px 10px", fontSize: 12 }}>
        {payload[0].value} min
      </div>
    );
  }
  return null;
};

export default function AverageSessionChart() {
  const [data, setData] = useState([]);
  const userId = import.meta.env.VITE_USER;

  useEffect(() => {
    fetch("/user-average-sessions.json")
      .then((res) => res.json())
      .then((json) => {
        const userData = json.find((u) => u.userId === parseInt(userId));
        if (userData) {
          const formatted = userData.sessions.map((s, index) => ({
            ...s,
            day: dayLabels[index]
          }));
          setData(formatted);
        }
      });
  }, [userId]);

  return (
    <div style={{ background: "#ff0000", borderRadius: "5px", padding: "1rem", color: "white" }}>
      <h3 style={{ fontSize: 14, opacity: 0.6 }}>Durée moyenne des sessions</h3>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data}>
          <XAxis dataKey="day" stroke="white" opacity={0.6} />
          <YAxis hide />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="sessionLength"
            stroke="white"
            strokeWidth={2}
            dot={false}
            activeDot={{
              stroke: "white",
              strokeWidth: 2,
              r: 4,
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
