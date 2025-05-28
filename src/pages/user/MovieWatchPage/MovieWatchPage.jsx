import React, { useState } from 'react';
import './MovieWatchPage.css';
import ReactPlayer from 'react-player';
import ActorCard from '../../../components/ActorCard/ActorCard.jsx';

const MovieWatchPage = () => {
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [played, setPlayed] = useState(0);
  const [seeking, setSeeking] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [quality, setQuality] = useState('auto');

  const handlePlayPause = () => {
    setPlaying(!playing);
  };

  const handleVolumeChange = (e) => {
    setVolume(parseFloat(e.target.value));
  };

  const handleProgress = (state) => {
    if (!seeking) {
      setPlayed(state.played);
    }
  };

  const handleSeekChange = (e) => {
    setPlayed(parseFloat(e.target.value));
  };

  const handleSeekMouseDown = () => {
    setSeeking(true);
  };

  const handleSeekMouseUp = (e) => {
    setSeeking(false);
    playerRef.current.seekTo(parseFloat(e.target.value));
  };

  const handlePlaybackRateChange = (rate) => {
    setPlaybackRate(rate);
  };

  const handleQualityChange = (newQuality) => {
    setQuality(newQuality);
  };

  const playerRef = React.useRef(null);

  const actors = [
    { name: 'Halit Ergenç', img: '/actor1.jpg', role: 'Lead Actor' },
    { name: 'Cansu Dere', img: '/actor2.jpg', role: 'Lead Actress' }
  ];

  return (
    <div className="movie-page">
      <div className="video-container !p-[20px] !pb-0">
        <ReactPlayer
          ref={playerRef}
          url="https://stream.mux.com/maVbJv2GSYNRgS02kPXOOGdJMWGU1mkA019ZUjYE7VU7k"
          className="react-player"
          width="100%"
          height="100%"
          playing={playing}
          volume={volume}
          playbackRate={playbackRate}
          onProgress={handleProgress}
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
            src="/poster.jpg"
            alt="Poster"
            className="movie-poster"
          />

          <div className="movie-details">
            <h2 className="movie-title">Bách Khoa Thư Istanbul</h2>
            <div className="movie-tags">
              <span className="tag yellow">Tâm lý</span>
              <span className="tag">Lịch sử</span>
              <span className="tag">Chính kịch</span>
              <span className="tag">18+</span>
            </div>
            <div className="movie-actions">
              <button>Yêu thích</button>
              <button>Thêm vào</button>
              <button>Chia sẻ</button>
            </div>
            <p className="movie-description">
              Một cuốn sách chuyển thể đầy công phu mở rộng phạm vi cách kể của điện ảnh…
            </p>
            <p className="movie-meta">Thổ Nhĩ Kỳ - 2024 - 8 Tập</p>
          </div>
        </div>

        <div className="cast-section">
          <h3>Diễn viên</h3>
          <div className="cast-list">
            {actors.map((actor, idx) => (
              <ActorCard key={idx} actor={actor} />
            ))}
          </div>
        </div>
      </div>

      <div className="episode-section">
        <h3>Phần 1</h3>
        <div className="episode-list">
          {Array.from({ length: 10 }, (_, i) => (
            <button key={i} className="episode-btn">
              Tập {i + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MovieWatchPage; 
