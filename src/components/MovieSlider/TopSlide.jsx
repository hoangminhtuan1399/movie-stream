import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Thumbs } from "swiper/modules";
import SlideItem from "./SlideItem";
import ThumbnailItem from "./ThumbnailItem";
import "swiper/css";
import "swiper/css/thumbs";
import "./TopSlide.css";

const slideData = [
  {
    title: "Thunderbolts: Biệt Đội Sấm Sét",
    aliasTitle: "Thunderbolts",
    detailUrl: "/phim/thunderbolts-biet-doi-sam-set.rfDhoxup",
    bgImage: "https://static.nutscdn.com/vimg/1920-0/8075260038eecb4c9684956a174180a5.jpg",
    watchUrl: "/xem-phim/thunderbolts-biet-doi-sam-set.rfDhoxup",
    imdb: "7.6",
    age: "T16",
    year: "2025",
    duration: "2h 10m",
    genres: [
      {name: "Hành Động", url: "/the-loai/hanh-dong.2xCjTG"},
      {name: "Chiếu Rạp", url: "/the-loai/chieu-rap.3679nF"},
      {name: "Siêu Anh Hùng", url: "/the-loai/sieu-anh-hung.OW2M9i"},
      {name: "Marvel", url: "/the-loai/marvel.QriAOn"},
      {name: "Kỳ Ảo", url: "/the-loai/ky-ao.gVRG25"},
      {name: "Phiêu Lưu", url: "/the-loai/phieu-luu.wca3Bp"},
    ],
    description: `Ai trong team này cũng từng làm việc ác, giờ là lúc làm việc ác cùng nhau...`,
    thumbnail: "https://static.nutscdn.com/vimg/1920-0/8075260038eecb4c9684956a174180a5.jpg",
  },
  {
    title: "Thunderbolts: Biệt Đội Sấm Sét",
    aliasTitle: "Thunderbolts",
    detailUrl: "/phim/thunderbolts-biet-doi-sam-set.rfDhoxup",
    bgImage: "https://static.nutscdn.com/vimg/1920-0/8075260038eecb4c9684956a174180a5.jpg",
    watchUrl: "/xem-phim/thunderbolts-biet-doi-sam-set.rfDhoxup",
    imdb: "7.6",
    age: "T16",
    year: "2025",
    duration: "2h 10m",
    genres: [
      {name: "Hành Động", url: "/the-loai/hanh-dong.2xCjTG"},
      {name: "Chiếu Rạp", url: "/the-loai/chieu-rap.3679nF"},
      {name: "Siêu Anh Hùng", url: "/the-loai/sieu-anh-hung.OW2M9i"},
      {name: "Marvel", url: "/the-loai/marvel.QriAOn"},
      {name: "Kỳ Ảo", url: "/the-loai/ky-ao.gVRG25"},
      {name: "Phiêu Lưu", url: "/the-loai/phieu-luu.wca3Bp"},
    ],
    description: `Ai trong team này cũng từng làm việc ác, giờ là lúc làm việc ác cùng nhau...`,
    thumbnail: "https://static.nutscdn.com/vimg/1920-0/8075260038eecb4c9684956a174180a5.jpg",
  },
  // thêm dữ liệu nếu cần
];

const TopSlide = (props) => {
  const {movies} = props;
  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  return (
    <div id="top_slide">
      <div className="slide-wrapper top-slide-wrap">
        {/* Main Swiper */}
        <Swiper
          modules={[Thumbs]}
          thumbs={{swiper: thumbsSwiper}}
          spaceBetween={0}
          slidesPerView={1}
          effect="fade"
          className="top-slide-main"
        >
          {movies.map((item) => (
            <SwiperSlide key={item.id}>
              <SlideItem data={item}/>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Thumbnail Swiper */}
        <Swiper
          onSwiper={setThumbsSwiper}
          slidesPerView="auto"
          spaceBetween={5}
          watchSlidesProgress
          className="top-slide-small"
        >
          {movies.map((item, index) => (
            <SwiperSlide key={index}>
              <div className={'top-slide__thumb rounded-circle'}></div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default TopSlide;
