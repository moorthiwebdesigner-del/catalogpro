import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import "../App.css";
import AdminSidebar from "../components/AdminSidebar";

const API =
  "https://code6technologies.com/catalogproapi";

function Dashboard() {
  const navigate = useNavigate();

  // =========================================================
  // IMAGE URL
  // =========================================================

  const getImageUrl = (path) => {
    if (
      !path ||
      path === "null" ||
      path === "undefined"
    ) {
      return "";
    }

    if (
      path.startsWith("http://") ||
      path.startsWith("https://")
    ) {
      return path;
    }

    return `${API}/${path}`;
  };

  // =========================================================
  // STATES
  // =========================================================

  const [business, setBusiness] = useState(null);

  const [user, setUser] = useState(null);

  const [subscription, setSubscription] =
    useState(null);

    const [payments, setPayments] = useState([]);

  const [stats, setStats] = useState({
    business_count: 1,
    categories_count: 0,
    items_count: 0,
  });

  const [loading, setLoading] =
    useState(true);

  // =========================================================
  // LOGOUT
  // =========================================================

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

  // =========================================================
  // AUTHENTICATION ERROR
  // =========================================================

  const isAuthenticationError = (
    message
  ) => {
    if (!message) {
      return false;
    }

    const text =
      message.toLowerCase();

    return (
      text.includes("token") ||
      text.includes("authentication") ||
      text.includes("authorization")
    );
  };

  // =========================================================
  // FETCH BUSINESS
  // =========================================================

  const fetchBusiness = async (token) => {
    try {
      const response = await fetch(
        `${API}/business/get.php`,
        {
          method: "GET",

          headers: {
            Authorization:
              `Bearer ${token}`,

            "Content-Type":
              "application/json",
          },
        }
      );

      const result =
        await response.json();

      console.log(
        "Business API:",
        result
      );

      if (
        !response.ok ||
        !result.success
      ) {
        if (
          isAuthenticationError(
            result.message
          )
        ) {
          handleLogout();
        }

        return;
      }

      setBusiness(result.data);

      localStorage.setItem(
        "catalogpro_business",
        JSON.stringify(
          result.data
        )
      );
    } catch (error) {
      console.error(
        "Business fetch error:",
        error
      );
    }
  };

  // =========================================================
  // FETCH DASHBOARD STATS
  // =========================================================

  const fetchDashboardStats =
    async (token) => {
      try {
        setLoading(true);

        const response = await fetch(
          `${API}/dashboard/stats.php`,
          {
            method: "GET",

            headers: {
              Authorization:
                `Bearer ${token}`,

              "Content-Type":
                "application/json",
            },
          }
        );

        const result =
          await response.json();

        console.log(
          "Dashboard Stats:",
          result
        );

        if (
          !response.ok ||
          !result.success
        ) {
          if (
            isAuthenticationError(
              result.message
            )
          ) {
            handleLogout();
          }

          return;
        }

        setStats(
          result.data || {
            business_count: 1,
            categories_count: 0,
            items_count: 0,
          }
        );
      } catch (error) {
        console.error(
          "Dashboard stats error:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

  // =========================================================
  // FETCH SUBSCRIPTION
  // =========================================================

  const fetchSubscription =
    async (token) => {
      try {
        const response = await fetch(
          `${API}/subscription/get.php`,
          {
            method: "GET",

            headers: {
              Authorization:
                `Bearer ${token}`,

              "Content-Type":
                "application/json",
            },
          }
        );

        const result =
          await response.json();

        console.log(
          "Subscription API:",
          result
        );

        if (
          !response.ok ||
          !result.success
        ) {
          if (
            isAuthenticationError(
              result.message
            )
          ) {
            handleLogout();
          }

          return;
        }

        setSubscription(
          result.data
        );
      } catch (error) {
        console.error(
          "Subscription fetch error:",
          error
        );
      }
    };


    // =========================================================
// FETCH PAYMENT HISTORY
// =========================================================

const fetchPaymentHistory = async (token) => {
  try {
    const response = await fetch(
      `${API}/payment-history/list.php`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const result = await response.json();

    console.log(
      "Payment History API:",
      result
    );

    if (
      !response.ok ||
      !result.success
    ) {
      if (
        isAuthenticationError(
          result.message
        )
      ) {
        handleLogout();
      }

      return;
    }

    const paymentData =
      Array.isArray(result.data)
        ? result.data
        : Array.isArray(
            result.data?.payments
          )
        ? result.data.payments
        : [];

    setPayments(paymentData);

  } catch (error) {
    console.error(
      "Payment History Error:",
      error
    );
  }
};
  // =========================================================
  // LOAD DASHBOARD
  // =========================================================

useEffect(() => {
  const token = localStorage.getItem("catalogpro_token");

  if (!token) {
    navigate("/login");
    return;
  }

  // ================================
  // LOAD USER FROM CACHE
  // ================================

  const storedUser = localStorage.getItem("catalogpro_user");

  if (storedUser) {
    try {
      setUser(JSON.parse(storedUser));
    } catch (error) {
      console.error("User JSON error:", error);
    }
  }

  // ================================
  // LOAD BUSINESS FROM CACHE FIRST
  // ================================

  const storedBusiness = localStorage.getItem(
    "catalogpro_business"
  );

  if (storedBusiness) {
    try {
      setBusiness(JSON.parse(storedBusiness));
    } catch (error) {
      console.error("Business JSON error:", error);
      localStorage.removeItem("catalogpro_business");
    }
  }

  // ================================
  // API REQUESTS
  // ================================

  fetchBusiness(token);
  fetchDashboardStats(token);
  fetchSubscription(token);
  fetchPaymentHistory(token);

}, [navigate]);

  // =========================================================
  // LOADING SCREEN
  // =========================================================

  if (!business) {
    return (
      <div className="admin-layout">
        <AdminSidebar />

        <main className="admin-main">
          <div className="dashboard-loading">
            <p>
              Loading Dashboard...
            </p>
          </div>
        </main>
      </div>
    );
  }

  // =========================================================
  // BUSINESS LOGO
  // =========================================================

  const businessLogo =
    business.logo?.trim();

  // =========================================================
  // CATALOGUE URL
  // =========================================================

  const catalogueUrl =
    `${window.location.origin}/${business.slug}`;



    // =========================================================
// FORMAT AMOUNT
// =========================================================

const formatAmount = (amount) => {
  return Number(
    amount || 0
  ).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

// =========================================================
// FORMAT DATE
// =========================================================

const formatDate = (date) => {
  if (!date) {
    return "-";
  }

  const parsedDate =
    new Date(date);

  if (
    Number.isNaN(
      parsedDate.getTime()
    )
  ) {
    return date;
  }

  return parsedDate.toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
};

  // =========================================================
  // SUBSCRIPTION REMAINING DAYS
  // =========================================================

  const getRemainingDays = () => {
    if (
      !subscription ||
      !subscription.end_date
    ) {
      return 0;
    }

    const today =
      new Date();

    const endDate =
      new Date(
        subscription.end_date
      );

    const difference =
      endDate.getTime() -
      today.getTime();

    const remainingDays =
      Math.ceil(
        difference /
          (1000 * 60 * 60 * 24)
      );

    return Math.max(
      0,
      remainingDays
    );
  };

  const remainingDays =
    getRemainingDays();

  // =========================================================
  // SUBSCRIPTION STATUS
  // =========================================================

  const subscriptionStatus =
    subscription?.status
      ? subscription.status.toLowerCase()
      : "unknown";

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="admin-layout">

      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <AdminSidebar />

      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="admin-main">

        {/* ===================================================
            TOPBAR
        =================================================== */}

        <header className="admin-topbar">

          <div>
            <h1>
              Dashboard
            </h1>

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

        {/* ===================================================
            BUSINESS CARD
        =================================================== */}

        <section className="business-dashboard-card">

          <div className="business-dashboard-info">

            <div className="business-dashboard-logo">

              {businessLogo ? (
                <img
                  src={getImageUrl(
                    business.logo
                  )}
                  alt={
                    business.business_name
                  }
                  className="business-logo"
                />
              ) : (
                <div className="business-logo-placeholder">
                  {business.business_name
                    ?.charAt(0)
                    .toUpperCase()}
                </div>
              )}

            </div>

            <div>

              <span className="dashboard-label">
                YOUR BUSINESS
              </span>

              <h2>
                {business.business_name}
              </h2>

              <p>
                /{business.slug}
              </p>

            </div>

          </div>

          <button
            type="button"
            className="dashboard-view-button"
            onClick={() =>
              window.open(
                catalogueUrl,
                "_blank",
                "noopener,noreferrer"
              )
            }
          >
            View Catalogue ↗
          </button>

        </section>

        {/* ===================================================
            LIVE STATS
        =================================================== */}

        <section className="dashboard-stats">

          {/* BUSINESS */}

          <div className="dashboard-stat-card">

            <div className="stat-icon">
              ◈
            </div>

            <div>
              <span>
                Business
              </span>

              <strong>
                {stats.business_count}
              </strong>
            </div>

          </div>

          {/* CATEGORIES */}

          <div className="dashboard-stat-card">

            <div className="stat-icon">
              ☷
            </div>

            <div>
              <span>
                Categories
              </span>

              <strong>
                {loading
                  ? "..."
                  : stats.categories_count}
              </strong>
            </div>

          </div>

          {/* ITEMS */}

          <div className="dashboard-stat-card">

            <div className="stat-icon">
              ▣
            </div>

            <div>
              <span>
                Items
              </span>

              <strong>
                {loading
                  ? "..."
                  : stats.items_count}
              </strong>
            </div>

          </div>

          {/* CATALOGUE */}

          <div className="dashboard-stat-card">

            <div className="stat-icon">
              ↗
            </div>

            <div>
              <span>
                Catalogue
              </span>

              <strong>
                Live
              </strong>
            </div>

          </div>

        </section>

        {/* ===================================================
            SUBSCRIPTION CARD
        =================================================== */}

        <section className="dashboard-subscription-card">

          <div className="subscription-info">

            <span className="dashboard-label">
              CURRENT PLAN
            </span>

            <h2>
              {subscription?.plan_name ||
                "No Plan"}
            </h2>

            <p>
              ₹
              {Number(
                subscription?.amount || 0
              ).toLocaleString("en-IN")}
              {" / "}
              {subscription?.plan_name
                ?.toLowerCase()
                .includes("free")
                ? "14 days"
                : "month"}
            </p>

          </div>

          <div className="subscription-status">

            <span
              className={`subscription-badge ${subscriptionStatus}`}
            >
              {subscription?.status
                ? subscription.status.toUpperCase()
                : "UNKNOWN"}
            </span>

            <strong>
              {remainingDays}{" "}
              days remaining
            </strong>

            <small>
              Expires:{" "}
              {subscription?.end_date
                ? new Date(
                    subscription.end_date
                  ).toLocaleDateString(
                    "en-IN"
                  )
                : "-"}
            </small>
   </div>
            <button
              type="button"
              className="subscription-upgrade-button"
              onClick={() =>
                navigate("/plans")
              }
            >
              Upgrade Plan
            </button>

       

        </section>

        {/* ===================================================
            CONTENT GRID
        =================================================== */}

        <div className="dashboard-grid">

          {/* =================================================
              BUSINESS INFORMATION
          ================================================= */}

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
                type="button"
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
                  {business.business_name}
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

          {/* =================================================
              QR CODE
          ================================================= */}

          <div className="dashboard-panel">

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
                  value={catalogueUrl}
                  size={160}
                  level="H"
                  includeMargin={true}
                />

              </div>

              <div className="dashboard-qr-info">

                <strong>
                  {business.business_name}
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
                      alert(
                        "QR Code not found."
                      );
                      return;
                    }

                    const link =
                      document.createElement(
                        "a"
                      );

                    link.download =
                      `${business.slug}-qr-code.png`;

                    link.href =
                      canvas.toDataURL(
                        "image/png"
                      );

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
                      catalogueUrl,
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

          {/* =================================================
              QUICK ACTIONS
          ================================================= */}

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
                type="button"
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
                type="button"
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
                type="button"
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


          
        <div className="dashboard-panel dashboard-payment-panel">

  <div className="panel-header">

    <div>
      <h3>
        Payment History
      </h3>

      <p>
        View your subscription payments
      </p>
    </div>

    <button
      type="button"
      onClick={() =>
        navigate("/payment-history")
      }
    >
      View All
    </button>

  </div>


  <div className="payment-history-table-wrapper">

    <table className="payment-history-table">

      <thead>

        <tr>

          <th>
            #
          </th>

          <th>
            Plan
          </th>

         
          

          <th>
            Subscription End
          </th>

          <th>
            Status
          </th>

        </tr>

      </thead>


      <tbody>

        {payments.length === 0 ? (

          <tr>

            <td
              colSpan="6"
              style={{
                textAlign: "center",
                padding: "30px",
              }}
            >
              No payment history found.
            </td>

          </tr>

        ) : (

          payments.map(
            (
              payment,
              index
            ) => (

              <tr
                key={
                  payment.id ||
                  index
                }
              >

                {/* NUMBER */}

                <td>
                  {index + 1}
                </td>


                {/* PLAN */}

                <td>

                  <div className="payment-plan-cell">

                    

                    <div>

                      <strong>
                        {
                          payment.plan_name ||
                          "-"
                        }
                      </strong>

                    </div>

                  </div>

                </td>


                {/* SUBSCRIPTION END */}

                <td>

                  {formatDate(
                    payment.end_date
                  )}

                </td>


                {/* STATUS */}

                <td>

                  <span
                    className={`payment-status ${
                      payment.status
                        ? payment.status.toLowerCase()
                        : "paid"
                    }`}
                  >

                    {
                      payment.status ||
                      "Paid"
                    }

                  </span>

                </td>

              </tr>

            )
          )

        )}

      </tbody>

    </table>

  </div>

</div>

        </div>

      </main>

    </div>
  );
}

export default Dashboard;