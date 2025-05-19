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
            { name: "Hành Động", url: "/the-loai/hanh-dong.2xCjTG" },
            { name: "Chiếu Rạp", url: "/the-loai/chieu-rap.3679nF" },
            { name: "Siêu Anh Hùng", url: "/the-loai/sieu-anh-hung.OW2M9i" },
            { name: "Marvel", url: "/the-loai/marvel.QriAOn" },
            { name: "Kỳ Ảo", url: "/the-loai/ky-ao.gVRG25" },
            { name: "Phiêu Lưu", url: "/the-loai/phieu-luu.wca3Bp" },
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
            { name: "Hành Động", url: "/the-loai/hanh-dong.2xCjTG" },
            { name: "Chiếu Rạp", url: "/the-loai/chieu-rap.3679nF" },
            { name: "Siêu Anh Hùng", url: "/the-loai/sieu-anh-hung.OW2M9i" },
            { name: "Marvel", url: "/the-loai/marvel.QriAOn" },
            { name: "Kỳ Ảo", url: "/the-loai/ky-ao.gVRG25" },
            { name: "Phiêu Lưu", url: "/the-loai/phieu-luu.wca3Bp" },
        ],
        description: `Ai trong team này cũng từng làm việc ác, giờ là lúc làm việc ác cùng nhau...`,
        thumbnail: "https://static.nutscdn.com/vimg/1920-0/8075260038eecb4c9684956a174180a5.jpg",
    },
    // thêm dữ liệu nếu cần
];

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
