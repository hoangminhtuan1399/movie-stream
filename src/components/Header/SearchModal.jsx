import React from 'react';
import { Modal, Button, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const DEFAULT_POSTER = "https://via.placeholder.com/80x120?text=No+Image"; // Default image if no banner

const SearchModal = ({ show, onHide, loading, searchValue, filteredResults }) => {
    const navigate = useNavigate();
    
    const handleMovieClick = (id) => {
        navigate(`/movie/${id}`);
    };

    const handleViewAll = () => {
        if (searchValue) {
            navigate(`/search?keyword=${encodeURIComponent(searchValue)}`);
        } else {
            navigate('/search');
        }
    };

    return (
    <>
        {show && (
                <div className="search-modal-body position-absolute w-100 mt-2" style={{ zIndex: 1050, left: 0, top: '100%', maxHeight: '60vh', overflowY: 'auto' }}>
                <div className="text-secondary mb-2" style={{ fontSize: '0.95rem' }}>Danh sách phim</div>
                {loading ? (
                    <div className="d-flex justify-content-center align-items-center py-4">
                        <Spinner animation="border" variant="light" size="sm" className="me-2" />
                        <span className="text-white">Đang tìm kiếm...</span>
                    </div>
                ) : filteredResults.length > 0 ? (
                    <>
                        <div className="search-modal-list">
                                {filteredResults.slice(0, 5).map(movie => {
                                    // Lấy poster từ bigBanner, nếu không có thì dùng ảnh mặc định
                                    const poster = movie.bigBanner || DEFAULT_POSTER;
                                    return (
                                        <div key={movie.id} className="search-modal-item" style={{cursor: 'pointer'}} onClick={() => handleMovieClick(movie.id)}>
                                            {/* Poster */}
                                            <img src={poster} alt={movie.title} className="search-modal-poster" />
                                    <div className="search-modal-info">
                                                {/* Tiêu đề */}
                                        <div className="search-modal-title">{movie.title}</div>
                                                {/* Subtitle */}
                                                {movie.subtitle && <div className="search-modal-subtitle">{movie.subtitle}</div>}
                                                {/* Meta: badge, year, duration, season, episode... */}
                                        <div className="search-modal-meta mt-2">
                                                    {movie.ageRating && <span className="meta-badge">{movie.ageRating}</span>}
                                                    {movie.seasonNumber && <><span className="meta-dot">•</span><span className="meta-badge">Phần {movie.seasonNumber}</span></>}
                                                    {movie.episodeNumber && <><span className="meta-dot">•</span><span className="meta-badge">Tập {movie.episodeNumber}</span></>}
                                                    {movie.year && <><span className="meta-dot">•</span><span className="meta-badge">{movie.year}</span></>}
                                                    {movie.duration && <><span className="meta-dot">•</span><span className="meta-badge">{movie.duration}m</span></>}
                                        </div>
                                    </div>
                                </div>
                                    );
                                })}
                        </div>
                            <Button variant="secondary" className="w-100 mt-3 search-modal-btn" onClick={handleViewAll}>Toàn bộ kết quả</Button>
                    </>
                ) : (
                    !loading && searchValue && <div className="text-secondary text-center py-3">Không tìm thấy kết quả</div>
                )}
            </div>
        )}
    </>
);
};

export default SearchModal; 