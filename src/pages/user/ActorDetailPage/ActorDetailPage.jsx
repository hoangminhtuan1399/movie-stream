import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Row, Col, Button, Spinner } from "react-bootstrap";
import CardCommon from "../../../components/CardMovie/CardCommon";
import MovieGrid from "../../../components/MovieGrid/MovieGrid";
import "./ActorDetailPage.css";
import { actorService } from "../../../services/actorService";
import { HeaderBack } from '../../../components/Header/Header';

const DEFAULT_AVATAR = "https://via.placeholder.com/120x120?text=No+Image";

const ActorDetailPage = () => {
  const { id } = useParams();
  const [actor, setActor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    actorService.getActorDetail(id)
      .then(({data}) => {
        console.log(data);
        setActor(data.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Không thể tải dữ liệu diễn viên");
        setLoading(false);
      });
  }, [id]);

  if (loading)
    return (
      <div className="text-white text-center py-5">
        <Spinner
          animation="border"
          variant="light"
          size="md"
          className="me-2"
        />
        Đang tải dữ liệu phim...
      </div>
    );
  if (error) return <div className="text-danger text-center py-5">{error}</div>;
  if (!actor) return null;

  // Map các trường có sẵn trên UI
  const avatar = actor.avatarUrl || DEFAULT_AVATAR;
  const name = actor.name || "Đang cập nhật";
  const gender = actor.gender || "Đang cập nhật";
  const birthday = actor.dob ? actor.dob.join("-") : "Đang cập nhật";
  const aka = actor.aka || "Đang cập nhật";
  const bio = actor.bio || "Đang cập nhật";
  // Map lại dữ liệu phim cho đúng với data.json
  const movies = (actor.movies || []).map((movie) => {
    // Lấy poster ưu tiên smallBanner, bigBanner, hoặc null
    const poster = movie.smallBanner || movie.bigBanner || "";
    // Subtitle lấy subtitle hoặc null
    const subtitle = movie.subtitle || null;
    // Badge: năm, loại phim, số season/tập
    const badges = [];
    if (movie.year) badges.push(movie.year);
    if (movie.type) badges.push(movie.type);
    if (movie.seasons && movie.seasons.length > 0) {
      badges.push(`Phần ${movie.seasons.length}`);
      // Đếm tổng số tập
      const totalEpisodes = movie.seasons.reduce((sum, s) => sum + (s.episodes?.length || 0), 0);
      if (totalEpisodes > 0) badges.push(`Tập ${totalEpisodes}`);
    }
    return {
      id: movie.id,
      poster,
      title: movie.title,
      subtitle,
      badges,
    };
  });

  return (
    <div className="actor-detail-page bg-dark text-white min-vh-100 py-4">
      <HeaderBack title="Thông tin diễn viên" paddingContainer={false} />
      <Container>
        <Row>
          {/* Left: Actor Info */}
          <Col md={3} className="mb-4 mb-md-0">
            <div className="actor-avatar-wrapper mb-3">
              <img src={avatar} alt={name} className="actor-avatar" />
            </div>
            <h3 className="mb-3">{name}</h3>
            <div className="d-flex gap-2 mb-3">
              <Button variant="outline-light" className="rounded-pill px-3">
                <span role="img" aria-label="heart">
                  ♥
                </span>{" "}
                Yêu thích
              </Button>
              <Button variant="outline-light" className="rounded-pill px-3">
                <span role="img" aria-label="share">
                  ✈
                </span>{" "}
                Chia sẻ
              </Button>
            </div>
            <div className="actor-info-list">
              <div>
                <span className="text-secondary">Tên gọi khác:</span>{" "}
                <span>{aka}</span>
              </div>
              <div>
                <span className="text-secondary">Giới thiệu:</span>{" "}
                <span>{bio}</span>
              </div>
              <div>
                <span className="text-secondary">Giới tính:</span>{" "}
                <span>{gender}</span>
              </div>
              <div>
                <span className="text-secondary">Ngày sinh:</span>{" "}
                <span>{birthday}</span>
              </div>
            </div>
          </Col>
          {/* Right: Movies */}
          <Col md={9} className="actor-movie-col">
            <h4 className="mb-4">Các phim đã tham gia</h4>
            <MovieGrid
              items={movies}
              columns={4}
              renderItem={(movie) => (
                <CardCommon
                  poster={movie.poster}
                  title={movie.title}
                  subtitle={movie.subtitle}
                  badges={movie.badges}
                  id={movie.id}
                />
              )}
            />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ActorDetailPage;
