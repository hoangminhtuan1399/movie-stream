import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { movieServiceApi } from "../../../services/movieService";
import { movieTypeOptions } from "../../../utils/movieTypeOptions";
import { countryOptions } from "../../../utils/countryOptions";
import { genreOptions } from "../../../utils/genreOptions";
import CardCommon from "../../../components/CardMovie/CardCommon.jsx";
import PaginationCommon from "../../../components/Pagination/PaginationCommon.jsx";
import SortCommon from "../../../components/SortCommon/SortCommon.jsx";
import MovieGrid from "../../../components/MovieGrid/MovieGrid";
import "./CategoryPage.css";

const CategoryPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  // Parse query string
  const query = React.useMemo(() => {
    const params = new URLSearchParams(location.search);
    return Object.fromEntries(params.entries());
  }, [location.search]);

  const [selectedFilter, setSelectedFilter] = useState({});

  useEffect(() => {
    setSelectedFilter(query);
    setPage(Number(query.page) || 1);
  }, [location.search]);

  const handleSelectFilter = (key, value) => {
    setSelectedFilter((prev) => ({ ...prev, [key]: value }));
  };

  const handleApplyFilter = () => {
    const params = { ...selectedFilter, page: 1 };
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        if (value.length > 0) searchParams.set(key, value.join(","));
      } else if (value !== undefined && value !== null && value !== "") {
        searchParams.set(key, value);
      }
    });
    navigate({ pathname: '/search', search: searchParams.toString() });
  };

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const params = { ...query, page: page - 1, size: 12 };
        const { data } = await movieServiceApi.getMovies(params);
        setMovies(data?.data?.content || []);
        setTotalPages(data?.data?.totalPages || 1);
      } catch {
        setMovies([]);
        setTotalPages(1);
      }
    };
    fetchMovies();
  }, [query, page]);

  // Helper để lấy label từ value
  const getLabel = (options, value) => {
    if (!value) return null;
    // Hỗ trợ nhiều giá trị (dạng chuỗi cách nhau bởi dấu phẩy)
    const values = value.split(',');
    return options
      .filter(opt => values.includes(opt.value))
      .map(opt => opt.label)
      .join(', ');
  };

  // Lấy tiêu đề động
  const typeLabel = getLabel(movieTypeOptions, query.type);
  const countryLabel = getLabel(countryOptions, query.countries || query.country);
  const genreLabel = getLabel(genreOptions, query.genres || query.genre);

  let dynamicTitle = "Danh mục phim";
  const titleParts = [];
  if (typeLabel) titleParts.push(typeLabel);
  if (countryLabel) titleParts.push(countryLabel);
  if (genreLabel) titleParts.push(genreLabel);
  if (titleParts.length > 0) dynamicTitle = "Phim " + titleParts.join(" • ");

  return (
    <div className="category-container">
      <div className="category-header">
        <span className="category-header-icon">🎬</span>
        <h2 className="category-title">{dynamicTitle}</h2>
      </div>
      <SortCommon selected={selectedFilter} onSelect={handleSelectFilter} onApply={handleApplyFilter} />
      <MovieGrid
        items={movies}
        columns={6}
        renderItem={(movie) => (
          <CardCommon
            key={movie.id}
            poster={movie.smallBanner}
            title={movie.title}
            subtitle={movie.subtitle}
            badge={movie.badge}
            id={movie.id}
          />
        )}
      />
      <PaginationCommon
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  );
};

export default CategoryPage;
