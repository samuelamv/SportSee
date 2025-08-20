import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import "../styles/UserSessionActivity.scss";
import { getUserId } from "../services/user.js";

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
  const userId = Number(getUserId());

  useEffect(() => {
    fetch("/user-average-sessions.json")
      .then((res) => res.json())
      .then((json) => {
        const userData = json.find((u) => u.userId === userId);
        if (!userData) return;
        const formatted = userData.sessions.map((s, i) => ({ ...s, day: dayLabels[i] }));
        setData(formatted);
      })
      .catch(console.error);
  }, [userId]);

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
