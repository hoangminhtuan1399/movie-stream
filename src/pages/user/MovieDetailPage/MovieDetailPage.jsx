import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ActorCard from '../../../components/ActorCard/ActorCard.jsx';
import CardCommon from '../../../components/CardMovie/CardCommon.jsx';
import MovieGrid from '../../../components/MovieGrid/MovieGrid';
import { FacebookShareButton, FacebookIcon } from 'react-share';
import './MovieDetailPage.css';
import { getMovieDetail } from '../../../services/movieService';
import { Spinner } from 'react-bootstrap';

const similarMovies = [
  {
    poster: 'https://static.nutscdn.com/vimg/1920-0/8075260038eecb4c9684956a174180a5.jpg',
    title: 'Phim tương tự 1',
    subtitle: 'Similar Movie 1',
    badge: 'P18',
  },
  {
    poster: 'https://static.nutscdn.com/vimg/1920-0/8075260038eecb4c9684956a174180a5.jpg',
    title: 'Phim tương tự 2',
    subtitle: 'Similar Movie 2',
    badge: 'P18',
  },
  {
    poster: 'https://static.nutscdn.com/vimg/1920-0/8075260038eecb4c9684956a174180a5.jpg',
    title: 'Phim tương tự 3',
    subtitle: 'Similar Movie 3',
    badge: 'P18',
  },
  {
    poster: 'https://static.nutscdn.com/vimg/1920-0/8075260038eecb4c9684956a174180a5.jpg',
    title: 'Phim tương tự 4',
    subtitle: 'Similar Movie 4',
    badge: 'P18',
  },
];

const MovieDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getMovieDetail(id)
      .then(data => {
        setMovie(data.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Không thể tải dữ liệu phim');
        setLoading(false);
      });
  }, [id]);

  if (loading) return (
    <div className="text-white text-center py-5">
      <Spinner animation="border" variant="light" size="md" className="me-2" />
      Đang tải dữ liệu phim...
    </div>
  );
  if (error) return <div className="text-danger text-center py-5">{error}</div>;
  if (!movie) return null;

  // Lấy các trường cơ bản, fallback nếu thiếu
  const poster = movie.bigBanner || movie.smallBanner || 'https://via.placeholder.com/300x450?text=No+Image';
  const title = movie.title || 'Đang cập nhật';
  const subtitle = movie.subtitle || '';
  const year = movie.year || '';
  const intro = movie.intro || '';
  const ageRating = movie.ageRating || '';
  const actors = movie.actors || [];

  return (
    <div className="movie-detail">
      <div className="movie-detail__container">
        <div className="movie-detail__poster">
          <img src={poster} alt={title} />
          <button className="movie-detail__watch-button" onClick={() => navigate(`/watch/${id}`)}>
            <span className="icon-play" /> XEM PHIM
          </button>
        </div>

        <div className="movie-detail__info">
          <h1 className="movie-title">{title}</h1>
          <p className="movie-subtitle">{subtitle} {year && `(${year})`}</p>

          <div className="movie-meta">
            <span>{ageRating}</span>
            <div className="btn-add">
              <FacebookShareButton url={window.location.href} quote="Xem phim này cực hay!" className="btn-facebook d-flex align-items-center">
                <FacebookIcon size={20} round />
                <span style={{ marginLeft: 8, fontWeight: 600 }}>Chia sẻ</span>
              </FacebookShareButton>
            </div>
            <button className="btn-add">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{marginRight: 6, verticalAlign: 'middle'}}>
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="#fff"/>
              </svg>
              Bộ sưu tập
            </button>
          </div>

          <div className="movie-attributes">
            <div><strong>Giới thiệu:</strong> {intro}</div>
          </div>

          <p className="movie-description">
            {intro}
          </p>

          <div className="movie-tags">
            <button>Kỳ ảo</button>
            <button>Phiêu lưu</button>
            <button>Hài</button>
            <button>Gia đình</button>
          </div>
        </div>
      </div>

      <div className="movie-cast">
        <h2>DIỄN VIÊN</h2>
        <div className="cast-list">
          {actors.length > 0 ? actors.map((actor, idx) => (
            <ActorCard key={idx} actor={actor}/>
          )) : <div className="text-secondary">Chưa có thông tin diễn viên</div>}
        </div>
      </div>

      <div className="movie-cast">
        <h2>Phim tương tự</h2>
        <MovieGrid
          items={similarMovies}
          columns={8}
          renderItem={(movie, idx) => (
            <CardCommon
              key={idx}
              poster={movie.poster}
              title={movie.title}
              subtitle={movie.subtitle}
              badge={movie.badge}
            />
          )}
        />
      </div>
    </div>
  );
};

export default MovieDetailPage;
