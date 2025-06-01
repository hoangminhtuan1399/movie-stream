import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import CardCommon from '../../../components/CardMovie/CardCommon';
import MovieGrid from '../../../components/MovieGrid/MovieGrid';
import './ActorDetailPage.css';

const actor = {
  name: 'Tamlyn Tomita',
  avatar: 'https://upload.wikimedia.org/wikipedia/commons/2/2e/Tamlyn_Tomita_2013.jpg',
  gender: 'Nữ',
  birthday: '',
  aka: '',
  bio: '',
};

const movies = [
  {
    title: 'Ultraman: Trỗi dậy',
    originalTitle: 'Ultraman: Rising',
    img: 'https://static.nutscdn.com/vimg/1920-0/8075260038eecb4c9684956a174180a5.jpg',
    badges: ['P.Đề', 'L.Tiếng'],
  },
  {
    title: 'Hàng xóm tốt',
    originalTitle: 'The Good Neighbor',
    img: 'https://m.media-amazon.com/images/I/81n6YQpQ1lL._AC_UF894,1000_QL80_.jpg',
    badges: ['P.Đề'],
  },
  {
    title: 'Siêu Nhí Karate 2',
    originalTitle: 'The Karate Kid Part II',
    img: 'https://m.media-amazon.com/images/I/81n6YQpQ1lL._AC_UF894,1000_QL80_.jpg',
    badges: ['P.Đề'],
  },
];

const ActorDetailPage = () => (
  <div className="actor-detail-page bg-dark text-white min-vh-100 py-4">
    <Container>
      <Row>
        {/* Left: Actor Info */}
        <Col md={3} className="mb-4 mb-md-0">
          <div className="actor-avatar-wrapper mb-3">
            <img src={actor.avatar} alt={actor.name} className="actor-avatar" />
          </div>
          <h3 className="mb-3">{actor.name}</h3>
          <div className="d-flex gap-2 mb-3">
            <Button variant="outline-light" className="rounded-pill px-3"><span role="img" aria-label="heart">♥</span> Yêu thích</Button>
            <Button variant="outline-light" className="rounded-pill px-3"><span role="img" aria-label="share">✈</span> Chia sẻ</Button>
          </div>
          <div className="actor-info-list">
            <div><span className="text-secondary">Tên gọi khác:</span> <span>Đang cập nhật</span></div>
            <div><span className="text-secondary">Giới thiệu:</span> <span>Đang cập nhật</span></div>
            <div><span className="text-secondary">Giới tính:</span> <span>{actor.gender}</span></div>
            <div><span className="text-secondary">Ngày sinh:</span> <span>Đang cập nhật</span></div>
          </div>
        </Col>
        {/* Right: Movies */}
        <Col md={9} className="actor-movie-col">
          <h4 className="mb-4">Các phim đã tham gia</h4>
          <MovieGrid
            items={movies}
            columns={5}
            renderItem={(movie, idx) => (
              <CardCommon
                poster={movie.img}
                title={movie.title}
                subtitle={movie.originalTitle}
                badges={movie.badges}
              />
            )}
          />
        </Col>
      </Row>
    </Container>
  </div>
);

export default ActorDetailPage; 