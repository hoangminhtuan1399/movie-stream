import React, { useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './ListItem.css';

const ListItem = ({ title, itemsMenu, columns = 2, path='/' }) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleItemClick = (item) => {
    navigate(`${path}?${item.value}`);
    setOpen(false);
  };

  return (
    <div
      className="list-item"
      onClick={() => setOpen(!open)}
      tabIndex={0}
      onBlur={() => setOpen(false)}
    >
      <div className="list-item-header">
        <span className="list-item-title fs-6">{title}</span>
        <FaChevronDown className={`list-item-icon ${open ? 'open' : ''}`} size={13} />
      </div>
      {open && (
        <div className={`list-item-menu ${columns === 1 ? 'single-column' : 'double-column'}`}>
          {itemsMenu.map((item, idx) => (
            <div
              key={idx}
              onClick={(e) => {
                e.stopPropagation();
                handleItemClick(item);
              }}
              className="list-item-option"
            >
              {item.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ListItem; 
