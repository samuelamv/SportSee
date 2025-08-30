// src/components/AverageSessionChart.jsx
import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import "../styles/UserSessionActivity.scss";
import { getUserAverageSessions } from "../services/apis.js";

const dayLabels = ["L", "M", "M", "J", "V", "S", "D"];

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  return <div className="avg-sessions__tooltip">{payload[0].value} min</div>;
}

function CustomCursor({ points, width, height }) {
  if (!points?.length) return null;
  const x = points[0].x;
  return <rect x={x} y={0} width={Math.max(0, width - x)} height={height} className="avg-sessions__cursor" />;
}

export default function AverageSessionChart() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError(null);

    getUserAverageSessions()
      .then((res) => {
        if (!alive) return;
        const rows = Array.isArray(res?.sessions) ? res.sessions : [];

        // mappe le jour: si 1..7 -> L..D ; sinon utilise l’index
        const formatted = rows.map((s, idx) => {
          const i = typeof s.day === "number" && s.day >= 1 && s.day <= 7 ? s.day - 1 : idx % 7;
          return { ...s, day: dayLabels[i] };
        });

        setData(formatted);
        setLoading(false);
      })
      .catch((e) => {
        if (!alive) return;
        setError(e.message || String(e));
        setLoading(false);
      });

    return () => { alive = false; };
  }, []);

  if (loading) return <div className="avg-sessions">Chargement…</div>;
  if (error)   return <div className="avg-sessions" style={{color:"crimson"}}>Erreur : {error}</div>;
  if (!data.length) return <div className="avg-sessions">Aucune donnée</div>;

  return (
    <div className="avg-sessions">
      <h3 className="avg-sessions__title">Durée moyenne des sessions</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 40, right: 20, bottom: 20, left: 20 }}>
          <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={10} />
          <YAxis hide domain={["dataMin - 10", "dataMax + 10"]} />
          <Tooltip content={<CustomTooltip />} cursor={<CustomCursor />} wrapperStyle={{ outline: "none" }} />
          <Line
            type="monotone"
            dataKey="sessionLength"
            stroke="#FFFFFF"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: "#FFFFFF", stroke: "rgba(255,255,255,0.4)", strokeWidth: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
