import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './CardCommon.css';

const ANIMATION_DURATION = 400; // ms, should match CSS

const CardCommon = ({ poster, title, subtitle, badge, id }) => {
  const [showPopover, setShowPopover] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const navigate = useNavigate();
  const timerRef = useRef();
  const animTimerRef = useRef();

  const handleMouseEnter = () => {
    timerRef.current = setTimeout(() => {
      setShowPopover(true);
      setTimeout(() => setIsAnimating(true), 10); // trigger animation after mount
    }, 0);
  };

  const handleMouseLeave = () => {
    clearTimeout(timerRef.current);
    setIsAnimating(false);
    animTimerRef.current = setTimeout(() => {
      setShowPopover(false);
    }, ANIMATION_DURATION);
  };

  // Clean up timers on unmount
  React.useEffect(() => {
    return () => {
      clearTimeout(timerRef.current);
      clearTimeout(animTimerRef.current);
    };
  }, []);

  const handleTitleClick = (e) => {
    e.stopPropagation();
    navigate(`/movie/${id ?? 1}`);
  };

  const handleWatchClick = (e) => {
    e.stopPropagation();
    navigate(`/watch/${id ?? 1}`);
  };

  return (
    <div className="card-common">
      <div
        className="card-common-img-wrapper"
      >
        <img
          src={poster}
          alt={title}
          className="card-common-img"
          style={{
            cursor: 'pointer'
          }}
          onMouseEnter={handleMouseEnter}
        />
      </div>
      <div className="card-common-content">
        <div 
          className="card-common-title truncate cursor-pointer hover:text-yellow-300"
          onClick={handleTitleClick}
        >
          {title}
        </div>
      </div>
      {showPopover && (
        <div 
          className={`card-popover${isAnimating ? ' showing' : ''}`}
          onMouseLeave={handleMouseLeave}
        >
          <div className="card-popover-img" style={{ backgroundImage: `url(${poster})` }} />
          <div className="card-popover-content">
            <div className="card-popover-title">{title}</div>
            <div className="card-popover-actions">
              <button className="card-popover-btn play" onClick={handleWatchClick}><span>▶</span> Xem ngay</button>
              <button className="card-popover-btn like">♥ Thích</button>
              <button className="card-popover-btn detail" onClick={handleTitleClick}>Chi tiết</button>
            </div>
            <div className="card-popover-badges">
              <span className="card-popover-badge">T13</span>
              <span className="card-popover-badge">2025</span>
              <span className="card-popover-badge">Phần 1</span>
              <span className="card-popover-badge">Tập 6</span>
            </div>
            <div className="card-popover-meta">Anime • Hài • Hoạt Hình</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CardCommon; 