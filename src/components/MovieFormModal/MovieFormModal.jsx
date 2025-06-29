import { useCallback, useEffect, useState } from 'react';
import { Button, Col, Container, Form, FormCheck, Modal, Row, Spinner } from 'react-bootstrap';
import { FaPlus } from 'react-icons/fa';
import ConfirmModal from '../ConfirmModal/ConfirmModal.jsx';
import './MovieFormModal.css';
import { createEmptyMovie } from "../../utils/createEmptyMovie.js";
import { genreOptions } from "../../utils/genreOptions.js";
import { ageRatingOptions } from "../../utils/ageRatingOptions.js";
import { generateOptions } from "../../utils/generateOptions.jsx";
import { countryOptions } from "../../utils/countryOptions.js";
import { MOVIE_TYPES, MOVIE_VALUES, movieTypeOptions } from "../../utils/movieTypeOptions.js";
import { createEmptySeason } from "../../utils/createEmptySeason.js";
import { createEmptyEpisode } from "../../utils/createEmptyEpisode.js";
import SeasonRow from "../SeasonRow/SeasonRow.jsx";
import FilePickerInput from '../FileUpload/FilePickerInput.jsx';
import FileSelectModal from '../FileUpload/FileSelectModal.jsx';
import ActorPicker from '../ActorPicker/ActorPicker.jsx';
import { movieServiceApi } from '../../services/movieService.js';

