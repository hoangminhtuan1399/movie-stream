import { useState } from 'react';
import { Button, Col, Form, Row, Pagination, InputGroup } from 'react-bootstrap';
import { FaSearch, FaTimes } from 'react-icons/fa';

// Dummy data cho collections
const dummyCollections = [
  { id: 1, name: 'Phim hot trong tuần' },
  { id: 2, name: 'Phim chiếu rạp mới nhất' },
  { id: 3, name: 'Phim Việt Nam hay nhất' },
  { id: 4, name: 'Phim hành động đỉnh cao' },
  { id: 5, name: 'Phim tình cảm lãng mạn' },
  { id: 6, name: 'Phim kinh dị nổi bật' },
  { id: 7, name: 'Phim hoạt hình cho gia đình' },
  { id: 8, name: 'Phim khoa học viễn tưởng' },
];

const ITEMS_PER_PAGE = 5;

const CollectionPicker = ({ selectedCollections, onSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Lọc collections theo search term
  const filteredCollections = dummyCollections.filter(collection =>
    collection.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Phân trang
  const totalPages = Math.ceil(filteredCollections.length / ITEMS_PER_PAGE);
  const paginatedCollections = filteredCollections.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleCollectionToggle = (collectionId) => {
    const newSelected = selectedCollections.includes(collectionId)
      ? selectedCollections.filter(id => id !== collectionId)
      : [...selectedCollections, collectionId];
    onSelect(newSelected);
  };

  const removeCollection = (collectionId) => {
    onSelect(selectedCollections.filter(id => id !== collectionId));
  };

  return (
    <Row className="g-3">
      {/* Cột bên trái - Danh sách collections */}
      <Col md={8}>
        <div className="border p-3 rounded">
          <h5>Bộ sưu tập</h5>

          {/* Search bar */}
          <div className="mb-3">
            <InputGroup>
              <Form.Control
                placeholder="Tìm kiếm bộ sưu tập..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Button variant="outline-secondary">
                <FaSearch />
              </Button>
            </InputGroup>
          </div>

          {/* Collection list */}
          <div className="mb-3 has-scroll" style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {paginatedCollections.length > 0 ? (
              paginatedCollections.map(collection => (
                <Form.Check
                  key={collection.id}
                  type="checkbox"
                  id={`collection-${collection.id}`}
                  label={collection.name}
                  checked={selectedCollections.includes(collection.id)}
                  onChange={() => handleCollectionToggle(collection.id)}
                  className="mb-2"
                />
              ))
            ) : (
              <div className="text-muted">Không tìm thấy bộ sưu tập phù hợp</div>
            )}
          </div>

          {/* Pagination */}
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

      {/* Cột bên phải - Collections đã chọn */}
      <Col md={4}>
        <div className="border p-3 rounded">
          <h5>Đã chọn</h5>
          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {selectedCollections.length > 0 ? (
              selectedCollections.map(collectionId => {
                const collection = dummyCollections.find(c => c.id === collectionId);
                return collection ? (
                  <div key={collectionId} className="d-flex justify-content-between align-items-center mb-2 p-2 bg-light rounded">
                    <span>{collection.name}</span>
                    <Button
                      variant="link"
                      size="sm"
                      className="text-danger p-0"
                      onClick={() => removeCollection(collectionId)}
                    >
                      <FaTimes />
                    </Button>
                  </div>
                ) : null;
              })
            ) : (
              <div className="text-muted">Chưa chọn bộ sưu tập nào</div>
            )}
          </div>
        </div>
      </Col>
    </Row>
  );
};

export default CollectionPicker;
