// src/services/api.js
import { getUserId, choose, fetchJSON, getApiBaseUrl } from "./user";

import UserModel from "../models/UserModel.js";

const BASE_URL = getApiBaseUrl();

async function loadLocal(filename) {
  const res = await fetch(`/${filename}`);
  if (!res.ok) throw new Error(`Erreur fetch local ${filename}`);
  return res.json();
}

export async function getUserMainData() {
  const id = getUserId();
  const raw = await choose(
    async () => {
      const data = await loadLocal("user-main-data.json");
      return Array.isArray(data)
        ? data.find((u) => String(u.id) === String(id))
        : data[id] ?? data;
    },
    async () => {
      const res = await fetchJSON(`${BASE_URL}/user/${id}`);
      return res.data ?? res;
    }
  );
  return UserModel.main(raw);
}

export async function getUserActivity() {
  const id = getUserId();
  const raw = await choose(
    async () => {
      const data = await loadLocal("user-activity.json");
      return Array.isArray(data)
        ? data.find((u) => String(u.userId ?? u.id) === String(id))
        : data[id] ?? data;
    },
    async () => {
      const res = await fetchJSON(`${BASE_URL}/user/${id}/activity`);
      return res.data ?? res;
    }
  );
  return UserModel.activity(raw);
}

export async function getUserAverageSessions() {
  const id = getUserId();
  const raw = await choose(
    async () => {
      const data = await loadLocal("user-average-sessions.json");
      return Array.isArray(data)
        ? data.find((u) => String(u.userId ?? u.id) === String(id))
        : data[id] ?? data;
    },
    async () => {
      const res = await fetchJSON(`${BASE_URL}/user/${id}/average-sessions`);
      return res.data ?? res;
    }
  );
  return UserModel.averageSessions(raw);
}

export async function getUserPerformance() {
  const id = getUserId();
  const raw = await choose(
    async () => {
      const data = await loadLocal("user-performance.json");
      return Array.isArray(data)
        ? data.find((u) => String(u.userId ?? u.id) === String(id))
        : data[id] ?? data;
    },
    async () => {
      const res = await fetchJSON(`${BASE_URL}/user/${id}/performance`);
      return res.data ?? res;
    }
  );
  return UserModel.performance(raw);
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
