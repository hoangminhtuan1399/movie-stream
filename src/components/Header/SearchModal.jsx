import React from 'react';
import { Modal, Button, Spinner } from 'react-bootstrap';

const SearchModal = ({ show, onHide, loading, searchValue, filteredResults }) => (
    <>
        {show && (
            <div className="search-modal-body position-absolute w-100 mt-2" style={{ zIndex: 1050, left: 0, top: '100%' }}>
                <div className="text-secondary mb-2" style={{ fontSize: '0.95rem' }}>Danh sách phim</div>
                {loading ? (
                    <div className="d-flex justify-content-center align-items-center py-4">
                        <Spinner animation="border" variant="light" size="sm" className="me-2" />
                        <span className="text-white">Đang tìm kiếm...</span>
                    </div>
                ) : filteredResults.length > 0 ? (
                    <>
                        <div className="search-modal-list">
                            {filteredResults.map(movie => (
                                <div key={movie.id} className="search-modal-item">
                                    <img src={movie.poster} alt={movie.title} className="search-modal-poster" />
                                    <div className="search-modal-info">
                                        <div className="search-modal-title">{movie.title}</div>
                                        <div className="search-modal-meta mt-2">
                                            <span>{movie.age}</span>
                                            <span>•</span>
                                            <span>{movie.year}</span>
                                            <span>•</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <Button variant="secondary" className="w-100 mt-3 search-modal-btn">Toàn bộ kết quả</Button>
                    </>
                ) : (
                    !loading && searchValue && <div className="text-secondary text-center py-3">Không tìm thấy kết quả</div>
                )}
            </div>
        )}
    </>
);

export default SearchModal; 