import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import "../App.css";
import AdminSidebar from "../components/AdminSidebar";

const API = "http://localhost/api";

function Dashboard() {
  const navigate = useNavigate();

    const getImageUrl = (path) => {
  if (!path) return "";

  if (
    path.startsWith("http://") ||
    path.startsWith("https://")
  ) {
    return path;
  }

  return `${API}/${path.replace(/^\/+/, "")}`;
};


  const [business, setBusiness] = useState(null);
  const [user, setUser] = useState(null);

  const [stats, setStats] = useState({
    business_count: 1,
    categories_count: 0,
    items_count: 0,
  });

  

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("catalogpro_token");

    if (!token) {
      navigate("/login");
      return;
    }

    const storedBusiness =
      localStorage.getItem("catalogpro_business");

    const storedUser =
      localStorage.getItem("catalogpro_user");

    if (storedBusiness) {
      setBusiness(JSON.parse(storedBusiness));
    }

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    fetchDashboardStats(token);
  }, [navigate]);


  const fetchDashboardStats = async (token) => {
    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost/api/dashboard/stats.php",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const result = await response.json();

      console.log("Dashboard Stats:", result);

      if (!result.success) {

        if (
          result.message?.toLowerCase().includes("token") ||
          result.message?.toLowerCase().includes("authentication")
        ) {
          handleLogout();
          return;
        }

        return;
      }

      setStats(result.data);

    } catch (error) {

      console.error(
        "Dashboard stats error:",
        error
      );

    } finally {
      setLoading(false);
    }
  };


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


  if (!business) {
    return (
      <div className="dashboard-loading">
        Loading Dashboard...
      </div>
    );
  }


  return (
    <div className="admin-layout">

      {/* SIDEBAR */}

<AdminSidebar />

      {/* MAIN */}

      <main className="admin-main">

        {/* TOPBAR */}

        <header className="admin-topbar">

          <div>

            <h1>Dashboard</h1>

            <p>
              Welcome back,{" "}
              {user?.name || "Admin"}
            </p>

          </div>


          <div className="admin-profile">

            <div className="admin-avatar">

              {(user?.name || "A")
                .charAt(0)
                .toUpperCase()}

            </div>

            <div>

              <strong>
                {user?.name || "Admin"}
              </strong>

              <small>
                {user?.email || ""}
              </small>

            </div>

          </div>

        </header>


        {/* BUSINESS */}

        <section className="business-dashboard-card">

          <div className="business-dashboard-info">

            <div className="business-dashboard-logo">

              {business.logo ? (

                <img
                  src={getImageUrl(business.logo)}
                  alt={business.name}
                />

              ) : (

                business.name
                  ?.charAt(0)
                  .toUpperCase()

              )}

            </div>


            <div>

              <span className="dashboard-label">
                YOUR BUSINESS
              </span>

              <h2>
                {business.name}
              </h2>

              <p>
                /{business.slug}
              </p>

            </div>

          </div>


          <button
            className="dashboard-view-button"
            onClick={() =>
    window.open(
      `/${business.slug}`,
      "_blank",
      "noopener,noreferrer"
    )
  }
          >
            View Catalogue ↗
          </button>

        </section>


        {/* LIVE STATS */}

        <section className="dashboard-stats">

          <div className="dashboard-stat-card">

            <div className="stat-icon">
              ◈
            </div>

            <div>

              <span>Business</span>

              <strong>
                {stats.business_count}
              </strong>

            </div>

          </div>


          <div className="dashboard-stat-card">

            <div className="stat-icon">
              ☷
            </div>

            <div>

              <span>Categories</span>

              <strong>
                {loading
                  ? "..."
                  : stats.categories_count}
              </strong>

            </div>

          </div>


          <div className="dashboard-stat-card">

            <div className="stat-icon">
              ▣
            </div>

            <div>

              <span>Items</span>

              <strong>
                {loading
                  ? "..."
                  : stats.items_count}
              </strong>

            </div>

          </div>


          <div className="dashboard-stat-card">

            <div className="stat-icon">
              ↗
            </div>

            <div>

              <span>Catalogue</span>

              <strong>Live</strong>

            </div>

          </div>

        </section>


        {/* CONTENT */}

   <section className="dashboard-grid">

  {/* BUSINESS INFO */}

  <div className="dashboard-panel">

    <div className="panel-header">

      <div>

        <h3>
          Business Information
        </h3>

        <p>
          Your public business details
        </p>

      </div>

      <button
        onClick={() =>
          navigate("/business")
        }
      >
        Edit
      </button>

    </div>


    <div className="business-details">

      <div className="detail-row">

        <span>
          Business Name
        </span>

        <strong>
          {business.name}
        </strong>

      </div>


      <div className="detail-row">

        <span>
          Phone
        </span>

        <strong>
          {business.phone ||
            "Not added"}
        </strong>

      </div>


      <div className="detail-row">

        <span>
          Email
        </span>

        <strong>
          {business.email ||
            "Not added"}
        </strong>

      </div>


      <div className="detail-row">

        <span>
          WhatsApp
        </span>

        <strong>
          {business.whatsapp ||
            "Not added"}
        </strong>

      </div>

    </div>

  </div>


  {/* QR CODE */}

  <div className="dashboard-panel dashboard-qr-panel">

    <div className="panel-header">

      <div>

        <h3>
          Catalogue QR Code
        </h3>

        <p>
          Scan to view your catalogue
        </p>

      </div>

    </div>


    <div className="dashboard-qr-content">

      <div className="dashboard-qr-box">

        <QRCodeCanvas
          value={
            `${window.location.origin}/${business.slug}`
          }
          size={160}
          level="H"
          includeMargin={true}
        />

      </div>


      <div className="dashboard-qr-info">

        <strong>
          {business.name}
        </strong>

        <span>
          /{business.slug}
        </span>


        <button
          type="button"
          className="dashboard-qr-download"
          onClick={() => {

            const canvas =
              document.querySelector(
                ".dashboard-qr-box canvas"
              );

            if (!canvas) {
              alert("QR Code not found.");
              return;
            }

            const link =
              document.createElement("a");

            link.download =
              `${business.slug}-qr-code.png`;

            link.href =
              canvas.toDataURL("image/png");

            link.click();

          }}
        >
          Download QR
        </button>


        <button
          type="button"
          className="dashboard-qr-view"
          onClick={() =>
            window.open(
              `/${business.slug}`,
              "_blank",
              "noopener,noreferrer"
            )
          }
        >
          View Catalogue ↗
        </button>

      </div>

    </div>

  </div>


  {/* QUICK ACTIONS */}

  <div className="dashboard-panel">

    <div className="panel-header">

      <div>

        <h3>
          Quick Actions
        </h3>

        <p>
          Manage your catalogue
        </p>

      </div>

    </div>


    <div className="quick-actions">

      <button
        onClick={() =>
          navigate("/business")
        }
      >

        <span>
          ◈
        </span>

        <div>

          <strong>
            Business Profile
          </strong>

          <small>
            Update business details
          </small>

        </div>

      </button>


      <button
        onClick={() =>
          navigate("/categories")
        }
      >

        <span>
          ☷
        </span>

        <div>

          <strong>
            Manage Categories
          </strong>

          <small>
            Add or edit categories
          </small>

        </div>

      </button>


      <button
        onClick={() =>
          navigate("/items")
        }
      >

        <span>
          ▣
        </span>

        <div>

          <strong>
            Manage Items
          </strong>

          <small>
            Add products and services
          </small>

        </div>

      </button>

    </div>

  </div>

</section>

      </main>

    </div>
  );
}

export default Dashboard;