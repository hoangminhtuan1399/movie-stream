import React from 'react';
import './MovieGrid.css';

const MovieGrid = ({ items, renderItem, children, className = '', columns = 8 }) => {
  // columns: số cột trên desktop, mặc định 8
  // Truyền columns=5 để hiển thị 5 cột
  const gridStyle = columns !== 8 ? { '--movie-grid-columns': columns } : {};
  return (
    <div className={`movie-grid ${className}`} style={gridStyle}>
      {items
        ? items.map((item, idx) => (
            <div key={idx} className="movie-grid-item">
              {renderItem ? renderItem(item, idx) : children}
            </div>
          ))
        : children}
    </div>
  );
};

export default MovieGrid; 