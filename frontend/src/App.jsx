import React, { useState } from "react";
import SearchBar from "./components/SearchBar.jsx";
import FiltersPanel from "./components/FiltersPanel.jsx";
import SortDropdown from "./components/SortDropdown.jsx";
import SalesTable from "./components/SalesTable.jsx";
import PaginationControls from "./components/PaginationControls.jsx";
import useSalesQuery from "./hooks/useSalesQuery.js";

function App() {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    regions: [],
    genders: [],
    ageMin: "",
    ageMax: "",
    productCategories: [],
    tags: [],
    paymentMethods: [],
    dateStart: "",
    dateEnd: ""
  });
  const [sorting, setSorting] = useState({
    sortBy: "date",
    sortOrder: "desc"
  });
  const [page, setPage] = useState(1);

  const { data, meta, loading, error } = useSalesQuery({
    search,
    filters,
    sorting,
    page
  });

  const handleSearchChange = value => {
    setSearch(value);
    setPage(1);
  };

  const handleFiltersChange = newFilters => {
    setFilters(newFilters);
    setPage(1);
  };

  const handleSortingChange = newSorting => {
    setSorting(newSorting);
    setPage(1);
  };

  const handlePageChange = newPage => {
    setPage(newPage);
  };

  return (
    <div className="app-root">
      <header className="app-header">
        <h1>Retail Sales Management</h1>
      </header>

      <main className="app-main">
        <section className="left-panel">
          <SearchBar value={search} onChange={handleSearchChange} />
          <FiltersPanel filters={filters} onChange={handleFiltersChange} />
        </section>

        <section className="right-panel">
          <div className="toolbar">
            <SortDropdown sorting={sorting} onChange={handleSortingChange} />
          </div>

          {loading && <p>Loading...</p>}
          {error && <p className="error">Error: {error}</p>}
          {!loading && !error && data.length === 0 && (
            <p className="empty">No results found. Try adjusting filters.</p>
          )}

          {!loading && !error && data.length > 0 && (
            <>
              <SalesTable rows={data} />
              <PaginationControls
                page={meta.page}
                totalPages={meta.totalPages}
                onChange={handlePageChange}
              />
            </>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
