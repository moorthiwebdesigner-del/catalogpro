import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        "https://code6technologies.com/catalogproapi/auth/login.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      const result = await response.json();

      if (!result.success) {
        setError(
          result.message || "Invalid email or password"
        );
        return;
      }

      /*
       * Save JWT token
       */
      localStorage.setItem(
        "catalogpro_token",
        result.data.token
      );

      /*
       * Save token expiry
       */
      if (result.data.expires_at) {
        localStorage.setItem(
          "catalogpro_expires_at",
          result.data.expires_at
        );
      }

      /*
       * Save user
       */
      localStorage.setItem(
        "catalogpro_user",
        JSON.stringify(result.data.user)
      );

      /*
       * Save business
       */
      localStorage.setItem(
        "catalogpro_business",
        JSON.stringify(result.data.business)
      );

      /*
       * Go to dashboard
       */
      navigate("/dashboard");

    } catch (error) {
      console.error("Login error:", error);

      setError(
        "Unable to connect to server. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      <div className="login-card">

        <div className="login-brand">

          <div className="login-logo">
            C
          </div>

          <h1>CatalogPro</h1>

          <p>
            Manage your digital catalogue
          </p>

        </div>

        <div className="login-title">

          <h2>Welcome Back</h2>

          <p>
            Sign in to continue to your dashboard
          </p>

        </div>

        {error && (
          <div className="login-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          <div className="form-group">

            <label htmlFor="email">
              Email Address
            </label>

            <input
              id="email"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="moorthi@example.com"
              autoComplete="email"
              required
            />

          </div>

          <div className="form-group">

            <label htmlFor="password">
              Password
            </label>

            <input
              id="password"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter your password"
              autoComplete="current-password"
              required
            />

          </div>

          <button
            type="submit"
            className="login-button"
            disabled={loading}
          >

            {loading ? (
              <>
                <span className="login-spinner"></span>
                Signing in...
              </>
            ) : (
              "Sign In"
            )}

          </button>

        </form>

        <div className="login-footer">
          <p>
            © {new Date().getFullYear()} CatalogPro
          </p>
        </div>

      </div>

    </div>
  );
}

export default Login;