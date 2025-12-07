import axios from "axios";

const BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:4000/api";

export async function fetchSales({ search, filters, sorting, page }) {
  const params = new URLSearchParams();

  if (search) params.set("search", search);
  if (filters.regions.length) params.set("regions", filters.regions.join(","));
  if (filters.genders.length) params.set("genders", filters.genders.join(","));
  if (filters.ageMin) params.set("ageMin", filters.ageMin);
  if (filters.ageMax) params.set("ageMax", filters.ageMax);
  if (filters.productCategories.length)
    params.set("productCategories", filters.productCategories.join(","));
  if (filters.tags.length) params.set("tags", filters.tags.join(","));
  if (filters.paymentMethods.length)
    params.set("paymentMethods", filters.paymentMethods.join(","));
  if (filters.dateStart) params.set("dateStart", filters.dateStart);
  if (filters.dateEnd) params.set("dateEnd", filters.dateEnd);

  if (sorting.sortBy) params.set("sortBy", sorting.sortBy);
  if (sorting.sortOrder) params.set("sortOrder", sorting.sortOrder);

  params.set("page", page);
  params.set("pageSize", 10);

  const url = `${BASE_URL}/sales?${params.toString()}`;

  const res = await axios.get(url);
  return res.data;
}
