import React, { useEffect, useState } from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
} from "recharts";
import "../styles/UserPerformanceActivity.scss";
import { getUserId } from "../services/user.js";

const ORDER = ["Intensité", "Vitesse", "Force", "Endurance", "Energie", "Cardio"];
const FR_LABEL = {
  cardio: "Cardio",
  energy: "Energie",
  endurance: "Endurance",
  strength: "Force",
  speed: "Vitesse",
  intensity: "Intensité",
};

export default function PerformanceChart() {
  const [data, setData] = useState([]);
  const userId = Number(getUserId());

  useEffect(() => {
    fetch("/user-performance.json")
      .then((res) => res.json())
      .then((json) => {
        const userData = json.find((u) => u.userId === userId);
        if (!userData) return;

        const kindMap = userData.kind;
        const formatted = userData.data.map((it) => {
          const en = kindMap[it.kind];
          const fr = FR_LABEL[en] ?? en;
          return { kind: fr, value: it.value };
        });

        formatted.sort((a, b) => ORDER.indexOf(a.kind) - ORDER.indexOf(b.kind));
        setData(formatted);
      })
      .catch(console.error);
  }, [userId]);

  return (
    <div className="perf-chart">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="65%" data={data}>
          <PolarGrid radialLines={false} stroke="#FFFFFF" strokeOpacity={0.3} />
          <PolarAngleAxis
            dataKey="kind"
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 12 }}
            stroke="#FFFFFF"
          />
          <Radar
            name="performance"
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
