import TopSlide from "../../../components/MovieSlider/TopSlide"
import TopicCard from "../../../components/TopicCard/TopicCard"
import { topicList } from "./dummyData"

export const HomePage = () => {
  return <>
    <TopSlide/>
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
  </>
}
