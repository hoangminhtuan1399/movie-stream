import { movieService } from './axios';

const actorService = {
  getAllActors: (params) => {
    return movieService.get('/actors', { params });
  },
  createActor: (actorData) => {
    return movieService.post('/actors', actorData);
  },
  updateActor: (id, actorData) => {
    return movieService.put(`/actors/${id}`, actorData);
  },
  deleteActor: (id) => {
    return movieService.delete(`/actors/${id}`);
  },
  getActorDetail: (id) => {
    return movieService.get(`/actors/${id}`);
  },
};

export { actorService }; 