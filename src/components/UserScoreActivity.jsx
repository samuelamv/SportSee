import React, { useEffect, useState } from "react";
import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
  PolarAngleAxis
} from "recharts";
import "../styles/UserScoreActivity.scss";

export default function Score() {
  const [score, setScore] = useState(null);
  const userId = parseInt(import.meta.env.VITE_USER, 10);

  useEffect(() => {
    fetch("/user-main-data.json")
      .then((res) => res.json())
      .then((json) => {
        const user = json.find((u) => u.id === userId);
        if (user) setScore(user.todayScore ?? user.score ?? 0);
      })
      .catch(console.error);
  }, [userId]);

  if (score === null) return <div className="score-card">Chargement...</div>;

  const percentage = Math.round(score * 100);
  const data = [{ value: percentage }];

  return (
    <div className="score-card">
      <h3 className="score-card__title">Score</h3>

      <div className="score-card__chart">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            data={data}
            cx="50%"
            cy="50%"
            startAngle={90}
            endAngle={450}
            innerRadius="68%"
            outerRadius="80%"
            barSize={12}
            margin={{ top: 12, right: 12, bottom: 12, left: 12 }}
          >
            <PolarAngleAxis
              type="number"
              dataKey="value"
              domain={[0, 100]}
              tick={false}
            />
            <RadialBar
              dataKey="value"
              fill="#FF0000"
              clockWise
              cornerRadius={12}
              minAngle={2}
              isAnimationActive={false}
            />
          </RadialBarChart>
        </ResponsiveContainer>

        <div className="score-card__label">
          <p className="score-card__percent">{percentage}%</p>
          <p className="score-card__text">de votre<br />objectif</p>
        </div>
      </div>
    </div>
  );
}
