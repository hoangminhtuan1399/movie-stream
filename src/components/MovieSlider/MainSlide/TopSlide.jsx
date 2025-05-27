import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Thumbs } from "swiper/modules";
import SlideItem from "./SlideItem";
import ThumbnailItem from "./ThumbnailItem";
import "swiper/css";
import "swiper/css/thumbs";
import "./TopSlide.css";
import { slideData } from "./dummyData";


const TopSlide = () => {
    const [thumbsSwiper, setThumbsSwiper] = useState(null);

    return (
        <div id="top_slide">
            <div className="slide-wrapper top-slide-wrap">
                {/* Main Swiper */}
                <Swiper
                    modules={[Thumbs]}
                    thumbs={{ swiper: thumbsSwiper }}
                    spaceBetween={0}
                    slidesPerView={1}
                    effect="fade"
                    className="top-slide-main"
                >
                    {slideData.map((item, index) => (
                        <SwiperSlide key={index}>
                            <SlideItem data={item} />
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
                    {slideData.map((item, index) => (
                        <SwiperSlide key={index} style={{ width: "70.83px", marginRight: "5px" }}>
                            <ThumbnailItem imageUrl={item.thumbnail} altText={item.title} />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
    );
};

export default TopSlide;
