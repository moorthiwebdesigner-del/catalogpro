import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

const API =
  "https://code6technologies.com/catalogproapi";

function Register() {
  const navigate = useNavigate();

  const [plans, setPlans] = useState([]);
  const [plansLoading, setPlansLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState(null);

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

  /*
  |--------------------------------------------------------------------------
  | Load Plans
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    try {
      setPlansLoading(true);
      setError("");

      const response = await fetch(
        `${API}/plans/list.php`
      );

      const result = await response.json();

      console.log("Plans:", result);

      if (!response.ok || !result.success) {
        setError(
          result.message ||
            "Unable to load subscription plans."
        );

        return;
      }

      const planList = result.data || [];

      setPlans(planList);

      /*
       * Automatically select Free Trial
       */

      const freePlan = planList.find(
        (plan) =>
          plan.slug === "free-trial"
      );

      if (freePlan) {
        setSelectedPlan(freePlan);
      }
    } catch (err) {
      console.error("Plans Error:", err);

      setError(
        "Unable to load subscription plans."
      );
    } finally {
      setPlansLoading(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Generate Slug
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
  | Handle Input Change
  |--------------------------------------------------------------------------
  */

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

  /*
  |--------------------------------------------------------------------------
  | Format Price
  |--------------------------------------------------------------------------
  */

  const formatPrice = (price) => {
    return Number(price || 0).toLocaleString(
      "en-IN"
    );
  };

  /*
  |--------------------------------------------------------------------------
  | Handle Submit
  |--------------------------------------------------------------------------
  */

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    /*
    |--------------------------------------------------------------------------
    | Validation
    |--------------------------------------------------------------------------
    */

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
      setError(
        "Password must be at least 6 characters."
      );
      return;
    }

    if (!form.business_name.trim()) {
      setError("Business name is required.");
      return;
    }

    if (!form.slug.trim()) {
      setError("Catalogue URL is required.");
      return;
    }

    if (!selectedPlan) {
      setError(
        "Please select a subscription plan."
      );
      return;
    }

    try {
      setLoading(true);

      /*
      |--------------------------------------------------------------------------
      | STEP 1
      | Register User + Business
      |--------------------------------------------------------------------------
      */

      const registerData = {
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        business_name:
          form.business_name.trim(),
        slug: form.slug.trim(),
        plan_id: Number(selectedPlan.id),
      };

      console.log(
        "Register Data:",
        registerData
      );

      const registerResponse =
        await fetch(
          `${API}/auth/register.php`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify(
              registerData
            ),
          }
        );

      const registerResult =
        await registerResponse.json();

      console.log(
        "Register Result:",
        registerResult
      );

      if (
        !registerResponse.ok ||
        !registerResult.success
      ) {
        setError(
          registerResult.message ||
            "Registration failed."
        );

        return;
      }

      /*
      |--------------------------------------------------------------------------
      | Get Business ID
      |--------------------------------------------------------------------------
      */

      const businessId =
        registerResult.data?.business_id;

      if (!businessId) {
        setError(
          "Business account was created, but business ID was not returned."
        );

        return;
      }

      /*
      |--------------------------------------------------------------------------
      | FREE PLAN
      |--------------------------------------------------------------------------
      */

      if (
        Number(selectedPlan.price) === 0
      ) {
        setMessage(
          "Free trial activated successfully!"
        );

        setTimeout(() => {
          navigate("/login");
        }, 1500);

        return;
      }

      /*
      |--------------------------------------------------------------------------
      | Get Authentication Token
      |--------------------------------------------------------------------------
      |
      | Create-order.php uses authenticate().
      | Therefore register.php should return a token.
      |
      */

      const token =
        registerResult.data?.token;

      if (!token) {
        setError(
          "Registration successful, but authentication token was not returned."
        );

        return;
      }

      /*
      |--------------------------------------------------------------------------
      | Save Token
      |--------------------------------------------------------------------------
      */

      localStorage.setItem(
        "catalogpro_token",
        token
      );

      /*
      |--------------------------------------------------------------------------
      | STEP 2
      | Create Razorpay Order
      |--------------------------------------------------------------------------
      */

      const orderResponse =
        await fetch(
          `${API}/payment/create-order.php`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${token}`,
            },

            body: JSON.stringify({
              business_id:
                businessId,

              plan_id:
                Number(selectedPlan.id),
            }),
          }
        );

      const orderResult =
        await orderResponse.json();

      console.log(
        "Razorpay Order:",
        orderResult
      );

      if (
        !orderResponse.ok ||
        !orderResult.success
      ) {
        setError(
          orderResult.message ||
            "Unable to create payment order."
        );

        return;
      }

      /*
      |--------------------------------------------------------------------------
      | STEP 3
      | Check Razorpay
      |--------------------------------------------------------------------------
      */

      if (!window.Razorpay) {
        setError(
          "Razorpay Checkout failed to load. Please refresh the page."
        );

        return;
      }

      /*
      |--------------------------------------------------------------------------
      | Razorpay Options
      |--------------------------------------------------------------------------
      */

      const options = {
        key:
          orderResult.data.key_id,

        amount:
          orderResult.data.amount,

        currency:
          orderResult.data.currency,

        name:
          "CatalogPro",

        description:
          `${orderResult.data.plan_name} Subscription`,

        order_id:
          orderResult.data.order_id,

        prefill: {
          name:
            form.name,

          email:
            form.email,
        },

        notes: {
          business_id:
            String(businessId),

          plan_id:
            String(selectedPlan.id),
        },

        theme: {
          color: "#111827",
        },

        /*
        |--------------------------------------------------------------------------
        | Payment Success
        |--------------------------------------------------------------------------
        */

        handler:
          async function (
            razorpayResponse
          ) {
            console.log(
              "Razorpay Success:",
              razorpayResponse
            );

            try {
              setLoading(true);

              /*
              |--------------------------------------------------------------------------
              | STEP 4
              | Verify Payment
              |--------------------------------------------------------------------------
              */

              const verifyResponse =
                await fetch(
                  `${API}/payment/verify-payment.php`,
                  {
                    method: "POST",

                    headers: {
                      "Content-Type":
                        "application/json",

                      Authorization:
                        `Bearer ${token}`,
                    },

                    body: JSON.stringify({
                      plan_id:
                        Number(
                          selectedPlan.id
                        ),

                      business_id:
                        Number(
                          businessId
                        ),

                      razorpay_order_id:
                        razorpayResponse
                          .razorpay_order_id,

                      razorpay_payment_id:
                        razorpayResponse
                          .razorpay_payment_id,

                      razorpay_signature:
                        razorpayResponse
                          .razorpay_signature,
                    }),
                  }
                );

              const verifyResult =
                await verifyResponse.json();

              console.log(
                "Payment Verify:",
                verifyResult
              );

              if (
                !verifyResponse.ok ||
                !verifyResult.success
              ) {
                setError(
                  verifyResult.message ||
                    "Payment verification failed."
                );

                return;
              }

              /*
              |--------------------------------------------------------------------------
              | PAYMENT SUCCESS
              |--------------------------------------------------------------------------
              */

              setMessage(
                "Payment successful! Your subscription has been activated."
              );

              /*
              |--------------------------------------------------------------------------
              | Login Page
              |--------------------------------------------------------------------------
              */

              setTimeout(() => {
                navigate("/login");
              }, 2000);
            } catch (error) {
              console.error(
                "Payment Verification Error:",
                error
              );

              setError(
                "Payment was successful, but verification failed. Please contact support."
              );
            } finally {
              setLoading(false);
            }
          },

        /*
        |--------------------------------------------------------------------------
        | Razorpay Modal
        |--------------------------------------------------------------------------
        */

        modal: {
          ondismiss:
            function () {
              setLoading(false);

              setError(
                "Payment cancelled."
              );
            },
        },
      };

      /*
      |--------------------------------------------------------------------------
      | Create Razorpay Instance
      |--------------------------------------------------------------------------
      */

      const razorpay =
        new window.Razorpay(
          options
        );

      /*
      |--------------------------------------------------------------------------
      | Payment Failed
      |--------------------------------------------------------------------------
      */

      razorpay.on(
        "payment.failed",
        function (response) {
          console.error(
            "Payment Failed:",
            response.error
          );

          setLoading(false);

          setError(
            response.error
              ?.description ||
              "Payment failed."
          );
        }
      );

      /*
      |--------------------------------------------------------------------------
      | Open Razorpay
      |--------------------------------------------------------------------------
      */

      razorpay.open();
    } catch (err) {
      console.error(
        "Registration / Payment Error:",
        err
      );

      setError(
        "Unable to connect to server."
      );

      setLoading(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Render
  |--------------------------------------------------------------------------
  */

  return (
    <div className="auth-page">
      <div className="auth-card">

        {/* BRAND */}

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


        {/* HEADER */}

        <div className="auth-header">

          <h1>
            Create Your Account
          </h1>

          <p>
            Create your business account
            and start building your digital
            catalogue.
          </p>

        </div>


        {/* SUCCESS MESSAGE */}

        {message && (
          <div className="profile-success">
            {message}
          </div>
        )}


        {/* ERROR MESSAGE */}

        {error && (
          <div className="profile-error">
            {error}
          </div>
        )}


        {/* FORM */}

        <form
          className="auth-form"
          onSubmit={handleSubmit}
        >

          {/* NAME */}

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


          {/* EMAIL */}

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


          {/* PASSWORD */}

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


          {/* BUSINESS */}

          <div className="auth-field">

            <label>
              Business Name
            </label>

            <input
              type="text"
              name="business_name"
              value={form.business_name}
              onChange={handleChange}
              placeholder="Example: Moorthi Web Developer"
              required
            />

          </div>


          {/* SLUG */}

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
              Your catalogue will be available
              at:
              <br />

              <strong>
                https://digital-catalogpro.vercel.app/
                {form.slug ||
                  "your-business"}
              </strong>
            </small>

          </div>


          {/* PLANS */}

          <div className="register-plans">

            <div className="register-plans-header">

              <h2>
                Choose Your Plan
              </h2>

              <p>
                Start with a 14-day free
                trial or choose a monthly
                subscription.
              </p>

            </div>


            {plansLoading ? (
              <div className="plans-loading">
                Loading plans...
              </div>
            ) : (
              <div className="plans-grid">

                {plans.map((plan) => {

                  const isSelected =
                    selectedPlan?.id ===
                    plan.id;

                  const isFree =
                    Number(plan.price) === 0;

                  return (
                    <div
                      key={plan.id}
                      className={`plan-card ${
                        isSelected
                          ? "plan-card-selected"
                          : ""
                      }`}
                      onClick={() =>
                        setSelectedPlan(
                          plan
                        )
                      }
                    >

                      {/* BADGE */}

                      {isFree && (
                        <div className="plan-badge">
                          FREE TRIAL
                        </div>
                      )}


                      {/* TOP */}

                      <div className="plan-top">

                        <div>

                          <h3>
                            {plan.name}
                          </h3>

                          <p>
                            {plan.description}
                          </p>

                        </div>


                        <div
                          className={`plan-radio ${
                            isSelected
                              ? "active"
                              : ""
                          }`}
                        >
                          {isSelected && (
                            <span>
                              ✓
                            </span>
                          )}
                        </div>

                      </div>


                      {/* PRICE */}

                      <div className="plan-price">

                        <strong>
                          ₹
                          {formatPrice(
                            plan.price
                          )}
                        </strong>

                        <span>
                          /
                          {" "}
                          {isFree
                            ? "14 days"
                            : "month"}
                        </span>

                      </div>


                      {/* DURATION */}

                      <div className="plan-duration">

                        {plan.duration_days}
                        {" "}
                        days

                      </div>


                      {/* SELECT BUTTON */}

                      <button
                        type="button"
                        className={
                          isSelected
                            ? "plan-selected-button"
                            : "plan-select-button"
                        }
                        onClick={(e) => {
                          e.stopPropagation();

                          setSelectedPlan(
                            plan
                          );
                        }}
                      >
                        {isSelected
                          ? "✓ Selected"
                          : "Select Plan"}
                      </button>

                    </div>
                  );
                })}

              </div>
            )}

          </div>


          {/* SELECTED PLAN */}

          {selectedPlan && (
            <div className="selected-plan-summary">

              <span>
                Selected Plan
              </span>

              <strong>
                {selectedPlan.name}
              </strong>

              <span>
                ₹
                {formatPrice(
                  selectedPlan.price
                )}
              </span>

            </div>
          )}


          {/* SUBMIT */}

          <button
            type="submit"
            className="auth-submit-button"
            disabled={
              loading ||
              plansLoading ||
              !selectedPlan
            }
          >
            {loading
              ? "Processing..."
              : Number(
                  selectedPlan?.price || 0
                ) > 0
              ? "Continue to Payment"
              : "Create Free Account"}
          </button>

        </form>


        {/* FOOTER */}

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

      </div>
    </div>
  );
}

export default Register;