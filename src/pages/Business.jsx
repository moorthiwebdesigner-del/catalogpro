import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import AdminSidebar from "../components/AdminSidebar";
import "../App.css";

const API = "http://localhost/api";

function Business() {
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

  const [form, setForm] = useState({
    business_name: "",
    slug: "",
    description: "",
    phone: "",
    whatsapp: "",
    email: "",
    address: "",
    city: "",
    state: "",
    country: "India",
  });

  const [logo, setLogo] = useState(null);
  const [cover, setCover] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [logoUploading, setLogoUploading] = useState(false);
  const [coverUploading, setCoverUploading] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    loadBusiness();
  }, []);

  const getToken = () => {
    return localStorage.getItem("catalogpro_token");
  };

  const loadBusiness = async () => {
    const token = getToken();

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API}/business/get.php`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const result = await response.json();

      console.log("Business:", result);

      if (!result.success) {
        setError(
          result.message ||
            "Failed to load business"
        );
        return;
      }

      const data = result.data;

      setBusiness(data);

      setForm({
        business_name:
          data.business_name || "",

        slug:
          data.slug || "",

        description:
          data.description || "",

        phone:
          data.phone || "",

        whatsapp:
          data.whatsapp || "",

        email:
          data.email || "",

        address:
          data.address || "",

        city:
          data.city || "",

        state:
          data.state || "",

        country:
          data.country || "India",
      });

    } catch (err) {
      console.error(err);

      setError(
        "Unable to connect to server."
      );

    } finally {
      setLoading(false);
    }
  };

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

  const handleUpdate = async (e) => {
    e.preventDefault();

    const token = getToken();

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setSaving(true);
      setMessage("");
      setError("");

      const response = await fetch(
        `${API}/business/update.php`,
        {
          method: "PUT",

          headers: {
            Authorization:
              `Bearer ${token}`,

            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(form),
        }
      );

      const result =
        await response.json();

      console.log(
        "Update Business:",
        result
      );

      if (!result.success) {
        setError(
          result.message ||
            "Update failed"
        );

        return;
      }

      setBusiness(result.data);

      /*
       * Update localStorage business
       */

      const oldBusiness =
        JSON.parse(
          localStorage.getItem(
            "catalogpro_business"
          ) || "{}"
        );

      const updatedBusiness = {
        ...oldBusiness,

        id:
          result.data.id,

        name:
          result.data.business_name,

        slug:
          result.data.slug,

        logo:
          result.data.logo,

        cover_image:
          result.data.cover_image,

        phone:
          result.data.phone,

        whatsapp:
          result.data.whatsapp,

        email:
          result.data.email,
      };

      localStorage.setItem(
        "catalogpro_business",
        JSON.stringify(
          updatedBusiness
        )
      );

      setMessage(
        "Business profile updated successfully."
      );

    } catch (err) {
      console.error(err);

      setError(
        "Unable to connect to server."
      );

    } finally {
      setSaving(false);
    }
  };
    const handleLogoUpload = async () => {
    if (!logo) {
      setError("Please select a logo image.");
      return;
    }

    const token = getToken();

    if (!token) {
      navigate("/login");
      return;
    }

    const formData = new FormData();

    formData.append("image", logo);

    try {
      setLogoUploading(true);
      setMessage("");
      setError("");

      const response = await fetch(
        `${API}/business/upload-logo.php`,
        {
          method: "POST",
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const result =
        await response.json();

      console.log(
        "Logo upload:",
        result
      );

      if (!result.success) {
        setError(
          result.message ||
            "Logo upload failed"
        );
        return;
      }

      /*
       * Update business state
       */

      setBusiness(result.data);

      /*
       * Update localStorage
       */

      updateLocalBusinessImages(
        result.data
      );

      /*
       * Clear selected logo
       */

      setLogo(null);

      /*
       * Success message
       */

      setMessage(
        "Logo uploaded successfully."
      );

    } catch (err) {
      console.error(err);

      setError(
        "Logo upload failed."
      );

    } finally {
      setLogoUploading(false);
    }
  };


  const handleCoverUpload = async () => {
    if (!cover) {
      setError(
        "Please select a cover image."
      );
      return;
    }

    const token = getToken();

    if (!token) {
      navigate("/login");
      return;
    }

    const formData = new FormData();

    /*
     * IMPORTANT
     *
     * upload-cover.php expects:
     * $_FILES["cover"]
     */

    formData.append(
      "cover",
      cover
    );

    try {
      setCoverUploading(true);
      setMessage("");
      setError("");

      const response = await fetch(
        `${API}/business/upload-cover.php`,
        {
          method: "POST",

          headers: {
            Authorization:
              `Bearer ${token}`,
          },

          body: formData,
        }
      );

      const result =
        await response.json();

      console.log(
        "Cover upload:",
        result
      );

      if (!result.success) {
        setError(
          result.message ||
            "Cover upload failed"
        );

        return;
      }

      /*
       * Update business state
       */

      setBusiness(result.data);

      /*
       * Update localStorage
       */

      updateLocalBusinessImages(
        result.data
      );

      /*
       * Clear selected cover
       */

      setCover(null);

      /*
       * Success message
       */

      setMessage(
        "Cover image uploaded successfully."
      );

    } catch (err) {
      console.error(err);

      setError(
        "Cover upload failed."
      );

    } finally {
      setCoverUploading(false);
    }
  };


  const updateLocalBusinessImages = (
    data
  ) => {

    const oldBusiness =
      JSON.parse(
        localStorage.getItem(
          "catalogpro_business"
        ) || "{}"
      );

    const updatedBusiness = {
      ...oldBusiness,

      logo:
        data.logo ||
        data.logo_url ||
        oldBusiness.logo,

      cover_image:
        data.cover_image ||
        data.cover_url ||
        oldBusiness.cover_image,
    };

    localStorage.setItem(
      "catalogpro_business",
      JSON.stringify(
        updatedBusiness
      )
    );
  };


  if (loading) {
    return (
      <div className="dashboard-loading">
        Loading Business Profile...
      </div>
    );
  }

  const businessName =
  business?.business_name || "My Business";

const catalogueUrl =
  `${window.location.origin}/${business?.slug || ""}`;

  if (!business) {
    return (
      <div className="dashboard-loading">
        Business profile not found.
      </div>
    );
  }


  return (
    <div className="admin-layout">

      {/* SIDEBAR */}
<AdminSidebar />

      {/* MAIN */}

      <main className="admin-main">

        <header className="admin-topbar">

          <div>

            <h1>
              Business Profile
            </h1>

            <p>
              Manage your business information
            </p>

          </div>


          <button
            className="business-back-button"
            onClick={() =>
              navigate("/dashboard")
            }
          >
            ← Dashboard
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


        {/* COVER */}

        <section className="profile-cover">

          {business.cover_image ? (

            <img
               src={getImageUrl(business.cover_image)}
              alt="Business Cover"
            />

          ) : (

            <div className="cover-placeholder">

              <span>
                Business Cover Image
              </span>

            </div>

          )}

        </section>


        {/* IMAGE UPLOADS */}

        <section className="profile-media-grid">

          {/* LOGO */}

          <div className="profile-media-card">

            <div className="profile-logo-preview">

              {business.logo ? (

                <img
                  src={getImageUrl(business.logo)}
                  alt="Business Logo"
                />

              ) : (

                business.business_name
                  ?.charAt(0)
                  .toUpperCase()

              )}

            </div>


            <div className="profile-media-content">

              <h3>
                Business Logo
              </h3>


              <p>
                JPG, PNG or WEBP.
                Recommended square image.
              </p>


              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) =>
                  setLogo(
                    e.target.files?.[0] ||
                      null
                  )
                }
              />


              <button
                type="button"
                className="profile-upload-button"
                onClick={
                  handleLogoUpload
                }
                disabled={
                  logoUploading
                }
              >
                {logoUploading
                  ? "Uploading..."
                  : "Upload Logo"}
              </button>

            </div>

          </div>


          {/* COVER */}

          <div className="profile-media-card">

            <div className="profile-cover-small">

              {business.cover_image ? (

                <img
                 src={getImageUrl(business.cover_image)}
                  alt="Cover"
                />

              ) : (

                <span>
                  Cover
                </span>

              )}

            </div>


            <div className="profile-media-content">

              <h3>
                Cover Image
              </h3>


              <p>
                Recommended wide image
                for catalogue header.
              </p>


              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) =>
                  setCover(
                    e.target.files?.[0] ||
                      null
                  )
                }
              />


              <button
                type="button"
                className="profile-upload-button"
                onClick={
                  handleCoverUpload
                }
                disabled={
                  coverUploading
                }
              >
                {coverUploading
                  ? "Uploading..."
                  : "Upload Cover"}
              </button>

            </div>

          </div>

        </section>
                {/* PROFILE FORM */}

        <form
          className="profile-form-card"
          onSubmit={handleUpdate}
        >

          <div className="profile-section-title">

            <div>

              <h2>
                Business Information
              </h2>

              <p>
                Update the information
                displayed on your catalogue.
              </p>

            </div>

          </div>


          <div className="profile-form-grid">

            {/* BUSINESS NAME */}

            <div className="profile-field">

              <label>
                Business Name
              </label>

              <input
                type="text"
                name="business_name"
                value={
                  form.business_name
                }
                onChange={
                  handleChange
                }
                required
              />

            </div>


            {/* SLUG */}

            <div className="profile-field">

              <label>
                Catalogue Slug
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
                required
              />

              <small>
                Your catalogue:
                /{form.slug}
              </small>

            </div>


            {/* PHONE */}

            <div className="profile-field">

              <label>
                Phone
              </label>

              <input
                type="text"
                name="phone"
                value={
                  form.phone
                }
                onChange={
                  handleChange
                }
                placeholder="9876543210"
              />

            </div>


            {/* WHATSAPP */}

            <div className="profile-field">

              <label>
                WhatsApp
              </label>

              <input
                type="text"
                name="whatsapp"
                value={
                  form.whatsapp
                }
                onChange={
                  handleChange
                }
                placeholder="9876543210"
              />

            </div>


            {/* EMAIL */}

            <div className="profile-field">

              <label>
                Email
              </label>

              <input
                type="email"
                name="email"
                value={
                  form.email
                }
                onChange={
                  handleChange
                }
              />

            </div>


            {/* CITY */}

            <div className="profile-field">

              <label>
                City
              </label>

              <input
                type="text"
                name="city"
                value={
                  form.city
                }
                onChange={
                  handleChange
                }
                placeholder="Namakkal"
              />

            </div>


            {/* STATE */}

            <div className="profile-field">

              <label>
                State
              </label>

              <input
                type="text"
                name="state"
                value={
                  form.state
                }
                onChange={
                  handleChange
                }
                placeholder="Tamil Nadu"
              />

            </div>


            {/* COUNTRY */}

            <div className="profile-field">

              <label>
                Country
              </label>

              <input
                type="text"
                name="country"
                value={
                  form.country
                }
                onChange={
                  handleChange
                }
              />

            </div>


            {/* ADDRESS */}

            <div className="profile-field full">

              <label>
                Address
              </label>

              <textarea
                name="address"
                value={
                  form.address
                }
                onChange={
                  handleChange
                }
                rows="3"
                placeholder="Business address"
              />

            </div>


            {/* DESCRIPTION */}

            <div className="profile-field full">

              <label>
                Business Description
              </label>

              <textarea
                name="description"
                value={
                  form.description
                }
                onChange={
                  handleChange
                }
                rows="5"
                placeholder="Tell customers about your business..."
              />

            </div>

          </div>


<br/>

{/* =========================
    CATALOGUE QR CODE
========================= */}

<div className="admin-panel">

  <div className="panel-header">

    <div>
      <h3>
        Catalogue QR Code
      </h3>

      <p>
        Customers can scan this QR code
        to view your catalogue.
      </p>
    </div>

  </div>

  <div className="business-qr-section">

    <div className="business-qr-code">

      <QRCodeCanvas
        id="catalogue-qr"
        value={catalogueUrl}
        size={220}
        level="H"
        includeMargin={true}
      />

    </div>

    <div className="business-qr-info">

      <span className="dashboard-label">
        YOUR CATALOGUE
      </span>

      <h3>
        {businessName}
      </h3>

      <p>
        {catalogueUrl}
      </p>

      <div className="business-qr-actions">

        <button
          type="button"
          className="admin-primary-button"
          onClick={() => {
            const canvas =
              document.getElementById(
                "catalogue-qr"
              );

            if (!canvas) {
              alert("QR Code not found.");
              return;
            }

            const link =
              document.createElement("a");

            link.download =
              `${business?.slug || "catalogue"}-qr-code.png`;

            link.href =
              canvas.toDataURL("image/png");

            link.click();
          }}
        >
          Download QR Code
        </button>

        <button
          type="button"
          className="admin-secondary-button"
          onClick={() => {

            const canvas =
              document.getElementById(
                "catalogue-qr"
              );

            if (!canvas) {
              alert("QR Code not found.");
              return;
            }

            const image =
              canvas.toDataURL("image/png");

            const printWindow =
              window.open("", "_blank");

            if (!printWindow) {
              alert("Please allow pop-ups.");
              return;
            }

            printWindow.document.write(`
              <html>

                <head>

                  <title>
                    ${businessName} - QR Code
                  </title>

                  <style>

                    body {
                      font-family: Arial, sans-serif;
                      text-align: center;
                      padding: 50px;
                    }

                    h1 {
                      font-size: 30px;
                    }

                    img {
                      width: 300px;
                      height: 300px;
                      margin: 30px auto;
                    }

                    p {
                      color: #64748b;
                    }

                  </style>

                </head>

                <body>

                  <h1>
                    ${businessName}
                  </h1>

                  <p>
                    Scan to View Catalogue
                  </p>

                  <img
                    src="${image}"
                    alt="Catalogue QR Code"
                  />

                  <p>
                    ${catalogueUrl}
                  </p>

                </body>

              </html>
            `);

            printWindow.document.close();

            setTimeout(() => {
              printWindow.print();
            }, 500);

          }}
        >
          Print QR Code
        </button>

      </div>

    </div>

  </div>

</div>
          {/* FORM FOOTER */}

          <div className="profile-form-footer">

            <button
              type="button"
              className="profile-cancel-button"
              onClick={() =>
                navigate("/dashboard")
              }
            >
              Cancel
            </button>


            <button
              type="submit"
              className="profile-save-button"
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : "Save Changes"}
            </button>

          </div>

        </form>

      </main>

    </div>
  );
}

export default Business;