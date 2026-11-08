
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ClipboardCheck } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(formData);
      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message || "Invalid username or password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-card" onSubmit={handleSubmit}>
        <div className="auth-brand">
          <ClipboardCheck size={30} />
          <span>TaskFlow</span>
        </div>

        <h1>Welcome back!</h1>
        <p>Sign in to continue managing your tasks.</p>

        {error && <div className="error-message">{error}</div>}

        <div className="form-group">
          <label>Username</label>
          <input
            type="text"
            name="username"
            placeholder="Enter your username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <button className="primary-button full-button" disabled={loading}>
          {loading ? "Signing in..." : "Sign In"}
        </button>

        <div className="auth-footer">
          Don't have an account? <Link to="/register">Create account</Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
