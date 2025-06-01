import React from 'react';
import CardCommon from '../../../components/CardMovie/CardCommon.jsx';
import PaginationCommon from '../../../components/Pagination/PaginationCommon.jsx';
import SortCommon from '../../../components/SortCommon/SortCommon.jsx';
import MovieGrid from '../../../components/MovieGrid/MovieGrid';
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

const CategoryPage = () => (
  <div className="category-container">
    <div className="category-header">
      <span className="category-header-icon">🎬</span>
      <h2 className="category-title">Danh mục phim</h2>
    </div>
    <div className="category-filter">Bộ lọc</div>
    <MovieGrid
      items={mockMovies}
      renderItem={(movie, idx) => (
        <CardCommon
          poster={movie.poster}
          title={movie.title}
          subtitle={movie.subtitle}
          badge={movie.badge}
        />
      )}
    />
    <PaginationCommon />
  </div>
);

export default CategoryPage;
