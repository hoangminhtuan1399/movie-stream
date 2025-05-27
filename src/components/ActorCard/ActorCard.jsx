import React from 'react';
import './ActorCard.css';

const ActorCard = ({ actor }) => {
  const { name, img, role } = actor;

  return (
    <div className="actor-card">
      <div className="actor-card__image">
        <img src={img} alt={name} />
      </div>
      <div className="actor-card__info">
        <h4 className="actor-card__name">{name}</h4>
        {role && <p className="actor-card__role">{role}</p>}
      </div>
    </div>
  );
};

export default ActorCard; 