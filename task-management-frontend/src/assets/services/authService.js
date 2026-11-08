
import api from "./api";

const authService = {
  register: async (userData) => {
    const response = await api.post("/api/auth/register", userData);
    return response.data;
  },

  login: async (userData) => {
    const response = await api.post("/api/auth/login", userData);

    localStorage.setItem("token", response.data.token);
    localStorage.setItem("username", response.data.username);

    return response.data;
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
  },

  getToken: () => localStorage.getItem("token"),

  getUsername: () => localStorage.getItem("username"),

  isLoggedIn: () => !!localStorage.getItem("token"),
};

export default authService;
