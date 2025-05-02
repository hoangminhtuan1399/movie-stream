import { useState } from 'react'
import { Breadcrumb, Button, Col, Container, Form, InputGroup, Pagination, Row, Table } from 'react-bootstrap'
import { FaEdit, FaFilter, FaHome, FaPlus, FaSearch, FaTrash } from 'react-icons/fa'
import './MoviePage.css'
import { movies } from "./dummyData.js";
import MovieFormModal from "../../../components/MovieFormModal/MovieFormModal.jsx";

export const MoviePage = () => {
  // State cho các control
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilter, setShowFilter] = useState(false)

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const [showModal, setShowModal] = useState(false);

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
            />
            <Button variant="outline-secondary" className={'d-flex align-items-center'}>
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
            aria-label="Thêm phim"
            onClick={() => setShowModal(true)}
          >
            <FaPlus />
            <span className="button-tooltip">Thêm phim</span>
          </Button>

          <MovieFormModal
            show={showModal}
            onHide={() => setShowModal(false)}
          />
        </Col>
      </Row>

      <div className="table-responsive movie-table">
        <Table bordered hover className="align-middle mb-0 position-relative">
          <thead className={'sticky-top'}>
          <tr>
            <th>Id</th>
            <th width={72}>Ảnh</th>
            <th>Tên</th>
            <th>Thể loại</th>
            <th>Năm phát hành</th>
            <th>Bộ sưu tập</th>
            <th>Lượt xem</th>
            <th style={{width: '120px'}}>Actions</th>
          </tr>
          </thead>
          <tbody>
          {movies.length > 0 ? (
            movies.map(movie => (
              <tr key={movie.id}>
                <td>{movie.id}</td>
                <td>
                  <img
                    src={movie.image}
                    alt={movie.title}
                    className={'movie-item__image'}
                  />
                </td>
                <td>{movie.title}</td>
                <td>{movie.genre}</td>
                <td>{movie.releaseYear}</td>
                <td>{movie.collection}</td>
                <td>{movie.views.toLocaleString()}</td>
                <td className="text-center p-1">
                  <div className="d-flex justify-content-center gap-2">
                    <Button variant="outline-primary" size="sm" className="p-1 icon-button border-0">
                      <FaEdit/>
                      <span className="button-tooltip">Chỉnh sửa</span>
                    </Button>
                    <Button variant="outline-danger" size="sm" className="p-1 icon-button border-0">
                      <FaTrash/>
                      <span className="button-tooltip">Xoá</span>
                    </Button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" className="text-center py-4">Không có dữ liệu</td>
            </tr>
          )}
          </tbody>
        </Table>
      </div>

      {/* Pagination */}
      {movies.length > 0 && (
        <div className="d-flex justify-content-center mt-4">
          <Pagination className={'mb-0'}>
            <Pagination.Prev
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            />
            <Pagination.Item active>{currentPage}</Pagination.Item>
            <Pagination.Next
              disabled={movies.length < itemsPerPage}
              onClick={() => setCurrentPage(p => p + 1)}
            />
          </Pagination>
        </div>
      )}
    </Container>
  )
}
