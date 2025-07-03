import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getMovieDetail } from "../../../services/movieService";
import "./MovieWatchPage.css";
import ReactPlayer from "react-player";
import ActorCard from "../../../components/ActorCard/ActorCard.jsx";
import { HeaderBack } from "../../../components/Header/Header";
import CardSkeleton from "../../../components/Loading/CardSkeleton";
import { useToast } from "../../../contexts/ToastContext.jsx";

const MovieWatchPage = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentSeasonIdx, setCurrentSeasonIdx] = useState(0);
  const [currentEpisodeIdx, setCurrentEpisodeIdx] = useState(0);
  const [lang, setLang] = useState("sub"); // 'sub' hoặc 'dub'
  const [videoLoading, setVideoLoading] = useState(false); // loading riêng cho video
  const { showToast } = useToast();

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getMovieDetail(id)
      .then((data) => {
        setMovie(data.data);
        setLoading(false);
        setCurrentSeasonIdx(0);
        setCurrentEpisodeIdx(0);
        setLang("sub");
      })
      .catch(() => {
        setError("Không thể tải dữ liệu phim");
        setLoading(false);
        showToast("Lỗi tải dữ liệu phim!", "danger");
      });
  }, [id]);

  if (loading)
    return (
      <div className="text-white text-center py-5">
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div className="row g-3">
            {Array(8)
              .fill(0)
              .map((_, i) => (
                <div className="col-6 col-md-4 col-lg-3" key={i}>
                  <CardSkeleton />
                </div>
              ))}
          </div>
        </div>
      </div>
    );
  if (error) return <div className="text-danger text-center py-5">{error}</div>;
  if (!movie) return null;

  // Xác định url video hiện tại
  let videoUrl = "";
  let episodeList = [];
  let seasonList = [];
  if (movie.type === "LE") {
    // Phim lẻ: chỉ có 1 season, 1 tập
    const season = movie.seasons && movie.seasons[0];
    const episode = season && season.episodes && season.episodes[0];
    videoUrl = lang === "sub" ? episode?.subtitleUrl : episode?.dubbedUrl;
    episodeList = [episode];
    seasonList = [season];
  } else {
    // Phim bộ: nhiều season, nhiều tập
    seasonList = movie.seasons || [];
    const season = seasonList[currentSeasonIdx] || {};
    episodeList = season.episodes || [];
    const episode = episodeList[currentEpisodeIdx] || {};
    videoUrl = lang === "sub" ? episode.subtitleUrl : episode.dubbedUrl;
  }

  // Hàm scroll lên đầu player
  const scrollToPlayer = () => {
    const player = document.getElementById("embed-player");
    if (player) {
      player.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  // Hàm xử lý khi đổi video (tập, mùa, sub/dub)
  const handleChangeVideo = (cb) => {
    setVideoLoading(true);
    cb();
    scrollToPlayer();
    setTimeout(() => setVideoLoading(false), 2000);
  };

  return (
    <div className="movie-page">
      <HeaderBack
        title="Xem phim"
        marginBottom={false}
        style={{
          paddingLeft: "60px",
          paddingRight: "60px",
          background: "black",
        }}
      />
      <div className="video-container pro-video-container !p-[20px] !pb-0">
        <div className="video-wrapper">
          {videoLoading && (
            <div className="video-loading-overlay">
              <div className="video-spinner"></div>
              <div className="video-loading-text">Đang tải video...</div>
            </div>
          )}
          <iframe
            width="100%"
            height="600"
            id="embed-player"
            allow="autoplay; encrypted-media; picture-in-picture;"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
            webkitallowfullscreen="true"
            mozallowfullscreen="true"
            src={videoUrl}
            style={{
              borderRadius: 16,
              boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
              minHeight: 400,
              background: "#111",
              display: videoLoading ? "none" : "block",
              transition: "all 0.3s",
            }}
          ></iframe>
        </div>
      </div>

      <div className="movie-info-container">
        <div className="movie-main">
          <img
            src={movie.smallBanner || "/poster.jpg"}
            alt="Poster"
            className="movie-poster"
          />
          <div className="movie-details">
            <h2 className="movie-title">{movie.title}</h2>
            <p className="movie-meta" style={{ margin: 0 }}>
              {movie.countries} - {movie.year}
            </p>
            <div className="movie-tags">
              {movie.genreNames?.map((g) => (
                <span key={g.id} className="tag">
                  {g.name || g}
                </span>
              ))}
              {movie.ageRating && (
                <span className="tag">{movie.ageRating}</span>
              )}
            </div>
            <p className="movie-description">{movie.intro}</p>
          </div>
        </div>
        <div className="cast-section">
          <h3>Diễn viên</h3>
          <div className="cast-list">
            {movie.actors?.map((actor, idx) => (
              <ActorCard key={idx} actor={actor} />
            ))}
          </div>
        </div>
      </div>

      {/* Hiển thị tập phim */}
      {movie.type === "BO" && (
        <div className="episode-section">
          <div className="mb-3 d-flex gap-2 align-items-center flex-wrap">
            <button
              className={`btn btn-sm rounded-pill fw-bold px-4 py-2 ${
                lang === "sub"
                  ? "btn-warning text-dark shadow"
                  : "btn-outline-warning"
              }`}
              onClick={() =>
                handleChangeVideo(() => {
                  setLang("sub");
                })
              }
            >
              Vietsub
            </button>
            <button
              className={`btn btn-sm rounded-pill fw-bold px-4 py-2 ${
                lang === "dub"
                  ? "btn-warning text-dark shadow"
                  : "btn-outline-warning"
              }`}
              onClick={() =>
                handleChangeVideo(() => {
                  setLang("dub");
                })
              }
            >
              Lồng tiếng
            </button>
          </div>
          <h3>Chọn mùa</h3>
          <div className="d-flex gap-2 mb-3 flex-wrap">
            {seasonList.map((season, idx) => (
              <button
                key={season.id}
                className={`btn btn-sm rounded-pill fw-bold px-4 py-2 ${
                  idx === currentSeasonIdx
                    ? "btn-primary text-white shadow"
                    : "btn-outline-primary"
                }`}
                style={{ minWidth: 100, fontSize: 16, borderWidth: 2 }}
                onClick={() =>
                  handleChangeVideo(() => {
                    setCurrentSeasonIdx(idx);
                    setCurrentEpisodeIdx(0);
                  })
                }
              >
                {season.name || `Mùa ${season.seasonNumber}`}
              </button>
            ))}
          </div>
          <h4>Chọn tập</h4>
          <div className="episode-list">
            {episodeList.map((ep, i) => (
              <button
                key={ep.id}
                className={`episode-btn ${
                  i === currentEpisodeIdx ? "active" : ""
                }`}
                onClick={() =>
                  handleChangeVideo(() => {
                    setCurrentEpisodeIdx(i);
                  })
                }
              >
                Tập {ep.episodeNumber}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieWatchPage;
