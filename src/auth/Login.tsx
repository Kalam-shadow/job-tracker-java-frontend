import { useState } from "react";
import { login } from "./authService";
import { useNavigate } from "react-router-dom";
import "./Login.css";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    
    try {
      if (!username.trim() || !password.trim()) {
        setError("Please enter both username and password");
        setIsLoading(false);
        return;
      }
      
      await login(username, password);
      navigate("/jobs");
    } catch (error: any) {
      console.error("Login failed:", error);
      setError(error.message || "Login failed. Please try again.");
      setIsLoading(false);
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Job Tracker</h1>
          <p>Track your job applications with ease</p>
        </div>
        
        <form className="login-form" onSubmit={handleSubmit}>
          {error && <div className="login-error">{error}</div>}
          
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            className="login-button"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="login-footer">
          <p>© 2026 Job Tracker. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}