// Service pour centraliser la récupération de l'ID utilisateur
// depuis la variable d'environnement VITE_USER

let _cachedUserId = null;

function readFromEnv() {
  const raw = import.meta?.env?.VITE_USER;
  return (raw && String(raw).trim()) || null;
}

/**
 * Retourne l'ID utilisateur défini dans le .env
 * - Mémoïsé pour éviter de relire import.meta.env à chaque fois
 * - Lève une erreur si manquant (sauf si option { optional: true })
 */
export function getUserId(opts) {
  if (_cachedUserId !== null) return _cachedUserId;

  const id = readFromEnv();
  if (!id) {
    if (opts && opts.optional) {
      _cachedUserId = null;
      return null;
    }
    const msg =
      "[user.js] VITE_USER est introuvable. " +
      'Ajoutez VITE_USER="<votre_id>" dans votre fichier .env puis redémarrez Vite.';
    if (import.meta.env?.DEV) {
      console.warn(msg);
    }
    throw new Error(msg);
  }

  _cachedUserId = id;
  return id;
}

/** Permet de vider le cache (utile pour les tests) */
export function resetUserIdCache() {
  _cachedUserId = null;
}
