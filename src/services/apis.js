// src/services/api.js
import { getUserId, choose, fetchJSON, getApiBaseUrl } from "./user";

const BASE_URL = getApiBaseUrl();

// petit helper pour charger un JSON depuis /public
async function loadLocal(filename) {
  const res = await fetch(`/${filename}`);
  if (!res.ok) throw new Error(`Erreur fetch local ${filename}`);
  return res.json();
}

export async function getUserMainData() {
  const id = getUserId();
  return choose(
    async () => {
      console.log(">>> MODE LOCAL getUserMainData");
      const data = await loadLocal("user-main-data.json"); // doit correspondre au nom exact dans public/
      return Array.isArray(data)
        ? data.find((u) => String(u.id) === String(id))
        : data[id] ?? data;
    },
    async () => {
      console.log(">>> MODE BACKEND getUserMainData");
      const res = await fetchJSON(`${BASE_URL}/user/${id}`);
      return res.data ?? res;
    }
  );
}

export async function getUserActivity() {
  const id = getUserId();
  return choose(
    async () => {
      const data = await loadLocal("user-activity.json");
      return Array.isArray(data)
        ? data.find((u) => String(u.userId ?? u.id) === String(id))
        : data[id] ?? data;
    },
    async () => fetchJSON(`${BASE_URL}/user/${id}/activity`).then((d) => d.data ?? d)
  );
}

export async function getUserAverageSessions() {
  const id = getUserId();
  return choose(
    async () => {
      const data = await loadLocal("user-average-sessions.json");
      return Array.isArray(data)
        ? data.find((u) => String(u.userId ?? u.id) === String(id))
        : data[id] ?? data;
    },
    async () => fetchJSON(`${BASE_URL}/user/${id}/average-sessions`).then((d) => d.data ?? d)
  );
}

export async function getUserPerformance() {
  const id = getUserId();
  return choose(
    async () => {
      const data = await loadLocal("user-performance.json");
      return Array.isArray(data)
        ? data.find((u) => String(u.userId ?? u.id) === String(id))
        : data[id] ?? data;
    },
    async () => fetchJSON(`${BASE_URL}/user/${id}/performance`).then((d) => d.data ?? d)
  );
}

export async function getAllUserData() {
  const [main, activity, avg, perf] = await Promise.all([
    getUserMainData(),
    getUserActivity(),
    getUserAverageSessions(),
    getUserPerformance(),
  ]);
  return { main, activity, avg, perf };
}
