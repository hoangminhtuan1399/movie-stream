import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import CardCommon from '../../../components/CardMovie/CardCommon';
import SortCommon from '../../../components/SortCommon/SortCommon';
import MovieGrid from '../../../components/MovieGrid/MovieGrid';
import movieApi from '../../../services/movieService';
import './SearchPage.css';

function useQuery() {
  const { search } = useLocation();
  return React.useMemo(() => new URLSearchParams(search), [search]);
}

const SearchPage = () => {
  const [tab, setTab] = useState('movie');
  const [selectedFilter, setSelectedFilter] = useState({});
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const query = useQuery();
  const searchValue = query.get('q') || '';

  useEffect(() => {
    if (!searchValue) {
      setMovies([]);
      return;
    }
    setLoading(true);
    setError(null);
    movieApi.searchMovies(searchValue)
      .then(res => {
        setMovies(res.data || []);
        setLoading(false);
      })
      .catch(() => {
        setError('Không thể tải kết quả tìm kiếm');
        setLoading(false);
      });
  }, [searchValue]);

  const handleSelectFilter = (key, value) => {
    setSelectedFilter(prev => ({ ...prev, [key]: value }));
  };

  const handleApplyFilter = () => {
    // TODO: Lọc dữ liệu theo selectedFilter
  };

  return (
    <div className="search-page bg-dark text-white min-vh-100 py-4">
      <div className="container">
        <div className="search-header d-flex align-items-center mb-4">
          <span className="me-2">🔍</span>
          <h2 className="mb-0">Kết quả tìm kiếm "{searchValue}"</h2>
        </div>
        <div className="search-tabs mb-3">
          <button className={`search-tab ${tab === 'movie' ? 'active' : ''}`} onClick={() => setTab('movie')}>Phim</button>
          <button className={`search-tab ${tab === 'actor' ? 'active' : ''}`} onClick={() => setTab('actor')}>Diễn viên</button>
        </div>
        <SortCommon selected={selectedFilter} onSelect={handleSelectFilter} onApply={handleApplyFilter} />
        {loading ? (
          <div className="text-center py-5">Đang tìm kiếm...</div>
        ) : error ? (
          <div className="text-danger text-center py-5">{error}</div>
        ) : (
        <MovieGrid
            items={movies}
            renderItem={movie => (
            <CardCommon
                key={movie.id}
                poster={movie.bigBanner || movie.smallBanner || 'https://via.placeholder.com/80x120?text=No+Image'}
              title={movie.title}
              subtitle={movie.subtitle}
                badges={[]}
            />
          )}
        />
        )}
      </div>
    </div>
  );
};

export default SearchPage; 