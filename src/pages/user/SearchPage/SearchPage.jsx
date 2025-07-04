import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import CardCommon from '../../../components/CardMovie/CardCommon';
import SortCommon from '../../../components/SortCommon/SortCommon';
import MovieGrid from '../../../components/MovieGrid/MovieGrid';
import PaginationCommon from '../../../components/Pagination/PaginationCommon';
import movieApi from '../../../services/movieService';
import './SearchPage.css';
import { HeaderBack } from '../../../components/Header/Header';
import CardSkeleton from '../../../components/Loading/CardSkeleton';
import { useToast } from '../../../contexts/ToastContext.jsx';

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
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const query = useQuery();
  const navigate = useNavigate();
  const { showToast } = useToast();

  // Lấy params từ query
  useEffect(() => {
    const params = {};
    for (const [key, value] of query.entries()) {
      if (value.includes(',')) {
        params[key] = value.split(',');
      } else if (!isNaN(value) && value !== '') {
        params[key] = Number(value);
      } else {
        params[key] = value;
      }
    }
    setSelectedFilter(params);
    setPage(Number(params.page) || 1);
  }, [window.location.search]);

  // Gọi API khi query thay đổi
  useEffect(() => {
    setLoading(true);
    setError(null);
    const params = {
      size: 10,
    };
    for (const [key, value] of query.entries()) {
      if (value.includes(',')) {
        params[key] = value.split(',');
      } else if (!isNaN(value) && value !== '') {
        params[key] = Number(value);
      } else {
        params[key] = value;
      }
    }
    const convertedParams = {
      "genres": params.genre ? [params.genre] : [],
      "countries": params.country ? [params.country] : [],
      "years": [],
      "type": params.type || '',
      "versions": [],
      "rating": params.age || '',
      "sort": params.sort || '',
      "page": 0,
      "size": 10,
      "keyword": params.keyword || ''
    }
    movieApi.searchMovies(convertedParams)
      .then(res => {
        setMovies(res.data.data.content || []);
        setTotalPages(res.data.data.totalPages || 1);
        setLoading(false);
      })
      .catch(() => {
        setMovies([]);
        setTotalPages(1);
        setLoading(false);
        showToast('Lỗi tìm kiếm phim!', 'danger');
      });
  }, [query, page]);

  const handleSelectFilter = (key, value) => {
    setSelectedFilter(prev => ({ ...prev, [key]: value }));
  };

  // Đẩy filter lên query string
  const handleApplyFilter = () => {
    const params = { ...selectedFilter, page: 1 };
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        if (value.length > 0) searchParams.set(key, value.join(','));
      } else if (value !== undefined && value !== null && value !== '') {
        searchParams.set(key, value);
      }
    });
    navigate({ search: searchParams.toString() });
  };

  // Xử lý chuyển trang
  const handlePageChange = (newPage) => {
    const params = { ...selectedFilter, page: newPage };
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        if (value.length > 0) searchParams.set(key, value.join(','));
      } else if (value !== undefined && value !== null && value !== '') {
        searchParams.set(key, value);
      }
    });
    navigate({ search: searchParams.toString() });
  };

  return (
    <div className="search-page text-white min-vh-100 py-4" style={{ backgroundColor: '#191b24' }}>
      <div className="search-container">
        <HeaderBack title="Tìm kiếm" style={{ paddingLeft: '0px' }} />
        <SortCommon selected={selectedFilter} onSelect={handleSelectFilter} onApply={handleApplyFilter} />
        {loading ? (
          <MovieGrid
            items={Array(12).fill({})}
            columns={6}
            renderItem={() => <CardSkeleton />}
          />
        ) : error ? (
          <div className="text-danger text-center py-5">{error}</div>
        ) : (
          <>
            <MovieGrid
              items={movies}
              columns={6}
              renderItem={movie => (
                <CardCommon
                  key={movie.id}
                  data={movie}
                />
              )}
            />
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 32 }}>
              <PaginationCommon page={page} totalPages={totalPages} onPageChange={handlePageChange} />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SearchPage; 
