import './ShowCard.css';

const ShowCard = ({ number, imageUrl, href, title, subtitle, tags = [], labels = [] }) => {
  return (
    <div className="sw-item">
      <a className="v-thumbnail" href={href}>
        <div className="mask"></div>
        {labels.map((label, index) => (
          <div key={index} className={`pin-new m-pin-new ${index > 0 ? 'pin-alt' : ''}`}>
            <div className="line-center line-pd">
              <span></span>
              <strong>{label}</strong>
            </div>
          </div>
        ))}
        <div>
          <img alt={`Xem Phim ${title} Vietsub HD Online`} loading="lazy" src={imageUrl} />
        </div>
      </a>

      <div className="info info-v w-chart">
        <div className="number">{number}</div>
        <h4 className="item-title lim-1">
          <a title={title} href={href}>{title}</a>
        </h4>
        <div className="alias-title lim-1">{subtitle}</div>
        <div className="info-line">
          {tags.map((tag, index) => (
            <div key={index} className="tag-small">{tag}</div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShowCard;
