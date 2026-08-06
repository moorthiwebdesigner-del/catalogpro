import { useEffect, useState } from "react";
import "../App.css";

const API_URL = "http://localhost/api/catalog/view.php";

function Catalogue() {
  const [catalog, setCatalog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedCategory, setSelectedCategory] = useState("all");

  const [selectedItem, setSelectedItem] = useState(null);

const slug =
  window.location.pathname.split("/").filter(Boolean).pop() ||
  "moorthi-furniture";

  useEffect(() => {
    fetch(`${API_URL}?slug=${slug}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Catalogue not found");
        }

        return response.json();
      })
      .then((result) => {
        if (!result.success) {
          throw new Error(result.message);
        }

        setCatalog(result.data);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="catalog-loading">
        <div className="loader"></div>
        <p>Loading catalogue...</p>
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

  const { business, categories, items } = catalog;

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
                backgroundImage: `linear-gradient(rgba(0,0,0,.55), rgba(0,0,0,.55)), url(http://localhost/api/${business.cover_image})`,
              }
            : {}
        }
      >
        <div className="hero-content">

          {business.logo && (
            <img
              src={`http://localhost/api/${business.logo}`}
              alt={business.business_name}
              className="business-logo"
            />
          )}

          <h1>{business.business_name}</h1>

          {business.description && (
            <p>{business.description}</p>
          )}

          <div className="hero-buttons">

  {business.phone && (
    <a href={`tel:${business.phone}`}>
      <i className="fi fi-rr-phone-call"></i>
      <span>Call Now</span>
    </a>
  )}

  {business.whatsapp && (
    <a
      href={`https://wa.me/${business.whatsapp}`}
      target="_blank"
      rel="noreferrer"
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

        <h2>About {business.business_name}</h2>

        {business.description ? (
          <p>{business.description}</p>
        ) : (
          <p>
            Welcome to {business.business_name}.
          </p>
        )}

        <div className="business-info">

          {business.address && (
            <div>
              <strong>Address</strong>
              <span>
                {business.address}
                {business.city && `, ${business.city}`}
                {business.state && `, ${business.state}`}
              </span>
            </div>
          )}

          {business.email && (
            <div>
              <strong>Email</strong>
              <span>{business.email}</span>
            </div>
          )}

        </div>

      </section>


      {/* CATEGORY FILTER */}
      <section className="catalog-section">

        <h2>Our Catalogue</h2>

        <div className="category-list">

  <button
    className={
      selectedCategory === "all"
        ? "category-active"
        : ""
    }
    onClick={() => setSelectedCategory("all")}
  >
    All
  </button>

  {categories.map((category) => (
    <button
      key={category.id}
      className={
        selectedCategory === String(category.id)
          ? "category-active"
          : ""
      }
      onClick={() =>
        setSelectedCategory(String(category.id))
      }
    >
      {category.name}
    </button>
  ))}

</div>


        {/* ITEMS */}
        <div className="items-grid">

  {filteredItems.length === 0 && (
    <div className="no-items">
      <h3>No items available</h3>
      <p>
        There are no items in this category yet.
      </p>
    </div>
  )}

  {filteredItems.map((item) => (

    <div className="item-card" key={item.id}   onClick={() => setSelectedItem(item)} >

      <div className="item-image">

        {item.image ? (
          <img
            src={`http://localhost/api/${item.image}`}
            alt={item.name}
          />
        ) : (
          <div className="image-placeholder">
            No Image
          </div>
        )}

      </div>

      <div className="item-content">

        <span className="item-category">
          {item.category_name}
        </span>

        <h3>{item.name}</h3>

        {item.short_description && (
          <p>{item.short_description}</p>
        )}

        <div className="price">

          {item.sale_price ? (
            <>
              <del>
                ₹{Number(item.price).toLocaleString("en-IN")}
              </del>

              <strong>
                ₹
                {Number(item.sale_price).toLocaleString("en-IN")}
              </strong>
            </>
          ) : (
            <strong>
              ₹
              {Number(item.price).toLocaleString("en-IN")}
            </strong>
          )}

        </div>

        {business.whatsapp && (
          <a
            className="enquiry-button"
            href={`https://wa.me/${business.whatsapp}?text=${encodeURIComponent(
              `Hi, I'm interested in ${item.name}`
            )}`}
            target="_blank"
            rel="noreferrer"
          >
            <i className="fi fi-brands-whatsapp"></i>
            <span>Enquire on WhatsApp</span>
          </a>
        )}

      </div>

    </div>

  ))}

</div>
{selectedItem && (
  <div
    className="product-modal-overlay"
    onClick={() => setSelectedItem(null)}
  >

    <div
      className="product-modal"
      onClick={(e) => e.stopPropagation()}
    >

      <button
        className="modal-close"
        onClick={() => setSelectedItem(null)}
      >
        ×
      </button>

      <div className="modal-image">

        {selectedItem.image ? (
          <img
            src={`http://localhost/api/${selectedItem.image}`}
            alt={selectedItem.name}
          />
        ) : (
          <div className="image-placeholder">
            No Image
          </div>
        )}

      </div>

      <div className="modal-content">

        <span className="item-category">
          {selectedItem.category_name}
        </span>

        <h2>{selectedItem.name}</h2>

        {selectedItem.description && (
          <p>{selectedItem.description}</p>
        )}

        <div className="price">

          {selectedItem.sale_price ? (
            <>
              <del>
                ₹{Number(selectedItem.price).toLocaleString("en-IN")}
              </del>

              <strong>
                ₹
                {Number(selectedItem.sale_price).toLocaleString("en-IN")}
              </strong>
            </>
          ) : (
            <strong>
              ₹
              {Number(selectedItem.price).toLocaleString("en-IN")}
            </strong>
          )}

        </div>

        {business.whatsapp && (
          <a
            className="modal-whatsapp"
            href={`https://wa.me/${business.whatsapp}?text=${encodeURIComponent(
              `Hi, I'm interested in ${selectedItem.name}`
            )}`}
            target="_blank"
            rel="noreferrer"
          >
            <i className="fi fi-brands-whatsapp"></i>
            <span>Enquire on WhatsApp</span>
          </a>
        )}

      </div>

    </div>

  </div>
)}
      </section>


      {/* CONTACT */}
<section className="contact-section">

  <h2>Get in Touch</h2>

  <p>
    Contact {business.business_name} for more information.
  </p>

  <div className="contact-buttons">

    {business.phone && (
      <a href={`tel:${business.phone}`}>
        <i className="fi fi-rr-phone-call"></i>
        <span>Call Now</span>
      </a>
    )}

    {business.whatsapp && (
      <a
        href={`https://wa.me/${business.whatsapp}`}
        target="_blank"
        rel="noreferrer"
      >
        <i className="fi fi-brands-whatsapp"></i>
        <span>WhatsApp</span>
      </a>
    )}

    {business.email && (
      <a href={`mailto:${business.email}`}>
        <i className="fi fi-rr-envelope"></i>
        <span>Email</span>
      </a>
    )}

  </div>

</section>


      {/* FOOTER */}
      <footer>

        <h3>{business.business_name}</h3>

        <p>
          Digital Catalogue powered by CatalogPro
        </p>

      </footer>

    </div>
  );
}

export default Catalogue;