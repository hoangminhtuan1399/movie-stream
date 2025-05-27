import "./TopSlide.css";

const ThumbnailItem = ({ imageUrl, altText }) => {
  return (
    <img alt={altText} loading="lazy" src={imageUrl} />
  );
};

export default ThumbnailItem;