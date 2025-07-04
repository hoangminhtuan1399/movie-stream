import { FaHeart, FaInfoCircle } from "react-icons/fa";
import '@fortawesome/fontawesome-free/css/all.min.css';
import "./TopSlide.css";
import { useNavigate } from "react-router-dom";

const SlideItem = ({data}) => {
  const navigate = useNavigate()
  const url = `/movie/${data.id}`
  console.log(data)

  return (
    <div className="slide-elements">
      <a className="slide-url" href={url}></a>
      <div
        className="slide-elements__background background-fade"
        style={{backgroundImage: `url("${data?.bigBanner}")`}}
      ></div>
      <div className="safe-area">
        <div className="slide-content">
          <div className="media-item">
            <div className="media-title-image">
              <a className={'d-block text-decoration-none text-white fw-bold h1 mb-3'} title={data.title}
                 href={url}>{data.title}</a>
            </div>
            <h3 className="media-title" style={{display: "none"}}>
              <a title={data.title} href={url}>{data.title}</a>
            </h3>
            <div className="hl-tags">
              <div className="tag-model"><span className="last">{data.ageRating}</span></div>
              <div className="tag-classic"><span>{data.year}</span></div>
            </div>
            <div className="hl-tags mb-4">
              {data.genreNames?.map((genre, index) => (
                <a key={index} className="tag-topic" href={'#'}>{genre}</a>
              ))}
            </div>
            <div className={'text-white'}>
              {data?.intro}
            </div>
            <div className="description lim-3">{data?.description}</div>
            <div className="touch">
              <a className="button-play" onClick={() => {
                navigate(`/watch/${data.id}`)
              }}>
                <i className="fa-solid fa-play"></i>
              </a>
              <div className="touch-group">
                <a className="item" href={url}>
                  <div className="inc-icon icon-20"><FaInfoCircle/></div>
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
