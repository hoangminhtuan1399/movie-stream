import React from 'react';
import { useNavigate } from 'react-router-dom';
import './CardCommon.css';

const ANIMATION_DURATION = 400; // ms, should match CSS

const CardCommon = ({data}) => {
  const navigate = useNavigate();

  const handleTitleClick = (e) => {
    e.stopPropagation();
    navigate(`/movie/${data?.id ?? 1}`);
  };

  const handleWatchClick = (e) => {
    e.stopPropagation();
    navigate(`/watch/${data?.id ?? 1}`);
  };
  console.log(data)
  return (
    <div className="card-common">
      <div
        className="card-common-img-wrapper position-relative overflow-hidden"
      >
        <img
          src={data?.smallBanner || data?.bigBanner || ''}
          alt={data?.title}
          className="card-common-img"
          style={{
            cursor: 'pointer'
          }}
        />
        <div
          className={`card-popover`}
        >
          <div className="card-popover-content">
            <div className="card-popover-title">{data?.title}</div>
            <button className="card-popover-btn play w-100" onClick={handleWatchClick}>
              <span>▶</span> Xem ngay
            </button>
            <div className="card-popover-actions">
              <button className="card-popover-btn detail" onClick={handleTitleClick}>Chi tiết</button>
            </div>
            <div className="card-popover-badges">
              {data?.ageRating && <span className="card-popover-badge">{data?.ageRating}</span>}
              {data?.releaseYear && <span className="card-popover-badge">{data?.releaseYear}</span>}
              {data?.episodeCount && <span className="card-popover-badge">{data?.episodeCount}</span>}
              {data?.episodeNumber && <span className="card-popover-badge">{data?.episodeNumber}</span>}
            </div>
            <div className="card-popover-meta">
              {data?.genreNames?.map((genre, index) => (
                <a key={index} className="tag-topic" href={'#'}>{genre?.name || genre}</a>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="card-common-content">
        <div
          className="card-common-title truncate cursor-pointer hover:text-yellow-300"
          style={{
            cursor: 'pointer'
          }}
          onClick={handleTitleClick}
        >
          {data?.title}
        </div>
      </div>
    </div>
  );
};

export default CardCommon; 
