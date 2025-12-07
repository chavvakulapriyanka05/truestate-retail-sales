import {
  textSearch,
  inMultiSelect,
  tagsMatch,
  inNumericRange,
  inDateRange,
  sortRecords
} from "../utils/filterUtils.js";

let salesData = [];

export function setSalesData(data) {
  salesData = data;
}

export function querySales({
  search,
  regions,
  genders,
  ageMin,
  ageMax,
  productCategories,
  tags,
  paymentMethods,
  dateStart,
  dateEnd,
  sortBy,
  sortOrder,
  page = 1,
  pageSize = 10
}) {
  let minAge = ageMin != null && ageMin !== "" ? Number(ageMin) : null;
  let maxAge = ageMax != null && ageMax !== "" ? Number(ageMax) : null;

  if (minAge != null && maxAge != null && minAge > maxAge) {
    const tmp = minAge;
    minAge = maxAge;
    maxAge = tmp;
  }

  const regionsArr = normalizeArray(regions);
  const gendersArr = normalizeArray(genders);
  const productCategoriesArr = normalizeArray(productCategories);
  const tagsArr = normalizeArray(tags);
  const paymentMethodsArr = normalizeArray(paymentMethods);

  const filtered = salesData.filter(record => {
    if (!textSearch(record, search)) return false;
    if (!inMultiSelect(record.customerRegion, regionsArr)) return false;
    if (!inMultiSelect(record.gender, gendersArr)) return false;
    if (!inNumericRange(record.age, minAge, maxAge)) return false;
    if (!inMultiSelect(record.productCategory, productCategoriesArr)) return false;
    if (!tagsMatch(record.tags, tagsArr)) return false;
    if (!inMultiSelect(record.paymentMethod, paymentMethodsArr)) return false;
    if (!inDateRange(record.date, dateStart, dateEnd)) return false;
    return true;
  });

  const sorted = sortRecords(
    filtered,
    sortBy,
    sortOrder || (sortBy === "date" ? "desc" : "asc")
  );

  const totalItems = sorted.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(Math.max(1, Number(page) || 1), totalPages);
  const startIndex = (safePage - 1) * pageSize;
  const paginated = sorted.slice(startIndex, startIndex + pageSize);

  return {
    meta: {
      page: safePage,
      pageSize,
      totalItems,
      totalPages
    },
    data: paginated
  };
}

function normalizeArray(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  return String(value)
    .split(",")
    .map(v => v.trim())
    .filter(Boolean);
}
