import React, { useState } from 'react';
import CardCommon from '../../../components/CardMovie/CardCommon';
import SortCommon from '../../../components/SortCommon/SortCommon';
import MovieGrid from '../../../components/MovieGrid/MovieGrid';
import './SearchPage.css';

const mockMovies = [
  {
    poster: 'https://static.nutscdn.com/vimg/1920-0/8075260038eecb4c9684956a174180a5.jpg',
    title: 'Bí Ẩn Karawek',
    subtitle: 'A Cage Of Karawek',
    badges: ['PĐ. 24', 'TM. 24'],
  },
  {
    poster: 'https://static.nutscdn.com/vimg/1920-0/8075260038eecb4c9684956a174180a5.jpg',
    title: 'Chiếc Lồng',
    subtitle: 'The Cage',
    badges: ['PĐ. 5'],
  },
  {
    poster: 'https://static.nutscdn.com/vimg/1920-0/8075260038eecb4c9684956a174180a5.jpg',
    title: 'Long Ngục Thiên Quan',
    subtitle: "Dragon's Cage",
    badges: ['P.Đề', 'T.Minh'],
  },
  {
    poster: 'https://static.nutscdn.com/vimg/1920-0/8075260038eecb4c9684956a174180a5.jpg',
    title: 'Mồi Cá Mập',
    subtitle: 'Open Water 3: Cage Dive',
    badges: ['P.Đề'],
  },
  {
    poster: 'https://static.nutscdn.com/vimg/1920-0/8075260038eecb4c9684956a174180a5.jpg',
    title: 'Điệp Viên xXx: Phản Đòn',
    subtitle: 'xXx: Return of Xander...',
    badges: ['P.Đề'],
  },
  {
    poster: 'https://static.nutscdn.com/vimg/1920-0/8075260038eecb4c9684956a174180a5.jpg',
    title: "Marvel's Luke Cage",
    subtitle: "Marvel's Luke Cage",
    badges: ['PĐ. 13'],
  },
  {
    poster: 'https://static.nutscdn.com/vimg/1920-0/8075260038eecb4c9684956a174180a5.jpg',
    title: 'Đặc Cảnh Đồ Long 2',
    subtitle: 'Tiger Cage 2',
    badges: ['P.Đề'],
  },
  {
    poster: 'https://static.nutscdn.com/vimg/1920-0/8075260038eecb4c9684956a174180a5.jpg',
    title: 'Ngôi Nhà Bươm Bướm',
    subtitle: 'La Cage aux Folles',
    badges: ['P.Đề'],
  },
];

const SearchPage = () => {
  const [tab, setTab] = useState('movie');
  const [selectedFilter, setSelectedFilter] = useState({});

  const handleSelectFilter = (key, value) => {
    setSelectedFilter(prev => ({ ...prev, [key]: value }));
  };

  const handleApplyFilter = () => {
    // TODO: Lọc dữ liệu theo selectedFilter
    // Hiện tại chỉ mock, bạn có thể tích hợp API/filter thực tế ở đây
    // alert(JSON.stringify(selectedFilter));
  };

  return (
    <div className="search-page bg-dark text-white min-vh-100 py-4">
      <div className="container">
        <div className="search-header d-flex align-items-center mb-4">
          <span className="me-2">🔍</span>
          <h2 className="mb-0">Kết quả tìm kiếm "cage"</h2>
        </div>
        <div className="search-tabs mb-3">
          <button className={`search-tab ${tab === 'movie' ? 'active' : ''}`} onClick={() => setTab('movie')}>Phim</button>
          <button className={`search-tab ${tab === 'actor' ? 'active' : ''}`} onClick={() => setTab('actor')}>Diễn viên</button>
        </div>
        <SortCommon selected={selectedFilter} onSelect={handleSelectFilter} onApply={handleApplyFilter} />
        <MovieGrid
          items={mockMovies}
          renderItem={(movie, idx) => (
            <CardCommon
              poster={movie.poster}
              title={movie.title}
              subtitle={movie.subtitle}
              badges={movie.badges}
            />
          )}
        />
      </div>
    </div>
  );
};

export default SearchPage; 