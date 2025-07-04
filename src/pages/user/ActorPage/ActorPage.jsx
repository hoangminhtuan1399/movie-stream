import React, { useEffect, useState } from 'react';
import './ActorPage.css';
import PaginationCommon from '../../../components/Pagination/PaginationCommon';
import { actorService } from '../../../services/actorService';
import { useNavigate } from 'react-router-dom';
import { HeaderBack } from '../../../components/Header/Header';
import { useToast } from '../../../contexts/ToastContext.jsx';

const ACTORS_PER_PAGE = 8;

const UserActorPage = () => {
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [actors, setActors] = useState([]);
  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    const fetchActors = async () => {
      try {
        const params = { page: page - 1, size: ACTORS_PER_PAGE };
        const { data } = await actorService.getAllActors(params);
        setActors(data?.data?.content || []);
        setTotalPages(data?.data?.totalPages || 1);
      } catch {
        setActors([]);
        setTotalPages(1);
        showToast('Lỗi tải danh sách diễn viên!', 'danger');
      }
    };
    fetchActors();
  }, [page]);

  return (
    <div className="actor-page">
      <div className={'category-container'}>
        <HeaderBack style={{ padding: 0}} title="Diễn viên"/>
        <div className="actor-grid">
          {actors.map((actor) => (
            <div className="actor-card" key={actor.id} onClick={() => navigate(`/actor/${actor.id}`)}>
              <img className="actor-img" src={actor.avatarUrl || actor.img} alt={actor.name}/>
              <div className="actor-name">{actor.name}</div>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', paddingBottom: 32 }}>
          <PaginationCommon page={page} totalPages={totalPages} onPageChange={setPage}/>
        </div>
      </div>
    </div>
  );
};

export default UserActorPage; 
