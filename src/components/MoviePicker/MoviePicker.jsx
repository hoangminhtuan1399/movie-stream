
import { useState } from 'react';
import { Button, Col, Form, Row, Pagination, InputGroup } from 'react-bootstrap';
import { FaSearch, FaTimes } from 'react-icons/fa';
import { movies } from '../../pages/admin/MoviePage/dummyMovies.js';

const ITEMS_PER_PAGE = 5;

const MoviePicker = ({ selectedMovies = [], onSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredMovies = movies.filter(movie =>
    movie.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredMovies.length / ITEMS_PER_PAGE);
  const paginatedMovies = filteredMovies.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleMovieToggle = (movieId) => {
    const newSelected = selectedMovies.includes(movieId)
      ? selectedMovies.filter(id => id !== movieId)
      : [...selectedMovies, movieId];
    onSelect(newSelected);
  };

  const removeMovie = (movieId) => {
    onSelect(selectedMovies.filter(id => id !== movieId));
  };

  return (
    <Row className="g-3">
      <Col md={8}>
        <div className="border p-3 rounded">
          <h5>Danh sách phim</h5>

          <div className="mb-3">
            <InputGroup>
              <Form.Control
                placeholder="Tìm kiếm phim..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Button variant="outline-secondary">
                <FaSearch />
              </Button>
            </InputGroup>
          </div>

          <div className="mb-3 has-scroll" style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {paginatedMovies.length > 0 ? (
              paginatedMovies.map(movie => (
                <Form.Check
                  key={movie.id}
                  type="checkbox"
                  id={`movie-${movie.id}`}
                  label={movie.title}
                  checked={selectedMovies.includes(movie.id)}
                  onChange={() => handleMovieToggle(movie.id)}
                  className="mb-2"
                />
              ))
            ) : (
              <div className="text-muted">Không tìm thấy phim phù hợp</div>
            )}
          </div>

          {totalPages > 1 && (
            <Pagination className="justify-content-center">
              <Pagination.Prev
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              />
              {Array.from({ length: totalPages }, (_, i) => (
                <Pagination.Item
                  key={i + 1}
                  active={i + 1 === currentPage}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </Pagination.Item>
              ))}
              <Pagination.Next
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              />
            </Pagination>
          )}
        </div>
      </Col>

      <Col md={4}>
        <div className="border p-3 rounded">
          <h5>Đã chọn</h5>
          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {selectedMovies.length > 0 ? (
              selectedMovies.map(movieId => {
                const movie = movies.find(m => m.id === movieId);
                return movie ? (
                  <div key={movieId} className="d-flex justify-content-between align-items-center mb-2 p-2 bg-light rounded">
                    <span>{movie.title}</span>
                    <Button
                      variant="link"
                      size="sm"
                      className="text-danger p-0"
                      onClick={() => removeMovie(movieId)}
                    >
                      <FaTimes />
                    </Button>
                  </div>
                ) : null;
              })
            ) : (
              <div className="text-muted">Chưa chọn phim nào</div>
            )}
          </div>
        </div>
      </Col>
    </Row>
  );
};

export default MoviePicker;
