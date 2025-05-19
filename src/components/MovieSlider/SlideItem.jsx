import { FaHeart, FaInfoCircle } from "react-icons/fa";
import '@fortawesome/fontawesome-free/css/all.min.css';
import "./TopSlide.css";

const SlideItem = ({ data }) => {
  return (
    <div className="slide-elements">
      <a className="slide-url" href={data.detailUrl}></a>
      <div
        className="background-fade"
        style={{ backgroundImage: `url(${data.bgImage})` }}
      ></div>
      <div className="cover-fade">
        <div className="cover-image">
          <img className="fade-in visible" title={data.title} loading="lazy"  />
        </div>
      </div>
      <div className="safe-area">
        <div className="slide-content">
          <div className="media-item">
            <div className="media-title-image">
              <a title={data.title} href={data.detailUrl}></a>
            </div>
            <h3 className="media-title" style={{ display: "none" }}>
              <a title={data.title} href={data.detailUrl}>{data.title}</a>
            </h3>
            <h3 className="media-alias-title">
              <a title={data.aliasTitle} href={data.detailUrl}>{data.aliasTitle}</a>
            </h3>
            <div className="hl-tags">
              <div className="tag-imdb"><span>imdb {data.imdb}</span></div>
              <div className="tag-model"><span className="last">{data.age}</span></div>
              <div className="tag-classic"><span>{data.year}</span></div>
              <div className="tag-classic"><span>{data.duration}</span></div>
            </div>
            <div className="hl-tags mb-4">
              {data.genres.map((genre, index) => (
                <a key={index} className="tag-topic" href={genre.url}>{genre.name}</a>
              ))}
            </div>
            <div className="description lim-3">{data.description}</div>
            <div className="touch">
              <a className="button-play" href={data.watchUrl}>
                <i className="fa-solid fa-play"></i>
              </a>
              <div className="touch-group">
                <a className="item">
                  <div className="inc-icon icon-20"><FaHeart /></div>
                </a>
                <a className="item" href={data.detailUrl}>
                  <div className="inc-icon icon-20"><FaInfoCircle /></div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SlideItem;
