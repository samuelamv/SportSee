// src/components/KeyDataCard.jsx
import React from "react";
import "../styles/StatCard.scss";

export default function KeyDataCard({
  dataKey,            // "calorieCount" | "proteinCount" | "carbohydrateCount" | "lipidCount"
  label,              // "Calories", "Protéines", ...
  unit = "",          // "kCal" | "g"
  icon,               // <img .../> ou <span>🔥</span>
  iconBg = "#fdecec", // fond carré derrière l’icône (rose pâle par défaut)
  jsonUrl = "/user-main-data.json",
}) {
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const userId = parseInt(import.meta.env.VITE_USER, 10);

  React.useEffect(() => {
    let on = true;
    setLoading(true);
    fetch(jsonUrl)
      .then((r) => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
      .then((data) => {
        if (!on) return;
        const found = Array.isArray(data) ? data.find((u) => u.id === userId) : null;
        setUser(found || null);
        setLoading(false);
      })
      .catch((e) => { if (!on) return; setError(e.message || String(e)); setLoading(false); });
    return () => { on = false; };
  }, [jsonUrl, userId]);

  if (loading) return <div className="kdc kdc--skeleton">Chargement…</div>;
  if (error)   return <div className="kdc kdc--error">Erreur: {error}</div>;
  if (!user)   return <div className="kdc kdc--warn">Utilisateur introuvable</div>;

  const rawValue = user?.keyData?.[dataKey];
  if (typeof rawValue !== "number") {
    return <div className="kdc kdc--warn">Donnée manquante: {dataKey}</div>;
  }

  const formatted = new Intl.NumberFormat("fr-FR").format(rawValue);

  return (
    <div className="kdc">
      <div className="kdc__icon" style={{ backgroundColor: iconBg }}>
        {icon}
      </div>
      <div className="kdc__content">
        <div className="kdc__value">{formatted}{unit}</div>
        <div className="kdc__label">{label}</div>
      </div>
    </div>
  );
}
