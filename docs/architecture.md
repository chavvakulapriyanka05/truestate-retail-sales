# Architecture – TruEstate Retail Sales Management System

## Backend Architecture

- **Tech Stack**: Node.js, Express, csv-parser
- **Data Source**: CSV file (`data/sales_data.csv`) loaded into memory at startup.
- **Layers**:
  - `index.js` – application entry point, Express setup, CSV loading and server start.
  - `routes/salesRoutes.js` – declares `/api/sales` route.
  - `controllers/salesController.js` – parses HTTP query parameters and delegates to service.
  - `services/salesService.js` – core business logic:
    - full-text search on customer name and phone
    - multi-select filters (region, gender, category, tags, payment method)
    - range filters (age, date range)
    - sorting (date, quantity, customer name)
    - pagination (10 items per page, next/prev via page number)
  - `models/salesRecord.js` – maps raw CSV rows into normalized JavaScript objects.
  - `utils/filterUtils.js` – pure helper functions for search, filter, sort.

- **Key Characteristics**
  - Single source-of-truth for filtering and sorting in the service layer (no duplication).
  - In-memory dataset for fast querying and no external DB dependency.
  - All edge cases (empty result, invalid ranges, conflicting filters) handled in `salesService`.

## Frontend Architecture

- **Tech Stack**: React + Vite, Axios
- **Application Shell**:
  - `main.jsx` – React entry attaching `<App />` to DOM.
  - `App.jsx` – top-level layout and state composition.

- **Components**:
  - `SearchBar` – full-text search box for customer name/phone.
  - `FiltersPanel` – controls for customer region, gender, age range, product category, tags, payment method, and date range.
  - `SortDropdown` – dropdown to select sorting: date, quantity, customer name.
  - `SalesTable` – transaction table displaying the filtered, sorted, paginated sales records.
  - `PaginationControls` – previous/next buttons with current page and total pages.

- **Hooks**:
  - `useSalesQuery` – handles API calls, loading state, error state and stores `{ data, meta }` from backend.

- **Services**:
  - `services/api.js` – builds query string from search, filters, sorting and page, calls `/api/sales`.

- **Styles**:
  - `styles/global.css` – minimal layout with left panel (search + filters) and right panel (sort dropdown + table + pagination).

## Data Flow

1. User interacts with SearchBar / FiltersPanel / SortDropdown / PaginationControls.
2. `App.jsx` updates local state (`search`, `filters`, `sorting`, `page`).
3. `useSalesQuery` observes these state changes and calls `fetchSales()` with the current parameters.
4. `fetchSales()` constructs a query string and sends `GET /api/sales` request to backend.
5. Backend `salesController` reads query params and calls `querySales()` in `salesService`.
6. `salesService` filters in-memory dataset, sorts results, paginates (page size 10) and returns `{ meta, data }`.
7. Frontend receives `{ meta, data }` and renders table + pagination.

## Folder Structure

- `backend/src`
  - `index.js` – entry point
  - `controllers/` – HTTP layer
  - `services/` – business logic and data querying
  - `routes/` – Express routes
  - `utils/` – shared utility functions
  - `models/` – data mapping from raw CSV to typed objects

- `frontend/src`
  - `components/` – reusable UI building blocks
  - `services/` – HTTP client logic
  - `hooks/` – data fetching and state hooks
  - `styles/` – global styling
  - `App.jsx`, `main.jsx` – composition and bootstrapping

## Module Responsibilities

- **Backend**
  - `index.js` – config, CSV load, server start.
  - `salesRoutes.js` – define endpoints.
  - `salesController.js` – request/response orchestration.
  - `salesService.js` – implements assignment requirements (search, filters, sorting, pagination).
  - `filterUtils.js` – pure, testable functions for filtering and sorting.
  - `salesRecord.js` – enforces consistent field mapping from dataset.

- **Frontend**
  - `App.jsx` – state coordination (search, filters, sorting, pagination).
  - `useSalesQuery.js` – data fetching and async state.
  - `api.js` – communication with backend.
  - `SearchBar`, `FiltersPanel`, `SortDropdown`, `SalesTable`, `PaginationControls` – UI modules aligned with the given Figma structure.
