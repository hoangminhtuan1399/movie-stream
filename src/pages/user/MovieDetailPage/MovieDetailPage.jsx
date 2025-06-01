import React from 'react';
import { useNavigate } from 'react-router-dom';
import ActorCard from '../../../components/ActorCard/ActorCard.jsx';
import CardCommon from '../../../components/CardMovie/CardCommon.jsx';
import MovieGrid from '../../../components/MovieGrid/MovieGrid';
import { FacebookShareButton, FacebookIcon } from 'react-share';
import './MovieDetailPage.css';

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

  const handleWatchClick = () => {
    navigate('/watch/1'); // Replace '1' with actual movie ID
  };

  const actors = [
    { name: 'Jason Momoa', img: 'https://kinhdoanh.hanoi.vnpt.vn/Uploads/images/2021/2020012001.jpg', role: 'Steve' },
    { name: 'Jack Black', img: 'https://kinhdoanh.hanoi.vnpt.vn/Uploads/images/2021/2020012001.jpg', role: 'Alex' },
    { name: 'Sebastian Eugene', img: 'https://kinhdoanh.hanoi.vnpt.vn/Uploads/images/2021/2020012001.jpg', role: 'Zombie' },
    { name: 'Emma Myers', img: 'https://kinhdoanh.hanoi.vnpt.vn/Uploads/images/2021/2020012001.jpg', role: 'Creeper' },
    { name: 'Danielle Brooks', img: 'https://kinhdoanh.hanoi.vnpt.vn/Uploads/images/2021/2020012001.jpg', role: 'Villager' },
    { name: 'Jennifer Coolidge', img: 'https://kinhdoanh.hanoi.vnpt.vn/Uploads/images/2021/2020012001.jpg', role: 'Witch' }
  ];

  return (
    <div className="movie-detail">
      <div className="movie-detail__container">
        <div className="movie-detail__poster">
          <img src="https://kinhdoanh.hanoi.vnpt.vn/Uploads/images/2021/2020012001.jpg" alt="Minecraft Poster" />
          <button className="movie-detail__watch-button" onClick={handleWatchClick}>
            <span className="icon-play" /> XEM PHIM
          </button>
        </div>

        <div className="movie-detail__info">
          <h1 className="movie-title">A Minecraft Movie</h1>
          <p className="movie-subtitle">Một bộ phim Minecraft (2025)</p>

          <div className="movie-meta">
            <span>1 giờ 41 phút</span>
            <span className="imdb-badge">IMDB <b>5.8</b></span>
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
            <div><strong>Đạo diễn:</strong> Jared Hess</div>
            <div><strong>Quốc gia:</strong> Thụy Điển, Mỹ</div>
            <div><strong>Khởi chiếu:</strong> 31/3/2025</div>
          </div>

          <p className="movie-description">
            Bốn kẻ lập dị đột nhiên bị kéo qua một cánh cổng bí ẩn đến một xứ sở thần tiên hình khối kỳ lạ,
            nơi phát triển trí tưởng tượng. Để trở về nhà, họ sẽ phải làm chủ thế giới này trong khi bắt đầu một nhiệm vụ
            với một thợ thủ công chuyên nghiệp bất ngờ.
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
          {actors.map((actor, idx) => (
            <ActorCard key={idx} actor={actor} />
          ))}
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
