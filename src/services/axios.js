import axios from 'axios';
import Cookies from 'js-cookie';
import { API_ENDPOINTS, DEFAULT_HEADERS } from '../config/api.config';

// Create axios instances for different services
const createAxiosInstance = (baseURL) => {
    const instance = axios.create({
        baseURL,
        headers: DEFAULT_HEADERS,
    });

    // Add request interceptor
    instance.interceptors.request.use(
        (config) => {
            // Get token from cookie
            const token = Cookies.get('token');

            // If token exists, add it to headers
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }

            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    // Add response interceptor
    instance.interceptors.response.use(
        (response) => {
            return response;
        },
        (error) => {
            // Handle errors here
            return Promise.reject(error);
        }
    );

    return instance;
};

// Create instances for each service
export const userService = createAxiosInstance(API_ENDPOINTS.USER_SERVICE);
export const movieService = createAxiosInstance(API_ENDPOINTS.MOVIE_SERVICE);
export const streamService = createAxiosInstance(API_ENDPOINTS.STREAM_SERVICE);
export const errorService = createAxiosInstance(API_ENDPOINTS.ERROR_SERVICE);

// Export a function to create new instances if needed
export const createService = (baseURL) => createAxiosInstance(baseURL);