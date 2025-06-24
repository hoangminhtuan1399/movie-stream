import { useState, useEffect } from 'react';
import { Button, Col, Form, Row, Pagination, InputGroup } from 'react-bootstrap';
import { FaSearch, FaTimes } from 'react-icons/fa';
import movieServiceApi from '../../services/movieService';

const ITEMS_PER_PAGE = 5;

const MoviePicker = ({ selectedMovies = [], onSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [movies, setMovies] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
          const { data } = await movieServiceApi.getMovies({
            page: currentPage - 1,
            size: ITEMS_PER_PAGE,
            keyword: searchTerm,
          });
            setMovies(data.data.content);
            setTotalPages(data.data.totalPages);
      } catch {
          setMovies([]);
          setTotalPages(1);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [searchTerm, currentPage]);

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
            {isLoading ? (
              <div>Đang tải...</div>
            ) : movies.length > 0 ? (
              movies.map(movie => (
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
