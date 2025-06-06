import TopSlide from "../../../components/MovieSlider/TopSlide"
import TopicCard from "../../../components/TopicCard/TopicCard"
import { dummyCollections, topicList } from "./dummyData"
import { useContext, useEffect, useState } from "react";
import { PageContext } from "../../../contexts/PageContext.jsx";

export const HomePage = () => {
  const [collections, setCollections] = useState([]);
  const { setPageLoading } = useContext(PageContext);

  useEffect(() => {
    const fetchCollections = async () => {
      setPageLoading(true)
      await new Promise(resolve => setTimeout(resolve, 2000));
      setPageLoading(false)
      setCollections(dummyCollections)
    }

    fetchCollections()
  }, []);

  if (!collections.length) return null;

  return <div className={'homepage'}>
    <TopSlide />
    <div className="topic-container">
      {topicList.map((topic, index) => (
        <TopicCard
          key={index}
          title={topic.title}
          href={topic.href}
          bgColor={topic.bgColor}
        />
      ))}
    </div>
  </div>
}
