// src/components/Score.jsx
import React, { useEffect, useState } from "react";
import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
  PolarAngleAxis,
} from "recharts";
import "../styles/UserScoreActivity.scss";
import { getUserId } from "../services/user.js";

export default function Score() {
  const [score, setScore] = useState(null);
  const [error, setError] = useState(null);

  let userId = null;
  try {
    userId = Number(getUserId());
  } catch (e) {
    userId = null;
    if (!error) setError(e.message);
  }

  useEffect(() => {
    if (!userId) return;
    let mounted = true;

    fetch("/user-main-data.json")
      .then((r) => r.json())
      .then((json) => {
        if (!mounted) return;
        const user = json.find((u) => u.id === userId);
        if (user) setScore(user.todayScore ?? user.score ?? 0);
        else setError(`Utilisateur #${userId} introuvable.`);
      })
      .catch((err) => {
        if (!mounted) return;
        setError(err?.message || "Erreur de chargement des données.");
      });

    return () => { mounted = false; };
  }, [userId]);

  if (error) {
    return (
      <div className="score-card">
        <h3 className="score-card__title">Score</h3>
        <div className="score-card__error">{error}</div>
      </div>
    );
  }

  if (score === null) return <div className="score-card">Chargement…</div>;

  const pct = Math.round(score * 100);
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
              startAngle={90}     // départ en haut
              endAngle={450}      // sens horaire
              innerRadius="72%"   // épaisseur de l'anneau
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
                fill="#FF0000"     // arc rouge
                minAngle={1}
                isAnimationActive={false}
              />
            </RadialBarChart>
          </ResponsiveContainer>
        </div>

        {/* Disque blanc au centre (z-index: 1) */}
        <div className="score-card__center-bg" aria-hidden />

        {/* Texte centré (z-index: 2) */}
        <div className="score-card__label">
          <p className="score-card__percent">{pct}%</p>
          <p className="score-card__text">de votre<br/>objectif</p>
        </div>
      </div>
    </div>
  );
}
