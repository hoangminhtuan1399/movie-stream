import { useEffect, useState } from 'react';
import { Button, Col, Container, Form, FormCheck, Modal, Row } from 'react-bootstrap';
import { FaPlus, FaTrash } from 'react-icons/fa';
import ConfirmModal from '../ConfirmModal/ConfirmModal.jsx';
import './MovieFormModal.css';

const genreOptions = [
  'Anime', 'Cổ trang', 'Chương trình truyền hình', 'Cổ tích',
  'Tâm lý', 'Hoạt hình', 'Hài', 'Viễn tưởng', 'Hành động',
  'Học đường', 'Kinh dị', 'Lịch sử', 'Marvel', 'Thể thao'
];

const MovieFormModal = ({show, onHide}) => {
  const [movies, setMovies] = useState([createEmptyMovie()]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [movieToDelete, setMovieToDelete] = useState(null);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [errors, setErrors] = useState([]);
  const [touched, setTouched] = useState([]);
  const [submitAttempted, setSubmitAttempted] = useState(false);

  function createEmptyMovie() {
    return {
      name: '',
      type: 'Lẻ',
      releaseYear: '',
      views: '',
      ageRating: 'PG',
      country: 'Việt Nam',
      genres: [],
      thumbnail: null,
      poster: null
    };
  }

  useEffect(() => {
    if (show) {
      setMovies([createEmptyMovie()]);
      setErrors([]);
      setTouched([]);
      setSubmitAttempted(false);
    }
  }, [show]);

  const validateMovie = (movie) => {
    const movieErrors = {};

    if (!movie.name.trim()) {
      movieErrors.name = 'Vui lòng nhập tên phim';
    }

    if (isNaN(movie.releaseYear)) {
      movieErrors.releaseYear = 'Năm phát hành phải là số';
    } else if (movie.releaseYear < 1900 || movie.releaseYear > new Date().getFullYear()) {
      movieErrors.releaseYear = `Năm phát hành phải từ 1900 đến ${new Date().getFullYear()}`;
    }

    if (isNaN(movie.views)) {
      movieErrors.views = 'Lượt xem phải là số';
    } else if (movie.views < 0) {
      movieErrors.views = 'Lượt xem không hợp lệ';
    }

    if (movie.genres.length === 0) {
      movieErrors.genres = 'Vui lòng chọn ít nhất 1 thể loại';
    }

    return movieErrors;
  };

  const handleAddRow = () => {
    setMovies([...movies, createEmptyMovie()]);
    setTouched([...touched, {}]);
    setErrors([...errors, {}]);
  };

  const handleDeleteRow = (index) => {
    setMovieToDelete(index);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteRow = () => {
    const newMovies = [...movies];
    newMovies.splice(movieToDelete, 1);
    setMovies(newMovies.length > 0 ? newMovies : [createEmptyMovie()]);

    const newErrors = [...errors];
    newErrors.splice(movieToDelete, 1);
    setErrors(newErrors);

    const newTouched = [...touched];
    newTouched.splice(movieToDelete, 1);
    setTouched(newTouched);

    setShowDeleteConfirm(false);
  };

  const handleChange = (index, field, value) => {
    const newMovies = [...movies];
    newMovies[index][field] = value;
    setMovies(newMovies);

    // Nếu đã blur field này rồi thì validate ngay
    if (touched[index]?.[field] || submitAttempted) {
      const newErrors = [...errors];
      newErrors[index] = validateMovie(newMovies[index]);
      setErrors(newErrors);
    }
  };

  const handleBlur = (index, field) => {
    const newTouched = [...touched];
    if (!newTouched[index]) newTouched[index] = {};
    newTouched[index][field] = true;
    setTouched(newTouched);

    // Validate field vừa blur
    const newErrors = [...errors];
    newErrors[index] = validateMovie(movies[index]);
    setErrors(newErrors);
  };

  const handleGenreChange = (index, genre, isChecked) => {
    const newMovies = [...movies];
    if (isChecked) {
      newMovies[index].genres = [...newMovies[index].genres, genre];
    } else {
      newMovies[index].genres = newMovies[index].genres.filter(g => g !== genre);
    }
    setMovies(newMovies);

    // Nếu đã blur genres rồi thì validate ngay
    if (touched[index]?.genres || submitAttempted) {
      const newErrors = [...errors];
      newErrors[index] = validateMovie(newMovies[index]);
      setErrors(newErrors);
    }
  };

  const handleFileChange = (index, field, e) => {
    const file = e.target.files[0];
    if (file) {
      handleChange(index, field, file);
    }
  };

  const handleSubmit = () => {
    setSubmitAttempted(true);

    // Validate tất cả movies
    const newErrors = movies.map(movie => validateMovie(movie));
    setErrors(newErrors);

    // Kiểm tra xem có lỗi nào không
    const isValid = newErrors.every(movieErrors => Object.keys(movieErrors).length === 0);

    if (isValid) {
      console.log('Movies to submit:', movies);
      onHide();
    } else {
      // Cuộn đến lỗi đầu tiên
      const firstErrorIndex = newErrors.findIndex(err => Object.keys(err).length > 0);
      if (firstErrorIndex !== -1) {
        document.querySelector(`.movie-row-${firstErrorIndex}`)?.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }
    }
  };

  const handleCancel = () => {
    if (movies.some(movie =>
      movie.name ||
      movie.releaseYear ||
      movie.views ||
      movie.genres.length > 0 ||
      movie.thumbnail ||
      movie.poster
    )) {
      setShowCancelConfirm(true);
    } else {
      onHide();
    }
  };

  const confirmCancel = () => {
    setMovies([createEmptyMovie()]);
    setErrors([]);
    setTouched([]);
    setShowCancelConfirm(false);
    onHide();
  };

  return (
    <>
      <Modal show={show} onHide={handleCancel} size="xl" centered>
        <Modal.Header closeButton>
          <Modal.Title>Thêm phim mới</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>
            <Container className={'movie-form-modal__cards has-scroll'}>
              {movies.map((movie, index) => (
                <div key={index} className={`p-3 mb-2 border rounded movie-row-${index}`}>
                  <Row className="mb-3">
                    <Form.Group as={Col} md={6}>
                      <Form.Label>Tên phim <span className="text-danger">*</span></Form.Label>
                      <Form.Control
                        type="text"
                        value={movie.name}
                        onChange={(e) => handleChange(index, 'name', e.target.value)}
                        onBlur={() => handleBlur(index, 'name')}
                        isInvalid={(touched[index]?.name || submitAttempted) && !!errors[index]?.name}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors[index]?.name}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group as={Col} md={3}>
                      <Form.Label>Kiểu phim</Form.Label>
                      <Form.Select
                        value={movie.type}
                        onChange={(e) => handleChange(index, 'type', e.target.value)}
                      >
                        <option value="Lẻ">Lẻ</option>
                        <option value="Bộ">Bộ</option>
                      </Form.Select>
                    </Form.Group>

                    <Form.Group as={Col} md={3}>
                      <Form.Label>Năm phát hành <span className="text-danger">*</span></Form.Label>
                      <Form.Control
                        type="number"
                        min="1900"
                        max={new Date().getFullYear() + 5}
                        value={movie.releaseYear}
                        onChange={(e) => handleChange(index, 'releaseYear', e.target.value)}
                        onBlur={() => handleBlur(index, 'releaseYear')}
                        isInvalid={(touched[index]?.releaseYear || submitAttempted) && !!errors[index]?.releaseYear}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors[index]?.releaseYear}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Row>

                  <Row className="mb-3">
                    <Form.Group as={Col} md={3}>
                      <Form.Label>Lượt xem</Form.Label>
                      <Form.Control
                        type="number"
                        min="0"
                        defaultValue={'0'}
                        value={movie.views}
                        onChange={(e) => handleChange(index, 'views', e.target.value)}
                        onBlur={() => handleBlur(index, 'views')}
                        isInvalid={(touched[index]?.views || submitAttempted) && !!errors[index]?.views}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors[index]?.views}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group as={Col} md={3}>
                      <Form.Label>Độ tuổi</Form.Label>
                      <Form.Select
                        value={movie.ageRating}
                        onChange={(e) => handleChange(index, 'ageRating', e.target.value)}
                      >
                        <option value="G">G</option>
                        <option value="PG">PG</option>
                        <option value="PG-13">PG-13</option>
                        <option value="R">R</option>
                      </Form.Select>
                    </Form.Group>

                    <Form.Group as={Col} md={3}>
                      <Form.Label>Quốc gia</Form.Label>
                      <Form.Select
                        value={movie.country}
                        onChange={(e) => handleChange(index, 'country', e.target.value)}
                      >
                        <option value="Âu Mỹ">Âu Mỹ</option>
                        <option value="Hàn Quốc">Hàn Quốc</option>
                        <option value="Thái Lan">Thái Lan</option>
                        <option value="Trung Quốc">Trung Quốc</option>
                        <option value="Việt Nam">Việt Nam</option>
                        <option value="Nhật Bản">Nhật Bản</option>
                      </Form.Select>
                    </Form.Group>
                  </Row>

                  <Row className="mb-3">
                    <Form.Group as={Col} md={12}>
                      <Form.Label>Thể loại <span className="text-danger">*</span></Form.Label>
                      <div className="d-flex flex-wrap gap-3">
                        {genreOptions.map(genre => (
                          <FormCheck
                            key={genre}
                            type="checkbox"
                            id={`genre-${index}-${genre}`}
                            label={genre}
                            checked={movie.genres.includes(genre)}
                            onChange={(e) => handleGenreChange(index, genre, e.target.checked)}
                            onBlur={() => handleBlur(index, 'genres')}
                            isInvalid={(touched[index]?.genres || submitAttempted) && !!errors[index]?.genres}
                          />
                        ))}
                      </div>
                      {(touched[index]?.genres || submitAttempted) && errors[index]?.genres && (
                        <div className="text-danger" style={{fontSize: '0.875em', marginTop: '0.25rem'}}>
                          {errors[index]?.genres}
                        </div>
                      )}
                    </Form.Group>
                  </Row>

                  <Row className="mb-3">
                    <Form.Group as={Col} md={6}>
                      <Form.Label>Ảnh nhỏ</Form.Label>
                      <Form.Control
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(index, 'thumbnail', e)}
                      />
                    </Form.Group>

                    <Form.Group as={Col} md={6}>
                      <Form.Label>Ảnh to</Form.Label>
                      <Form.Control
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(index, 'poster', e)}
                      />
                    </Form.Group>
                  </Row>

                  {movies.length > 1 && (
                    <div className="text-end">
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDeleteRow(index)}
                      >
                        <FaTrash/>
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </Container>

            <div className="text-center mt-3">
              <Button variant="outline-primary" onClick={handleAddRow}>
                <FaPlus className="me-2"/>
                Thêm phim
              </Button>
            </div>
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
        show={showDeleteConfirm}
        onHide={() => setShowDeleteConfirm(false)}
        onConfirm={confirmDeleteRow}
        title="Xác nhận xoá"
        message="Bạn có chắc chắn muốn xoá phim này?"
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

export default MovieFormModal;
