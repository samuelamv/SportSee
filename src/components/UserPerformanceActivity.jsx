// src/components/PerformanceChart.jsx
import React, { useEffect, useState } from "react";
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer,
} from "recharts";
import "../styles/UserPerformanceActivity.scss";
import { getUserPerformance } from "../services/apis.js"; // <-- service

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
  const [data, setData]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError(null);

    getUserPerformance()
      .then((perf) => {
        if (!alive) return;

        const kindMap = perf?.kind ?? {};
        const rows = Array.isArray(perf?.data) ? perf.data : [];

        const formatted = rows.map((it) => {
          const en =
            kindMap[it.kind] ??
            kindMap[String(it.kind)] ?? // selon que la clé soit "1" ou 1
            it.kind;
          const fr = FR_LABEL[en] ?? en;
          return { kind: fr, value: it.value };
        });

        const orderIndex = (k) => {
          const i = ORDER.indexOf(k);
          return i === -1 ? ORDER.length : i;
        };
        formatted.sort((a, b) => orderIndex(a.kind) - orderIndex(b.kind));

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

  if (loading) return <div className="perf-chart">Chargement…</div>;
  if (error)   return <div className="perf-chart" style={{ color: "crimson" }}>Erreur : {error}</div>;
  if (!data.length) return <div className="perf-chart">Aucune donnée</div>;

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
