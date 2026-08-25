import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../Services/api";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      console.log("Login successful:", response.data);

      localStorage.setItem(
        "nirvaUser",
        JSON.stringify(response.data)
      );

      navigate("/dashboard");

    }  catch (error) {

  if (error.response?.data) {
    setError(error.response.data);
  } else {
    setError("Unable to connect to NIRVA server.");
  }

} finally {
  setLoading(false);
}
  };

  return (
    <div className="auth-page">

      <div className="auth-card">

        <div className="auth-brand">

          <div className="brand-icon">
            N
          </div>

          <h1>NIRVA</h1>

          <p>
            Smart mobility for Bengaluru
          </p>

        </div>

        <div className="auth-content">

          <h2>
            Welcome back
          </h2>

          <p>
            Login to continue your journey.
          </p>

          <form onSubmit={handleSubmit}>

            <label>
              Email address
            </label>

            <input
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              placeholder="you@example.com"
              required
            />

            <label>
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              placeholder="Enter your password"
              required
            />

            <button
              type="submit"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>

          </form>

          {error && (
            <p className="error-message">
              {error}
            </p>
          )}

          <p className="auth-footer">
            Don't have an account?{" "}

            <Link to="/register">
              Create account
            </Link>
          </p>

        </div>

      </div>

    </div>
  );
}

export default Login;