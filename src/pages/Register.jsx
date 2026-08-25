import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../Services/api";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await api.post("/auth/register", {
        name,
        email,
        password,
      });

      console.log("Registration successful:", response.data);

      setSuccess("Account created successfully!");

      setTimeout(() => {
        navigate("/login");
      }, 1500);
} catch (error) {

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
          <div className="brand-icon">N</div>

          <h1>NIRVA</h1>

          <p>
            Smart mobility for Bengaluru
          </p>
        </div>

        <div className="auth-content">

          <h2>Create your account</h2>

          <p>
            Start exploring smarter routes.
          </p>

          <form onSubmit={handleSubmit}>

            <label>Full name</label>

            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Enter your name"
              required
            />

            <label>Email address</label>

            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              required
            />

            <label>Password</label>

            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Create a password"
              required
            />

            <button
              type="submit"
              disabled={loading}
            >
              {loading ? "Creating account..." : "Create account"}
            </button>

          </form>

          {success && (
            <p className="success-message">
              {success}
            </p>
          )}

          {error && (
            <p className="error-message">
              {error}
            </p>
          )}

          <p className="auth-footer">
            Already have an account?{" "}

            <Link to="/login">
              Login
            </Link>
          </p>

        </div>

      </div>

    </div>
  );
}

export default Register;