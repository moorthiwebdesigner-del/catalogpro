import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
import AdminSidebar from "../components/AdminSidebar";

const API =
  "https://code6technologies.com/catalogproapi";

function PaymentHistory() {

  const navigate = useNavigate();

  const [payments, setPayments] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  /*
  |--------------------------------------------------------------------------
  | TOKEN
  |--------------------------------------------------------------------------
  */

  const getToken = () => {

    return localStorage.getItem(
      "catalogpro_token"
    );

  };


  /*
  |--------------------------------------------------------------------------
  | LOAD PAYMENT HISTORY
  |--------------------------------------------------------------------------
  */

  useEffect(() => {

    loadPaymentHistory();

  }, []);


  const loadPaymentHistory =
    async () => {

      const token =
        getToken();


      /*
      |--------------------------------------------------------------------------
      | LOGIN CHECK
      |--------------------------------------------------------------------------
      */

      if (!token) {

        navigate("/login");

        return;

      }


      try {

        setLoading(true);

        setError("");


        /*
        |--------------------------------------------------------------------------
        | API
        |--------------------------------------------------------------------------
        */

        const response =
          await fetch(
            `${API}/payment-history/list.php`,
            {
              method: "GET",

              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );


        const result =
          await response.json();


        console.log(
          "Payment History:",
          result
        );


        /*
        |--------------------------------------------------------------------------
        | ERROR
        |--------------------------------------------------------------------------
        */

        if (
          !response.ok ||
          !result.success
        ) {

          setError(
            result.message ||
              "Failed to load payment history"
          );

          return;

        }


        /*
        |--------------------------------------------------------------------------
        | PAYMENT DATA
        |--------------------------------------------------------------------------
        */

        const paymentData =
          Array.isArray(
            result.data
          )
            ? result.data
            : Array.isArray(
                result.data?.payments
              )
            ? result.data.payments
            : [];


        setPayments(
          paymentData
        );

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
  | FORMAT MONEY
  |--------------------------------------------------------------------------
  */

  const formatAmount =
    (amount) => {

      return Number(
        amount || 0
      ).toLocaleString(
        "en-IN",
        {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }
      );

    };


  /*
  |--------------------------------------------------------------------------
  | FORMAT DATE
  |--------------------------------------------------------------------------
  */

  const formatDate =
    (date) => {

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


  /*
  |--------------------------------------------------------------------------
  | TOTAL AMOUNT
  |--------------------------------------------------------------------------
  */

  const totalAmount =
    payments.reduce(
      (total, payment) => {

        return (
          total +
          Number(
            payment.amount || 0
          )
        );

      },
      0
    );


  /*
  |--------------------------------------------------------------------------
  | LOADING
  |--------------------------------------------------------------------------
  */

  if (loading) {

    return (

      <div className="dashboard-loading">

        Loading Payment History...

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
              Payment History
            </h1>

            <p>
              View your subscription
              payment history
            </p>

          </div>

        </header>


        {/* ERROR */}

        {error && (

          <div className="profile-error">

            {error}

          </div>

        )}


        {/* SUMMARY */}

        <div className="payment-history-summary">


          {/* TOTAL PAYMENTS */}

          <div className="payment-summary-card">

            <span>
              Total Payments
            </span>

            <strong>
              {payments.length}
            </strong>

          </div>


          {/* TOTAL AMOUNT */}

          <div className="payment-summary-card">

            <span>
              Total Paid
            </span>

            <strong>
              ₹{" "}
              {formatAmount(
                totalAmount
              )}
            </strong>

          </div>


          {/* SUBSCRIPTIONS */}

          <div className="payment-summary-card">

            <span>
              Subscriptions
            </span>

            <strong>
              {payments.length}
            </strong>

          </div>

        </div>


        {/* HEADER */}

        <div className="payment-history-list-header">

          <div>

            <h2>
              Subscription History
            </h2>

            <span>

              {payments.length}{" "}

              {payments.length === 1
                ? "payment"
                : "payments"}

            </span>

          </div>


          {/* REFRESH */}

          <button
            type="button"
            className="payment-history-refresh"
            onClick={
              loadPaymentHistory
            }
          >
            ↻ Refresh
          </button>

        </div>


        {/* EMPTY */}

        {payments.length === 0 ? (

          <div className="payment-history-empty">

            <div className="payment-history-empty-icon">
              ₹
            </div>

            <h3>
              No Payment History
            </h3>

            <p>
              Your subscription
              payment history will
              appear here.
            </p>

          </div>

        ) : (

          <>


            {/* DESKTOP TABLE */}

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
                      Amount
                    </th>

                    <th>
                      Paid Date
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

                  {payments.map(
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

                            <div className="payment-plan-icon">
                              
                            </div>

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


                        {/* AMOUNT */}

                        <td>

                          <strong className="payment-amount">

                            ₹{" "}

                            {formatAmount(
                              payment.amount
                            )}

                          </strong>

                        </td>


                        {/* PAID DATE */}

                        <td>

                          {formatDate(
                            payment.start_date ||
                            payment.created_at
                          )}

                        </td>


                        {/* END DATE */}

                        <td>

                          {formatDate(
                            payment.end_date
                          )}

                        </td>


                        {/* STATUS */}

                        <td>

                          <span className="payment-status">

                            {
                              payment.status ||
                              "Paid"
                            }

                          </span>

                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>


            {/* MOBILE */}

            <div className="payment-history-mobile-list">

              {payments.map(
                (
                  payment,
                  index
                ) => (

                  <div
                    className="payment-history-mobile-card"
                    key={
                      payment.id ||
                      index
                    }
                  >


                    {/* TOP */}

                    <div className="payment-mobile-top">

                      <div className="payment-plan-cell">

                        <div className="payment-plan-icon">
                          P
                        </div>

                        <div>

                          <strong>
                            {
                              payment.plan_name ||
                              "-"
                            }
                          </strong>

                          <span>
                            {formatDate(
                              payment.start_date ||
                              payment.created_at
                            )}
                          </span>

                        </div>

                      </div>


                      <span className="payment-status">

                        {
                          payment.status ||
                          "Paid"
                        }

                      </span>

                    </div>


                    {/* AMOUNT */}

                    <div className="payment-mobile-amount">

                      <small>
                        Amount Paid
                      </small>

                      <strong>

                        ₹{" "}

                        {formatAmount(
                          payment.amount
                        )}

                      </strong>

                    </div>


                    {/* DETAILS */}

                    <div className="payment-mobile-details">


                      <div>

                        <small>
                          Paid Date
                        </small>

                        <strong>

                          {formatDate(
                            payment.start_date ||
                            payment.created_at
                          )}

                        </strong>

                      </div>


                      <div>

                        <small>
                          Valid Until
                        </small>

                        <strong>

                          {formatDate(
                            payment.end_date
                          )}

                        </strong>

                      </div>


                    </div>

                  </div>

                )
              )}

            </div>

          </>

        )}

      </main>

    </div>

  );

}

export default PaymentHistory;