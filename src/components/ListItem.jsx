import React, { useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';

const ListItem = ({ title, itemsMenu, columns = 2 }) => {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="relative select-none"
      onClick={() => setOpen(!open)}
      tabIndex={0}
      onBlur={() => setOpen(false)}
    >
      <div className="flex items-center gap-1 cursor-pointer px-3 py-2 rounded-md transition-colors duration-200 text-white hover:bg-gray-800 focus:bg-gray-800">
        <span className="font-medium text-base">{title}</span>
        <FaChevronDown className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`} size={13} />
      </div>
      {open && (
        <div className={`absolute left-0 mt-2 ${columns === 1 ? 'min-w-[200px]' : 'min-w-[300px]'} bg-[rgba(15,17,26,.8)] rounded-radius-base overflow-hidden shadow-2xl z-50 p-4 grid gap-2 animate-fade-in ${columns === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
          {itemsMenu.map((item, idx) => (
            <div
              key={idx}
              className={`px-3 py-2 ${columns === 1 ? 'w-full' : 'max-w-[130px]'} min-w-[120px] truncate text-base text-white rounded-lg hover:bg-yellow-300 hover:text-gray-900 transition-colors duration-150 cursor-pointer font-medium`}
            >
              {item.label}
            </div>
          ))}
        </div>
      )}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.18s ease; }
      `}</style>
    </div>
  );
};

export default ListItem; 