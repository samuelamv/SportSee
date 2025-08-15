import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import "../styles/UserSessionActivity.scss";

// Jours FR
const dayLabels = ["L", "M", "M", "J", "V", "S", "D"];

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="avg-sessions__tooltip">
      {payload[0].value} min
    </div>
  );
}

/** Overlay sombre à droite du curseur (comme l’image) */
function CustomCursor({ points, width, height }) {
  if (!points?.length) return null;
  const x = points[0].x;
  return (
    <rect
      x={x}
      y={0}
      width={Math.max(0, width - x)}
      height={height}
      className="avg-sessions__cursor"
    />
  );
}

export default function AverageSessionChart() {
  const [data, setData] = useState([]);
  const userId = parseInt(import.meta.env.VITE_USER, 10);

  useEffect(() => {
    fetch("/user-average-sessions.json")
      .then((res) => res.json())
      .then((json) => {
        const userData = json.find((u) => u.userId === userId);
        if (!userData) return;
        const formatted = userData.sessions.map((s, i) => ({
          ...s,
          day: dayLabels[i]
        }));
        setData(formatted);
      })
      .catch(console.error);
  }, [userId]);

  return (
    <div className="avg-sessions">
      <h3 className="avg-sessions__title">Durée moyenne des sessions</h3>

      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data} margin={{ top: 20, right: 15, left: 15, bottom: 10 }}>
          <XAxis
            dataKey="day"
            tickLine={false}
            axisLine={false}
            tickMargin={10}
            // style des ticks via CSS (stroke)
          />
          <YAxis
            hide
            domain={["dataMin - 10", "dataMax + 10"]} // un peu d'air au-dessus/dessous
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={<CustomCursor />}
            wrapperStyle={{ outline: "none" }}
          />
          <Line
            type="monotone"
            dataKey="sessionLength"
            stroke="#FFFFFF"
            strokeWidth={2}
            dot={false}
            activeDot={{
              r: 4,
              fill: "#FFFFFF",
              stroke: "rgba(255,255,255,0.4)",
              strokeWidth: 8, // halo
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
