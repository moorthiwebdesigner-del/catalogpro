import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

const API = "http://localhost/api";

function Categories() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);

  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    slug: "",
    sort_order: 0,
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const getToken = () => {
    return localStorage.getItem("catalogpro_token");
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    const token = getToken();

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API}/categories/list.php`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      console.log("Categories:", result);

      if (!result.success) {
        setError(
          result.message ||
            "Failed to load categories"
        );
        return;
      }

      setCategories(
        result.data.categories || []
      );

    } catch (err) {
      console.error(err);
      setError("Unable to connect to server.");
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (value) => {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const handleNameChange = (e) => {
    const name = e.target.value;

    setForm((prev) => ({
      ...prev,
      name,
      slug: editingId
        ? prev.slug
        : generateSlug(name),
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setForm({
      name: "",
      slug: "",
      sort_order: categories.length,
    });

    setEditingId(null);
    setShowForm(false);
  };

  const openAddForm = () => {
    setMessage("");
    setError("");

    setEditingId(null);

    setForm({
      name: "",
      slug: "",
      sort_order: categories.length,
    });

    setShowForm(true);
  };

  const openEditForm = (category) => {
    setMessage("");
    setError("");

    setEditingId(category.id);

    setForm({
      name: category.name || "",
      slug: category.slug || "",
      sort_order:
        category.sort_order ?? 0,
    });

    setShowForm(true);
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  const token = getToken();

  if (!token) {
    navigate("/login");
    return;
  }

  try {
    setMessage("");
    setError("");

    const isEditing = Boolean(editingId);

    const endpoint = isEditing
      ? `${API}/categories/update.php`
      : `${API}/categories/create.php`;

    const body = isEditing
      ? {
          id: editingId,
          name: form.name,
          slug: form.slug,
          sort_order: Number(form.sort_order) || 0,
        }
      : {
          name: form.name,
          slug: form.slug,
          sort_order: Number(form.sort_order) || 0,
        };

    const response = await fetch(endpoint, {
      method: isEditing ? "PUT" : "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const result = await response.json();

    console.log("Category save:", result);

    if (!result.success) {
      setError(
        result.message || "Category save failed"
      );
      return;
    }

    setMessage(
      isEditing
        ? "Category updated successfully."
        : "Category created successfully."
    );

    resetForm();

    await loadCategories();

  } catch (err) {
    console.error(err);
    setError("Unable to connect to server.");
  }
};

  const handleDelete = async (id) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this category?"
  );

  if (!confirmDelete) {
    return;
  }

  const token = getToken();

  if (!token) {
    navigate("/login");
    return;
  }

  try {
    setMessage("");
    setError("");

    const response = await fetch(
      `${API}/categories/delete.php`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: id,
        }),
      }
    );

    const result = await response.json();

    console.log("Delete category:", result);

    if (!result.success) {
      setError(
        result.message || "Delete failed"
      );
      return;
    }

    setMessage(
      "Category deleted successfully."
    );

    await loadCategories();

  } catch (err) {
    console.error(err);
    setError("Unable to connect to server.");
  }
};

  if (loading) {
    return (
      <div className="dashboard-loading">
        Loading Categories...
      </div>
    );
  }

  return (
    <div className="admin-layout">

      {/* SIDEBAR */}

      <aside className="admin-sidebar">

        <div className="admin-brand">

          <div className="admin-logo">
            C
          </div>

          <div>
            <h2>CatalogPro</h2>
            <span>Admin Panel</span>
          </div>

        </div>

        <nav className="admin-nav">

          <button
            className="admin-nav-item"
            onClick={() =>
              navigate("/dashboard")
            }
          >
            <span>▦</span>
            Dashboard
          </button>

          <button
            className="admin-nav-item"
            onClick={() =>
              navigate("/business")
            }
          >
            <span>◈</span>
            Business Profile
          </button>

          <button
            className="admin-nav-item active"
          >
            <span>☷</span>
            Categories
          </button>

          <button
            className="admin-nav-item"
            onClick={() =>
              navigate("/items")
            }
          >
            <span>▣</span>
            Items
          </button>

        </nav>

        <div className="admin-sidebar-bottom">

          <button
            className="admin-nav-item"
            onClick={() => {
              localStorage.clear();
              navigate("/login");
            }}
          >
            <span>↪</span>
            Logout
          </button>

        </div>

      </aside>


      {/* MAIN */}

      <main className="admin-main">

        <header className="admin-topbar">

          <div>
            <h1>Categories</h1>

            <p>
              Manage your catalogue categories
            </p>
          </div>

          <button
            className="category-add-button"
            onClick={openAddForm}
          >
            + Add Category
          </button>

        </header>


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


        {/* FORM */}

        {showForm && (
          <section className="category-form-card">

            <div className="category-form-header">

              <div>
                <h2>
                  {editingId
                    ? "Edit Category"
                    : "Add Category"}
                </h2>

                <p>
                  Create a category for your
                  catalogue.
                </p>
              </div>

              <button
                className="category-close-button"
                onClick={resetForm}
              >
                ×
              </button>

            </div>


            <form onSubmit={handleSubmit}>

              <div className="category-form-grid">

                <div className="category-field">

                  <label>
                    Category Name
                  </label>

                  <input
                    type="text"
                    value={form.name}
                    onChange={
                      handleNameChange
                    }
                    placeholder="Example: Electronics"
                    required
                  />

                </div>


                <div className="category-field">

                  <label>
                    Slug
                  </label>

                  <input
                    type="text"
                    name="slug"
                    value={form.slug}
                    onChange={
                      handleChange
                    }
                    placeholder="electronics"
                    required
                  />

                </div>


                <div className="category-field">

                  <label>
                    Sort Order
                  </label>

                  <input
                    type="number"
                    name="sort_order"
                    value={form.sort_order}
                    onChange={
                      handleChange
                    }
                    min="0"
                  />

                </div>

              </div>


              <div className="category-form-actions">

                <button
                  type="button"
                  className="category-cancel-button"
                  onClick={resetForm}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="category-save-button"
                >
                  {editingId
                    ? "Update Category"
                    : "Create Category"}
                </button>

              </div>

            </form>

          </section>
        )}


        {/* TABLE */}

        <section className="category-table-card">

          <div className="category-table-header">

            <div>
              <h2>
                All Categories
              </h2>

              <span>
                {categories.length} categories
              </span>
            </div>

          </div>


          {categories.length === 0 ? (

            <div className="category-empty">

              <div className="category-empty-icon">
                ☷
              </div>

              <h3>
                No categories yet
              </h3>

              <p>
                Create your first category
                to organize your catalogue.
              </p>

              <button
                className="category-add-button"
                onClick={openAddForm}
              >
                + Add Category
              </button>

            </div>

          ) : (

            <div className="category-table-wrapper">

              <table className="category-table">

                <thead>

                  <tr>

                    <th>
                      #
                    </th>

                    <th>
                      Category
                    </th>

                    <th>
                      Slug
                    </th>

                    <th>
                      Sort Order
                    </th>

                    <th>
                      Status
                    </th>

                    <th>
                      Actions
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {categories.map(
                    (category, index) => (

                      <tr
                        key={category.id}
                      >

                        <td>
                          {index + 1}
                        </td>

                        <td>

                          <div className="category-name-cell">

                            <div className="category-icon">
                              {category.name
                                ?.charAt(0)
                                .toUpperCase()}
                            </div>

                            <strong>
                              {category.name}
                            </strong>

                          </div>

                        </td>

                        <td>
                          <span className="category-slug">
                            {category.slug}
                          </span>
                        </td>

                        <td>
                          {category.sort_order}
                        </td>

                        <td>

                          <span className="category-status">
                            Active
                          </span>

                        </td>

                        <td>

                          <div className="category-actions">

                            <button
                              className="category-edit-button"
                              onClick={() =>
                                openEditForm(
                                  category
                                )
                              }
                            >
                              Edit
                            </button>

                            <button
                              className="category-delete-button"
                              onClick={() =>
                                handleDelete(
                                  category.id
                                )
                              }
                            >
                              Delete
                            </button>

                          </div>

                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          )}

        </section>

      </main>

    </div>
  );
}

export default Categories;