import React, { useState } from 'react';
import './ActorPage.css';
import PaginationCommon from '../../../components/Pagination/PaginationCommon';

const actors = [
  { name: 'Madonna', img: 'https://upload.wikimedia.org/wikipedia/commons/9/98/Madonna_2015.jpg' },
  { name: 'Tamlyn Tomita', img: 'https://upload.wikimedia.org/wikipedia/commons/2/2e/Tamlyn_Tomita_2013.jpg' },
  { name: 'Sakari Kuosmanen', img: 'https://upload.wikimedia.org/wikipedia/commons/7/7e/Sakari_Kuosmanen.jpg' },
  { name: 'Valeria Golino', img: 'https://upload.wikimedia.org/wikipedia/commons/2/2d/Valeria_Golino_2011.jpg' },
  { name: 'Paul Calderon', img: 'https://upload.wikimedia.org/wikipedia/commons/3/3d/Paul_Calderon_2019.jpg' },
  { name: 'Charles Barkley', img: 'https://upload.wikimedia.org/wikipedia/commons/6/6d/Charles_Barkley_2019.jpg' },
  { name: 'Salma Hayek', img: 'https://upload.wikimedia.org/wikipedia/commons/6/6e/Salma_Hayek_Cannes_2015_2.jpg' },
  { name: 'Actor 8', img: 'https://randomuser.me/api/portraits/men/8.jpg' },
  { name: 'Actor 9', img: 'https://randomuser.me/api/portraits/women/9.jpg' },
  { name: 'Actor 10', img: 'https://randomuser.me/api/portraits/men/10.jpg' },
  { name: 'Actor 11', img: 'https://randomuser.me/api/portraits/men/11.jpg' },
  { name: 'Actor 12', img: 'https://randomuser.me/api/portraits/women/12.jpg' },
];

const ACTORS_PER_PAGE = 8;

const UserActorPage = () => {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(actors.length / ACTORS_PER_PAGE);
  const startIdx = (page - 1) * ACTORS_PER_PAGE;
  const endIdx = startIdx + ACTORS_PER_PAGE;
  const paginatedActors = actors.slice(startIdx, endIdx);

  return (
    <div className="actor-page">
      <h2 className="actor-title">Diễn viên</h2>
      <div className="actor-grid">
        {paginatedActors.map((actor, idx) => (
          <div className="actor-card" key={startIdx + idx}>
            <img className="actor-img" src={actor.img} alt={actor.name} />
            <div className="actor-name">{actor.name}</div>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', paddingBottom: 32 }}>
        <PaginationCommon page={page} totalPages={totalPages} onPageChange={setPage} />
      </div>
    </div>
  );
};

export default UserActorPage; 