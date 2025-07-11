import React, { useEffect, useState } from "react";
import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
  PolarAngleAxis
} from "recharts";

export default function Score() {
  const [score, setScore] = useState(null);
  const userId = parseInt(import.meta.env.VITE_USER);

  useEffect(() => {
    fetch("/user-main-data.json")
      .then((res) => res.json())
      .then((json) => {
        const user = json.find((u) => u.id === userId);
        if (user) {
          const value = user.todayScore ?? user.score ?? 0;
          setScore(value);
        }
      });
  }, [userId]);

  if (score === null) return <p>Chargement...</p>;

  const percentage = score * 100;

  // ⚠️ Le background est un deuxième RadialBar "vide"
  const data = [
    { name: "completed", value: percentage, fill: "#FF0000" },
    { name: "rest", value: 100 - percentage, fill: "#FBFBFB" }
  ];

  return (
    <div style={{
      background: "#FBFBFB",
      borderRadius: "5px",
      padding: "1rem",
      width: "100%",
      height: "100%",
      position: "relative"
    }}>
      <h3 style={{ fontSize: "16px", fontWeight: 500 }}>Score</h3>
      <ResponsiveContainer width="100%" height={200}>
        <RadialBarChart
          cx="50%" cy="50%"
          innerRadius="70%" outerRadius="80%"
          barSize={10}
          data={data}
          startAngle={90}
          endAngle={450}
        >
          <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
          <RadialBar
            dataKey="value"
            cornerRadius={10}
            background
            clockWise
          />
        </RadialBarChart>
      </ResponsiveContainer>

      <div style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        textAlign: "center"
      }}>
        <p style={{ fontSize: "26px", fontWeight: "bold" }}>
          {Math.round(percentage)}%
        </p>
        <p style={{ fontSize: "14px", color: "#74798C" }}>
          de votre<br />objectif
        </p>
      </div>
    </div>
  );
}
