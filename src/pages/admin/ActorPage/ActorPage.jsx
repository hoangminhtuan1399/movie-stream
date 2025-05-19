import { useState } from 'react'
import { Breadcrumb, Button, Col, Container, Form, InputGroup, Pagination, Row, Table } from 'react-bootstrap'
import { FaEdit, FaFilter, FaHome, FaPlus, FaSearch, FaTrash } from 'react-icons/fa'
import { actors } from './dummyActors.js'
import ActorFormModal from '../../../components/ActorFormModal/ActorFormModal.jsx'
import { createEmptyActor } from "../../../utils/createEmptyActor.js";

export const ActorPage = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilter, setShowFilter] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const [showActorFormModal, setShowActorFormModal] = useState(false)
  const [selectedActor, setSelectedActor] = useState(createEmptyActor())

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
            />
            <Button variant="outline-secondary" className="d-flex align-items-center">
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
          {actors.map(actor => (
            <tr key={'actor-' + actor.id}>
              <td>{actor.id}</td>
              <td>
                <img src={actor.avatar_url} alt={actor.name} width="50" height="50" style={{objectFit: 'cover'}}/>
              </td>
              <td>{actor.name}</td>
              <td>{actor.gender === 0 ? 'Nam' : actor.gender === 1 ? 'Nữ' : 'Khác'}</td>
              <td>{actor.dob}</td>
              <td>{actor.movies.length}</td>
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
                  <Button variant="outline-danger" size="sm" className="p-1 icon-button border-0">
                    <FaTrash/>
                    <span className="button-tooltip">Xoá</span>
                  </Button>
                </div>
              </td>
            </tr>
          ))}
          </tbody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="d-flex justify-content-center mt-4">
        <Pagination className="mb-0">
          <Pagination.Prev
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
          />
          <Pagination.Item active>{currentPage}</Pagination.Item>
          <Pagination.Next
            disabled={actors.length <= itemsPerPage}
            onClick={() => setCurrentPage(p => p + 1)}
          />
        </Pagination>
      </div>

      <ActorFormModal
        show={showActorFormModal}
        onHide={(actor) => {
          if (actor) {
            console.log('Actor to save:', actor)
            // TODO: Handle save actor
          }
          setShowActorFormModal(false)
        }}
        initialActor={selectedActor}
      />
    </Container>
  )
}
