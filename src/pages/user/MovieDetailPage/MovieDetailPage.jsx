import React from 'react';
import { useNavigate } from 'react-router-dom';
import ActorCard from '../../../components/ActorCard/ActorCard.jsx';
import './MovieDetailPage.css';

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
            <button className="btn-share">Chia sẻ</button>
            <button className="btn-add">+ Bộ sưu tập</button>
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
    </div>
  );
};

export default MovieDetailPage;
