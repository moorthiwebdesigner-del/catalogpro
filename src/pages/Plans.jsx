import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

const API =
  "https://code6technologies.com/catalogproapi";

function Plans() {
  const navigate = useNavigate();

  const [plans, setPlans] = useState([]);
  const [subscription, setSubscription] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /*
  |--------------------------------------------------------------------------
  | Get Token
  |--------------------------------------------------------------------------
  */

  const token = localStorage.getItem(
    "catalogpro_token"
  );

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
  | Check Authentication Error
  |--------------------------------------------------------------------------
  */

  const isAuthenticationError = (message) => {
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

  /*
  |--------------------------------------------------------------------------
  | Load Plans
  |--------------------------------------------------------------------------
  */

  const loadPlans = async () => {
    try {
      const response = await fetch(
        `${API}/plans/list.php`
      );

      const result =
        await response.json();

      console.log(
        "Plans:",
        result
      );

      if (
        !response.ok ||
        !result.success
      ) {
        setError(
          result.message ||
            "Unable to load plans."
        );

        return;
      }

      setPlans(
        result.data || []
      );

    } catch (error) {
      console.error(
        "Plans error:",
        error
      );

      setError(
        "Unable to load subscription plans."
      );
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Load Current Subscription
  |--------------------------------------------------------------------------
  */

  const loadSubscription = async () => {
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
        "Subscription:",
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

        setError(
          result.message ||
            "Unable to load subscription."
        );

        return;
      }

      setSubscription(
        result.data
      );

    } catch (error) {
      console.error(
        "Subscription error:",
        error
      );

      setError(
        "Unable to load current subscription."
      );
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Load Page
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const loadData = async () => {
      setLoading(true);
      setError("");

      await Promise.all([
        loadPlans(),
        loadSubscription(),
      ]);

      setLoading(false);
    };

    loadData();

  }, [navigate, token]);

  /*
  |--------------------------------------------------------------------------
  | Format Price
  |--------------------------------------------------------------------------
  */

  const formatPrice = (price) => {
    return Number(
      price || 0
    ).toLocaleString("en-IN");
  };

  /*
  |--------------------------------------------------------------------------
  | Current Plan Check
  |--------------------------------------------------------------------------
  */

  const isCurrentPlan = (plan) => {
    if (!subscription) {
      return false;
    }

    return (
      Number(subscription.plan_id) ===
      Number(plan.id)
    );
  };

  /*
  |--------------------------------------------------------------------------
  | Handle Plan Select
  |--------------------------------------------------------------------------
  */

  const handlePlanSelect = (plan) => {

    if (isCurrentPlan(plan)) {
      return;
    }

    /*
     * Free plan
     */

    if (
      Number(plan.price) === 0
    ) {
      alert(
        "You are already using a paid subscription. Free plan switching will be available later."
      );

      return;
    }

    /*
     * Payment page
     */

    navigate("/upgrade", {
      state: {
        plan,
      },
    });
  };

  /*
  |--------------------------------------------------------------------------
  | Loading
  |--------------------------------------------------------------------------
  */

  if (loading) {
    return (
      <div className="plans-page">

        <div className="plans-loading-screen">
          Loading subscription plans...
        </div>

      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Render
  |--------------------------------------------------------------------------
  */

  return (
    <div className="plans-page">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="plans-header">

        <div>

          <button
            type="button"
            className="plans-back-button"
            onClick={() =>
              navigate("/dashboard")
            }
          >
            ← Dashboard
          </button>

          <h1>
            Subscription Plans
          </h1>

          <p>
            Choose the right plan for your
            digital catalogue.
          </p>

        </div>

      </header>


      {/* =====================================================
          ERROR
      ===================================================== */}

      {error && (
        <div className="plans-error">
          {error}
        </div>
      )}


      {/* =====================================================
          CURRENT SUBSCRIPTION
      ===================================================== */}

      {subscription && (
        <section className="current-subscription">

          <div>

            <span>
              CURRENT PLAN
            </span>

            <strong>
              {subscription.plan_name}
            </strong>

          </div>


          <div className="current-subscription-status">

            <span
              className={`subscription-badge ${
                subscription.status
              }`}
            >
              {subscription.status.toUpperCase()}
            </span>

            <small>
              {subscription.days_remaining}
              {" "}
              days remaining
            </small>

          </div>

        </section>
      )}


      {/* =====================================================
          PLANS
      ===================================================== */}

      <section className="plans-section">

        <div className="plans-grid">

          {plans.map((plan) => {

            const current =
              isCurrentPlan(plan);

            const free =
              Number(plan.price) === 0;

            return (

              <div
                key={plan.id}
                className={`subscription-plan-card ${
                  current
                    ? "subscription-plan-current"
                    : ""
                }`}
              >

                {/* BADGE */}

                {current && (
                  <div className="current-plan-badge">
                    CURRENT PLAN
                  </div>
                )}

                {!current && free && (
                  <div className="free-plan-badge">
                    FREE TRIAL
                  </div>
                )}


                {/* PLAN NAME */}

                <div className="subscription-plan-top">

                  <h2>
                    {plan.name}
                  </h2>

                  <p>
                    {plan.description}
                  </p>

                </div>


                {/* PRICE */}

                <div className="subscription-plan-price">

                  <strong>
                    ₹
                    {formatPrice(
                      plan.price
                    )}
                  </strong>

                  <span>
                    /
                    {" "}
                    {free
                      ? "14 days"
                      : "month"}
                  </span>

                </div>


                {/* DURATION */}

                <div className="subscription-plan-duration">

                  {plan.duration_days}
                  {" "}
                  days access

                </div>


                {/* BUTTON */}

                <button
                  type="button"
                  className={
                    current
                      ? "current-plan-button"
                      : "upgrade-plan-button"
                  }
                  disabled={current}
                  onClick={() =>
                    handlePlanSelect(
                      plan
                    )
                  }
                >

                  {current
                    ? "✓ Current Plan"
                    : free
                    ? "Select Free Trial"
                    : "Upgrade Plan"}

                </button>

              </div>

            );
          })}

        </div>

      </section>


      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="plans-footer">

        <button
          type="button"
          onClick={() =>
            navigate("/dashboard")
          }
        >
          ← Back to Dashboard
        </button>

      </footer>

    </div>
  );
}

export default Plans;