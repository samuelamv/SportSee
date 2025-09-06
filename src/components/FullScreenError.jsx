// src/components/FullScreenError.jsx
import React from "react";
import "../styles/FullScreenError.scss";

/** Déduit un libellé court de "type d'erreur" à partir d'un objet/texte d'erreur. */
function getErrorType(error) {
  const raw = error?.message || String(error || "");
  const msg = raw.toLowerCase();

  // timeouts (AbortController ou messages explicites)
  if (error?.name === "AbortError" || msg.includes("timeout")) return "Timeout";

  // pannes réseau (Chrome: "Failed to fetch", Firefox: "NetworkError", Safari varie)
  if (msg.includes("failed to fetch") || msg.includes("networkerror") || msg.includes("network error"))
    return "Réseau indisponible";

  // CORS bloqué par le navigateur
  if (msg.includes("cors")) return "CORS bloqué";

  // erreurs HTTP propagées par fetchJSON (ex: "HTTP 404 sur ...")
  const http = msg.match(/http\s+(\d{3})/i);
  if (http) return `HTTP ${http[1]}`;

  // JSON mal formé, mauvais content-type, etc.
  if (msg.includes("json")) return "Réponse invalide";

  return "Erreur";
}

export default function FullScreenError({ message = "Une erreur est survenue." }) {
  const type = getErrorType(message); // transforme "Failed to fetch" en "Réseau indisponible", etc.
  return (
    <div className="fs-error" role="alert" aria-live="assertive">
      <div className="fs-error__box">
        <p className="fs-error__title">Erreur</p>
        <p className="fs-error__msg">{type}</p>
      </div>
    </div>
  );
}
