import { useEffect, useState } from 'react';
import { Button, Col, Container, Form, Modal, Row } from 'react-bootstrap';
import ConfirmModal from '../../components/ConfirmModal/ConfirmModal.jsx';
import { createEmptyCollection } from "../../utils/createEmptyCollection.js";
import { collectionService } from "../../services/collectionService.js";
import MoviePicker from '../MoviePicker/MoviePicker.jsx';

const CollectionFormModal = ({ show, onHide, initialCollection = createEmptyCollection() }) => {
  const [collection, setCollection] = useState(initialCollection);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  useEffect(() => {
    if (show) {
      setCollection(initialCollection);
      setErrors({});
      setTouched({});
      setSubmitAttempted(false);
    }
  }, [show, initialCollection]);

  const validateCollection = (collectionToValidate = collection) => {
    const collectionErrors = {};
    if (!collectionToValidate?.name?.trim()) {
      collectionErrors.name = 'Vui lòng nhập tên bộ sưu tập';
    }
    return collectionErrors;
  };

  const handleChange = (field, value) => {
    setCollection(prev => ({ ...prev, [field]: value }));
    if (touched[field] || submitAttempted) {
      setErrors(validateCollection({ ...collection, [field]: value }));
    }
  };

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    setErrors(validateCollection());
  };

  const handleSubmit = async () => {
    setSubmitAttempted(true);
    const newErrors = validateCollection();
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      setIsSubmitting(true);
      const payload = {
        name: collection.name,
        featured: collection.featured,
        movieIds: collection.movies.map(movie => movie),
      };
      try {
        let response;
        if (collection.id) {
          response = await collectionService.updateCollection(collection.id, payload);
        } else {
          response = await collectionService.createCollection(payload);
        }
        onHide(response.data);
      } catch (error) {
        console.error('Failed to save collection', error);
        // Có thể set thông báo lỗi ở đây
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleCancel = () => {
    if (collection.name || collection.movies.length > 0) {
      setShowCancelConfirm(true);
    } else {
      onHide();
    }
  };

  const confirmCancel = () => {
    setCollection(initialCollection);
    setErrors({});
    setTouched({});
    setShowCancelConfirm(false);
    onHide();
  };

  return (
    <>
      <Modal show={show} onHide={handleCancel} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>{initialCollection.id ? 'Chỉnh sửa bộ sưu tập' : 'Thêm bộ sưu tập mới'}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>
            <Container className={'movie-form-modal__cards has-scroll'}>
              <Row className="mb-3">
                <Form.Group as={Col} md={6}>
                  <Form.Label>Tên bộ sưu tập <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="text"
                    value={collection.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    onBlur={() => handleBlur('name')}
                    isInvalid={(touched.name || submitAttempted) && !!errors.name}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.name}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md={6}>
                  <Form.Label>Thứ tự</Form.Label>
                  <Form.Control
                    type="number"
                    min="0"
                    value={collection.index}
                    onChange={(e) => handleChange('index', e.target.value)}
                  />
                  <Form.Text className="text-muted">
                    Bỏ trống để đặt thứ tự ưu tiên thấp nhất
                  </Form.Text>
                </Form.Group>
              </Row>

              <Row className="mb-3">
                <Form.Group as={Col} md={6}>
                  <Form.Label>Trạng thái</Form.Label>
                  <Form.Check
                    type="switch"
                    id="featured-switch"
                    label={collection.featured ? 'Hiện' : 'Ẩn'}
                    checked={collection.featured}
                    onChange={(e) => handleChange('featured', e.target.checked)}
                  />
                </Form.Group>
              </Row>

              <Row className="mb-3">
                <Form.Group as={Col} md={12}>
                  <Form.Label>Danh sách phim</Form.Label>
                  <MoviePicker
                    selectedMovies={collection.movies}
                    onSelect={(movies) => handleChange('movies', movies)}
                  />
                </Form.Group>
              </Row>
            </Container>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleCancel} disabled={isSubmitting}>
            Huỷ bỏ
          </Button>
          <Button variant="primary" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Đang lưu...
              </>
            ) : 'Xác nhận'}
          </Button>
        </Modal.Footer>
      </Modal>

      <ConfirmModal
        show={showCancelConfirm}
        onHide={() => setShowCancelConfirm(false)}
        onConfirm={confirmCancel}
        title="Xác nhận huỷ"
        message="Bạn có chắc chắn muốn huỷ bỏ? Tất cả thay đổi sẽ không được lưu."
      />
    </>
  );
};

export default CollectionFormModal;
