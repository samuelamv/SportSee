// src/components/UserDailyActivity.jsx
import React, { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";
import "../styles/UserDailyActivity.scss";
import { getUserActivity } from "../services/apis.js"; // <-- le service

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
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError(null);

    getUserActivity()
      .then((d) => {
        if (!alive) return;
        // d ressemble à { userId, sessions: [...] } (local ET backend)
        setSessions(Array.isArray(d?.sessions) ? d.sessions : []);
        setLoading(false);
      })
      .catch((e) => {
        if (!alive) return;
        setError(e.message || String(e));
        setLoading(false);
      });

    return () => { alive = false; };
  }, []);

  if (loading) return <div className="user-daily-activity">Chargement…</div>;
  if (error)   return <div className="user-daily-activity" style={{color:"crimson"}}>Erreur : {error}</div>;
  if (!sessions.length) return <div className="user-daily-activity">Aucune session</div>;

  return (
    <div className="user-daily-activity">
      <div className="user-daily-activity__header">
        <h4>Activité quotidienne</h4>
        <div className="legend">
          <div className="legend-item legend-item--kg">
            <span className="dot"></span> <p className="legendp">Poids (kg)</p>
          </div>
          <div className="legend-item legend-item--kcal">
            <span className="dot"></span> <p className="legendp">Calories brûlées (kCal)</p>
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
            tickFormatter={(d) => {
              // backend: '2020-07-01' -> 1 ; local identique
              const date = new Date(d);
              return Number.isNaN(date) ? d : date.getDate();
            }}
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
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(196,196,196,0.5)" }} />
          <Bar yAxisId="kg"  dataKey="kilogram" fill="#282D30" radius={[10, 10, 0, 0]} barSize={7} />
          <Bar yAxisId="kcal" dataKey="calories" fill="#E60000" radius={[10, 10, 0, 0]} barSize={7} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
