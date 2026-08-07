import { useState } from "react";
import { useNavigate, useLocation  } from "react-router-dom";

function AdminSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const closeMenu = () => {
    setOpen(false);
  };

  const goTo = (path) => {
    navigate(path);
    closeMenu();
  };

  const handleLogout = () => {
    localStorage.removeItem("catalogpro_token");
    localStorage.removeItem("catalogpro_expires_at");
    localStorage.removeItem("catalogpro_user");
    localStorage.removeItem("catalogpro_business");

    navigate("/login");
  };

  const viewCatalogue = () => {
    const stored =
      localStorage.getItem("catalogpro_business");

    if (!stored) return;

    const business = JSON.parse(stored);

    if (!business.slug) return;

    window.open(
      `/${business.slug}`,
      "_blank",
      "noopener,noreferrer"
    );

    closeMenu();
  };

  return (
    <>
      {/* MOBILE HEADER */}

      <header className="mobile-admin-header">

        <button
          type="button"
          className="mobile-menu-button"
          onClick={() => setOpen(true)}
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


      {/* MOBILE OVERLAY */}

      {open && (
        <div
          className="mobile-sidebar-overlay"
          onClick={closeMenu}
        />
      )}


      {/* SIDEBAR */}

      <aside
        className={
          open
            ? "admin-sidebar mobile-open"
            : "admin-sidebar"
        }
      >

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


        {/* CLOSE BUTTON - MOBILE */}

        <button
          type="button"
          className="mobile-sidebar-close"
          onClick={closeMenu}
        >
          ×
        </button>


        <nav className="admin-nav">

          <button
           type="button"
  className={`admin-nav-item ${
    location.pathname === "/dashboard" ? "active" : ""
  }`}
            onClick={() =>
              goTo("/dashboard")
            }
          >
            <span>▦</span>
            Dashboard
          </button>


          <button
           type="button"
  className={`admin-nav-item ${
    location.pathname === "/business" ? "active" : ""
  }`}
            onClick={() =>
              goTo("/business")
            }
          >
            <span>◈</span>
            Business Profile
          </button>


          <button
            type="button"
  className={`admin-nav-item ${
    location.pathname === "/categories" ? "active" : ""
  }`}
            onClick={() =>
              goTo("/categories")
            }
          >
            <span>☷</span>
            Categories
          </button>


          <button
           type="button"
  className={`admin-nav-item ${
    location.pathname === "/items" ? "active" : ""
  }`}
            onClick={() =>
              goTo("/items")
            }
          >
            <span>▣</span>
            Items
          </button>


          <button
            type="button"
            className="admin-nav-item"
            onClick={viewCatalogue}
          >
            <span>↗</span>
            View Catalogue
          </button>

        </nav>


        <div className="admin-sidebar-bottom">

          <button
            type="button"
            className="admin-nav-item logout-button"
            onClick={handleLogout}
          >
            <span>↪</span>
            Logout
          </button>

        </div>

      </aside>
    </>
  );
}

export default AdminSidebar;