import {userService} from './axios';

export const getMe = async () => {
  try {
    const response = await userService.get('/user/me');
    return response.data;
  } catch (error) {
    console.error('Error fetching user data', error);
    throw error;
  }
};

export const changePassword = async (oldPassword, newPassword) => {
  try {
    const response = await userService.post('/user/change-password', {
      oldPassword,
      newPassword,
    });
    return response.data;
  } catch (error) {
    console.error('Error changing password', error);
    throw error;
  }
};

export const updateUser = async (userData) => {
  try {
    const response = await userService.put('/user', userData);
    return response.data;
  } catch (error) {
    console.error('Error updating user', error);
    throw error;
  }
};

export const addFavoriteMovie = async (movieId) => {
  try {
    const response = await userService.post('/user/favorites', { movieId });
    return response.data;
  } catch (error) {
    console.error('Error add favorite movie', error);
    throw error;
  }
}; 