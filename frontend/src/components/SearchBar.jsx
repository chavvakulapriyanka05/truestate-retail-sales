import React from "react";

function SearchBar({ value, onChange }) {
  return (
    <div className="card search-bar">
      <label>Search (Customer / Phone)</label>
      <input
        type="text"
        placeholder="Type name or phone..."
        value={value}
        onChange={e => onChange(e.target.value)}
      />
    </div>
  );
}

export default SearchBar;
