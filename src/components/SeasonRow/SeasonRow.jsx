import { Button, Col, Form, Row } from 'react-bootstrap';
import { FaPlus, FaTrash } from 'react-icons/fa';
import ConfirmModal from '../ConfirmModal/ConfirmModal.jsx';
import { useState } from 'react';
import EpisodeRow from '../../components/EpisodeRow/EpisodeRow.jsx';

const SeasonRow = ({ season, index, onDelete, onChange, onAddEpisode, onChangeEpisode, onDeleteEpisode, errors }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleChange = (field, value) => {
    onChange(field, value);
  };

  return (
    <div className="mb-4 p-3 border rounded season-row">
      <Row className="mb-3">
        <Col md={6}>
          <Form.Label>Tên mùa</Form.Label>
          <Form.Control
            type="text"
            value={season.name}
            onChange={(e) => handleChange('name', e.target.value)}
          />
        </Col>
        {onDelete && (
          <Col md={6} className="text-end d-flex justify-content-end">
            <Button
              className={'icon-button me-2'}
              variant="outline-danger"
              size="sm"
              onClick={() => setShowDeleteConfirm(true)}
            >
              <FaTrash />
              <span className="button-tooltip">Xoá mùa phim</span>
            </Button>
          </Col>
        )}
      </Row>

      <div className="mb-3">
        {season.episodes.map((episode, epIndex) => (
          <EpisodeRow
            key={epIndex}
            episode={episode}
            index={epIndex}
            seasonIndex={index}
            onChange={onChangeEpisode}
            onDelete={season.episodes.length > 1 ? onDeleteEpisode : null}
            errors={errors?.[epIndex]}
          />
        ))}
      </div>

      <div className="text-center">
        <Button variant="outline-secondary" size="sm" onClick={() => {
          onAddEpisode(index)
        }}>
          <FaPlus className="me-2" />
          Thêm tập
        </Button>
      </div>

      <ConfirmModal
        show={showDeleteConfirm}
        onHide={() => setShowDeleteConfirm(false)}
        onConfirm={() => {
          onDelete(index);
          setShowDeleteConfirm(false);
        }}
        title="Xác nhận xoá"
        message="Bạn có chắc chắn muốn xoá mùa phim này?"
      />
    </div>
  );
};

export default SeasonRow;
