import { userService } from './axios';

export const loginService = {
    login: async(username, password) => {
        return userService.post("/user/login", { username, password });
    },
};