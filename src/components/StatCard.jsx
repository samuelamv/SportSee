// src/components/KeyDataCard.jsx
import React from "react";
import "../styles/StatCard.scss";
import { getUserId } from "../services/user.js";

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

  // 🧩 NE JETTE PAS D’ERREUR : on lit l’ID en optionnel
  const userIdStr = getUserId({ optional: true });
  const userId = userIdStr ? Number(userIdStr) : null;

  React.useEffect(() => {
    let on = true;
    setLoading(true);
    setError(null);

    // Si pas d'ID → on signale l'erreur et on arrête proprement
    if (!userId && userId !== 0) {
      if (on) {
        setError('VITE_USER est manquante ou invalide dans votre .env');
        setLoading(false);
      }
      return () => { on = false; };
    }

    fetch(jsonUrl)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data) => {
        if (!on) return;
        const found = Array.isArray(data) ? data.find((u) => u.id === userId) : null;
        setUser(found || null);
        setLoading(false);
      })
      .catch((e) => {
        if (!on) return;
        setError(e.message || String(e));
        setLoading(false);
      });

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
