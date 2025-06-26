import { useEffect, useState } from 'react'
import { Breadcrumb, Button, Col, Container, Form, InputGroup, Pagination, Row, Table, Spinner, Toast, ToastContainer } from 'react-bootstrap'
import { FaEdit, FaFilter, FaHome, FaPlus, FaSearch, FaTrash } from 'react-icons/fa'
import ActorFormModal from '../../../components/ActorFormModal/ActorFormModal.jsx'
import { createEmptyActor } from "../../../utils/createEmptyActor.js";
import ConfirmModal from "../../../components/ConfirmModal/ConfirmModal.jsx";
import { actorService } from '../../../services/actorService.js';

export const ActorPage = () => {
  const [actors, setActors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('')
  const [submittedQuery, setSubmittedQuery] = useState('')
  const [showFilter, setShowFilter] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const itemsPerPage = 10

  const [showActorFormModal, setShowActorFormModal] = useState(false)
  const [selectedActor, setSelectedActor] = useState(createEmptyActor())
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [actorToDelete, setActorToDelete] = useState(null);
  const [toastInfo, setToastInfo] = useState({ show: false, message: '', type: 'danger' });

  const fetchActors = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage - 1,
        size: itemsPerPage,
        keyword: submittedQuery,
      };
      const { data } = await actorService.getAllActors(params);
      setActors(data.data?.content || []);
      setTotalPages(data.data?.totalPages || 1);
    } catch (error) {
      console.error("Failed to fetch actors:", error);
      setActors([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActors();
  }, [currentPage, submittedQuery]);

  const handleSearch = () => {
    setCurrentPage(1);
    setSubmittedQuery(searchQuery);
  };

  const handleFormModalHide = (result) => {
    setShowActorFormModal(false);
    if (result) {
      fetchActors();
    }
  }

  const handleApiError = (message) => {
    setToastInfo({ show: true, message, type: 'danger' });
  };

  const handleDeleteClick = (actor) => {
    setActorToDelete(actor);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (actorToDelete) {
      setIsDeleting(true);
      try {
        await actorService.deleteActor(actorToDelete.id);
        fetchActors();
      } catch (error) {
        console.error("Failed to delete actor:", error);
      } finally {
        setShowDeleteConfirm(false);
        setActorToDelete(null);
        setIsDeleting(false);
      }
    }
  };

  return (
    <Container fluid className="h-100 d-flex flex-column">
      {/* Breadcrumbs */}
      <Breadcrumb>
        <Breadcrumb.Item href="#">
          <FaHome className="me-1"/>
        </Breadcrumb.Item>
        <Breadcrumb.Item active>Diễn viên</Breadcrumb.Item>
      </Breadcrumb>

      {/* Action Section */}
      <Row className="mb-4 align-items-center justify-content-between">
        <Col xs={6} md={8} className="mb-2 mb-md-0">
          <InputGroup>
            <Form.Control
              placeholder="Tìm kiếm diễn viên"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyUp={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button variant="outline-secondary" className="d-flex align-items-center" onClick={handleSearch}>
              <FaSearch/>
            </Button>
          </InputGroup>
        </Col>

        <Col xs="auto" className="d-flex gap-2">
          <Button
            variant="outline-secondary"
            className="icon-button square-button"
            onClick={() => setShowFilter(!showFilter)}
            aria-label="Bộ lọc"
          >
            <FaFilter/>
            <span className="button-tooltip">Bộ lọc</span>
          </Button>

          <Button
            variant="primary"
            className="icon-button square-button"
            aria-label="Thêm diễn viên"
            onClick={() => {
              setSelectedActor(createEmptyActor())
              setShowActorFormModal(true)
            }}
          >
            <FaPlus/>
            <span className="button-tooltip">Thêm mới</span>
          </Button>
        </Col>
      </Row>

      <div className="table-responsive movie-table">
        <Table bordered hover className="align-middle mb-0 position-relative">
          <thead className="sticky-top">
          <tr>
            <th>Id</th>
            <th>Ảnh</th>
            <th>Tên</th>
            <th>Giới tính</th>
            <th>Ngày sinh</th>
            <th>Số phim tham gia</th>
            <th style={{width: '120px'}}>Hành động</th>
          </tr>
          </thead>
          <tbody>
          {loading ? (
            <tr>
              <td colSpan="7" className="text-center py-5">
                <Spinner animation="border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              </td>
            </tr>
          ) : (
            actors.map(actor => (
              <tr key={'actor-' + actor.id}>
                <td>{actor.id}</td>
                <td>
                  <img src={actor.avatarUrl} alt={actor.name} width="50" height="50" className="rounded-circle" style={{objectFit: 'cover'}}/>
                </td>
                <td>{actor.name}</td>
                <td>{actor.gender.toLowerCase() === 'male' ? 'Nam' : actor.gender.toLowerCase() === 'female' ? 'Nữ' : 'Khác'}</td>
                <td>{Array.isArray(actor.dob) ? actor.dob.join('-') : actor.dob}</td>
                <td>{actor.movieIds ? actor.movieIds.length : 0}</td>
                <td className="text-center p-1">
                  <div className="d-flex justify-content-center gap-2">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="p-1 icon-button border-0"
                      onClick={() => {
                        setSelectedActor(actor)
                        setShowActorFormModal(true)
                      }}
                    >
                      <FaEdit/>
                      <span className="button-tooltip">Chỉnh sửa</span>
                    </Button>
                    <Button variant="outline-danger" size="sm" className="p-1 icon-button border-0" onClick={() => handleDeleteClick(actor)}>
                      <FaTrash/>
                      <span className="button-tooltip">Xoá</span>
                    </Button>
                  </div>
                </td>
              </tr>
            ))
          )}
          </tbody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="d-flex justify-content-center mt-4">
        <Pagination className="mb-0">
          <Pagination.Prev
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => p - 1)}
          />
          {[...Array(totalPages).keys()].map(pageNumber => (
            <Pagination.Item
              key={pageNumber + 1}
              active={pageNumber + 1 === currentPage}
              onClick={() => setCurrentPage(pageNumber + 1)}
            >
              {pageNumber + 1}
            </Pagination.Item>
          ))}
          <Pagination.Next
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(p => p + 1)}
          />
        </Pagination>
      </div>

      <ActorFormModal
        show={showActorFormModal}
        onHide={handleFormModalHide}
        initialActor={selectedActor}
        onError={handleApiError}
      />

      <ConfirmModal
        show={showDeleteConfirm}
        onHide={() => setShowDeleteConfirm(false)}
        onConfirm={confirmDelete}
        title="Xác nhận xoá"
        message={`Bạn có chắc chắn muốn xoá diễn viên "${actorToDelete?.name}"?`}
        isConfirming={isDeleting}
      />

      <ToastContainer position="top-center" className="p-3" style={{ zIndex: 9999 }}>
        <Toast
          onClose={() => setToastInfo({ ...toastInfo, show: false })}
          show={toastInfo.show}
          delay={5000}
          autohide
          bg={toastInfo.type}
        >
          <Toast.Header closeButton={true}>
            <strong className="me-auto">Thông báo</strong>
          </Toast.Header>
          <Toast.Body className="text-white">{toastInfo.message}</Toast.Body>
        </Toast>
      </ToastContainer>
    </Container>
  )
}
