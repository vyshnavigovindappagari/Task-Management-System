
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  ListTodo,
  PlusCircle,
  ClipboardCheck,
  CalendarDays,
  Activity,
} from "lucide-react";

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-icon">
          <ClipboardCheck size={24} />
        </div>
        <span>TaskFlow</span>
      </div>

      <div className="sidebar-section">
        <p className="sidebar-label">WORKSPACE</p>

        <nav className="sidebar-nav">
          <NavLink to="/dashboard" className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }>
            <LayoutDashboard size={19} />
            <span>Dashboard</span>
          </NavLink>

          <NavLink to="/tasks" className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }>
            <ListTodo size={19} />
            <span>All Tasks</span>
          </NavLink>

          <NavLink to="/add-task" className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }>
            <PlusCircle size={19} />
            <span>Add New Task</span>
          </NavLink>

          <NavLink to="/calendar" className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }>
            <CalendarDays size={19} />
            <span>Calendar</span>
          </NavLink>

          <NavLink to="/activity" className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }>
            <Activity size={19} />
            <span>Activity History</span>
          </NavLink>
        </nav>
      </div>

      <div className="sidebar-bottom">
        <p>Organize your work.</p>
        <span>Stay focused. Get things done.</span>
      </div>
    </aside>
  );
};

export default Sidebar;
