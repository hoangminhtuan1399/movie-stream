import { useState, useEffect } from 'react';
import { Button, Col, Form, Row, InputGroup } from 'react-bootstrap';
import { FaSearch, FaTimes } from 'react-icons/fa';
import useDebounce from '../../hooks/useDebounce';
import { actorService } from '../../services/actorService';

const ITEMS_PER_PAGE = 5;

const ActorPicker = ({ selectedActors, onSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Lấy danh sách diễn viên khi mount hoặc khi search/page thay đổi
  useEffect(() => {
    const fetchActors = async () => {
      setIsLoading(true);
      try {
        const params = {
          page: currentPage - 1,
          size: ITEMS_PER_PAGE,
          keyword: debouncedSearchTerm,
        };
        const { data } = await actorService.getAllActors(params);
        setSearchResults(data.data.content || []);
        setTotalPages(data.totalPages || 1);
      } catch (error) {
        console.log(error);
        setSearchResults([]);
        setTotalPages(1);
      } finally {
        setIsLoading(false);
      }
    };
    fetchActors();
  }, [debouncedSearchTerm, currentPage]);

  // Pagination: khi click chuyển trang
  const paginatedActors = searchResults;

  const handleActorToggle = (actor) => {
    const isSelected = selectedActors.some(a => a.id === actor.id);
    let newSelected;
    if (isSelected) {
      newSelected = selectedActors.filter(a => a.id !== actor.id);
    } else {
      newSelected = [...selectedActors, actor];
    }
    onSelect(newSelected);
  };

  const removeActor = (actorId) => {
    onSelect(selectedActors.filter(a => a.id !== actorId));
  };

  return (
    <Row className="g-3">
      {/* Cột bên trái - Danh sách diễn viên */}
      <Col md={8}>
        <div className="border p-3 rounded">
          <h5>Diễn viên</h5>
          {/* Search bar */}
          <div className="mb-3">
            <InputGroup>
              <Form.Control
                placeholder="Tìm kiếm diễn viên..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
              <Button variant="outline-secondary">
                <FaSearch />
              </Button>
            </InputGroup>
          </div>

          {/* Actor list */}
          <div className="mb-3 has-scroll" style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {isLoading && <div>Đang tìm...</div>}
            {!isLoading && paginatedActors.length > 0 ? (
              paginatedActors.map(actor => (
                <Form.Check
                  key={actor.id}
                  type="checkbox"
                  id={`actor-${actor.id}`}
                  label={<><img src={actor.avatarUrl} alt={actor.name} width="32" height="32" className="me-2 rounded-circle" />{actor.name}</>}
                  checked={selectedActors.some(a => a.id === actor.id)}
                  onChange={() => handleActorToggle(actor)}
                  className="mb-2 d-flex align-items-center gap-2"
                />
              ))
            ) : !isLoading && searchTerm ? (
              <div className="text-muted">Không tìm thấy diễn viên phù hợp</div>
            ) : null}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="d-flex justify-content-center">
              <Button
                variant="outline-secondary"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                className="me-2"
              >
                &laquo;
              </Button>
              {Array.from({ length: totalPages }, (_, i) => (
                <Button
                  key={i + 1}
                  variant={i + 1 === currentPage ? 'primary' : 'outline-primary'}
                  size="sm"
                  onClick={() => setCurrentPage(i + 1)}
                  className="me-1"
                >
                  {i + 1}
                </Button>
              ))}
              <Button
                variant="outline-secondary"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              >
                &raquo;
              </Button>
            </div>
          )}
        </div>
      </Col>

      {/* Cột bên phải - Diễn viên đã chọn */}
      <Col md={4}>
        <div className="border p-3 rounded">
          <h5>Đã chọn</h5>
          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {selectedActors.length > 0 ? (
              selectedActors.map(actor => (
                <div key={actor.id} className="d-flex justify-content-between align-items-center mb-2 p-2 bg-light rounded">
                  <span><img src={actor.avatarUrl} alt={actor.name} width="28" height="28" className="me-2 rounded-circle" />{actor.name}</span>
                  <Button
                    variant="link"
                    size="sm"
                    className="text-danger p-0"
                    onClick={() => removeActor(actor.id)}
                  >
                    <FaTimes />
                  </Button>
                </div>
              ))
            ) : (
              <div className="text-muted">Chưa chọn diễn viên nào</div>
            )}
          </div>
        </div>
      </Col>
    </Row>
  );
};

export default ActorPicker; 