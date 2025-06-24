import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getMovieDetail } from '../../../services/movieService';
import './MovieWatchPage.css';
import ReactPlayer from 'react-player';
import ActorCard from '../../../components/ActorCard/ActorCard.jsx';

const MovieWatchPage = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [currentSeasonIdx, setCurrentSeasonIdx] = useState(0);
  const [currentEpisodeIdx, setCurrentEpisodeIdx] = useState(0);
  const [lang, setLang] = useState('sub'); // 'sub' hoặc 'dub'

  const playerRef = React.useRef(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getMovieDetail(id)
      .then(data => {
        setMovie(data.data);
        setLoading(false);
        setCurrentSeasonIdx(0);
        setCurrentEpisodeIdx(0);
        setLang('sub');
      })
      .catch(() => {
        setError('Không thể tải dữ liệu phim');
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="text-white text-center py-5">Đang tải dữ liệu phim...</div>;
  if (error) return <div className="text-danger text-center py-5">{error}</div>;
  if (!movie) return null;

  // Xác định url video hiện tại
  let videoUrl = '';
  let episodeList = [];
  let seasonList = [];
  if (movie.type === 'LE') {
    // Phim lẻ: chỉ có 1 season, 1 tập
    const season = movie.seasons && movie.seasons[0];
    const episode = season && season.episodes && season.episodes[0];
    videoUrl = lang === 'sub' ? episode?.subtitleUrl : episode?.dubbedUrl;
    episodeList = [episode];
    seasonList = [season];
  } else {
    // Phim bộ: nhiều season, nhiều tập
    seasonList = movie.seasons || [];
    const season = seasonList[currentSeasonIdx] || {};
    episodeList = season.episodes || [];
    const episode = episodeList[currentEpisodeIdx] || {};
    videoUrl = lang === 'sub' ? episode.subtitleUrl : episode.dubbedUrl;
  }

  const handlePlayPause = () => {
    setPlaying(!playing);
  };

  return (
    <div className="movie-page">
      <div className="video-container !p-[20px] !pb-0">
        <ReactPlayer
          ref={playerRef}
          url={videoUrl}
          className="react-player"
          width="100%"
          height="100%"
          playing={playing}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onEnded={() => setPlaying(false)}
          onError={(e) => console.log('onError', e)}
          onBuffer={() => console.log('onBuffer')}
          onBufferEnd={() => console.log('onBufferEnd')}
          onReady={() => console.log('onReady')}
          onStart={() => console.log('onStart')}
          onSeek={(e) => console.log('onSeek', e)}
          onDuration={(duration) => console.log('onDuration', duration)}
          config={{
            file: {
              attributes: {
                crossOrigin: "anonymous",
                controlsList: "nodownload",
                disablePictureInPicture: true,
              },
              forceVideo: true,
              forceHLS: true,
              forceDASH: true,
              hlsOptions: {
                enableWorker: true,
                lowLatencyMode: true,
                backBufferLength: 90,
              },
              dashOptions: {
                streaming: {
                  buffer: {
                    bufferTimeAtTopQuality: 60,
                    fastSwitchEnabled: true,
                  },
                },
              },
            },
            youtube: {
              playerVars: {
                modestbranding: 1,
                rel: 0,
                showinfo: 0,
                iv_load_policy: 3,
                fs: 1,
                cc_load_policy: 0,
                origin: window.location.origin,
              },
            },
            vimeo: {
              playerOptions: {
                byline: false,
                portrait: false,
                title: false,
                transparent: false,
              },
            },
            facebook: {
              appId: 'YOUR_FACEBOOK_APP_ID',
            },
            soundcloud: {
              options: {
                show_artwork: false,
                show_comments: false,
                show_playcount: false,
                show_user: false,
                visual: false,
              },
            },
            wistia: {
              options: {
                videoFoam: true,
                playbar: true,
                fullscreenButton: true,
                playButton: true,
                volumeControl: true,
                controlsVisibleOnLoad: false,
              },
            },
            mixcloud: {
              options: {
                light: false,
                hide_cover: true,
                hide_artwork: true,
              },
            },
            dailymotion: {
              params: {
                'ui-highlight': '000000',
                'ui-logo': false,
                'ui-start-screen-info': false,
              },
            },
            twitch: {
              options: {
                channel: 'YOUR_TWITCH_CHANNEL',
                parent: window.location.hostname,
              },
            },
          }}
          controls={true}
          light={false}
          pip={false}
          stopOnUnmount={true}
          playsinline={true}
          playIcon={
            <button className="play-icon" onClick={handlePlayPause}>
              {playing ? '⏸' : '▶'}
            </button>
          }
          previewTabIndex={0}
          fallback={<div>Loading...</div>}
          wrapper="div"
          style={{ aspectRatio: '16/9' }}
        />
      </div>

      <div className="movie-info-container">
        <div className="movie-main">
          <img
            src={movie.smallBanner || '/poster.jpg'}
            alt="Poster"
            className="movie-poster"
          />
          <div className="movie-details">
            <h2 className="movie-title">{movie.title}</h2>
            <div className="movie-tags">
              {movie.genreNames?.map((g) => (
                <span key={g.id} className="tag">{g.name}</span>
              ))}
              {movie.ageRating && <span className="tag">{movie.ageRating}</span>}
            </div>
            <div className="movie-actions">
              <button>Yêu thích</button>
              <button>Thêm vào</button>
              <button>Chia sẻ</button>
            </div>
            <p className="movie-description">{movie.intro}</p>
            <p className="movie-meta">{movie.countries} - {movie.year}</p>
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
      {movie.type === 'BO' && (
        <div className="episode-section">
          <div className="mb-3 d-flex gap-2 align-items-center flex-wrap">
            <button
              className={`btn btn-sm rounded-pill fw-bold px-4 py-2 ${lang === 'sub' ? 'btn-warning text-dark shadow' : 'btn-outline-warning'}`}
              onClick={() => setLang('sub')}
            >Vietsub</button>
            <button
              className={`btn btn-sm rounded-pill fw-bold px-4 py-2 ${lang === 'dub' ? 'btn-warning text-dark shadow' : 'btn-outline-warning'}`}
              onClick={() => setLang('dub')}
            >Lồng tiếng</button>
          </div>
          <h3>Chọn mùa</h3>
          <div className="d-flex gap-2 mb-3 flex-wrap">
            {seasonList.map((season, idx) => (
              <button
                key={season.id}
                className={`btn btn-sm rounded-pill fw-bold px-4 py-2 ${idx === currentSeasonIdx ? 'btn-primary text-white shadow' : 'btn-outline-primary'}`}
                style={{ minWidth: 100, fontSize: 16, borderWidth: 2 }}
                onClick={() => { setCurrentSeasonIdx(idx); setCurrentEpisodeIdx(0); }}
              >{season.name || `Mùa ${season.seasonNumber}`}</button>
            ))}
          </div>
          <h4>Chọn tập</h4>
          <div className="episode-list">
            {episodeList.map((ep, i) => (
              <button
                key={ep.id}
                className={`episode-btn ${i === currentEpisodeIdx ? 'active' : ''}`}
                onClick={() => setCurrentEpisodeIdx(i)}
              >Tập {ep.episodeNumber}</button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieWatchPage; 
