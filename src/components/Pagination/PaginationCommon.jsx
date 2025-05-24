import React from 'react';
import './PaginationCommon.css';

const PaginationCommon = ({ page, totalPages, onPageChange }) => {
  return (
    <div className="pagination-common">
      <button
        className="pagination-arrow"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
      >
        &#8592;
      </button>
      <div className="pagination-center">
        <span className="pagination-label">Trang</span>
        <input
          className="pagination-input"
          type="number"
          min={1}
          max={totalPages}
          value={page}
          onChange={e => {
            const val = Number(e.target.value);
            if (val >= 1 && val <= totalPages) onPageChange(val);
          }}
        />
        <span className="pagination-total">/ {totalPages}</span>
      </div>
      <button
        className="pagination-arrow"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
      >
        &#8594;
      </button>
    </div>
  );
};

export default PaginationCommon; 