// src/components/PerformanceChart.jsx
import React, { useEffect, useState } from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer
} from "recharts";

export default function PerformanceChart() {
  const [data, setData] = useState([]);
  const userId = import.meta.env.VITE_USER;

  useEffect(() => {
    fetch("/user-performance.json")
      .then((res) => res.json())
      .then((json) => {
        const userData = json.find((u) => u.userId === parseInt(userId));
        if (userData) {
          // Map kind number to label
          const kindMap = userData.kind;
          const formattedData = userData.data.map((item) => ({
            value: item.value,
            kind: kindMap[item.kind].toUpperCase(),
          }));
          setData(formattedData);
        }
      });
  }, [userId]);

  return (
    <div style={{ background: "#282D30", borderRadius: "5px", padding: "1rem", color: "white" }}>
      <ResponsiveContainer width="100%" height={250}>
        <RadarChart cx="50%" cy="50%" outerRadius="65%" data={data}>
          <PolarGrid radialLines={false} />
          <PolarAngleAxis
            dataKey="kind"
            tick={{ fill: "white", fontSize: 12 }}
          />
          <Radar
            dataKey="value"
            stroke="#FF0101"
            fill="#FF0101"
            fillOpacity={0.7}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
