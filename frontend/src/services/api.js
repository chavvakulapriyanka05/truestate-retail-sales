// frontend/src/services/api.js

// In development: falls back to localhost
// In production: uses VITE_API_BASE_URL from Vercel env
// src/services/api.js

// Ensure trailing slash is removed and fallback is correct
const envBase = import.meta.env.VITE_API_BASE_URL;
export const BASE_URL = (envBase && envBase !== "undefined")
  ? envBase
  : "https://truestate-retail-sales-1-lg1e.onrender.com/api";




export async function getSales(params = {}) {
  // Base URL + path, no hard-coded ?query here
  const url = new URL(`${API_BASE_URL}/sales`);


  // Attach query params
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "") continue;

    if (Array.isArray(value)) {
      if (!value.length) continue;
      url.searchParams.set(key, value.join(","));
    } else {
      url.searchParams.set(key, String(value));
    }
  }

  const res = await fetch(url.toString());

  if (!res.ok) {
    throw new Error(`Failed to load data (${res.status})`);
  }

  return res.json(); // { meta, data }
}
