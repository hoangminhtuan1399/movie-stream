/* eslint-disable no-useless-catch */
import { movieService } from './axios';

export const movieServiceApi = {
    getMovies: (params) => {
        return movieService.get('/movies', { params });
    },
    searchMovies: (params) => {
        return movieService.post('/movies/filter', { ...params });
    },
    createMovie: (movieData) => {
        return movieService.post('/movies', movieData);
    },
    updateMovie: (id, movieData) => {
        return movieService.put(`/movies/${id}`, movieData);
    },
    deleteMovie: (id) => {
        return movieService.delete(`/movies/${id}`);
    },
    searchActors: async (keyword) => {
        try {
            const response = await movieService.get(`/actors`, {
                params: {
                    keyword: keyword
                }
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};

export const getMovieDetail = async (id) => {
    try {
        const response = await movieService.get(`/movies/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export default movieServiceApi;
