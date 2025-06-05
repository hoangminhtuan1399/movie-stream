import axiosInstance from './axios';

export const movieService = {
    searchMovies: async(keyword) => {
        try {
            const response = await axiosInstance.get(`/movies/search`, {
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

export default movieService;