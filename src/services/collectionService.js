import {movieService} from './axios';

const collectionService = {
  createCollection: (collectionData) => {
    return movieService.post('/collections', collectionData);
  },
  getAllCollections: (params) => {
    return movieService.get('/collections', { params });
  },
  deleteCollection: (id) => {
    return movieService.delete(`/collections/${id}`);
  },
  updateCollection: (id, collectionData) => {
    return movieService.put(`/collections/${id}`, collectionData);
  }
};

export { collectionService };
