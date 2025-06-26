import React, { useState } from 'react';
import './SortCommon.css';
import { countryOptions } from '../../utils/countryOptions';
import { movieTypeOptions } from '../../utils/movieTypeOptions';
import { ageRatingOptions } from '../../utils/ageRatingOptions';
import { genreOptions } from '../../utils/genreOptions';
import { Button } from "react-bootstrap";


const sortOptions = [
  { label: 'Mới nhất', value: 'newest' },
  { label: 'Lượt xem', value: 'views' }
];

const filters = [
  {
    label: 'Quốc gia',
    key: 'country',
    options: [{ label: 'Tất cả', value: '' }, ...countryOptions]
  },
  {
    label: 'Loại phim',
    key: 'type',
    options: [{ label: 'Tất cả', value: '' }, ...movieTypeOptions]
  },
  {
    label: 'Xếp hạng',
    key: 'age',
    options: [{ label: 'Tất cả', value: '' }, ...ageRatingOptions]
  },
  {
    label: 'Thể loại',
    key: 'genre',
    options: [{ label: 'Tất cả', value: '' }, ...genreOptions]
  },
  {
    label: 'Sắp xếp',
    key: 'sort',
    options: sortOptions
  }
];

const SortCommon = ({ selected, onSelect, onApply }) => {
  const [expanded, setExpanded] = useState(false);

  const onClose = () => {
    setExpanded(false);
  }

  return (
    <div className={`sort-common`}>
      <Button variant={'link'} className={`sort-title text-decoration-none ${expanded ? 'expanded' : ''}`} onClick={() => setExpanded(e => !e)}>
        <span className={`sort-title-icon d-flex align-items-center`}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 5a1 1 0 0 1 1-1h16a1 1 0 0 1 .8 1.6l-5.6 7.47V19a1 1 0 0 1-1.45.89l-3-1.5A1 1 0 0 1 10 17v-4.93L4.2 6.6A1 1 0 0 1 3 5z" fill='currentColor' />
          </svg>
        </span> Bộ lọc
      </Button>
      {expanded && (
        <>
          <div className="sort-table">
            {filters.map((row, idx) => (
              <div className="sort-row" key={idx}>
                <div className="sort-row-label">{row.label}:</div>
                <div className="sort-row-options">
                  {row.options.map(opt => (
                    <button
                      key={opt.value}
                      className={`sort-option${selected[row.key] === opt.value ? ' selected' : ''}`}
                      onClick={() => onSelect(row.key, opt.value)}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="sort-actions">
            <button className="sort-apply" onClick={onApply}>Lọc kết quả →</button>
            <button className="sort-close" onClick={onClose}>Đóng</button>
          </div>
        </>
      )}
    </div>
  );
};

export default SortCommon; 
