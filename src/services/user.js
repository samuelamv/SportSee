// src/services/user.js
let _cachedUserId = null;
let _cachedIsProd = null;
let _cachedApiUrl = null;

function readEnv(key) {
  return (import.meta?.env?.[key] ?? '').toString().trim();
}

/** --------- USER ID --------- **/
function readUserFromEnv() {
  const raw = readEnv('VITE_USER');
  return raw || null;
}

export function getUserId(opts) {
  if (_cachedUserId !== null) return _cachedUserId;

  const id = readUserFromEnv();
  if (!id) {
    if (opts && opts.optional) {
      _cachedUserId = null;
      return null;
    }
    const msg =
      "[user.js] VITE_USER est introuvable. " +
      'Ajoutez VITE_USER="<votre_id>" dans votre fichier .env puis redémarrez Vite.';
    if (import.meta.env?.DEV) console.warn(msg);
    throw new Error(msg);
  }
  _cachedUserId = id;
  return id;
}

export function resetUserIdCache() {
  _cachedUserId = null;
}

/** --------- MODE / CONFIG --------- **/
export function isProd() {
  if (_cachedIsProd !== null) return _cachedIsProd;
  _cachedIsProd = readEnv('VITE_PROD').toLowerCase() === 'true';
  return _cachedIsProd;
}

export function getApiBaseUrl() {
  if (_cachedApiUrl !== null) return _cachedApiUrl;
  _cachedApiUrl = readEnv('VITE_API_URL') || 'http://localhost:3000';
  return _cachedApiUrl;
}

/** --------- HELPERS RÉSEAU --------- **/
export async function fetchJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} on ${url}`);
  return res.json();
}

/**
 * Import dynamique d’un JSON local (chemin relatif à ce fichier).
 * Exemple: await loadLocal('../data/userMainData.json')
 */
export async function loadLocal(jsonPath) {
  const mod = await import(/* @vite-ignore */ jsonPath);
  return mod.default;
}

/** Choisit la source en fonction de isProd() */
export async function choose(localFn, remoteFn) {
  return isProd() ? remoteFn() : localFn();
}
console.log("VITE_PROD =", import.meta.env.VITE_PROD, "isProd() =>", isProd());

