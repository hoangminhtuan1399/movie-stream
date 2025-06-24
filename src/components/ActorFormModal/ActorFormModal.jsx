import { useEffect, useState } from 'react';
import { Button, Col, Container, Form, Modal, Row, Spinner } from 'react-bootstrap';
import ConfirmModal from '../ConfirmModal/ConfirmModal.jsx';
import MoviePicker from '../MoviePicker/MoviePicker.jsx';
import './ActorFormModal.css'
import { createEmptyActor } from "../../utils/createEmptyActor.js";
import { actorService } from "../../services/actorService.js";
import FilePickerInput from '../FileUpload/FilePickerInput.jsx';
import FileSelectModal from '../FileUpload/FileSelectModal.jsx';

const ActorFormModal = ({ show, onHide, initialActor, onError }) => {
  const [actor, setActor] = useState(createEmptyActor());
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [showFileModal, setShowFileModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (show) {
      const genderMapFromApi = {
        'MALE': 0,
        'FEMALE': 1,
        'OTHER': 2
      };

      let formActor = createEmptyActor();

      if (initialActor && initialActor.id) {
        formActor = {
          ...createEmptyActor(),
          ...initialActor,
          gender: genderMapFromApi[initialActor.gender?.toUpperCase()] ?? 0,
          avatar_url: initialActor.avatarUrl || '',
          dob: Array.isArray(initialActor.dob) && initialActor.dob.length === 3
            ? `${initialActor.dob[0]}-${String(initialActor.dob[1]).padStart(2, '0')}-${String(initialActor.dob[2]).padStart(2, '0')}`
            : initialActor.dob || '',
          movies: initialActor.movieIds || [],
        };
      }
      setActor(formActor);
      setErrors({});
      setTouched({});
      setSubmitAttempted(false);
      setIsSubmitting(false);
    }
  }, [show, initialActor]);

  const handleModalSelect = (files) => {
    if (files?.length > 0) {
      setActor(prev => ({...prev, avatar_url: files[0].url}));
    }
    setShowFileModal(false);
  };

  const handleModalUpload = (file) => {
    if (file) {
      const tempPath = `(uploading) ${file.name}`;
      setActor(prev => ({...prev, avatar_url: tempPath}));
      // TODO: Trigger actual file upload service here
    }
    setShowFileModal(false);
  };
  
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

  const handleSubmit = async () => {
    setSubmitAttempted(true);
    const newErrors = validateActor();
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setIsSubmitting(true);
      const genderMapping = {
        0: 'male',
        1: 'female',
        2: 'other'
      };

      const payload = {
        name: actor.name,
        gender: genderMapping[actor.gender],
        dob: actor.dob,
        avatarUrl: actor.avatar_url,
        bio: actor.bio,
      };

      try {
        let response;
        if (actor.id) {
          response = await actorService.updateActor(actor.id, payload);
        } else {
          response = await actorService.createActor(payload);
        }
        onHide(response.data);
      } catch (error) {
        console.error('Failed to save actor', error);
        if (onError) {
          const errorMessage = error.response?.data?.message || 'Lưu diễn viên thất bại.';
          onError(errorMessage);
        }
      } finally {
        setIsSubmitting(false);
      }
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
    setActor(createEmptyActor());
    setErrors({});
    setTouched({});
    setShowCancelConfirm(false);
    onHide();
  };

  return (
    <>
      <Modal show={show} onHide={handleCancel} size="xl" centered>
        <Modal.Header closeButton>
          <Modal.Title>{actor.id ? 'Chỉnh sửa diễn viên' : 'Thêm diễn viên mới'}</Modal.Title>
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
                  <FilePickerInput
                    value={actor.avatar_url || ''}
                    onClick={() => setShowFileModal(true)}
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
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
                <span className="ms-1">Đang lưu...</span>
              </>
            ) : (
              'Xác nhận'
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      <FileSelectModal
        show={showFileModal}
        onClose={() => setShowFileModal(false)}
        onSelect={handleModalSelect}
        onUpload={handleModalUpload}
        isMultiselect={false}
      />

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
