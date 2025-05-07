import { Button, Col, Form, Row } from 'react-bootstrap';
import { FaTrash } from 'react-icons/fa';
import ConfirmModal from '../ConfirmModal/ConfirmModal.jsx';
import { useState } from 'react';

const EpisodeRow = ({episode, index, seasonIndex, onDelete, onChange, errors}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleFileChange = (field, e) => {
    const file = e.target.files[0];
    if (file) {
      onChange(index, field, file.name);
    }
  };

  return (
    <>
      <Row className="mt-3 align-items-center episode-row">
        <Col md={1} className={'align-self-start'}>
          <Form.Label>Tập {index + 1}</Form.Label>
          <p></p>
        </Col>
        <Col md={5}>
          <Form.Label>Lồng tiếng</Form.Label>
          <Form.Control
            type="file"
            accept="video/*"
            onChange={(e) => handleFileChange('dubbed', e)}
          />
        </Col>
        <Col md={5}>
          <Form.Label>Vietsub</Form.Label>
          <Form.Control
            type="file"
            accept="video/*"
            onChange={(e) => handleFileChange('subbed', e)}
          />
        </Col>
        {onDelete && (
          <Col md={1} className="text-end">
            <Form.Label className={'opacity-0'}>Delete</Form.Label>
            <Button
              className={'icon-button ms-auto me-2'}
              variant="outline-danger"
              size="sm"
              onClick={() => setShowDeleteConfirm(true)}
            >
              <FaTrash/>
              <span className="button-tooltip">Xoá tập</span>
            </Button>
          </Col>
        )}
      </Row>
      {errors?.video && (
        <Row>
          <Col md={1}></Col>
          <Col md={'auto'}>
            <div
              className="text-danger invalid-feedback d-block"
              style={{fontSize: '0.875em', marginTop: '0.25rem'}}
            >
              {errors.video}
            </div>
          </Col>
        </Row>
      )}

      <ConfirmModal
        show={showDeleteConfirm}
        onHide={() => setShowDeleteConfirm(false)}
        onConfirm={() => {
          onDelete(seasonIndex, index)
          setShowDeleteConfirm(false)
        }}
        title="Xác nhận xoá"
        message="Bạn có chắc chắn muốn xoá tập phim này?"
      />
    </>
  );
};

export default EpisodeRow;
