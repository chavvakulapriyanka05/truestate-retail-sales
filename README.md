# TruEstate – Retail Sales Management System

## 1. Overview (3–5 lines)

This project implements a Retail Sales Management System for exploring structured sales data. It supports full-text search on customers, multi-select filters, sorting and pagination on top of the provided dataset. The goal is to demonstrate clean separation between frontend and backend, predictable state management and production-ready engineering practices.

## 2. Tech Stack

- **Frontend**: React (Vite), Axios, CSS
- **Backend**: Node.js, Express, csv-parser
- **Language**: JavaScript (ES modules)

## 3. Search Implementation Summary

- Full-text search is implemented on **Customer Name** and **Phone Number**.
- The backend performs case-insensitive substring matching using a pure `textSearch` helper.
- Search works in combination with all active filters, sorting and pagination.
- Search term is passed as a `search` query parameter from the frontend.

## 4. Filter Implementation Summary

- Multi-select filters for:
  - Customer Region
  - Gender
  - Product Category
  - Tags
  - Payment Method
- Range filters for:
  - Age (min / max)
  - Date (start / end)
- The backend normalizes comma-separated values and uses helpers like `inMultiSelect`, `inNumericRange`, `inDateRange` and `tagsMatch`.
- Filters can be combined arbitrarily and always apply on top of search.

## 5. Sorting Implementation Summary

- Sorting is handled in the backend using a single `sortRecords` utility.
- Supported fields:
  - Date (Newest First – default)
  - Quantity
  - Customer Name (A–Z)
- Sorting preserves active search, filters and pagination by operating on the filtered dataset before slicing pages.
- The frontend sends `sortBy` and `sortOrder` query parameters.

## 6. Pagination Implementation Summary

- Pagination is implemented in the backend with a fixed **page size of 10** items.
- The service computes `totalItems`, `totalPages` and slices the sorted list for the requested page.
- Edge cases such as out-of-range page numbers are clamped to valid bounds.
- The frontend consumes the `meta` object to render previous/next buttons and the current page.

## 7. Setup Instructions

### Prerequisites

- Node.js (v18+ recommended)
- NPM or Yarn

### Backend Setup

```bash
cd backend
npm install
# Place the dataset file as: backend/data/sales_data.csv
cp .env.example .env   # or create .env and set PORT / DATA_FILE_PATH
npm run dev            # or npm start
```

The backend will start on `http://localhost:4000`.

### Frontend Setup

```bash
cd frontend
npm install
# create .env file and set:
# VITE_API_URL=http://localhost:4000/api
npm run dev
```

The frontend will start on `http://localhost:5173` (default Vite port).

### Deployment (Suggested)

- Deploy **backend** to Render as a Node.js web service (set `PORT` and `DATA_FILE_PATH`).
- Deploy **frontend** to Vercel or Netlify and set environment variable `VITE_API_URL` to the deployed backend URL (e.g. `https://your-backend.onrender.com/api`).
