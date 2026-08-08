import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

const API = "https://code6technologies.com/catalogproapi";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!form.email.trim()) {
      setError("Email address is required.");
      return;
    }

    if (!form.password) {
      setError("Password is required.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${API}/auth/login.php`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email: form.email.trim(),
            password: form.password,
          }),
        }
      );

      const result = await response.json();

      console.log("Login Result:", result);

      if (
        !response.ok ||
        !result.success
      ) {
        setError(
          result.message ||
            "Invalid email or password."
        );

        return;
      }

      /*
      |--------------------------------------------------------------------------
      | Save Authentication Token
      |--------------------------------------------------------------------------
      */

      localStorage.setItem(
        "catalogpro_token",
        result.data.token
      );

      /*
      |--------------------------------------------------------------------------
      | Save Token Expiry
      |--------------------------------------------------------------------------
      */

      if (result.data.expires_at) {
        localStorage.setItem(
          "catalogpro_expires_at",
          result.data.expires_at
        );
      }

      /*
      |--------------------------------------------------------------------------
      | Save User
      |--------------------------------------------------------------------------
      */

      if (result.data.user) {
        localStorage.setItem(
          "catalogpro_user",
          JSON.stringify(
            result.data.user
          )
        );
      }

      /*
      |--------------------------------------------------------------------------
      | Save Business
      |--------------------------------------------------------------------------
      */

      if (result.data.business) {
        localStorage.setItem(
          "catalogpro_business",
          JSON.stringify(
            result.data.business
          )
        );
      }

      /*
      |--------------------------------------------------------------------------
      | Login Success
      |--------------------------------------------------------------------------
      */

      navigate("/dashboard");

    } catch (err) {
      console.error(
        "Login error:",
        err
      );

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

        {/* BRAND */}

        <div className="login-brand">

          <div className="login-logo">
            C
          </div>

          <h1>
            CatalogPro
          </h1>

          <p>
            Manage your digital catalogue
          </p>

        </div>


        {/* TITLE */}

        <div className="login-title">

          <h2>
            Welcome Back
          </h2>

          <p>
            Sign in to continue to your dashboard
          </p>

        </div>


        {/* ERROR */}

        {error && (
          <div className="login-error">
            {error}
          </div>
        )}


        {/* FORM */}

        <form
          onSubmit={handleSubmit}
        >

          {/* EMAIL */}

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


          {/* PASSWORD */}

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


          {/* LOGIN BUTTON */}

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


        {/* REGISTER */}

        <div className="login-register">

          <span>
            Don't have an account?
          </span>

          <button
            type="button"
            onClick={() =>
              navigate("/register")
            }
          >
            Create Account
          </button>

        </div>


        {/* HOME */}

        <button
          type="button"
          className="auth-home-button"
          onClick={() =>
            navigate("/")
          }
        >
          ← Back to Home
        </button>


        {/* FOOTER */}

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