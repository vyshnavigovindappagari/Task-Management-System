
import { useNavigate } from "react-router-dom";
import { Bell, LogOut, UserCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { username, logout } = useAuth();
  const navigate = useNavigate();

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
