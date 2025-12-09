// frontend/src/services/api.js

// In development: falls back to localhost
// In production: uses VITE_API_URL from Vercel env
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:4000/api";

export async function getSales(params = {}) {
  const url = new URL(`${API_BASE_URL}/sales`);

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
