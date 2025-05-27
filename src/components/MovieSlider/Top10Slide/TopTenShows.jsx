import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import './TopTenShows.css';

import ShowCard from './ShowCard';
import { showData } from './data';


const TopTenShows = () => {
  return (
    <div className="top-ten-wrapper">
      <h2 className="section-title">Top 10 phim bộ hôm nay</h2>
      <Swiper
        spaceBetween={10}
        slidesPerView={5}
        navigation
        breakpoints={{
          0: { slidesPerView: 2 },
          640: { slidesPerView: 3 },
          1024: { slidesPerView: 5 }
        }}
      >
        {showData.map((show, index) => (
          <SwiperSlide key={index}>
            <ShowCard {...show} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default TopTenShows;
