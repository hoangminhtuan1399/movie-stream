
import { useEffect, useState } from 'react';
import { Button, Col, Container, Form, Modal, Row } from 'react-bootstrap';
import ConfirmModal from '../ConfirmModal/ConfirmModal.jsx';
import MoviePicker from '../MoviePicker/MoviePicker.jsx';
import './ActorFormModal.css'
import { createEmptyActor } from "../../utils/createEmptyActor.js";

const ActorFormModal = ({ show, onHide, initialActor = createEmptyActor() }) => {
  const [actor, setActor] = useState(initialActor);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitAttempted, setSubmitAttempted] = useState(false);

  useEffect(() => {
    if (show) {
      setActor(initialActor);
      setErrors({});
      setTouched({});
      setSubmitAttempted(false);
    }
  }, [show, initialActor]);

  const validateActor = (actorToValidate = actor) => {
    const actorErrors = {};

    if (!actorToValidate.name.trim()) {
      actorErrors.name = 'Vui lòng nhập tên diễn viên';
    }

    if (actorToValidate.dob) {
      const dobDate = new Date(actorToValidate.dob);
      if (dobDate > new Date()) {
        actorErrors.dob = 'Ngày sinh không hợp lệ';
      }
    }

    return actorErrors;
  };

  const handleChange = (field, value) => {
    setActor(prev => ({ ...prev, [field]: value }));

    if (touched[field] || submitAttempted) {
      setErrors(validateActor({ ...actor, [field]: value }));
    }
  };

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    setErrors(validateActor());
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setActor(prev => ({ ...prev, avatar_url: file.name }));
  };

  const handleSubmit = () => {
    setSubmitAttempted(true);
    const newErrors = validateActor();
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      console.log('Actor to submit:', actor);
      onHide(actor);
    }
  };

  const handleCancel = () => {
    if (actor.name || actor.dob || actor.bio || actor.avatar_url || actor.movies.length > 0) {
      setShowCancelConfirm(true);
    } else {
      onHide();
    }
  };

  const confirmCancel = () => {
    setActor(initialActor);
    setErrors({});
    setTouched({});
    setShowCancelConfirm(false);
    onHide();
  };

  return (
    <>
      <Modal show={show} onHide={handleCancel} size="xl" centered>
        <Modal.Header closeButton>
          <Modal.Title>{initialActor.id ? 'Chỉnh sửa diễn viên' : 'Thêm diễn viên mới'}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>
            <Container className="actor-form-modal__cards has-scroll">
              <Row className="mb-3">
                <Form.Group as={Col} md={6}>
                  <Form.Label>Tên <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="text"
                    value={actor.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    onBlur={() => handleBlur('name')}
                    isInvalid={(touched.name || submitAttempted) && !!errors.name}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.name}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group as={Col} md={6}>
                  <Form.Label>Giới tính</Form.Label>
                  <Form.Select
                    value={actor.gender}
                    onChange={(e) => handleChange('gender', parseInt(e.target.value))}
                  >
                    <option value={0}>Nam</option>
                    <option value={1}>Nữ</option>
                    <option value={2}>Khác</option>
                  </Form.Select>
                </Form.Group>
              </Row>

              <Row className="mb-3">
                <Form.Group as={Col} md={6}>
                  <Form.Label>Ngày sinh</Form.Label>
                  <Form.Control
                    type="date"
                    value={actor.dob}
                    onChange={(e) => handleChange('dob', e.target.value)}
                    onBlur={() => handleBlur('dob')}
                    isInvalid={(touched.dob || submitAttempted) && !!errors.dob}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.dob}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group as={Col} md={6}>
                  <Form.Label>Ảnh đại diện</Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </Form.Group>
              </Row>

              <Row className="mb-3">
                <Form.Group as={Col} md={12}>
                  <Form.Label>Thông tin</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={actor.bio}
                    onChange={(e) => handleChange('bio', e.target.value)}
                  />
                </Form.Group>
              </Row>

              <Row className="mb-3">
                <Form.Group as={Col} md={12}>
                  <Form.Label>Phim tham gia</Form.Label>
                  <MoviePicker
                    selectedMovies={actor.movies}
                    onSelect={(movies) => handleChange('movies', movies)}
                  />
                </Form.Group>
              </Row>
            </Container>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleCancel}>
            Huỷ bỏ
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Xác nhận
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

export default ActorFormModal;
