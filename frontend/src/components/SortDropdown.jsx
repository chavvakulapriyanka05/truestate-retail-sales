import React from "react";

function SortDropdown({ sorting, onChange }) {
  const updateSortBy = sortBy => {
    onChange({ ...sorting, sortBy });
  };

  return (
    <div className="card sort-dropdown">
      <label>Sort By</label>
      <select
        value={sorting.sortBy}
        onChange={e => updateSortBy(e.target.value)}
      >
        <option value="date">Date (Newest First)</option>
        <option value="quantity">Quantity</option>
        <option value="customerName">Customer Name (A–Z)</option>
      </select>
    </div>
  );
}

export default SortDropdown;
