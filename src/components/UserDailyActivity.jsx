import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import "../styles/UserDailyActivity.scss";

function CustomTooltip({ active, payload }) {
  if (!active || !payload) return null;
  const kg = payload.find((p) => p.dataKey === "kilogram")?.value;
  const kcal = payload.find((p) => p.dataKey === "calories")?.value;

  return (
    <div className="custom-tooltip">
      <span>{kg}kg</span>
      <span>{kcal}Kcal</span>
    </div>
  );
}

export default function UserDailyActivity() {
  const [sessions, setSessions] = useState([]);
  const userId = parseInt(import.meta.env.VITE_USER, 10);

  useEffect(() => {
    fetch("/user-activity.json")
      .then((res) => res.json())
      .then((json) => {
        const user = json.find((u) => u.userId === userId);
        if (user) setSessions(user.sessions || []);
      })
      .catch((err) => console.error("Erreur:", err));
  }, [userId]);

  return (
    <div className="user-daily-activity">
      <div className="user-daily-activity__header">
        <h4>Activité quotidienne</h4>
        <div className="legend">
          <div className="legend-item legend-item--kg">
            <span className="dot"></span> Poids (kg)
          </div>
          <div className="legend-item legend-item--kcal">
            <span className="dot"></span> Calories brûlées (kCal)
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height="85%">
        <BarChart
          data={sessions}
          margin={{ top: 0, right: 20, left: 20, bottom: 10 }}
          barCategoryGap="40%"
          barGap={8}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />

          <XAxis
            dataKey="day"
            tickFormatter={(d) => new Date(d).getDate()}
            tickLine={false}
            axisLine={false}
            tickMargin={10}
          />

          <YAxis
            yAxisId="kg"
            dataKey="kilogram"
            orientation="right"
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
            domain={["dataMin - 1", "dataMax + 1"]}
          />

          <YAxis
            yAxisId="kcal"
            dataKey="calories"
            hide
            domain={["dataMin - 20", "dataMax + 20"]}
          />

          <Tooltip
            content={<CustomTooltip />}
            cursor={{ fill: "rgba(196,196,196,0.5)" }}
          />

          <Bar
            yAxisId="kg"
            dataKey="kilogram"
            fill="#282D30"
            radius={[10, 10, 0, 0]}
            barSize={7}
          />
          <Bar
            yAxisId="kcal"
            dataKey="calories"
            fill="#E60000"
            radius={[10, 10, 0, 0]}
            barSize={7}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
