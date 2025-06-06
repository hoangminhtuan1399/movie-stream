import { useCallback, useEffect, useState } from 'react';
import { Button, Col, Container, Form, FormCheck, Modal, Row } from 'react-bootstrap';
import { FaPlus } from 'react-icons/fa';
import ConfirmModal from '../ConfirmModal/ConfirmModal.jsx';
import './MovieFormModal.css';
import { createEmptyMovie } from "../../utils/createEmptyMovie.js";
import { genreOptions } from "../../utils/genreOptions.js";
import { ageRatingOptions } from "../../utils/ageRatingOptions.js";
import { generateOptions } from "../../utils/generateOptions.jsx";
import { countryOptions } from "../../utils/countryOptions.js";
import { MOVIE_TYPES, movieTypeOptions } from "../../utils/movieTypeOptions.js";
import { createEmptySeason } from "../../utils/createEmptySeason.js";
import { createEmptyEpisode } from "../../utils/createEmptyEpisode.js";
import SeasonRow from "../SeasonRow/SeasonRow.jsx";
import CollectionPicker from "../CollectionPicker/CollectionPicker.jsx";

const MovieFormModal = ({show, onHide, initialMovie = createEmptyMovie()}) => {
  const [movie, setMovie] = useState(initialMovie);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitAttempted, setSubmitAttempted] = useState(false);

  useEffect(() => {
    if (show) {
      setMovie(initialMovie);
      setErrors({});
      setTouched({});
      setSubmitAttempted(false);
    }
  }, [show, initialMovie]);

  const validateMovie = (movieToValidate = movie) => {
    const movieErrors = {};

    if (!movieToValidate.title.trim()) {
      movieErrors.title = 'Vui lòng nhập tên phim';
    }

    if (isNaN(movieToValidate.releaseYear)) {
      movieErrors.releaseYear = 'Năm phát hành phải là số';
    } else if (movieToValidate.releaseYear > new Date().getFullYear()) {
      movieErrors.releaseYear = `Năm phát hành không hợp lệ`;
    }

    if (isNaN(movieToValidate.views)) {
      movieErrors.views = 'Lượt xem phải là số';
    } else if (movieToValidate.views < 0) {
      movieErrors.views = 'Lượt xem không hợp lệ';
    }

    if (movieToValidate.genres.length === 0) {
      movieErrors.genres = 'Vui lòng chọn ít nhất 1 thể loại';
    }

    if (movieToValidate.type === MOVIE_TYPES.SINGLE) {
      if (!movieToValidate.singleStream.dubbed.fileUrl && !movieToValidate.singleStream.subbed.fileUrl) {
        movieErrors.singleStream = 'Vui lòng upload ít nhất 1 phiên bản video';
      }
    }

    if (movieToValidate.type === MOVIE_TYPES.SEASON) {
      const seasonErrors = movieToValidate.seasons.map((season) => {
        const episodeErrors = season.episodes.map((episode) => {
          const errors = {};
          if (!episode.dubbed.fileUrl && !episode.subbed.fileUrl) {
            errors.video = 'Vui lòng upload ít nhất 1 phiên bản video';
          }
          return Object.keys(errors).length > 0 ? errors : null;
        });
        return episodeErrors.some(e => e) ? episodeErrors : null;
      });

      if (seasonErrors.some(s => s)) {
        movieErrors.seasons = seasonErrors;
      }
    }

    return movieErrors;
  };

  const handleAddSeason = () => {
    setMovie(prev => ({
      ...prev,
      seasons: [...prev.seasons, createEmptySeason()]
    }));
  };

  const handleDeleteSeason = (seasonIndex) => {
    setMovie(prev => ({
      ...prev,
      seasons: prev.seasons.filter((_, i) => i !== seasonIndex)
    }));
  };

  const handleAddEpisode = useCallback((seasonIndex) => {
    setMovie(prev => {
      const newSeasons = JSON.parse(JSON.stringify(prev.seasons));
      newSeasons[seasonIndex].episodes.push(createEmptyEpisode());
      return {...prev, seasons: newSeasons};
    });
  }, []);

  const handleDeleteEpisode = (seasonIndex, episodeIndex) => {
    setMovie(prev => {
      const newSeasons = JSON.parse(JSON.stringify(prev.seasons));
      newSeasons[seasonIndex].episodes = newSeasons[seasonIndex].episodes.filter((_, i) => i !== episodeIndex);
      return {...prev, seasons: newSeasons};
    });
  };

  const handleSeasonChange = (seasonIndex, field, value) => {
    setMovie(prev => {
      const newSeasons = JSON.parse(JSON.stringify(prev.seasons));
      newSeasons[seasonIndex][field] = value;
      return {...prev, seasons: newSeasons};
    });
  };

  const handleEpisodeChange = (seasonIndex, epIndex, field, value) => {
    setMovie(prev => {
      const newSeasons = JSON.parse(JSON.stringify(prev.seasons));
      const episodes = newSeasons[seasonIndex].episodes;
      episodes[epIndex][field] = value;
      const newMovie = {...prev, seasons: newSeasons};
      setErrors(validateMovie(newMovie))
      return newMovie;
    })
  }

  const handleChange = (field, value) => {
    setMovie(prev => ({...prev, [field]: value}));

    if (touched[field] || submitAttempted) {
      setErrors(validateMovie({...movie, [field]: value}));
    }
  };

  const handleBlur = (field) => {
    setTouched(prev => ({...prev, [field]: true}));
    setErrors(validateMovie());
  };

  const handleGenreChange = (genre, isChecked) => {
    setMovie(prev => {
      const newGenres = isChecked
        ? [...prev.genres, genre]
        : prev.genres.filter(g => g !== genre);
      return {...prev, genres: newGenres};
    });

    if (touched.genres || submitAttempted) {
      setErrors(validateMovie({
        ...movie,
        genres: isChecked
          ? [...movie.genres, genre]
          : movie.genres.filter(g => g !== genre)
      }));
    }
  };

  const handleFileChange = (fieldPath, e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fieldParts = fieldPath.split('.');

    if (fieldParts.length === 1) {
      setMovie(prev => ({...prev, [fieldParts[0]]: file.name}));
    } else if (fieldParts.length === 2) {
      setMovie(prev => {
        const newMovie = {
          ...prev,
          [fieldParts[0]]: {
            ...prev[fieldParts[0]],
            [fieldParts[1]]: file.name
          }
        }

        setErrors(validateMovie(newMovie))
        return newMovie;
      });
    }
  };

  const handleSubmit = () => {
    setSubmitAttempted(true);
    const newErrors = validateMovie();
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      console.log('Movie to submit:', movie);
      onHide(movie);
    } else {
      document.querySelector(`.invalid-feedback:not(:empty)`)?.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  };

  const handleCancel = () => {
    if (movie.title ||
      movie.releaseYear ||
      movie.views ||
      movie.genres.length > 0 ||
      movie.thumbnail ||
      movie.poster ||
      (movie.type === MOVIE_TYPES.SINGLE && (movie.singleStream.dubbed.fileUrl || movie.singleStream.subbed.fileUrl)) ||
      (movie.type === MOVIE_TYPES.SEASON && movie.seasons.some(s => s.episodes.some(e => e.dubbed.fileUrl || e.subbed.fileUrl)))
    ) {
      setShowCancelConfirm(true);
    } else {
      onHide();
    }
  };

  const confirmCancel = () => {
    setMovie(createEmptyMovie());
    setErrors({});
    setTouched({});
    setShowCancelConfirm(false);
    onHide();
  };

  return (
    <>
      <Modal show={show} onHide={handleCancel} size="xl" centered>
        <Modal.Header closeButton>
          <Modal.Title>{initialMovie.id ? 'Chỉnh sửa phim' : 'Thêm phim mới'}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>
            <Container className={'movie-form-modal__cards has-scroll'}>
              <div className="mb-2 movie-row">
                <Row className="mb-3">
                  <Form.Group as={Col} md={6}>
                    <Form.Label>Tên phim <span className="text-danger">*</span></Form.Label>
                    <Form.Control
                      type="text"
                      value={movie.title}
                      onChange={(e) => handleChange('title', e.target.value)}
                      onBlur={() => handleBlur('title')}
                      isInvalid={(touched.title || submitAttempted) && !!errors.title}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.title}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group as={Col} md={3}>
                    <Form.Label>Năm phát hành</Form.Label>
                    <Form.Control
                      type="number"
                      min="1900"
                      max={new Date().getFullYear() + 5}
                      value={movie.releaseYear}
                      onChange={(e) => handleChange('releaseYear', e.target.value)}
                      onBlur={() => handleBlur('releaseYear')}
                      isInvalid={(touched.releaseYear || submitAttempted) && !!errors.releaseYear}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.releaseYear}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group as={Col} md={3}>
                    <Form.Label>Quốc gia</Form.Label>
                    <Form.Select
                      value={movie.country}
                      onChange={(e) => handleChange('country', e.target.value)}
                    >
                      {generateOptions(countryOptions)}
                    </Form.Select>
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
                      onChange={(e) => handleChange('views', e.target.value)}
                      onBlur={() => handleBlur('views')}
                      isInvalid={(touched.views || submitAttempted) && !!errors.views}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.views}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group as={Col} md={3}>
                    <Form.Label>Độ tuổi</Form.Label>
                    <Form.Select
                      value={movie.ageRating}
                      onChange={(e) => handleChange('ageRating', e.target.value)}
                    >
                      {generateOptions(ageRatingOptions)}
                    </Form.Select>
                  </Form.Group>

                  <Form.Group as={Col} md={3}>
                    <Form.Label>Ảnh nhỏ</Form.Label>
                    <Form.Control
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange('thumbnail', e)}
                    />
                  </Form.Group>

                  <Form.Group as={Col} md={3}>
                    <Form.Label>Ảnh to</Form.Label>
                    <Form.Control
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange('poster', e)}
                    />
                  </Form.Group>
                </Row>

                <Row className="mb-3">
                  <Form.Group as={Col} md={12}>
                    <Form.Label>Thể loại <span className="text-danger">*</span></Form.Label>
                    <div className="d-flex flex-wrap gap-3">
                      {genreOptions.map(genre => (
                        <FormCheck
                          key={genre.value}
                          type="checkbox"
                          id={`genre-${genre.value}`}
                          label={genre.label}
                          checked={movie.genres.includes(genre.value)}
                          onChange={(e) => handleGenreChange(genre.value, e.target.checked)}
                          onBlur={() => handleBlur('genres')}
                          isInvalid={(touched.genres || submitAttempted) && !!errors.genres}
                        />
                      ))}
                    </div>
                    {(touched.genres || submitAttempted) && errors.genres && (
                      <div className="text-danger invalid-feedback d-block"
                           style={{fontSize: '0.875em', marginTop: '0.25rem'}}>
                        {errors.genres}
                      </div>
                    )}
                  </Form.Group>
                </Row>

                <Row className="mb-3">
                  <Form.Group as={Col} md={3}>
                    <Form.Label>Kiểu phim</Form.Label>
                    <Form.Select
                      value={movie.type}
                      onChange={(e) => handleChange('type', e.target.value)}
                    >
                      {generateOptions(movieTypeOptions)}
                    </Form.Select>
                  </Form.Group>
                </Row>

                {movie.type === 'Lẻ' && (
                  <Row className="mb-3">
                    <Form.Group as={Col} md={6}>
                      <Form.Label>Lồng tiếng</Form.Label>
                      <Form.Control
                        type="file"
                        accept="video/*"
                        onChange={(e) => handleFileChange('singleStream.dubbed', e)}
                        isInvalid={(touched.singleStream || submitAttempted) && !!errors.singleStream}
                      />
                    </Form.Group>
                    <Form.Group as={Col} md={6}>
                      <Form.Label>Phụ đề</Form.Label>
                      <Form.Control
                        type="file"
                        accept="video/*"
                        onChange={(e) => handleFileChange('singleStream.subbed', e)}
                        isInvalid={(touched.singleStream || submitAttempted) && !!errors.singleStream}
                      />
                    </Form.Group>
                    {(touched.singleStream || submitAttempted) && errors.singleStream && (
                      <div className="text-danger invalid-feedback d-block"
                           style={{fontSize: '0.875em', marginTop: '0.25rem'}}>
                        {errors.singleStream}
                      </div>
                    )}
                  </Row>
                )}

                {movie.type === MOVIE_TYPES.SEASON && (
                  <Row className="mb-3">
                    <label className={'form-label'}>Danh sách mùa phim:</label>
                    <div>
                      {movie.seasons.map((season, seasonIndex) => (
                        <SeasonRow
                          key={`season-${seasonIndex}`}
                          season={season}
                          index={seasonIndex}
                          onChange={(field, value) => handleSeasonChange(seasonIndex, field, value)}
                          onAddEpisode={() => handleAddEpisode(seasonIndex)}
                          onChangeEpisode={(epIndex, field, value) => {
                            handleEpisodeChange(seasonIndex, epIndex, field, value)
                          }}
                          onDelete={movie.seasons.length > 1 ? () => handleDeleteSeason(seasonIndex) : null}
                          onDeleteEpisode={(episodeIndex) => handleDeleteEpisode(seasonIndex, episodeIndex)}
                          errors={errors.seasons?.[seasonIndex]}
                        />
                      ))}
                    </div>
                    <div className="text-center mt-3">
                      <Button
                        variant="outline-primary"
                        onClick={handleAddSeason}
                      >
                        <FaPlus className="me-2"/>
                        Thêm mùa
                      </Button>
                    </div>
                  </Row>
                )}

                <Row className="mb-3">
                  <Form.Group as={Col} md={12}>
                    <Form.Label>Bộ sưu tập</Form.Label>
                    <CollectionPicker
                      selectedCollections={movie.collections}
                      onSelect={(collections) => handleChange('collections', collections)}
                    />
                  </Form.Group>
                </Row>
              </div>
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

export default MovieFormModal;
