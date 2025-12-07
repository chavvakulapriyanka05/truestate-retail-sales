import React from "react";

function MultiSelect({ label, options, selected, onChange }) {
  const toggle = value => {
    if (selected.includes(value)) {
      onChange(selected.filter(v => v !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  return (
    <div className="filter-group">
      <span className="filter-label">{label}</span>
      <div className="filter-options">
        {options.map(opt => (
          <button
            key={opt}
            type="button"
            className={selected.includes(opt) ? "chip chip-active" : "chip"}
            onClick={() => toggle(opt)}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

function FiltersPanel({ filters, onChange }) {
  const regions = ["North", "South", "East", "West"];
  const genders = ["Male", "Female", "Other"];
  const categories = ["Electronics", "Fashion", "Grocery", "Home"];
  const paymentMethods = ["Cash", "Card", "UPI", "Wallet"];
  const tagOptions = ["New", "Sale", "Loyal", "Online"];

  const update = patch => {
    onChange({ ...filters, ...patch });
  };

  return (
    <div className="card filters-panel">
      <h3>Filters</h3>

      <MultiSelect
        label="Customer Region"
        options={regions}
        selected={filters.regions}
        onChange={vals => update({ regions: vals })}
      />

      <MultiSelect
        label="Gender"
        options={genders}
        selected={filters.genders}
        onChange={vals => update({ genders: vals })}
      />

      <div className="filter-group">
        <span className="filter-label">Age Range</span>
        <div className="range-row">
          <input
            type="number"
            placeholder="Min"
            value={filters.ageMin}
            onChange={e => update({ ageMin: e.target.value })}
          />
          <span>–</span>
          <input
            type="number"
            placeholder="Max"
            value={filters.ageMax}
            onChange={e => update({ ageMax: e.target.value })}
          />
        </div>
      </div>

      <MultiSelect
        label="Product Category"
        options={categories}
        selected={filters.productCategories}
        onChange={vals => update({ productCategories: vals })}
      />

      <MultiSelect
        label="Tags"
        options={tagOptions}
        selected={filters.tags}
        onChange={vals => update({ tags: vals })}
      />

      <MultiSelect
        label="Payment Method"
        options={paymentMethods}
        selected={filters.paymentMethods}
        onChange={vals => update({ paymentMethods: vals })}
      />

      <div className="filter-group">
        <span className="filter-label">Date Range</span>
        <div className="range-row">
          <input
            type="date"
            value={filters.dateStart}
            onChange={e => update({ dateStart: e.target.value })}
          />
          <span>–</span>
          <input
            type="date"
            value={filters.dateEnd}
            onChange={e => update({ dateEnd: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
}

export default FiltersPanel;
