import { useEffect, useState } from 'react'
import { Breadcrumb, Button, Col, Container, Form, InputGroup, Pagination, Row, Table, Spinner } from 'react-bootstrap'
import { FaEdit, FaHome, FaPlus, FaSearch, FaTrash } from 'react-icons/fa'
import CollectionFormModal from '../../../components/CollectionFormModal/CollectionFormModal'
import { createEmptyCollection } from "../../../utils/createEmptyCollection.js";
import { collectionService } from "../../../services/collectionService.js";
import ConfirmModal from "../../../components/ConfirmModal/ConfirmModal.jsx";
import { useToast } from '../../../contexts/ToastContext.jsx';

export const CollectionPage = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [showCollectionFormModal, setShowCollectionFormModal] = useState(false)
  const [selectedCollection, setSelectedCollection] = useState(createEmptyCollection());
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [collectionToDelete, setCollectionToDelete] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [submittedQuery, setSubmittedQuery] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const { showToast } = useToast();

  const itemsPerPage = 10

  const fetchCollections = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage - 1,
        size: itemsPerPage,
        keyword: submittedQuery,
      };
      const response = await collectionService.getAllCollections(params);
      setCollections(response.data.data.content || []);
      setTotalPages(response.data.data.totalPages || 1);
    } catch (error) {
      console.error("Failed to fetch collections:", error);
      setCollections([]);
      setTotalPages(1);
      showToast('Lỗi tải danh sách bộ sưu tập!', 'danger');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollections();
  }, [currentPage, submittedQuery]);

  const handleFormModalHide = (result) => {
    setShowCollectionFormModal(false);
    if (result) {
      fetchCollections();
    }
  }

  const handleDeleteClick = (collection) => {
    setCollectionToDelete(collection);
    setShowDeleteConfirm(true);
  };

  const handleEditClick = async (collection) => {
    let movies = collection.movies.map(id => id);
    setSelectedCollection({ ...collection, movies });
    setShowCollectionFormModal(true);
  };

  const confirmDelete = async () => {
    if (collectionToDelete) {
      setIsDeleting(true);
      try {
        await collectionService.deleteCollection(collectionToDelete.id);
        fetchCollections();
      } catch (error) {
        console.error("Failed to delete collection:", error);
        showToast('Lỗi xóa bộ sưu tập!', 'danger');
      } finally {
        setIsDeleting(false);
        setShowDeleteConfirm(false);
        setCollectionToDelete(null);
      }
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    setSubmittedQuery(searchQuery);
  };

  return (
    <Container fluid className="h-100 d-flex flex-column">
      {/* Breadcrumbs */}
      <Breadcrumb>
        <Breadcrumb.Item href="#">
          <FaHome className="me-1"/>
        </Breadcrumb.Item>
        <Breadcrumb.Item active>Bộ sưu tập</Breadcrumb.Item>
      </Breadcrumb>

      {/* Action Section */}
      <Row className="mb-4 align-items-center justify-content-between">
        <Col xs={6} md={8} className="mb-2 mb-md-0">
          <InputGroup>
            <Form.Control
              placeholder="Tìm kiếm bộ sưu tập"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button variant="outline-secondary" className="d-flex align-items-center" onClick={handleSearch}>
              <FaSearch/>
            </Button>
          </InputGroup>
        </Col>

        <Col xs="auto">
          <Button
            variant="primary"
            className="icon-button square-button"
            aria-label="Thêm bộ sưu tập"
            onClick={() => {
              setSelectedCollection(createEmptyCollection())
              setShowCollectionFormModal(true)
            }}
          >
            <FaPlus/>
            <span className="button-tooltip">Thêm mới</span>
          </Button>
        </Col>
      </Row>

      <div className="table-responsive movie-table">
        <Table bordered hover className="align-middle mb-0 position-relative">
          <thead className={'sticky-top'}>
          <tr>
            <th>Id</th>
            <th>Tiêu đề</th>
            <th>Số lượng phim</th>
            <th>Trạng thái</th>
            <th>Thứ tự</th>
            <th style={{width: '120px'}}>Hành động</th>
          </tr>
          </thead>
          <tbody>
          {loading ? (
            <tr>
              <td colSpan="6" className="text-center py-5">
                <Spinner animation="border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              </td>
            </tr>
          ) : (
            collections.map(collection => (
            <tr key={'collection-' + collection.id}>
              <td>{collection.id}</td>
              <td>{collection.name}</td>
              <td>{collection.movies ? collection.movies.length : 0}</td>
              <td>{collection.featured ? 'Hiện' : 'Ẩn'}</td>
              <td>{collection.index}</td>
              <td className="text-center p-1">
                <div className="d-flex justify-content-center gap-2">
                  <Button
                    variant="outline-primary"
                    size="sm"
                    className="p-1 icon-button border-0"
                    onClick={() => handleEditClick(collection)}
                  >
                    <FaEdit/>
                    <span className="button-tooltip">Chỉnh sửa</span>
                  </Button>
                  <Button variant="outline-danger" size="sm" className="p-1 icon-button border-0" onClick={() => handleDeleteClick(collection)}>
                    <FaTrash/>
                    <span className="button-tooltip">Xoá</span>
                  </Button>
                </div>
              </td>
            </tr>
          )))}
          </tbody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
      <div className="d-flex justify-content-center mt-4">
        <Pagination className="mb-0">
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
            onClick={() => setCurrentPage(p => p + 1)}
          />
        </Pagination>
      </div>
      )}

      <CollectionFormModal
        show={showCollectionFormModal}
        onHide={handleFormModalHide}
        initialCollection={selectedCollection}
      />

      <ConfirmModal
        show={showDeleteConfirm}
        onHide={() => setShowDeleteConfirm(false)}
        onConfirm={confirmDelete}
        title="Xác nhận xoá"
        message={`Bạn có chắc chắn muốn xoá bộ sưu tập "${collectionToDelete?.name}"?`}
        confirmLoading={isDeleting}
      />
    </Container>
  )
}
