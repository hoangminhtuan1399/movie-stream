import axiosInstance from "./axios";

export const loginService = {
  login: async (username, password) => {
    return axiosInstance.post("/user/login",
      { username, password },
    );
  },
};
