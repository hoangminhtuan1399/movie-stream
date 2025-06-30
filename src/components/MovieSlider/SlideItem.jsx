import { FaHeart, FaInfoCircle } from "react-icons/fa";
import '@fortawesome/fontawesome-free/css/all.min.css';
import "./TopSlide.css";

const SlideItem = ({data}) => {
  const url = `/movies/${data.id}`

  return (
    <div className="slide-elements">
      <a className="slide-url" href={url}></a>
      <div
        className="slide-elements__background background-fade"
        style={{backgroundImage: `url(${data?.bigBanner})`}}
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
              <div className="tag-classic"><span>{data.releaseYear}</span></div>
            </div>
            <div className="hl-tags mb-4">
              {data.genreNames?.map((genre, index) => (
                <a key={index} className="tag-topic" href={'#'}>{genre?.name}</a>
              ))}
            </div>
            <div className={'text-white'}>
              Dựa trên webtoon cùng tên, kể về câu chuyện của một học sinh gương mẫu từng dành toàn bộ sự chú ý của mình
              cho việc học nhưng bị vướng vào bạo lực gia đình và bắt nạt ở trường, buộc anh phải đưa ra quyết định mang
              tính thay đổi. One: High School Heroes kể về hành trình nhóm học sinh dũng cảm chống bạo lực học đường,
              kết hợp hành động mãn nhãn và drama sâu sắc, truyền tải thông điệp đoàn kết.
            </div>
            <div className="description lim-3">{data.description}</div>
            <div className="touch">
              <a className="button-play" href={data.watchUrl}>
                <i className="fa-solid fa-play"></i>
              </a>
              <div className="touch-group">
                <a className="item">
                  <div className="inc-icon icon-20"><FaHeart/></div>
                </a>
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
