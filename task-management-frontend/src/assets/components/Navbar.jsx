
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  LogOut,
  UserCircle,
  Sun,
  Moon,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import { getSavedTheme, saveTheme } from "../services/themeService";

const Navbar = () => {
  const { username, logout } = useAuth();
  const navigate = useNavigate();

  const [theme, setTheme] = useState(getSavedTheme);

  useEffect(() => {
    saveTheme(theme);
  }, [theme]);

  const handleThemeToggle = () => {
    setTheme((current) =>
      current === "light" ? "dark" : "light"
    );
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="top-navbar">
      <div className="navbar-title">
        <h2>Workspace</h2>
        <p>Manage your daily activities</p>
      </div>

      <div className="navbar-actions">
        <button
          className="icon-button theme-toggle"
          onClick={handleThemeToggle}
          title={theme === "light" ? "Enable dark mode" : "Enable light mode"}
          aria-label="Toggle theme"
        >
          {theme === "light" ? (
            <Moon size={20} />
          ) : (
            <Sun size={20} />
          )}
        </button>

        <button className="icon-button" aria-label="Notifications">
          <Bell size={20} />
        </button>

        <div className="user-profile">
          <UserCircle size={30} />
          <span>{username}</span>
        </div>

        <button
          className="logout-button"
          onClick={handleLogout}
          title="Logout"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
};

export default Navbar;
