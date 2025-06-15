import { movieService } from './axios';

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

export default movieApi;