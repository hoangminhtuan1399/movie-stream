/* eslint-disable no-useless-catch */
import { movieService, streamService } from './axios';
// import { streamService } from './axios';
import { userService } from './axios';

export const movieApi = {
    searchMovies: async(keyword) => {
        try {
            const response = await movieService.get(`/movies/search`, {
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

export const getActorDetail = async (id) => {
    try {
        const response = await streamService.get(`/actors/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export default movieApi;