import React from 'react';
import { FaAngleRight } from 'react-icons/fa';
import './TopicCard.css'; // (Đảm bảo bạn có file CSS đính kèm bên dưới)

const TopicCard = ({ title, href, bgColor }) => {
  return (
    <a className="row-topic" href={href}>
      <div className="mask" style={{ backgroundColor: bgColor }}></div>
      <div className="intro">
        <div className="heading-md lim-2 mb-0">{title}</div>
        <div className="info">
          <div className="btn btn-sm btn-outline">
            <span>Xem chủ đề</span>
            <FaAngleRight />
          </div>
        </div>
      </div>
    </a>
  );
};

export default TopicCard;