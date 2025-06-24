import React from 'react';
import './ActorCard.css';
import { useNavigate } from 'react-router-dom';

const ActorCard = ({ actor }) => {
  const navigate = useNavigate();
  const { name, avatarUrl, role } = actor;

  const handleActorClick = (actorId) => {
    navigate(`/actor/${actorId}`);
  };

  return (
    <div className="actor-card" onClick={() => handleActorClick(actor.id)} >
      <div className="actor-card__image">
        <img src={avatarUrl} alt={name} />
      </div>
      <div className="actor-card__info">
        <h4 className="actor-card__name">{name}</h4>
        {role && <p className="actor-card__role">{role}</p>}
      </div>
    </div>
  );
};

export default ActorCard; 