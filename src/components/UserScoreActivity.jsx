// src/components/Score.jsx
import React, { useEffect, useState } from "react";
import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
  PolarAngleAxis,
} from "recharts";
import "../styles/UserScoreActivity.scss";
import { getUserMainData } from "../services/apis.js";

export default function Score() {
  const [pct, setPct]     = useState(null); // pourcentage 0..100
  const [error, setError] = useState(null);

  useEffect(() => {
    let alive = true;
    setError(null);
    setPct(null);

    getUserMainData()
      .then((user) => {
        if (!alive) return;
        const raw = user?.todayScore ?? user?.score ?? 0; // backend: todayScore (0..1) ou score
        // normalisation robuste -> 0..100
        let percent = typeof raw === "number"
          ? (raw <= 1 ? raw * 100 : raw)
          : 0;
        percent = Math.max(0, Math.min(100, Math.round(percent)));
        setPct(percent);
      })
      .catch((e) => {
        if (!alive) return;
        setError(e?.message || "Erreur de chargement des données.");
      });

    return () => { alive = false; };
  }, []);

  if (error) return (
    <div className="score-card">
      <h3 className="score-card__title">Score</h3>
      <div className="score-card__error">{error}</div>
    </div>
  );

  if (pct === null) return <div className="score-card">Chargement…</div>;

  const data = [{ value: pct }];

  return (
    <div className="score-card">
      <h3 className="score-card__title">Score</h3>

      {/* Wrapper carré pour forcer un vrai cercle */}
      <div className="score-card__square">
        {/* SVG Recharts en fond (z-index: 0) */}
        <div className="score-card__svg">
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart
              data={data}
              startAngle={90}
              endAngle={450}
              innerRadius="72%"
              outerRadius="84%"
              barSize={14}
            >
              <PolarAngleAxis
                type="number"
                dataKey="value"
                domain={[0, 100]}
                tick={false}
              />
              <RadialBar
                dataKey="value"
                clockWise
                cornerRadius={9999}
                fill="#FF0000"
                minAngle={1}
                isAnimationActive={false}
              />
            </RadialBarChart>
          </ResponsiveContainer>
        </div>

        {/* Disque blanc au centre */}
        <div className="score-card__center-bg" aria-hidden />

        {/* Texte centré */}
        <div className="score-card__label">
          <p className="score-card__percent">{pct}%</p>
          <p className="score-card__text">de votre<br/>objectif</p>
        </div>
      </div>
    </div>
  );
}
