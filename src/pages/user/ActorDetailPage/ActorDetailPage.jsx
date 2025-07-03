import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Row, Col, Button, Spinner } from "react-bootstrap";
import CardCommon from "../../../components/CardMovie/CardCommon";
import MovieGrid from "../../../components/MovieGrid/MovieGrid";
import "./ActorDetailPage.css";
import { actorService } from "../../../services/actorService";
import { HeaderBack } from '../../../components/Header/Header';
import CardSkeleton from '../../../components/Loading/CardSkeleton';
import { useToast } from '../../../contexts/ToastContext.jsx';

const DEFAULT_AVATAR = "https://via.placeholder.com/120x120?text=No+Image";

const ActorDetailPage = () => {
  const { id } = useParams();
  const [actor, setActor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { showToast } = useToast();

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
        showToast('Lỗi tải dữ liệu diễn viên!', 'danger');
      });
  }, [id]);

  if (loading)
    return (
      <div className="text-white text-center py-5">
        <div style={{maxWidth:900,margin:'0 auto'}}>
          <div className="row g-3">
            {Array(8).fill(0).map((_,i) => (
              <div className="col-6 col-md-4 col-lg-3" key={i}><CardSkeleton /></div>
            ))}
          </div>
        </div>
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
              items={actor.movies}
              columns={4}
              renderItem={(movie) => (
                <CardCommon
                  data={movie}
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
