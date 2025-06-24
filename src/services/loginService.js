import { userService } from './axios';

export const loginService = {
    login: async(username, password) => {
        return userService.post("/user/login", { username, password });
    },
    register: async(username, password, email, name) => {
        return userService.post("/user/register", { username, password, email, name });
    }
};