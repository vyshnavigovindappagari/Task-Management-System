import { createContext, useContext, useState } from "react";
import authService from "../services/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    authService.isLoggedIn()
  );

  const [username, setUsername] = useState(
    authService.getUsername() || ""
  );

  const login = async (userData) => {
    const response = await authService.login(userData);

    setIsAuthenticated(true);
    setUsername(response.username);

    return response;
  };

  const register = async (userData) => {
    return await authService.register(userData);
  };

  const logout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setUsername("");
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        username,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
