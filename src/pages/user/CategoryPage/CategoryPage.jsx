import React from 'react';
import CardCommon from '../../../components/CardMovie/CardCommon.jsx';
import PaginationCommon from '../../../components/Pagination/PaginationCommon.jsx';
import SortCommon from '../../../components/SortCommon/SortCommon.jsx';
import './CategoryPage.css';

const mockMovies = [
  {
    poster: 'https://thanhnien.mediacdn.vn/uploaded/ngocthanh/2020_12_10/da-04_PBWC.jpg?width=500',
    title: 'Chiến Binh Thép',
    subtitle: 'Tin Soldier',
    badge: 'P18'
  },
  {
    poster: 'https://thanhnien.mediacdn.vn/uploaded/ngocthanh/2020_12_10/da-04_PBWC.jpg?width=500',
    title: 'Suối Nguồn Tuổi Trẻ',
    subtitle: 'Fountain of Youth',
    badge: 'P18'
  },
  {
    poster: 'https://thanhnien.mediacdn.vn/uploaded/ngocthanh/2020_12_10/da-04_PBWC.jpg?width=500',
    title: 'Bí mật giết thạc Vua gan...',
    subtitle: 'Untold: The Liver King',
    badge: 'P18'
  },
  {
    poster: 'https://thanhnien.mediacdn.vn/uploaded/ngocthanh/2020_12_10/da-04_PBWC.jpg?width=500',
    title: 'Ghế Trống',
    subtitle: 'The Seat',
    badge: 'P18'
  },
  {
    poster: 'https://thanhnien.mediacdn.vn/uploaded/ngocthanh/2020_12_10/da-04_PBWC.jpg?width=500',
    title: 'Havoc Tàn Phá',
    subtitle: 'Havoc',
    badge: 'T16'
  },
  {
    poster: 'https://thanhnien.mediacdn.vn/uploaded/ngocthanh/2020_12_10/da-04_PBWC.jpg?width=500',
    title: 'Havoc Tàn Phá',
    subtitle: 'Havoc',
    badge: 'T16'
  },
  {
    poster: 'https://thanhnien.mediacdn.vn/uploaded/ngocthanh/2020_12_10/da-04_PBWC.jpg?width=500',
    title: 'Havoc Tàn Phá',
    subtitle: 'Havoc',
    badge: 'T16'
  },
  {
    poster: 'https://thanhnien.mediacdn.vn/uploaded/ngocthanh/2020_12_10/da-04_PBWC.jpg?width=500',
    title: 'Havoc Tàn Phá',
    subtitle: 'Havoc',
    badge: 'T16'
  },
  {
    poster: 'https://thanhnien.mediacdn.vn/uploaded/ngocthanh/2020_12_10/da-04_PBWC.jpg?width=500',
    title: 'Havoc Tàn Phá',
    subtitle: 'Havoc',
    badge: 'T16'
  },
  {
    poster: 'https://thanhnien.mediacdn.vn/uploaded/ngocthanh/2020_12_10/da-04_PBWC.jpg?width=500',
    title: 'Havoc Tàn Phá',
    subtitle: 'Havoc',
    badge: 'T16'
  },
  // ...add more mock movies as needed
];


const CategoryPage = () => {
  const [page, setPage] = React.useState(1);
  const totalPages = 17;
  const [selected, setSelected] = React.useState({});
  const handleSelect = (key, value) => setSelected(s => ({ ...s, [key]: value }));

  return (
    <div className="category-container">
      <div className="category-header">
        <h2 className="category-title">Duyệt tìm</h2>
      </div>
      <SortCommon
        selected={selected}
        onSelect={handleSelect}
        onApply={() => {}}
        onClose={() => {}}
      />
      <div className="category-grid">
        {mockMovies.map((movie, idx) => (
          <CardCommon {...movie} key={idx} />
        ))}
      </div>
      <PaginationCommon page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
};

export default CategoryPage;
