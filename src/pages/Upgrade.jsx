import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../App.css";

const API =
  "https://code6technologies.com/catalogproapi";

function Upgrade() {
  const navigate = useNavigate();
  const location = useLocation();

  const plan = location.state?.plan;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem(
    "catalogpro_token"
  );

  /*
   * ---------------------------------------------------------
   * Load Razorpay Script
   * ---------------------------------------------------------
   */

  useEffect(() => {
    if (window.Razorpay) {
      return;
    }

    const script = document.createElement("script");

    script.src =
      "https://checkout.razorpay.com/v1/checkout.js";

    script.async = true;

    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  /*
   * ---------------------------------------------------------
   * Check Plan
   * ---------------------------------------------------------
   */

  useEffect(() => {
    if (!plan) {
      navigate("/plans");
    }
  }, [plan, navigate]);

  /*
   * ---------------------------------------------------------
   * Logout
   * ---------------------------------------------------------
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
   * ---------------------------------------------------------
   * Authentication Error
   * ---------------------------------------------------------
   */

  const isAuthenticationError = (message) => {
    if (!message) {
      return false;
    }

    const text = message.toLowerCase();

    return (
      text.includes("token") ||
      text.includes("authentication") ||
      text.includes("authorization")
    );
  };

  /*
   * ---------------------------------------------------------
   * Create Razorpay Order
   * ---------------------------------------------------------
   */

  const createOrder = async () => {
    try {
      setLoading(true);
      setError("");

      if (!token) {
        handleLogout();
        return;
      }

      if (!plan?.id) {
        setError(
          "Invalid subscription plan."
        );

        setLoading(false);
        return;
      }

      console.log(
        "Upgrade Plan:",
        plan
      );

      const response = await fetch(
        `${API}/payment/create-order.php`,
        {
          method: "POST",

          headers: {
            Authorization:
              `Bearer ${token}`,

            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            plan_id: Number(plan.id),
          }),
        }
      );

      const result =
        await response.json();

      console.log(
        "Create Order Result:",
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
          return;
        }

        setError(
          result.message ||
            "Unable to create payment order."
        );

        setLoading(false);
        return;
      }

      const order = result.data;

      /*
       * -------------------------------------------------------
       * Check Razorpay
       * -------------------------------------------------------
       */

      if (!window.Razorpay) {
        setError(
          "Razorpay is not loaded. Please refresh the page and try again."
        );

        setLoading(false);
        return;
      }

      /*
       * -------------------------------------------------------
       * Get User
       * -------------------------------------------------------
       */

      let storedUser = {};

      try {
        storedUser = JSON.parse(
          localStorage.getItem(
            "catalogpro_user"
          ) || "{}"
        );
      } catch (error) {
        console.error(
          "User JSON error:",
          error
        );
      }

      /*
       * -------------------------------------------------------
       * Razorpay Options
       * -------------------------------------------------------
       */

      const options = {
        key: order.key_id,

        amount: order.amount,

        currency:
          order.currency || "INR",

        name: "CatalogPro",

        description:
          `${order.plan_name} Subscription`,

        order_id:
          order.order_id,

        handler: async function (
          paymentResponse
        ) {
          console.log(
            "Razorpay Success:",
            paymentResponse
          );

          await verifyPayment(
            paymentResponse,
            order
          );
        },

        prefill: {
          name:
            storedUser.name || "",

          email:
            storedUser.email || "",
        },

        theme: {
          color: "#111827",
        },

        modal: {
          ondismiss: function () {
            setLoading(false);

            console.log(
              "Razorpay popup closed"
            );
          },
        },
      };

      /*
       * -------------------------------------------------------
       * Open Razorpay
       * -------------------------------------------------------
       */

      const razorpay =
        new window.Razorpay(
          options
        );

      razorpay.on(
        "payment.failed",
        function (response) {
          console.error(
            "Razorpay Payment Failed:",
            response
          );

          setLoading(false);

          setError(
            response.error?.description ||
              "Payment failed. Please try again."
          );
        }
      );

      razorpay.open();

    } catch (error) {
      console.error(
        "Create order error:",
        error
      );

      setError(
        "Unable to start payment. Please try again."
      );

      setLoading(false);
    }
  };

  /*
   * ---------------------------------------------------------
   * Verify Payment
   * ---------------------------------------------------------
   */

  const verifyPayment = async (
    paymentResponse,
    order
  ) => {
    try {
      setLoading(true);

      console.log(
        "Verifying Payment:",
        paymentResponse
      );

      const response = await fetch(
        `${API}/payment/verify-payment.php`,
        {
          method: "POST",

          headers: {
            Authorization:
              `Bearer ${token}`,

            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            razorpay_payment_id:
              paymentResponse.razorpay_payment_id,

            razorpay_order_id:
              paymentResponse.razorpay_order_id,

            razorpay_signature:
              paymentResponse.razorpay_signature,

            subscription_id:
              order.subscription_id,

            plan_id:
              order.plan_id,
          }),
        }
      );

      const result =
        await response.json();

      console.log(
        "Payment Verify:",
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
          return;
        }

        setError(
          result.message ||
            "Payment verification failed."
        );

        setLoading(false);
        return;
      }

      /*
       * -------------------------------------------------------
       * Success
       * -------------------------------------------------------
       */

      console.log(
        "Upgrade successful:",
        result
      );

      alert(
        "Payment successful! Your subscription has been upgraded."
      );

      navigate(
        "/dashboard",
        {
          replace: true,
        }
      );

    } catch (error) {
      console.error(
        "Payment verification error:",
        error
      );

      setError(
        "Payment completed, but verification failed. Please contact support."
      );

    } finally {
      setLoading(false);
    }
  };

  /*
   * ---------------------------------------------------------
   * No Plan
   * ---------------------------------------------------------
   */

  if (!plan) {
    return null;
  }

  /*
   * ---------------------------------------------------------
   * Render
   * ---------------------------------------------------------
   */

  return (
    <div className="upgrade-page">

      <div className="upgrade-card">

        <button
          type="button"
          className="upgrade-back-button"
          onClick={() =>
            navigate("/plans")
          }
          disabled={loading}
        >
          ← Back to Plans
        </button>

        <div className="upgrade-header">

          <span className="dashboard-label">
            UPGRADE PLAN
          </span>

          <h1>
            Upgrade your subscription
          </h1>

          <p>
            Complete your payment to activate
            your new CatalogPro plan.
          </p>

        </div>

        {error && (
          <div className="plans-error">
            {error}
          </div>
        )}

        <div className="upgrade-plan-summary">

          <div>

            <span>
              Selected Plan
            </span>

            <h2>
              {plan.name}
            </h2>

            {plan.description && (
              <p>
                {plan.description}
              </p>
            )}

          </div>

          <div className="upgrade-price">

            <strong>
              ₹
              {Number(
                plan.price || 0
              ).toLocaleString("en-IN")}
            </strong>

            <span>
              / month
            </span>

          </div>

        </div>

        <div className="upgrade-details">

          <div>

            <span>
              Duration
            </span>

            <strong>
              {plan.duration_days} days
            </strong>

          </div>

          <div>

            <span>
              Payment
            </span>

            <strong>
              Razorpay
            </strong>

          </div>

          <div>

            <span>
              Currency
            </span>

            <strong>
              INR
            </strong>

          </div>

        </div>

        <button
          type="button"
          className="upgrade-payment-button"
          onClick={createOrder}
          disabled={loading}
        >
          {loading
            ? "Processing..."
            : `Pay ₹${Number(
                plan.price || 0
              ).toLocaleString("en-IN")}`}
        </button>

        <p className="upgrade-secure-text">
          🔒 Secure payment powered by Razorpay
        </p>

      </div>

    </div>
  );
}

export default Upgrade;