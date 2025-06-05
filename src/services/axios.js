 import axios from 'axios';

 const axiosInstance = axios.create({
     baseURL: 'https://movie-streaming-movie-service-319946458144.asia-southeast1.run.app/api',
     headers: {
         'Content-Type': 'application/json',
     },
 });

 // Add request interceptor
 axiosInstance.interceptors.request.use(
     (config) => {
         // You can add auth token here if needed
         return config;
     },
     (error) => {
         return Promise.reject(error);
     }
 );

 // Add response interceptor
 axiosInstance.interceptors.response.use(
     (response) => {
         return response;
     },
     (error) => {
         // Handle errors here
         return Promise.reject(error);
     }
 );

 export default axiosInstance;