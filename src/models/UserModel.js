// src/models/UserModel.js

const DAY_FR = ["L", "M", "M", "J", "V", "S", "D"];
const FR_LABEL = {
  cardio: "Cardio",
  energy: "Energie",
  endurance: "Endurance",
  strength: "Force",
  speed: "Vitesse",
  intensity: "Intensité",
};
const ORDER = ["Intensité", "Vitesse", "Force", "Endurance", "Energie", "Cardio"];

export default class UserModel {
  // Données principales utilisateur
  static main(raw = {}) {
    const base = typeof raw.todayScore === "number"
      ? raw.todayScore
      : (typeof raw.score === "number" ? raw.score : 0);

    const pct = base <= 1 ? base * 100 : base;
    const scorePercent = Math.max(0, Math.min(100, Math.round(pct)));

    return {
      // on garde les champs utiles et on ajoute un champ normalisé prêt à l’emploi
      id: raw.id ?? raw.userId ?? null,
      userInfos: raw.userInfos ?? {},
      keyData: raw.keyData ?? {},
      scorePercent,
      // on garde le reste si besoin ailleurs (optionnel)
      ...raw,
    };
  }

  // Activité quotidienne (bar chart)
  static activity(raw = {}) {
    const sessions = Array.isArray(raw.sessions) ? raw.sessions : [];
    return {
      userId: raw.userId ?? raw.id ?? null,
      sessions,
    };
  }

  // Sessions moyennes (line chart) — map 1..7 -> L..D
  static averageSessions(raw = {}) {
    const rows = Array.isArray(raw.sessions) ? raw.sessions : [];
    const sessions = rows.map((s, idx) => {
      const i = (typeof s.day === "number" && s.day >= 1 && s.day <= 7) ? s.day - 1 : idx % 7;
      return { day: DAY_FR[i], sessionLength: s.sessionLength };
    });
    return {
      userId: raw.userId ?? raw.id ?? null,
      sessions,
    };
  }

  // Performance (radar) — EN -> FR + tri
  static performance(raw = {}) {
    const kindMap = raw.kind ?? {};
    const rows = Array.isArray(raw.data) ? raw.data : [];

    const formatted = rows.map((it) => {
      const en = kindMap[it.kind] ?? kindMap[String(it.kind)] ?? it.kind;
      const fr = FR_LABEL[en] ?? en;
      return { kind: fr, value: it.value };
    });

    const orderIndex = (k) => {
      const i = ORDER.indexOf(k);
      return i === -1 ? ORDER.length : i;
    };
    formatted.sort((a, b) => orderIndex(a.kind) - orderIndex(b.kind));

    return { data: formatted };
  }
}
