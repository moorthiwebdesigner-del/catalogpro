import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

const API = "http://localhost/api";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    business_name: "",
    slug: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const generateSlug = (value) => {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "business_name"
        ? {
            slug: generateSlug(value),
          }
        : {}),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!form.name.trim()) {
      setError("Name is required.");
      return;
    }

    if (!form.email.trim()) {
      setError("Email is required.");
      return;
    }

    if (!form.password) {
      setError("Password is required.");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (!form.business_name.trim()) {
      setError("Business name is required.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${API}/auth/register.php`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      const result = await response.json();

      console.log("Register:", result);

      if (!response.ok || !result.success) {
        setError(
          result.message || "Registration failed."
        );
        return;
      }

      setMessage(
        "Registration successful! Redirecting to login..."
      );

      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (err) {
      console.error(err);

      setError(
        "Unable to connect to server."
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

      <div className="auth-card">

        <div className="auth-brand">

          <div className="auth-logo">
            C
          </div>

          <div>
            <strong>
              CatalogPro
            </strong>

            <span>
              Digital Catalogue
            </span>
          </div>

        </div>

        <div className="auth-header">

          <h1>
            Create Your Account
          </h1>

          <p>
            Create your business account and
            start building your digital catalogue.
          </p>

        </div>

        {message && (
          <div className="profile-success">
            {message}
          </div>
        )}

        {error && (
          <div className="profile-error">
            {error}
          </div>
        )}

        <form
          className="auth-form"
          onSubmit={handleSubmit}
        >

          <div className="auth-field">

            <label>
              Your Name
            </label>

            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter your name"
              required
            />

          </div>

          <div className="auth-field">

            <label>
              Email Address
            </label>

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
            />

          </div>

          <div className="auth-field">

            <label>
              Password
            </label>

            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Minimum 6 characters"
              required
            />

          </div>

          <div className="auth-field">

            <label>
              Business Name
            </label>

            <input
              type="text"
              name="business_name"
              value={form.business_name}
              onChange={handleChange}
              placeholder="Example: Moorthi Furniture"
              required
            />

          </div>

          <div className="auth-field">

            <label>
              Catalogue URL
            </label>

            <div className="auth-slug-input">

              <span>
                /
              </span>

              <input
                type="text"
                name="slug"
                value={form.slug}
                onChange={handleChange}
                placeholder="moorthi-furniture"
                required
              />

            </div>

            <small>
              Your catalogue will be available at:
              <br />

              <strong>
                http://localhost:5173/
                {form.slug || "your-business"}
              </strong>
            </small>

          </div>

          <button
            type="submit"
            className="auth-submit-button"
            disabled={loading}
          >
            {loading
              ? "Creating Account..."
              : "Create Account"}
          </button>

        </form>

        <div className="auth-footer">

          <span>
            Already have an account?
          </span>

          <button
            type="button"
            onClick={() =>
              navigate("/login")
            }
          >
            Login
          </button>

        </div>

        <button
          type="button"
          className="auth-home-button"
          onClick={() =>
            navigate("/")
          }
        >
          ← Back to Home
        </button>

      </div>

    </div>
  );
}

export default Register;