const MovieFormModal = ({show, onHide, initialMovie = createEmptyMovie(), onError}) => {
  const [movie, setMovie] = useState(initialMovie);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // New state for the single modal
  const [showFileModal, setShowFileModal] = useState(false);
  const [currentFieldContext, setCurrentFieldContext] = useState(null);

  useEffect(() => {
    if (show) {
      let movieForForm;

      if (initialMovie && initialMovie.id) {
        // Editing an existing movie, format it for the form
        const formatted = {
          ...createEmptyMovie(),
          ...initialMovie,
          actors: initialMovie.actors || [],
          genres: (initialMovie.genreNames || []).map(g => g.name || g),
          thumbnail: initialMovie.smallBanner || '',
          poster: initialMovie.bigBanner || '',
          subtitle: initialMovie.subtitle || '',
          description: initialMovie.intro || initialMovie.description || '',
        };

        if (formatted.type === MOVIE_VALUES.SINGLE && formatted.seasons?.length > 0 && formatted.seasons[0].episodes?.length > 0) {
          const firstEpisode = formatted.seasons[0].episodes[0];
          formatted.singleStream = {
            dubbed: { fileUrl: firstEpisode?.dubbed || firstEpisode?.dubbedUrl || '', fileName: firstEpisode?.dubbed || firstEpisode?.dubbedUrl || '' },
            subbed: { fileUrl: firstEpisode?.subbed || firstEpisode?.subtitleUrl || '', fileName: firstEpisode?.subbed || firstEpisode?.subtitleUrl || '' },
          };
          formatted.seasons = [createEmptySeason()]; // Reset for single movie type
        } else if (formatted.type === MOVIE_VALUES.SEASON) {
          formatted.seasons = formatted.seasons.map(s => ({
            name: s.name,
            episodes: s.episodes.map(e => ({
              dubbed: { fileUrl: e.dubbed || e.dubbedUrl || '', fileName: e.dubbed || e.dubbedUrl || '' },
              subbed: { fileUrl: e.subbed || e.subtitleUrl || '', fileName: e.subbed || e.subtitleUrl || '' },
            })),
          }));
          if (formatted.seasons.length === 0) {
            formatted.seasons.push(createEmptySeason());
          }
        }
        movieForForm = formatted;
      } else {
        // Creating a new movie
        movieForForm = createEmptyMovie();
      }

      setMovie(movieForForm);
      setErrors({});
      setTouched({});
      setSubmitAttempted(false);
      setIsSubmitting(false);
      setCurrentFieldContext(null);
    }
  }, [show, initialMovie]);

  const openFileModal = (context) => {
    setCurrentFieldContext(context);
    setShowFileModal(true);
  };

  const handleModalSelect = (files) => {
    if (!currentFieldContext || !files || files.length === 0) {
      setShowFileModal(false);
      return;
    }

    const file = files[0];
    const { field, seasonIndex, epIndex } = currentFieldContext;

    if (seasonIndex !== undefined && epIndex !== undefined) {
      const streamData = { fileUrl: file.url, fileName: file.name };
      handleEpisodeChange(seasonIndex, epIndex, field, streamData);
    } else if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setMovie(prev => ({ ...prev, [parent]: { ...prev[parent], [child]: { fileUrl: file.url, fileName: file.name }}}));
    } else {
      setMovie(prev => ({ ...prev, [field]: file.url }));
    }
    setShowFileModal(false);
  };

  const handleModalUpload = (file) => {
    if (!currentFieldContext || !file) {
      setShowFileModal(false);
      return;
    }
    
    const { field, seasonIndex, epIndex } = currentFieldContext;
    const tempPath = `(uploading) ${file.name}`;
    
    if (seasonIndex !== undefined && epIndex !== undefined) {
      const streamData = { fileUrl: tempPath, fileName: file.name };
      handleEpisodeChange(seasonIndex, epIndex, field, streamData);
    } else if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setMovie(prev => ({ ...prev, [parent]: { ...prev[parent], [child]: { fileUrl: tempPath, fileName: file.name }}}));
    } else {
      setMovie(prev => ({ ...prev, [field]: tempPath }));
    }

    setShowFileModal(false);
    // TODO: Trigger actual file upload service here
  };

  const validateMovie = (movieToValidate = movie) => {
    const movieErrors = {};

    if (!movieToValidate.title.trim()) {
      movieErrors.title = 'Vui lòng nhập tên phim';
    }

    if (isNaN(movieToValidate.year)) {
      movieErrors.year = 'Năm phát hành phải là số';
    } else if (movieToValidate.year > new Date().getFullYear()) {
      movieErrors.year = `Năm phát hành không hợp lệ`;
    }

    if (isNaN(movieToValidate.views)) {
      movieErrors.views = 'Lượt xem phải là số';
    } else if (movieToValidate.views < 0) {
      movieErrors.views = 'Lượt xem không hợp lệ';
    }

    if (movieToValidate.genres.length === 0) {
      movieErrors.genres = 'Vui lòng chọn ít nhất 1 thể loại';
    }

    if (movieToValidate.type === MOVIE_VALUES.SINGLE) {
      if (!movieToValidate.singleStream.dubbed.fileUrl && !movieToValidate.singleStream.subbed.fileUrl) {
        movieErrors.singleStream = 'Vui lòng upload ít nhất 1 phiên bản video';
      }
    }

    if (movieToValidate.type === MOVIE_VALUES.SEASON) {
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

  const handleSubmit = async () => {
    setSubmitAttempted(true);
    const newErrors = validateMovie();
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      console.log(movie);
      setIsSubmitting(true);
      // Format lại dữ liệu gửi lên giống format.json
      const formattedMovie = {
        title: movie.title,
        subtitle: movie.subtitle,
        intro: movie.description,
        year: Number(movie.year),
        countryName: movie.countries,
        genreNames: movie.genres, // mảng string
        ageRating: movie.ageRating,
        smallBanner: movie.thumbnail,
        largeBanner: movie.poster,
        views: Number(movie.views),
        type: movie.type,
        seasons: movie.type === MOVIE_VALUES.SINGLE
          ? [
          {
                name: '',
            seasonNumber: 1,
                episodes: [
                  {
                    episodeNumber: 1,
                    dubbed: movie.singleStream.dubbed.fileUrl || '',
                    subbed: movie.singleStream.subbed.fileUrl || '',
                  }
                ]
              }
            ]
          : movie.seasons.map((season, seasonIndex) => ({
          name: season.name,
          seasonNumber: seasonIndex + 1,
          episodes: season.episodes.map((episode, episodeIndex) => ({
            episodeNumber: episodeIndex + 1,
            dubbed: episode.dubbed.fileUrl || '',
            subbed: episode.subbed.fileUrl || '',
              }))
            })),
        actorIds: movie.actors.map(a => a.id),
      };
      try {
        let response;
        if (movie.id) {
          response = await movieServiceApi.updateMovie(movie.id, formattedMovie);
        } else {
          response = await movieServiceApi.createMovie(formattedMovie);
        }
        onHide(response.data);
      } catch (error) {
        console.error('Failed to save movie', error);
        if (onError) {
          const errorMessage = error.response?.data?.message || 'Lưu phim thất bại.';
          onError(errorMessage);
        }
      } finally {
        setIsSubmitting(false);
      }
    } else {
      document.querySelector(`.invalid-feedback:not(:empty)`)?.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  };

  const handleCancel = () => {
    if (movie.title ||
      movie.year ||
      movie.views ||
      movie.genres.length > 0 ||
      movie.thumbnail ||
      movie.poster ||
      (movie.type === MOVIE_VALUES.SINGLE && (movie.singleStream.dubbed.fileUrl || movie.singleStream.subbed.fileUrl)) ||
      (movie.type === MOVIE_VALUES.SEASON && movie.seasons.some(s => s.episodes.some(e => e.dubbed.fileUrl || e.subbed.fileUrl)))
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
                      value={movie.year}
                      onChange={(e) => handleChange('year', e.target.value)}
                      onBlur={() => handleBlur('year')}
                      isInvalid={(touched.year || submitAttempted) && !!errors.year}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.year}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group as={Col} md={3}>
                    <Form.Label>Quốc gia</Form.Label>
                    <Form.Select
                      value={movie.countries}
                      onChange={(e) => handleChange('countries', e.target.value)}
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
                    <FilePickerInput
                      value={movie.thumbnail}
                      onClick={() => openFileModal({ field: 'thumbnail', fileType: 'images' })}
                      placeholder="Chọn hoặc tải lên ảnh..."
                    />
                  </Form.Group>

                  <Form.Group as={Col} md={3}>
                    <Form.Label>Ảnh to</Form.Label>
                    <FilePickerInput
                      value={movie.poster}
                      onClick={() => openFileModal({ field: 'poster', fileType: 'images' })}
                      placeholder="Chọn hoặc tải lên ảnh..."
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
                  <Form.Group as={Col} md={6}>
                    <Form.Label>Tên gọi khác</Form.Label>
                    <Form.Control
                      type="text"
                      value={movie.subtitle}
                      onChange={(e) => handleChange('subtitle', e.target.value)}
                    />
                  </Form.Group>
                </Row>

                <Row className="mb-3">
                  <Form.Group as={Col} md={12}>
                    <Form.Label>Mô tả</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={movie.description}
                      onChange={(e) => handleChange('description', e.target.value)}
                    />
                  </Form.Group>
                </Row>

                <Row className="mb-3">
                  <Form.Group as={Col} md={3}>
                    <Form.Label>Kiểu phim</Form.Label>
                    <Form.Select
                      value={movie.type}
                      onChange={(e) => {
                        console.log(e.target.value);
                        handleChange('type', e.target.value)
                      }}
                    >
                      {generateOptions(movieTypeOptions)}
                    </Form.Select>
                  </Form.Group>
                </Row>

                {movie.type === MOVIE_VALUES.SINGLE && (
                  <Row className="mb-3">
                    <Form.Group as={Col} md={6}>
                      <Form.Label>Lồng tiếng</Form.Label>
                      <FilePickerInput
                        value={movie.singleStream.dubbed.fileUrl}
                        onClick={() => openFileModal({ field: 'singleStream.dubbed', fileType: 'videos' })}
                        placeholder="Chọn hoặc tải lên video..."
                      />
                    </Form.Group>
                    <Form.Group as={Col} md={6}>
                      <Form.Label>Phụ đề</Form.Label>
                      <FilePickerInput
                        value={movie.singleStream.subbed.fileUrl}
                        onClick={() => openFileModal({ field: 'singleStream.subbed', fileType: 'videos' })}
                        placeholder="Chọn hoặc tải lên video..."
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

                {movie.type === MOVIE_VALUES.SEASON && (
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
                          onPickerClick={(epIndex, field) => openFileModal({ seasonIndex, epIndex, field, fileType: 'videos' })}
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
                    <Form.Label>Diễn viên</Form.Label>
                    <ActorPicker
                      selectedActors={movie.actors}
                      onSelect={(actors) => handleChange('actors', actors)}
                    />
                  </Form.Group>
                </Row>
              </div>
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
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                <span className="ms-1">Đang lưu...</span>
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

      {showFileModal && (
        <FileSelectModal
          show={showFileModal}
          onClose={() => setShowFileModal(false)}
          onSelect={handleModalSelect}
          onUpload={handleModalUpload}
          fileType={currentFieldContext?.fileType || 'all'}
        />
      )}
    </>
  );
};

export default MovieFormModal;
