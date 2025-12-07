import { useEffect, useState } from "react";
import { fetchSales } from "../services/api.js";

export default function useSalesQuery({ search, filters, sorting, page }) {
  const [state, setState] = useState({
    data: [],
    meta: { page: 1, pageSize: 10, totalItems: 0, totalPages: 1 },
    loading: false,
    error: null
  });

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setState(prev => ({ ...prev, loading: true, error: null }));
      try {
        const res = await fetchSales({ search, filters, sorting, page });
        if (cancelled) return;

        setState({
          data: res.data,
          meta: res.meta,
          loading: false,
          error: null
        });
      } catch (err) {
        if (cancelled) return;
        setState(prev => ({
          ...prev,
          loading: false,
          error: err.message || "Failed to fetch"
        }));
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [search, JSON.stringify(filters), JSON.stringify(sorting), page]);

  return state;
}
