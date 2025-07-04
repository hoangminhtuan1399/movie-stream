import TopSlide from "../../../components/MovieSlider/TopSlide"
import TopicCard from "../../../components/TopicCard/TopicCard"
import { collectionService } from "../../../services/collectionService";
import { dummyCollections, topicList } from "./dummyData"
import { useContext, useEffect, useMemo, useState } from "react";
import { PageContext } from "../../../contexts/PageContext.jsx";
import { Button, Stack } from "react-bootstrap";
import { FaAngleRight } from "react-icons/fa6";
import './HomePage.css';
import { Swiper, SwiperSlide } from "swiper/react";
import CardCommon from "../../../components/CardMovie/CardCommon.jsx";
import { Navigation } from "swiper/modules";


export const HomePage = () => {
  const [collections, setCollections] = useState([]);
  const {setPageLoading} = useContext(PageContext);


  const collectionListSliders = useMemo(() => {
    if (!collections.length) return null;

    const isMobile = window.matchMedia('(max-width: 767px)').matches

    return (
      <div className={'container-fluid mt-4'}>
        {collections?.map((collection, index) => {
          return (
            <div key={`collection-slider-${index}`} className={'collection-slider mt-4'}>
              <Stack direction={'horizontal'} gap={3} className={'mb-3'}>
                <h1 className={'h1'}>{collection.name}</h1>
                <Button className={'rounded-circle collection-slider__view-more'} variant={'outline-primary'}>
                  <FaAngleRight/>
                </Button>
              </Stack>
              {collection.movies.length > 0 ? <Swiper
                modules={[Navigation]}
                spaceBetween={12}
                slidesPerView={isMobile ? 3 : 6}
                className={'collection-slider__slider'}
                loop={true}
                navigation={true}
              >
                {collection.movies.map((movie) => {
                  return (
                    <SwiperSlide key={movie.id}>
                      <CardCommon
                        data={movie}
                      />
                    </SwiperSlide>
                  )
                })}
              </Swiper> : <div className="text-white" style={{marginTop: 16, paddingBottom: 140}}>Không có phim nào</div>}
            </div>
          )
        })}
      </div>
    )
  }, [collections])

  useEffect(() => {
    const fetchCollections = async () => {
      setPageLoading(true)
      try {
        const {data} = await collectionService.getFeaturedCollections();
        setCollections(data?.data?.content || []);
      } catch {
        setCollections([]);
      }
      setPageLoading(false)
    }

    fetchCollections()
  }, []);

  if (!collections.length) return null;

  return <div className={'homepage bg-dark'}>
    <TopSlide movies={collections[0].movies}/>
    <div className="topic-container container-fluid mt-4">
      {topicList.map((topic, index) => (
        <TopicCard
          key={index}
          title={topic.title}
          href={topic.href}
          bgColor={topic.bgColor}
        />
      ))}
    </div>
    {collectionListSliders}
  </div>
}
