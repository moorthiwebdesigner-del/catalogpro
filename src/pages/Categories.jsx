import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
import AdminSidebar from "../components/AdminSidebar";

const API =
  "https://code6technologies.com/catalogproapi";

function Categories() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);

  const [editingId, setEditingId] = useState(null);

  const [subscription, setSubscription] = useState({
    plan_name: "",
    category_limit: 0,
    total_categories: 0,
    remaining_categories: null,
    end_date: "",
  });

  const [form, setForm] = useState({
    name: "",
    slug: "",
    sort_order: 0,
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  /*
  |--------------------------------------------------------------------------
  | CATEGORY POPUP
  |--------------------------------------------------------------------------
  */

  const [showUpgradePopup, setShowUpgradePopup] =
    useState(false);

  const [upgradeTitle, setUpgradeTitle] =
    useState("");

  const [upgradeMessage, setUpgradeMessage] =
    useState("");

  const [upgradeInfo, setUpgradeInfo] =
    useState(null);

  /*
  |--------------------------------------------------------------------------
  | GET TOKEN
  |--------------------------------------------------------------------------
  */

  const getToken = () => {
    return localStorage.getItem("catalogpro_token");
  };

  /*
  |--------------------------------------------------------------------------
  | SHOW CATEGORY POPUP
  |--------------------------------------------------------------------------
  */

  const showCategoryPopup = (result) => {
    const code = result?.code;

    let title = "";
    let popupMessage = "";
    let info = null;

    /*
     * 1. CATEGORY LIMIT REACHED
     */

    if (code === "CATEGORY_LIMIT_REACHED") {
      title = "Category Limit Reached";

      popupMessage =
        "You have reached your category limit. Please upgrade your plan to add more categories.";

      info = {
        plan_name:
          result?.data?.plan_name || "",

        current_categories:
          result?.data?.current_categories ?? 0,

        category_limit:
          result?.data?.category_limit ?? 0,

        remaining_categories: 0,
      };
    }

    /*
     * 2. SUBSCRIPTION EXPIRED
     */

    else if (
      code === "SUBSCRIPTION_EXPIRED"
    ) {
      title = "Subscription Expired";

      popupMessage =
        "Your subscription has expired. Please choose a plan to continue adding categories.";

      info = {
        plan_name:
          result?.data?.plan_name || "",

        end_date:
          result?.data?.end_date || "",
      };
    }

    /*
     * 3. SUBSCRIPTION REQUIRED
     */

    else if (
      code === "SUBSCRIPTION_REQUIRED"
    ) {
      title = "Subscription Required";

      popupMessage =
        "Your account does not have an active subscription. Please choose a plan to continue adding categories.";

      info = null;
    }

    /*
     * Unknown subscription error
     */

    else {
      title = "Subscription Required";

      popupMessage =
        result?.message ||
        "Please choose a plan to continue.";

      info = null;
    }

    setUpgradeTitle(title);
    setUpgradeMessage(popupMessage);
    setUpgradeInfo(info);

    setShowUpgradePopup(true);
  };

  /*
  |--------------------------------------------------------------------------
  | LOAD CATEGORIES
  |--------------------------------------------------------------------------
  */

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

      console.log(
        "Categories:",
        result
      );

      if (!result.success) {
        setError(
          result.message ||
            "Failed to load categories"
        );

        return;
      }

      /*
       * Categories
       */

      const categoryData =
        Array.isArray(result.data)
          ? result.data
          : Array.isArray(
              result.data?.categories
            )
          ? result.data.categories
          : [];

      setCategories(categoryData);

      /*
       * Subscription information
       */

      const subscriptionData =
        result.subscription ||
        result.data?.subscription ||
        null;

      if (subscriptionData) {
        setSubscription({
          plan_name:
            subscriptionData.plan_name ||
            "",

          category_limit:
            Number(
              subscriptionData.category_limit ||
                0
            ),

          total_categories:
            Number(
              subscriptionData.total_categories ||
                categoryData.length
            ),

          remaining_categories:
            subscriptionData.remaining_categories ??
            null,

          end_date:
            subscriptionData.end_date ||
            "",
        });
      } else {
        /*
         * Fallback
         */

        setSubscription((prev) => ({
          ...prev,

          total_categories:
            categoryData.length,
        }));
      }
    } catch (err) {
      console.error(err);

      setError(
        "Unable to connect to server."
      );
    } finally {
      setLoading(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | GENERATE SLUG
  |--------------------------------------------------------------------------
  */

  const generateSlug = (value) => {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  /*
  |--------------------------------------------------------------------------
  | CATEGORY NAME CHANGE
  |--------------------------------------------------------------------------
  */

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

  /*
  |--------------------------------------------------------------------------
  | FORM CHANGE
  |--------------------------------------------------------------------------
  */

  const handleChange = (e) => {
    const {
      name,
      value,
    } = e.target;

    setForm((prev) => ({
      ...prev,

      [name]: value,
    }));
  };

  /*
  |--------------------------------------------------------------------------
  | RESET FORM
  |--------------------------------------------------------------------------
  */

  const resetForm = () => {
    setForm({
      name: "",
      slug: "",
      sort_order: categories.length,
    });

    setEditingId(null);
    setShowForm(false);
  };

  /*
  |--------------------------------------------------------------------------
  | CATEGORY LIMIT CHECK
  |--------------------------------------------------------------------------
  */

  const categoryLimitReached = () => {
    const limit = Number(
      subscription.category_limit || 0
    );

    const currentCount =
      categories.length;

    /*
     * category_limit = 0
     * means unlimited
     */

    if (limit <= 0) {
      return false;
    }

    return currentCount >= limit;
  };

  /*
  |--------------------------------------------------------------------------
  | ADD CATEGORY
  |--------------------------------------------------------------------------
  */

  const openAddForm = () => {
    setMessage("");
    setError("");

    /*
     * Frontend category limit check
     */

    if (categoryLimitReached()) {
      setShowUpgradePopup(false);

      /*
       * Show limit popup directly
       */

      setUpgradeTitle(
        "Category Limit Reached"
      );

      setUpgradeMessage(
        "You have reached your category limit. Please upgrade your plan to add more categories."
      );

      setUpgradeInfo({
        plan_name:
          subscription.plan_name,

        current_categories:
          categories.length,

        category_limit:
          subscription.category_limit,

        remaining_categories: 0,
      });

      setShowUpgradePopup(true);

      return;
    }

    setEditingId(null);

    setForm({
      name: "",
      slug: "",
      sort_order:
        categories.length,
    });

    setShowForm(true);
  };

  /*
  |--------------------------------------------------------------------------
  | EDIT CATEGORY
  |--------------------------------------------------------------------------
  */

  const openEditForm = (category) => {
    setMessage("");
    setError("");

    /*
     * IMPORTANT:
     * Editing is always allowed.
     * Category limit only applies
     * while creating.
     */

    setEditingId(category.id);

    setForm({
      name: category.name || "",

      slug: category.slug || "",

      sort_order:
        category.sort_order ?? 0,
    });

    setShowForm(true);
  };

  /*
  |--------------------------------------------------------------------------
  | SAVE CATEGORY
  |--------------------------------------------------------------------------
  */

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = getToken();

    if (!token) {
      navigate("/login");
      return;
    }

    /*
     * Extra frontend protection
     *
     * Only check limit while creating.
     */

    if (
      !editingId &&
      categoryLimitReached()
    ) {
      setShowForm(false);

      setUpgradeTitle(
        "Category Limit Reached"
      );

      setUpgradeMessage(
        "You have reached your category limit. Please upgrade your plan to add more categories."
      );

      setUpgradeInfo({
        plan_name:
          subscription.plan_name,

        current_categories:
          categories.length,

        category_limit:
          subscription.category_limit,

        remaining_categories: 0,
      });

      setShowUpgradePopup(true);

      return;
    }

    try {
      setMessage("");
      setError("");

      const isEditing =
        Boolean(editingId);

      const endpoint = isEditing
        ? `${API}/categories/update.php`
        : `${API}/categories/create.php`;

      const body = isEditing
        ? {
            id: editingId,

            name: form.name,

            slug: form.slug,

            sort_order:
              Number(
                form.sort_order
              ) || 0,
          }
        : {
            name: form.name,

            slug: form.slug,

            sort_order:
              Number(
                form.sort_order
              ) || 0,
          };

      const response = await fetch(
        endpoint,
        {
          method: isEditing
            ? "PUT"
            : "POST",

          headers: {
            Authorization:
              `Bearer ${token}`,

            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(
            body
          ),
        }
      );

      const result =
        await response.json();

      console.log(
        "Category save:",
        result
      );

      /*
       * SUBSCRIPTION ERRORS
       *
       * These are the 3 popup types.
       */

      if (
        result.code ===
          "CATEGORY_LIMIT_REACHED" ||
        result.code ===
          "SUBSCRIPTION_EXPIRED" ||
        result.code ===
          "SUBSCRIPTION_REQUIRED"
      ) {
        setShowForm(false);

        showCategoryPopup(result);

        return;
      }

      /*
       * Normal API error
       */

      if (!result.success) {
        setError(
          result.message ||
            "Category save failed"
        );

        return;
      }

      /*
       * Success
       */

      setMessage(
        isEditing
          ? "Category updated successfully."
          : "Category created successfully."
      );

      resetForm();

      await loadCategories();
    } catch (err) {
      console.error(err);

      setError(
        "Unable to connect to server."
      );
    }
  };

  /*
  |--------------------------------------------------------------------------
  | DELETE CATEGORY
  |--------------------------------------------------------------------------
  */

  const handleDelete = async (id) => {
    const confirmDelete =
      window.confirm(
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

      const response =
        await fetch(
          `${API}/categories/delete.php`,
          {
            method: "DELETE",

            headers: {
              Authorization:
                `Bearer ${token}`,

              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              id: id,
            }),
          }
        );

      const result =
        await response.json();

      console.log(
        "Delete category:",
        result
      );

      /*
       * If delete API also returns
       * subscription errors,
       * show the same popup.
       */

      if (
        result.code ===
          "SUBSCRIPTION_EXPIRED" ||
        result.code ===
          "SUBSCRIPTION_REQUIRED"
      ) {
        showCategoryPopup(result);

        return;
      }

      if (!result.success) {
        setError(
          result.message ||
            "Delete failed"
        );

        return;
      }

      setMessage(
        "Category deleted successfully."
      );

      await loadCategories();
    } catch (err) {
      console.error(err);

      setError(
        "Unable to connect to server."
      );
    }
  };

  /*
  |--------------------------------------------------------------------------
  | LOADING
  |--------------------------------------------------------------------------
  */

  if (loading) {
    return (
      <div className="dashboard-loading">
        Loading Categories...
      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | MAIN
  |--------------------------------------------------------------------------
  */

  return (
    <div className="admin-layout">

      {/* SIDEBAR */}

      <AdminSidebar />

      {/* MAIN */}

      <main className="admin-main">

        {/* TOPBAR */}

        <header className="admin-topbar">

          <div>
            <h1>
              Categories
            </h1>

            <p>
              Manage your catalogue
              categories
            </p>
          </div>

          <button
            type="button"
            className="category-add-button"
            onClick={
              openAddForm
            }
          >
            + Add Category
          </button>

        </header>

        {/* SUCCESS */}

        {message && (
          <div className="profile-success">
            {message}
          </div>
        )}

        {/* ERROR */}

        {error && (
          <div className="profile-error">
            {error}
          </div>
        )}

        {/* PLAN INFO */}

        {subscription.plan_name && (
          <div className="category-plan-info">

            <div>
              <span>
                Current Plan
              </span>

              <strong>
                {
                  subscription.plan_name
                }
              </strong>
            </div>

            <div>
              <span>
                Categories
              </span>

              <strong>
                {
                  categories.length
                }

                {" / "}

                {subscription.category_limit >
                0
                  ? subscription.category_limit
                  : "Unlimited"}
              </strong>
            </div>

            {subscription.end_date && (
              <div>
                <span>
                  Valid Until
                </span>

                <strong>
                  {
                    subscription.end_date
                  }
                </strong>
              </div>
            )}

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
                  Create a category
                  for your catalogue.
                </p>
              </div>

              <button
                type="button"
                className="category-close-button"
                onClick={
                  resetForm
                }
              >
                ×
              </button>

            </div>

            <form
              onSubmit={
                handleSubmit
              }
            >

              <div className="category-form-grid">

                {/* NAME */}

                <div className="category-field">

                  <label>
                    Category Name
                  </label>

                  <input
                    type="text"
                    value={
                      form.name
                    }
                    onChange={
                      handleNameChange
                    }
                    placeholder="Example: Electronics"
                    required
                  />

                </div>

                {/* SLUG */}

                <div className="category-field">

                  <label>
                    Slug
                  </label>

                  <input
                    type="text"
                    name="slug"
                    value={
                      form.slug
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="electronics"
                    required
                  />

                </div>

                {/* SORT */}

                <div className="category-field">

                  <label>
                    Sort Order
                  </label>

                  <input
                    type="number"
                    name="sort_order"
                    value={
                      form.sort_order
                    }
                    onChange={
                      handleChange
                    }
                    min="0"
                  />

                </div>

              </div>

              {/* ACTIONS */}

              <div className="category-form-actions">

                <button
                  type="button"
                  className="category-cancel-button"
                  onClick={
                    resetForm
                  }
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


<section className="item-table-card">
        {/* CATEGORY HEADER */}

        <div className="category-table-header">

          <div>
            <h2>
              All Categories
            </h2>

            <span>
              {
                categories.length
              }{" "}

              {categories.length ===
              1
                ? "category"
                : "categories"}
            </span>
          </div>

        </div>

        {/* EMPTY */}

        {categories.length ===
        0 ? (

          <div className="category-empty">

            <div className="category-empty-icon">
              ☷
            </div>

            <h3>
              No categories yet
            </h3>

            <p>
              Create your first
              category to organize
              your catalogue.
            </p>

            <button
              type="button"
              className="category-add-button"
              onClick={
                openAddForm
              }
            >
              + Add Category
            </button>

          </div>

        ) : (

          <>

            {/* DESKTOP TABLE */}

            <div className="category-table-wrapper">

              <table className="category-table">

                <thead>

                  <tr>
                    <th>#</th>
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
                    (
                      category,
                      index
                    ) => (

                      <tr
                        key={
                          category.id
                        }
                      >

                        <td>
                          {
                            index +
                            1
                          }
                        </td>

                        <td>

                          <div className="category-name-cell">

                            <div className="category-icon">
                              {category.name
                                ?.charAt(
                                  0
                                )
                                .toUpperCase()}
                            </div>

                            <strong>
                              {
                                category.name
                              }
                            </strong>

                          </div>

                        </td>

                        <td>

                          <span className="category-slug">
                            {
                              category.slug
                            }
                          </span>

                        </td>

                        <td>
                          {
                            category.sort_order
                          }
                        </td>

                        <td>

                          <span className="category-status">
                            Active
                          </span>

                        </td>

                        <td>

                          <div className="category-actions">

                            <button
                              type="button"
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
                              type="button"
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

            {/* MOBILE */}

            <div className="category-mobile-list">

              {categories.map(
                (
                  category,
                  index
                ) => (

                  <div
                    className="category-mobile-card"
                    key={
                      category.id
                    }
                  >

                    {/* TOP */}

                    <div className="category-mobile-top">

                      <div className="category-mobile-info">

                        <div className="category-mobile-icon">
                          {category.name
                            ?.charAt(
                              0
                            )
                            .toUpperCase()}
                        </div>

                        <div>

                          <strong>
                            {
                              category.name
                            }
                          </strong>

                          <span>
                            /
                            {
                              category.slug
                            }
                          </span>

                        </div>

                      </div>

                      <span className="category-mobile-status">
                        Active
                      </span>

                    </div>

                    {/* DETAILS */}

                    <div className="category-mobile-details">

                      <div>

                        <small>
                          #
                        </small>

                        <strong>
                          {
                            index +
                            1
                          }
                        </strong>

                      </div>

                      <div>

                        <small>
                          Sort Order
                        </small>

                        <strong>
                          {
                            category.sort_order
                          }
                        </strong>

                      </div>

                    </div>

                    {/* ACTIONS */}

                    <div className="category-mobile-actions">

                      <button
                        type="button"
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
                        type="button"
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

                  </div>

                )
              )}

            </div>

          </>

        )}

      </section>

      </main>

      {/* =====================================================
          CATEGORY SUBSCRIPTION POPUP
          3 TYPES:
          1. CATEGORY LIMIT REACHED
          2. SUBSCRIPTION EXPIRED
          3. SUBSCRIPTION REQUIRED
          ===================================================== */}

      {showUpgradePopup && (

        <div
          className="upgrade-popup-overlay"
          onClick={() =>
            setShowUpgradePopup(
              false
            )
          }
        >

          <div
            className="upgrade-popup"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* CLOSE */}

            <button
              type="button"
              className="upgrade-popup-close"
              onClick={() =>
                setShowUpgradePopup(
                  false
                )
              }
            >
              ×
            </button>

            {/* ICON */}

            <div className="upgrade-popup-icon">
              ⚡
            </div>

            {/* TITLE */}

            <h2>
              {upgradeTitle}
            </h2>

            {/* MESSAGE */}

            <p>
              {upgradeMessage}
            </p>

            {/* LIMIT INFO */}

            {upgradeInfo &&
              upgradeTitle ===
                "Category Limit Reached" && (

                <div className="upgrade-popup-info">

                  {upgradeInfo.plan_name && (
                    <div>

                      <span>
                        Current Plan
                      </span>

                      <strong>
                        {
                          upgradeInfo.plan_name
                        }
                      </strong>

                    </div>
                  )}

                  <div>

                    <span>
                      Categories Used
                    </span>

                    <strong>
                      {
                        upgradeInfo.current_categories
                      }

                      {" / "}

                      {
                        upgradeInfo.category_limit
                      }
                    </strong>

                  </div>

                </div>

              )}

            {/* EXPIRED INFO */}

            {upgradeInfo &&
              upgradeTitle ===
                "Subscription Expired" && (

                <div className="upgrade-popup-info">

                  {upgradeInfo.plan_name && (
                    <div>

                      <span>
                        Previous Plan
                      </span>

                      <strong>
                        {
                          upgradeInfo.plan_name
                        }
                      </strong>

                    </div>
                  )}

                  {upgradeInfo.end_date && (
                    <div>

                      <span>
                        Expired On
                      </span>

                      <strong>
                        {
                          upgradeInfo.end_date
                        }
                      </strong>

                    </div>
                  )}

                </div>

              )}

            {/* REQUIRED */}

            {upgradeTitle ===
              "Subscription Required" && (

              <div className="upgrade-popup-info">

                <div>

                  <span>
                    Account Status
                  </span>

                  <strong>
                    No Active Plan
                  </strong>

                </div>

              </div>

            )}

            {/* ACTIONS */}

            <div className="upgrade-popup-actions">

              <button
                type="button"
                className="upgrade-popup-cancel"
                onClick={() =>
                  setShowUpgradePopup(
                    false
                  )
                }
              >
                Maybe Later
              </button>

              <button
                type="button"
                className="upgrade-popup-button"
                onClick={() => {

                  setShowUpgradePopup(
                    false
                  );

                  navigate(
                    "/plans"
                  );

                }}
              >
                Choose Plan
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default Categories;