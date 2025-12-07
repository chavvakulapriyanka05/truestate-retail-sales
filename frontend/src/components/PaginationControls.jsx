import React from "react";

function PaginationControls({ page, totalPages, onChange }) {
  const prevDisabled = page <= 1;
  const nextDisabled = page >= totalPages;

  return (
    <div className="pagination">
      <button
        type="button"
        disabled={prevDisabled}
        onClick={() => !prevDisabled && onChange(page - 1)}
      >
        Previous
      </button>
      <span>
        Page {page} of {totalPages}
      </span>
      <button
        type="button"
        disabled={nextDisabled}
        onClick={() => !nextDisabled && onChange(page + 1)}
      >
        Next
      </button>
    </div>
  );
}

export default PaginationControls;
