import { useEffect, useState } from 'react'
import { Breadcrumb, Button, Col, Container, Form, InputGroup, Pagination, Row, Table, Spinner } from 'react-bootstrap'
import { FaEdit, FaFilter, FaHome, FaPlus, FaSearch, FaTrash } from 'react-icons/fa'
import './MoviePage.css'
import MovieFormModal from "../../../components/MovieFormModal/MovieFormModal.jsx";
import { createEmptyMovie } from "../../../utils/createEmptyMovie.js";
import { movieServiceApi } from '../../../services/movieService.js';
import ConfirmModal from '../../../components/ConfirmModal/ConfirmModal.jsx';
import { useToast } from '../../../contexts/ToastContext.jsx';

export const MoviePage = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [submittedQuery, setSubmittedQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  const [showModal, setShowModal] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(createEmptyMovie());
  const { showToast } = useToast();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [movieToDelete, setMovieToDelete] = useState(null);

  const fetchMovies = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage - 1,
        size: itemsPerPage,
        keyword: submittedQuery,
      };
      const { data } = await movieServiceApi.getMovies(params);
      setMovies(data.data.content || []);
      setTotalPages(data.data.totalPages || 1);
    } catch (error) {
      console.error("Failed to fetch movies:", error);
      setMovies([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, [currentPage, submittedQuery]);
  
  const handleSearch = () => {
    setCurrentPage(1);
    setSubmittedQuery(searchQuery);
  };

  const handleModalHide = (result) => {
    setShowModal(false);
    if (result) {
      fetchMovies();
    }
  };

  const handleApiError = (message) => {
    showToast(message, 'danger');
  };
  
  const handleDeleteClick = (movie) => {
    setMovieToDelete(movie);
    setShowDeleteConfirm(true);
  };
  
  const confirmDelete = async () => {
    if (movieToDelete) {
      try {
        await movieServiceApi.deleteMovie(movieToDelete.id);
        fetchMovies();
      } catch (error) {
        console.error("Failed to delete movie:", error);
        handleApiError('Xoá phim thất bại.');
      } finally {
        setShowDeleteConfirm(false);
        setMovieToDelete(null);
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
        <Breadcrumb.Item active>Phim</Breadcrumb.Item>
      </Breadcrumb>

      {/* Action Section */}
      <Row className="mb-4 align-items-center justify-content-between">
        <Col xs={6} md={8} className="mb-2 mb-md-0">
          <InputGroup>
            <Form.Control
              placeholder="Tìm kiếm phim"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyUp={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button variant="outline-secondary" className={'d-flex align-items-center'} onClick={handleSearch}>
              <FaSearch/>
            </Button>
          </InputGroup>
        </Col>

        <Col xs="auto" className="d-flex gap-2">
          <Button
            variant="primary"
            className="icon-button square-button"
            aria-label="Thêm phim"
            onClick={() => {
              setSelectedMovie(createEmptyMovie());
              setShowModal(true);
            }}
          >
            <FaPlus/>
            <span className="button-tooltip">Thêm phim</span>
          </Button>
        </Col>
      </Row>

      <MovieFormModal
        show={showModal}
        onHide={handleModalHide}
        initialMovie={selectedMovie}
        onError={handleApiError}
      />

      <div className="table-responsive movie-table">
        <Table bordered hover className="align-middle mb-0 position-relative">
          <thead className={'sticky-top'}>
          <tr>
            <th>Id</th>
            <th width={72}>Ảnh</th>
            <th>Tên</th>
            <th>Năm phát hành</th>
            <th>Lượt xem</th>
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
          ) : movies.length > 0 ? (
            movies.map(movie => (
              <tr key={movie.id}>
                <td>{movie.id}</td>
                <td>
                  <img
                    src={movie.bigBanner || '/default-thumbnail.jpg'}
                    alt={movie.title}
                    className={'movie-item__image'}
                  />
                </td>
                <td>{movie.title}</td>
                <td>{movie.year}</td>
                <td>{movie.views?.toLocaleString() || 0}</td>
                <td className="text-center p-1">
                  <div className="d-flex justify-content-center gap-2">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="p-1 icon-button border-0"
                      onClick={() => {
                        setSelectedMovie(movie);
                        setShowModal(true);
                      }}>
                      <FaEdit/>
                      <span className="button-tooltip">Chỉnh sửa</span>
                    </Button>
                    <Button variant="outline-danger" size="sm" className="p-1 icon-button border-0" onClick={() => handleDeleteClick(movie)}>
                      <FaTrash/>
                      <span className="button-tooltip">Xoá</span>
                    </Button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center py-4">Không có dữ liệu</td>
            </tr>
          )}
          </tbody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="d-flex justify-content-center mt-4">
          <Pagination className={'mb-0'}>
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
      )}
      
      <ConfirmModal
        show={showDeleteConfirm}
        onHide={() => setShowDeleteConfirm(false)}
        onConfirm={confirmDelete}
        title="Xác nhận xoá"
        message={`Bạn có chắc chắn muốn xoá phim "${movieToDelete?.title}"?`}
      />
    </Container>
  )
}
