// frontend/src/components/SalesTable.jsx
import React, { useEffect, useState, useMemo } from "react";
import { getSales } from "../services/api";

// Static filter options (must match your CSV values)
const REGIONS = ["North", "South", "East", "West"];
const GENDERS = ["Male", "Female", "Other"];
const CATEGORIES = ["Beauty", "Clothing", "Electronics", "Grocery", "Home"];
const TAGS = ["organic", "skincare", "gadgets", "accessories", "casual"];
const PAYMENT_METHODS = ["Cash", "Card", "UPI", "Wallet", "Net Banking"];

const PAGE_SIZE = 10;

function toggleFromList(list, value) {
  if (list.includes(value)) {
    return list.filter((v) => v !== value);
  }
  return [...list, value];
}

export default function SalesTable() {
  // Search
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Filters
  const [regions, setRegions] = useState([]);
  const [genders, setGenders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [payments, setPayments] = useState([]);

  const [ageMin, setAgeMin] = useState("");
  const [ageMax, setAgeMax] = useState("");

  const [dateStart, setDateStart] = useState("");
  const [dateEnd, setDateEnd] = useState("");

  // Sorting + paging
  const [sortBy, setSortBy] = useState("Date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [page, setPage] = useState(1);

  // Data
  const [rows, setRows] = useState([]);
  const [meta, setMeta] = useState({
    page: 1,
    pageSize: PAGE_SIZE,
    totalItems: 0,
    totalPages: 1,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Build parameter object for API call
  const apiParams = useMemo(
    () => ({
      search: searchTerm || undefined,
      page,
      pageSize: PAGE_SIZE,
      sortBy,
      sortOrder,
      regions,
      genders,
      productCategories: categories,
      tags,
      paymentMethods: payments,
      ageMin: ageMin || undefined,
      ageMax: ageMax || undefined,
      dateStart: dateStart || undefined,
      dateEnd: dateEnd || undefined,
    }),
    [
      searchTerm,
      page,
      sortBy,
      sortOrder,
      regions,
      genders,
      categories,
      tags,
      payments,
      ageMin,
      ageMax,
      dateStart,
      dateEnd,
    ]
  );

  // Load data whenever filters / paging / searchTerm change
  useEffect(() => {
    async function load() {
      setLoading(true);
      setError("");
      try {
        const result = await getSales(apiParams);
        setRows(result.data || []);
        setMeta(result.meta || { page: 1, pageSize: PAGE_SIZE, totalItems: 0, totalPages: 1 });
      } catch (err) {
        console.error("load error", err);
        setRows([]);
        setMeta((m) => ({ ...m, totalItems: 0, totalPages: 1, page: 1 }));
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [apiParams]);

  // Handlers
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    setSearchTerm(searchInput.trim());
  };

  const handleClearFilters = () => {
    setRegions([]);
    setGenders([]);
    setCategories([]);
    setTags([]);
    setPayments([]);
    setAgeMin("");
    setAgeMax("");
    setDateStart("");
    setDateEnd("");
    setPage(1);
  };

  const handlePrevPage = () => {
    if (page > 1) setPage((p) => p - 1);
  };

  const handleNextPage = () => {
    if (page < meta.totalPages) setPage((p) => p + 1);
  };

  return (
    <div style={{ padding: "24px", fontFamily: "system-ui, sans-serif" }}>
      <h1 style={{ fontSize: 24, marginBottom: 16 }}>Retail Sales Management</h1>

      {/* Top bar: search + sort */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <form onSubmit={handleSearchSubmit} style={{ display: "flex", gap: 8 }}>
          <input
            type="text"
            placeholder="Search customer / phone"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            style={{ width: 260, padding: "6px 8px" }}
          />
          <button type="submit" style={{ padding: "6px 12px" }}>
            Search
          </button>
        </form>

        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span>Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value);
              setPage(1);
            }}
          >
            <option value="Date">Date</option>
            <option value="Final Amount">Final Amount</option>
            <option value="Customer Name">Customer</option>
          </select>
          <select
            value={sortOrder}
            onChange={(e) => {
              setSortOrder(e.target.value);
              setPage(1);
            }}
          >
            <option value="asc">Asc</option>
            <option value="desc">Desc</option>
          </select>
        </div>
      </div>

      <div style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>
        {/* FILTERS SIDEBAR */}
        <div
          style={{
            width: 260,
            border: "1px solid #ddd",
            padding: 12,
            borderRadius: 4,
          }}
        >
          <h3 style={{ marginTop: 0 }}>Filters</h3>

          {/* Region */}
          <div style={{ marginBottom: 10 }}>
            <strong>Region</strong>
            <br />
            {REGIONS.map((r) => (
              <label key={r} style={{ display: "block", fontSize: 14 }}>
                <input
                  type="checkbox"
                  checked={regions.includes(r)}
                  onChange={() => {
                    setRegions((prev) => toggleFromList(prev, r));
                    setPage(1);
                  }}
                />{" "}
                {r}
              </label>
            ))}
          </div>

          {/* Gender */}
          <div style={{ marginBottom: 10 }}>
            <strong>Gender</strong>
            <br />
            {GENDERS.map((g) => (
              <label key={g} style={{ display: "block", fontSize: 14 }}>
                <input
                  type="checkbox"
                  checked={genders.includes(g)}
                  onChange={() => {
                    setGenders((prev) => toggleFromList(prev, g));
                    setPage(1);
                  }}
                />{" "}
                {g}
              </label>
            ))}
          </div>

          {/* Category */}
          <div style={{ marginBottom: 10 }}>
            <strong>Category</strong>
            <br />
            {CATEGORIES.map((c) => (
              <label key={c} style={{ display: "block", fontSize: 14 }}>
                <input
                  type="checkbox"
                  checked={categories.includes(c)}
                  onChange={() => {
                    setCategories((prev) => toggleFromList(prev, c));
                    setPage(1);
                  }}
                />{" "}
                {c}
              </label>
            ))}
          </div>

          {/* Tags */}
          <div style={{ marginBottom: 10 }}>
            <strong>Tags</strong>
            <br />
            {TAGS.map((t) => (
              <label key={t} style={{ display: "block", fontSize: 14 }}>
                <input
                  type="checkbox"
                  checked={tags.includes(t)}
                  onChange={() => {
                    setTags((prev) => toggleFromList(prev, t));
                    setPage(1);
                  }}
                />{" "}
                {t}
              </label>
            ))}
          </div>

          {/* Payment */}
          <div style={{ marginBottom: 10 }}>
            <strong>Payment</strong>
            <br />
            {PAYMENT_METHODS.map((p) => (
              <label key={p} style={{ display: "block", fontSize: 14 }}>
                <input
                  type="checkbox"
                  checked={payments.includes(p)}
                  onChange={() => {
                    setPayments((prev) => toggleFromList(prev, p));
                    setPage(1);
                  }}
                />{" "}
                {p}
              </label>
            ))}
          </div>

          {/* Age Range */}
          <div style={{ marginBottom: 10 }}>
            <strong>Age</strong>
            <div style={{ display: "flex", gap: 4, marginTop: 4 }}>
              <input
                type="number"
                placeholder="Min"
                value={ageMin}
                onChange={(e) => {
                  setAgeMin(e.target.value);
                  setPage(1);
                }}
                style={{ width: "50%" }}
              />
              <input
                type="number"
                placeholder="Max"
                value={ageMax}
                onChange={(e) => {
                  setAgeMax(e.target.value);
                  setPage(1);
                }}
                style={{ width: "50%" }}
              />
            </div>
          </div>

          {/* Date Range */}
          <div style={{ marginBottom: 10 }}>
            <strong>Date Range</strong>
            <div style={{ display: "flex", flexDirection: "column", gap: 4, marginTop: 4 }}>
              <input
                type="date"
                value={dateStart}
                onChange={(e) => {
                  setDateStart(e.target.value);
                  setPage(1);
                }}
              />
              <input
                type="date"
                value={dateEnd}
                onChange={(e) => {
                  setDateEnd(e.target.value);
                  setPage(1);
                }}
              />
            </div>
          </div>

          <button onClick={handleClearFilters} style={{ marginTop: 8, width: "100%" }}>
            Clear Filters
          </button>
        </div>

        {/* TABLE AREA */}
        <div style={{ flex: 1 }}>
          {error && (
            <div style={{ color: "red", marginBottom: 8 }}>
              {error}
            </div>
          )}

          {loading ? (
            <div>Loading…</div>
          ) : (
            <>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: 14,
                }}
              >
                <thead>
                  <tr>
                    {[
                      "Date",
                      "Customer",
                      "Phone",
                      "Region",
                      "Gender",
                      "Product",
                      "Category",
                      "Qty",
                      "Final Amount",
                      "Payment",
                      "Store",
                    ].map((h) => (
                      <th
                        key={h}
                        style={{
                          borderBottom: "1px solid #ccc",
                          textAlign: "left",
                          padding: "6px 4px",
                          background: "#f7f7f7",
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.length === 0 ? (
                    <tr>
                      <td colSpan={11} style={{ padding: 8, textAlign: "center" }}>
                        No records found.
                      </td>
                    </tr>
                  ) : (
                    rows.map((row) => (
                      <tr key={row._id}>
                        <td style={{ padding: "4px 4px" }}>{row.Date}</td>
                        <td style={{ padding: "4px 4px" }}>{row["Customer Name"]}</td>
                        <td style={{ padding: "4px 4px" }}>{row["Phone Number"]}</td>
                        <td style={{ padding: "4px 4px" }}>{row["Customer Region"]}</td>
                        <td style={{ padding: "4px 4px" }}>{row.Gender}</td>
                        <td style={{ padding: "4px 4px" }}>{row["Product Name"]}</td>
                        <td style={{ padding: "4px 4px" }}>{row["Product Category"]}</td>
                        <td style={{ padding: "4px 4px" }}>{row.Quantity}</td>
                        <td style={{ padding: "4px 4px" }}>{row["Final Amount"]}</td>
                        <td style={{ padding: "4px 4px" }}>{row["Payment Method"]}</td>
                        <td style={{ padding: "4px 4px" }}>{row["Store Location"]}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>

              {/* Pagination + total */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: 8,
                }}
              >
                <div>
                  <button onClick={handlePrevPage} disabled={page <= 1}>
                    Prev
                  </button>
                  <span style={{ margin: "0 8px" }}>
                    Page {page} / {meta.totalPages || 1}
                  </span>
                  <button onClick={handleNextPage} disabled={page >= (meta.totalPages || 1)}>
                    Next
                  </button>
                </div>
                <div>Total Records: {meta.totalItems}</div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
