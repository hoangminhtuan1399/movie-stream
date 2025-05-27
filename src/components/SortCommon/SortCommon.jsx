import React, { useState } from 'react';
import './SortCommon.css';
import { countryOptions } from '../../utils/countryOptions';
import { movieTypeOptions } from '../../utils/movieTypeOptions';
import { ageRatingOptions } from '../../utils/ageRatingOptions';
import { genreOptions } from '../../utils/genreOptions';


const sortOptions = [
  { label: 'Mới nhất', value: 'newest' },
  { label: 'Lượt xem', value: 'views' }
];

const filters = [
  {
    label: 'Quốc gia',
    key: 'country',
    options: [{ label: 'Tất cả', value: 'all' }, ...countryOptions]
  },
  {
    label: 'Loại phim',
    key: 'type',
    options: [{ label: 'Tất cả', value: 'all' }, ...movieTypeOptions]
  },
  {
    label: 'Xếp hạng',
    key: 'age',
    options: [{ label: 'Tất cả', value: 'all' }, ...ageRatingOptions]
  },
  {
    label: 'Thể loại',
    key: 'genre',
    options: [{ label: 'Tất cả', value: 'all' }, ...genreOptions]
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
    <div className={`sort-common ${!expanded ? 'w-[160px]' : ''}`}>
      <div className={`sort-title ${expanded ? 'expanded' : ''}`} onClick={() => setExpanded(e => !e)} style={{ cursor: 'pointer', userSelect: 'none' }}>
        <span className={`sort-title-icon`}
          style={{ display: 'flex', alignItems: 'center', marginRight: 8 }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 5a1 1 0 0 1 1-1h16a1 1 0 0 1 .8 1.6l-5.6 7.47V19a1 1 0 0 1-1.45.89l-3-1.5A1 1 0 0 1 10 17v-4.93L4.2 6.6A1 1 0 0 1 3 5z" fill={expanded ? '#ffe066' : '#fff'} />
          </svg>
        </span> Bộ lọc
      </div>
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