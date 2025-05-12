import { useState } from 'react'
import { Breadcrumb, Button, Col, Container, Form, InputGroup, Pagination, Row, Table } from 'react-bootstrap'
import { FaEdit, FaHome, FaPlus, FaSearch, FaTrash } from 'react-icons/fa'
import { collections } from './dummyData'
import CollectionFormModal from '../../../components/CollectionFormModal/CollectionFormModal'
import { createEmptyCollection } from "../../../utils/createEmptyCollection.js";

export const CollectionPage = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [showCollectionFormModal, setShowCollectionFormModal] = useState(false)

  const itemsPerPage = 10

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
            <Button variant="outline-secondary" className="d-flex align-items-center">
              <FaSearch/>
            </Button>
          </InputGroup>
        </Col>

        <Col xs="auto">
          <Button
            variant="primary"
            className="icon-button square-button"
            aria-label="Thêm bộ sưu tập"
            onClick={() => setShowCollectionFormModal(true)}
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
          {collections.map(collection => (
            <tr key={'collection-' + collection.id}>
              <td>{collection.id}</td>
              <td>{collection.title}</td>
              <td>{collection.movies.length}</td>
              <td>{collection.featured ? 'Hiện' : 'Ẩn'}</td>
              <td>{collection.index}</td>
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
            disabled={collections.length <= itemsPerPage}
            onClick={() => setCurrentPage(p => p + 1)}
          />
        </Pagination>
      </div>

      <CollectionFormModal
        show={showCollectionFormModal}
        onHide={() => setShowCollectionFormModal(false)}
        initialCollection={createEmptyCollection()}
      />
    </Container>
  )
}
