import { useState } from "react";
import {
  useNavigate,
  useLocation,
} from "react-router-dom";

function AdminSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [open, setOpen] = useState(false);


  /*
  |--------------------------------------------------------------------------
  | Close Mobile Menu
  |--------------------------------------------------------------------------
  */

  const closeMenu = () => {
    setOpen(false);
  };


  /*
  |--------------------------------------------------------------------------
  | Navigate
  |--------------------------------------------------------------------------
  */

  const goTo = (path) => {
    navigate(path);
    closeMenu();
  };


  /*
  |--------------------------------------------------------------------------
  | Logout
  |--------------------------------------------------------------------------
  */

  const handleLogout = () => {
    localStorage.removeItem(
      "catalogpro_token"
    );

    localStorage.removeItem(
      "catalogpro_expires_at"
    );

    localStorage.removeItem(
      "catalogpro_user"
    );

    localStorage.removeItem(
      "catalogpro_business"
    );

    navigate("/login");
  };


  /*
  |--------------------------------------------------------------------------
  | View Catalogue
  |--------------------------------------------------------------------------
  */

  const viewCatalogue = () => {
    const stored =
      localStorage.getItem(
        "catalogpro_business"
      );

    if (!stored) {
      return;
    }

    try {
      const business =
        JSON.parse(stored);

      if (!business?.slug) {
        return;
      }

      window.open(
        `/${business.slug}`,
        "_blank",
        "noopener,noreferrer"
      );

      closeMenu();

    } catch (error) {
      console.error(
        "Business JSON error:",
        error
      );
    }
  };


  /*
  |--------------------------------------------------------------------------
  | Active Menu
  |--------------------------------------------------------------------------
  */

  const isActive = (path) => {
    return location.pathname === path;
  };


  return (
    <>
      {/* =========================================================
          MOBILE HEADER
      ========================================================= */}

      <header className="mobile-admin-header">

        <button
          type="button"
          className="mobile-menu-button"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
        >
          ☰
        </button>


        <div className="mobile-admin-title">

          <strong>
            CatalogPro
          </strong>

          <span>
            Admin Panel
          </span>

        </div>

      </header>


      {/* =========================================================
          MOBILE OVERLAY
      ========================================================= */}

      {open && (
        <div
          className="mobile-sidebar-overlay"
          onClick={closeMenu}
        />
      )}


      {/* =========================================================
          SIDEBAR
      ========================================================= */}

      <aside
        className={
          open
            ? "admin-sidebar mobile-open"
            : "admin-sidebar"
        }
      >


        {/* =======================================================
            BRAND
        ======================================================= */}

        <div className="admin-brand">

          <div className="admin-logo">
            C
          </div>


          <div>

            <h2>
              CatalogPro
            </h2>

            <span>
              Admin Panel
            </span>

          </div>

        </div>


        {/* =======================================================
            MOBILE CLOSE BUTTON
        ======================================================= */}

        <button
          type="button"
          className="mobile-sidebar-close"
          onClick={closeMenu}
          aria-label="Close menu"
        >
          ×
        </button>


        {/* =======================================================
            NAVIGATION
        ======================================================= */}

        <nav className="admin-nav">


          {/* DASHBOARD */}

          <button
            type="button"
            className={`admin-nav-item ${
              isActive("/dashboard")
                ? "active"
                : ""
            }`}
            onClick={() =>
              goTo("/dashboard")
            }
          >
            <span>
              ▦
            </span>

            Dashboard
          </button>


          {/* BUSINESS PROFILE */}

          <button
            type="button"
            className={`admin-nav-item ${
              isActive("/business")
                ? "active"
                : ""
            }`}
            onClick={() =>
              goTo("/business")
            }
          >
            <span>
              ◈
            </span>

            Business Profile
          </button>


          {/* CATEGORIES */}

          <button
            type="button"
            className={`admin-nav-item ${
              isActive("/categories")
                ? "active"
                : ""
            }`}
            onClick={() =>
              goTo("/categories")
            }
          >
            <span>
              ☷
            </span>

            Categories
          </button>


          {/* ITEMS */}

          <button
            type="button"
            className={`admin-nav-item ${
              isActive("/items")
                ? "active"
                : ""
            }`}
            onClick={() =>
              goTo("/items")
            }
          >
            <span>
              ▣
            </span>

            Items
          </button>

          <button
            type="button"
            className={`admin-nav-item ${
              isActive("/payment-history")
                ? "active"
                : ""
            }`}
            onClick={() =>
              goTo("/payment-history")
            }
          >
  <span>◷</span>
  Payment History
</button>


          {/* VIEW CATALOGUE */}

          <button
            type="button"
            className="admin-nav-item"
            onClick={viewCatalogue}
          >
            <span>
              ↗
            </span>

            View Catalogue
          </button>

        </nav>


        {/* =======================================================
            SIDEBAR BOTTOM
        ======================================================= */}

        <div className="admin-sidebar-bottom">

          <button
            type="button"
            className="admin-nav-item logout-button"
            onClick={handleLogout}
          >
            <span>
              ↪
            </span>

            Logout
          </button>

        </div>

      </aside>
    </>
  );
}

export default AdminSidebar;