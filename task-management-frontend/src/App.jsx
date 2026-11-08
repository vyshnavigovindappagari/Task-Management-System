import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";

import { AuthProvider, useAuth } from "./assets/context/AuthContext";
import { Toaster } from "react-hot-toast";

import ProtectedRoute from "./assets/components/ProtectedRoute";
import Sidebar from "./assets/components/Sidebar";
import Navbar from "./assets/components/Navbar";

import Login from "./assets/pages/Login";
import Register from "./assets/pages/Register";
import Dashboard from "./assets/pages/Dashboard";
import Tasks from "./assets/pages/Tasks";
import AddTask from "./assets/pages/AddTask";
import EditTask from "./assets/pages/EditTask";

const AppLayout = () => {
  return (
    <div className="app-layout">
      <Sidebar />

      <div className="main-area">
        <Navbar />

        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

const HomeRedirect = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Navigate
      to={isAuthenticated ? "/dashboard" : "/login"}
      replace
    />
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>       <Toaster position="top-right" />
        <Routes>
          <Route path="/" element={<HomeRedirect />} />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/add-task" element={<AddTask />} />
              <Route path="/edit-task/:id" element={<EditTask />} />
            </Route>
          </Route>

          <Route path="*" element={<HomeRedirect />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
