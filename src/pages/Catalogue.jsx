import { useEffect, useState } from "react";
import "../App.css";

const API_URL = "http://localhost/api/catalog/view.php";
const API_BASE = "http://localhost/api";

function Catalogue() {
  const [catalog, setCatalog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedItem, setSelectedItem] = useState(null);

  const slug =
    window.location.pathname
      .split("/")
      .filter(Boolean)
      .pop() || "";

  useEffect(() => {
    if (!slug) {
      setError("Catalogue not found");
      setLoading(false);
      return;
    }

    fetch(`${API_URL}?slug=${encodeURIComponent(slug)}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Catalogue not found");
        }

        return response.json();
      })
      .then((result) => {
        if (!result.success) {
          throw new Error(
            result.message || "Catalogue not found"
          );
        }

        setCatalog(result.data);
      })
      .catch((err) => {
        console.error("Catalogue error:", err);
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="catalog-loading">
        Loading catalogue...
      </div>
    );
  }

  if (error) {
    return (
      <div className="catalog-error">
        <h2>Catalogue Not Found</h2>
        <p>{error}</p>
      </div>
    );
  }

  if (!catalog) {
    return (
      <div className="catalog-error">
        <h2>Catalogue Not Found</h2>
      </div>
    );
  }

  const {
    business,
    categories = [],
    items = [],
  } = catalog;

  const filteredItems =
    selectedCategory === "all"
      ? items
      : items.filter(
          (item) =>
            Number(item.category_id) ===
            Number(selectedCategory)
        );

  return (
    <div className="catalog-page">

      {/* HERO */}
      <section
        className="catalog-hero"
        style={
          business.cover_image
            ? {
                backgroundImage: `
                  linear-gradient(
                    rgba(0,0,0,.55),
                    rgba(0,0,0,.55)
                  ),
                  url(${API_BASE}/${business.cover_image})
                `,
              }
            : {}
        }
      >
        <div className="hero-content">

          {business.logo && (
            <img
              src={`${API_BASE}/${business.logo}`}
              alt={business.business_name}
              className="business-logo"
            />
          )}

  <span className="hero-badge">
      DIGITAL CATALOGUE
    </span>

          <h1>
            {business.business_name}
          </h1>

          {business.description && (
            <p>{business.description}</p>
          )}

          <div className="hero-buttons">

            {business.phone && (
              <a
                href={`tel:${business.phone}`}
                className="hero-call-button"
              >
                <i className="fi fi-rr-phone-call"></i>
                <span>Call Now</span>
              </a>
            )}

            {business.whatsapp && (
              <a
                href={`https://wa.me/91${business.whatsapp}`}
                target="_blank"
                rel="noreferrer"
                className="hero-whatsapp-button"
              >
                <i className="fi fi-brands-whatsapp"></i>
                <span>WhatsApp</span>
              </a>
            )}

          </div>
        </div>
      </section>


      {/* ABOUT */}
      <section className="about-section">

        <div className="catalog-container">

          <h2>
            About {business.business_name}
          </h2>

          {business.description ? (
            <p>{business.description}</p>
          ) : (
            <p>
              Welcome to {business.business_name}.
            </p>
          )}

          <div className="business-info">

            {business.address && (
              <div className="business-info-item">

                <strong>Address</strong>

                <span>
                  {business.address}

                  {business.city &&
                    `, ${business.city}`}

                  {business.state &&
                    `, ${business.state}`}
                </span>

              </div>
            )}

            {business.email && (
              <div className="business-info-item">

                <strong>Email</strong>

                <span>
                  {business.email}
                </span>

              </div>
            )}

          </div>

        </div>

      </section>


      {/* CATALOGUE */}
      <section className="catalog-section">

        <div className="catalog-container">

          <div className="catalog-heading">

            <h2>Our Catalogue</h2>

            <p>
              Explore our products and services
            </p>

          </div>


          {/* CATEGORY FILTER */}
          <div className="category-list">

            <button
              type="button"
              className={
                selectedCategory === "all"
                  ? "category-active"
                  : ""
              }
              onClick={() =>
                setSelectedCategory("all")
              }
            >
              All
            </button>

            {categories.map((category) => (
              <button
                type="button"
                key={category.id}
                className={
                  selectedCategory ===
                  String(category.id)
                    ? "category-active"
                    : ""
                }
                onClick={() =>
                  setSelectedCategory(
                    String(category.id)
                  )
                }
              >
                {category.name}
              </button>
            ))}

          </div>


          {/* ITEMS */}
          <div className="items-grid">

            {filteredItems.length === 0 ? (

              <div className="no-items">

                <h3>No items available</h3>

                <p>
                  There are no items in this
                  category yet.
                </p>

              </div>

            ) : (

              filteredItems.map((item) => (

                <div
                  className="item-card"
                  key={item.id}
                  onClick={() =>
                    setSelectedItem(item)
                  }
                >

                  {/* IMAGE */}
                  <div className="item-image">

                    {item.image ? (

                      <img
                        src={`${API_BASE}/${item.image}`}
                        alt={item.name}
                      />

                    ) : (

                      <div className="image-placeholder">
                        No Image
                      </div>

                    )}

                  </div>


                  {/* CONTENT */}
                  <div className="item-content">

                    <span className="item-category">
                      {item.category_name ||
                        "Catalogue Item"}
                    </span>

                    <h3>{item.name}</h3>

                    {item.short_description && (
                      <p>
                        {item.short_description}
                      </p>
                    )}


                    {/* PRICE */}
                    <div className="price">

                      {item.sale_price ? (

                        <>
                          <del>
                            ₹
                            {Number(
                              item.price || 0
                            ).toLocaleString(
                              "en-IN"
                            )}
                          </del>

                          <strong>
                            ₹
                            {Number(
                              item.sale_price
                            ).toLocaleString(
                              "en-IN"
                            )}
                          </strong>
                        </>

                      ) : (

                        <strong>
                          ₹
                          {Number(
                            item.price || 0
                          ).toLocaleString(
                            "en-IN"
                          )}
                        </strong>

                      )}

                    </div>


                    {/* WHATSAPP */}
                    {business.whatsapp && (
                      <a
                        className="enquiry-button"
                        href={`https://wa.me/91${business.whatsapp}?text=${encodeURIComponent(
                          `Hi, I'm interested in ${item.name}`
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) =>
                          e.stopPropagation()
                        }
                      >
                        <i className="fi fi-brands-whatsapp"></i>

                        <span>
                          Enquire on WhatsApp
                        </span>
                      </a>
                    )}

                  </div>

                </div>

              ))

            )}

          </div>

        </div>

      </section>


      {/* PRODUCT MODAL */}
      {selectedItem && (

        <div
          className="product-modal-overlay"
          onClick={() =>
            setSelectedItem(null)
          }
        >

          <div
            className="product-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <button
              type="button"
              className="modal-close"
              onClick={() =>
                setSelectedItem(null)
              }
            >
              ×
            </button>


            {/* MODAL IMAGE */}
            <div className="modal-image">

              {selectedItem.image ? (

                <img
                  src={`${API_BASE}/${selectedItem.image}`}
                  alt={selectedItem.name}
                />

              ) : (

                <div className="image-placeholder">
                  No Image
                </div>

              )}

            </div>


            {/* MODAL CONTENT */}
            <div className="modal-content">

              <span className="item-category">
                {selectedItem.category_name ||
                  "Catalogue Item"}
              </span>

              <h2>
                {selectedItem.name}
              </h2>

              {selectedItem.description && (
                <p>
                  {selectedItem.description}
                </p>
              )}


              {/* PRICE */}
              <div className="price">

                {selectedItem.sale_price ? (

                  <>
                    <del>
                      ₹
                      {Number(
                        selectedItem.price || 0
                      ).toLocaleString("en-IN")}
                    </del>

                    <strong>
                      ₹
                      {Number(
                        selectedItem.sale_price
                      ).toLocaleString("en-IN")}
                    </strong>
                  </>

                ) : (

                  <strong>
                    ₹
                    {Number(
                      selectedItem.price || 0
                    ).toLocaleString("en-IN")}
                  </strong>

                )}

              </div>


              {/* WHATSAPP */}
              {business.whatsapp && (
                <a
                  className="modal-whatsapp"
                  href={`https://wa.me/91${business.whatsapp}?text=${encodeURIComponent(
                    `Hi, I'm interested in ${selectedItem.name}`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <i className="fi fi-brands-whatsapp"></i>

                  <span>
                    Enquire on WhatsApp
                  </span>
                </a>
              )}

            </div>

          </div>

        </div>

      )}


      {/* CONTACT */}
      <section className="contact-section">

        <div className="catalog-container">

          <h2>
            Contact {business.business_name}
          </h2>

          <div className="contact-buttons">

            {business.phone && (
              <a
                href={`tel:${business.phone}`}
              >
                <i className="fi fi-rr-phone-call"></i>

                <span>
                  Call Now
                </span>
              </a>
            )}

            {business.whatsapp && (
              <a
                href={`https://wa.me/91${business.whatsapp}`}
                target="_blank"
                rel="noreferrer"
              >
                <i className="fi fi-brands-whatsapp"></i>

                <span>
                  WhatsApp
                </span>
              </a>
            )}

            {business.email && (
              <a
                href={`mailto:${business.email}`}
              >
                <i className="fi fi-rr-envelope"></i>

                <span>
                  Email
                </span>
              </a>
            )}

          </div>

        </div>

      </section>


      {/* FOOTER */}
      <footer className="catalog-footer">

        <h3>
          {business.business_name}
        </h3>

        <p>
          Digital Catalogue powered by CatalogPro
        </p>

      </footer>

    </div>
  );
}

export default Catalogue;