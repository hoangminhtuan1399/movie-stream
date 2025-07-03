import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ActorCard from "../../../components/ActorCard/ActorCard.jsx";
import CardCommon from "../../../components/CardMovie/CardCommon.jsx";
import MovieGrid from "../../../components/MovieGrid/MovieGrid";
import { FacebookShareButton, FacebookIcon } from "react-share";
import "./MovieDetailPage.css";
import {
  getMovieDetail,
  movieServiceApi,
} from "../../../services/movieService";
import { Spinner, Toast, ToastContainer } from "react-bootstrap";
import { addFavoriteMovie, checkFavoriteMovie, removeFavoriteMovie } from "../../../services/userService";
import { HeaderBack } from "../../../components/Header/Header";
import CardSkeleton from "../../../components/Loading/CardSkeleton";
import Footer from '../../../components/Footer/Footer';

const MovieDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favLoading, setFavLoading] = useState(false);
  const [toastInfo, setToastInfo] = useState({
    show: false,
    message: "",
    type: "success",
  });
  const [similarMovies, setSimilarMovies] = useState([]);
  const [loadingSimilar, setLoadingSimilar] = useState(true);
  const pageRef = useRef(null);
  const contentRef = useRef(null);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getMovieDetail(id)
      .then((data) => {
        setMovie(data.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Không thể tải dữ liệu phim");
        setLoading(false);
      });
  }, [id]);

  // Lấy phim tương tự dựa trên genres
  useEffect(() => {
    if (!movie || !movie.genreNames || movie.genreNames.length === 0) {
      setSimilarMovies([]);
      setLoadingSimilar(false);
      return;
    }
    setLoadingSimilar(true);
    const genreNames = movie.genreNames.map((g) => g.name).join(",");
    movieServiceApi
      .getMovies({ genres: genreNames, size: 5, excludeId: id })
      .then((res) => {
        setSimilarMovies(
          (res.data?.data?.content || []).filter((m) => m.id !== id)
        );
        setLoadingSimilar(false);
      })
      .catch(() => {
        setSimilarMovies([]);
        setLoadingSimilar(false);
      });
  }, [movie, id]);

  // Kiểm tra phim đã trong bộ sưu tập chưa
  useEffect(() => {
    console.log(id);
    if (!id) return;
    checkFavoriteMovie(id)
      .then((res) => {
        setIsFavorite(!!res?.data?.isLiked);
      })
      .catch(() => {
        console.log("false");
        setIsFavorite(false);
      });
  }, [id]);

  // Đồng bộ chiều cao
  useEffect(() => {
    if (pageRef.current && contentRef.current) {
      pageRef.current.style.height = contentRef.current.offsetHeight + "px";
    }
  }, [loading, movie, similarMovies, loadingSimilar]);

  // Xử lý thêm/xóa phim khỏi yêu thích
  const handleFavorite = async () => {
    setFavLoading(true);
    try {
      if (isFavorite) {
        await removeFavoriteMovie(id);
        setToastInfo({
          show: true,
          message: "Đã xóa khỏi bộ sưu tập!",
          type: "success",
        });
      } else {
        await addFavoriteMovie(id);
        setToastInfo({
          show: true,
          message: "Đã thêm vào bộ sưu tập!",
          type: "success",
        });
      }
      // Gọi lại checkFavoriteMovie để cập nhật trạng thái
      await checkFavoriteMovie(id)
        .then((res) => setIsFavorite(!!res?.data?.isLiked))
        .catch(() => setIsFavorite(false));
      // Reload lại detail
    } catch {
      setToastInfo({
        show: true,
        message: isFavorite ? "Xóa khỏi bộ sưu tập thất bại!" : "Thêm vào bộ sưu tập thất bại!",
        type: "danger",
      });
    }
    setFavLoading(false);
  };

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
  if (!movie) return null;

  // Lấy các trường cơ bản, fallback nếu thiếu
  const poster =
    movie.smallBanner || "https://via.placeholder.com/300x450?text=No+Image";
  const bigBanner =
    movie.bigBanner || "https://via.placeholder.com/300x450?text=No+Image";
  const title = movie.title || "Đang cập nhật";
  const subtitle = movie.subtitle || "";
  const year = movie.year || "";
  const intro = movie.intro || "";
  const ageRating = movie.ageRating || "";
  const actors = movie.actors || [];

  return (
    <>
      <div className="movie-detail-page" ref={pageRef}>
        <div
          className="movie-detail__banner"
          style={{ backgroundImage: `url("${bigBanner}")` }}
        />
        <div
          className="movie-detail__content"
          ref={contentRef}
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            position: "absolute",
            zIndex: 2,
            top: 0,
            left: 0,
            right: 0,
            paddingTop: "50vh",
          }}
        >
          <div className="movie-detail__main">
            <div className="movie-detail__poster">
              <img src={poster} alt={title} />
              <button
                className="movie-detail__watch-button"
                onClick={() => navigate(`/watch/${id}`)}
              >
                <span className="icon-play" /> XEM PHIM
              </button>
            </div>
            <div className="movie-detail__info">
              <h1 className="movie-title">{title}</h1>
              <p className="movie-subtitle">
                {subtitle} {year && `(${year})`}
              </p>
              <div className="movie-meta">
                <span>{ageRating}</span>
                <div className="btn-add">
                  <FacebookShareButton
                    url={window.location.href}
                    quote={`Xem phim ${title} cực hay!`}
                    className="btn-facebook d-flex align-items-center"
                  >
                    <FacebookIcon size={20} round />
                    <span style={{ marginLeft: 8, fontWeight: 600 }}>
                      Chia sẻ
                    </span>
                  </FacebookShareButton>
                </div>
                <button
                  className={`btn-add${isFavorite ? " active" : ""}`}
                  onClick={handleFavorite}
                  disabled={favLoading}
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    style={{ marginRight: 6, verticalAlign: "middle" }}
                  >
                    <path
                      d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                      fill={isFavorite ? "#f5c518" : "#fff"}
                      stroke="#fff"
                      strokeWidth="1"
                    />
                  </svg>
                  {favLoading ? (isFavorite ? "Đang xóa..." : "Đang thêm...") : isFavorite ? "Đã thêm bộ sưu tập" : "Bộ sưu tập"}
                </button>
              </div>
              <div className="movie-attributes">
                <div>
                  <strong>Giới thiệu:</strong> {intro}
                </div>
              </div>
              <div className="movie-tags">
                {movie?.genreNames?.map((genre) => (
                  <button key={genre.id}>{genre.name || genre}</button>
                ))}
              </div>
            </div>
          </div>
          <div className="movie-cast">
            <h2>DIỄN VIÊN</h2>
            <div className="cast-list">
              {actors.length > 0 ? (
                actors.map((actor, idx) => <ActorCard key={idx} actor={actor} />)
              ) : (
                <div className="text-secondary">Chưa có thông tin diễn viên</div>
              )}
            </div>
          </div>
          <div className="movie-cast">
            <h2>Phim tương tự</h2>
            <MovieGrid
              items={loadingSimilar ? Array(5).fill({}) : similarMovies}
              columns={5}
              renderItem={
                loadingSimilar
                  ? () => <CardSkeleton />
                  : (movie, idx) => (
                      <CardCommon
                        key={movie.id || idx}
                        data={movie}
                      />
                    )
              }
            />
          </div>
        </div>
      </div>
      {/* <Footer /> */}
      <ToastContainer
        position="top-center"
        className="p-3"
        style={{ zIndex: 9999 }}
      >
        <Toast
          onClose={() => setToastInfo({ ...toastInfo, show: false })}
          show={toastInfo.show}
          delay={4000}
          autohide
          bg={toastInfo.type}
        >
          <Toast.Body className="text-white">{toastInfo.message}</Toast.Body>
        </Toast>
      </ToastContainer>
    </>
  );
};

export default MovieDetailPage;
