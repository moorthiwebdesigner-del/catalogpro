import { useNavigate } from "react-router-dom";
import "../App.css";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-page">

      {/* =========================
          NAVBAR
      ========================== */}

      <header className="home-navbar">

        <div className="home-logo">
          <div className="home-logo-mark">
            C
          </div>

          <div>
            <strong>CatalogPro</strong>
            <span>Digital Catalogue Platform</span>
          </div>
        </div>

        <nav className="home-nav">

          <a href="#features">
            Features
          </a>

          <a href="#how-it-works">
            How It Works
          </a>

          <a href="#businesses">
            For Businesses
          </a>

          <button
            className="home-login-button"
            onClick={() => navigate("/login")}
          >
            Login
          </button>

          <button
            className="home-register-button"
            onClick={() => navigate("/register")}
          >
            Get Started
          </button>

        </nav>

      </header>


      {/* =========================
          HERO
      ========================== */}

      <section className="home-hero">

        <div className="home-hero-glow glow-one"></div>
        <div className="home-hero-glow glow-two"></div>

        <div className="home-hero-content">

          <div className="home-badge">
            ✦ SMART DIGITAL CATALOGUE PLATFORM
          </div>

          <h1>
            Turn Your Business
            <br />

            <span>
              Into a Digital Catalogue
            </span>
          </h1>

          <p>
            Create a beautiful online catalogue for your
            products and services. Manage your business,
            showcase your products, and share your catalogue
            with customers — all from one simple platform.
          </p>

          <div className="home-hero-actions">

            <button
              className="home-primary-button"
              onClick={() => navigate("/register")}
            >
              Create Your Catalogue
              <span>→</span>
            </button>

            <button
  className="home-secondary-button"
  onClick={() =>
    window.open(
      "/moorthi-web-developer",
      "_blank",
      "noopener,noreferrer"
    )
  }
>
  View Demo
  <span>↗</span>
</button>

          </div>

          <div className="home-trust">

            <span>
              ✓ Easy to Manage
            </span>

            <span>
              ✓ Mobile Friendly
            </span>

            <span>
              ✓ Share Anywhere
            </span>

          </div>

        </div>


        {/* HERO VISUAL */}

        <div className="home-hero-visual">

          <div className="hero-browser">

            <div className="hero-browser-top">

              <div className="browser-dots">

                <i></i>
                <i></i>
                <i></i>

              </div>

              <div className="browser-url">
                catalogpro.app/your-business
              </div>

            </div>


            <div className="hero-catalogue">

              <div className="catalogue-cover">

                <div className="catalogue-cover-content">

                  <div className="mini-logo">
                    MF
                  </div>

                  <div>

                    <h3>
                      Moorthi Web Developer
                    </h3>

                    <span>
Results-driven Senior WordPress Developer                    </span>

                  </div>

                </div>

              </div>


              <div className="catalogue-body">

                <div className="catalogue-heading">

                  <div>

                    <small>
                      OUR COLLECTION
                    </small>

                    <h3>
                      Featured Products
                    </h3>

                  </div>

                  <span>
                    View All →
                  </span>

                </div>


                <div className="catalogue-products">

                  <div className="mini-product">

                    <div className="mini-product-image">
                      🛋️
                    </div>

                    <strong>
                      Premium Sofa
                    </strong>

                    <span>
                      ₹24,999
                    </span>

                  </div>


                  <div className="mini-product">

                    <div className="mini-product-image">
                      🪑
                    </div>

                    <strong>
                      Office Chair
                    </strong>

                    <span>
                      ₹8,499
                    </span>

                  </div>


                  <div className="mini-product">

                    <div className="mini-product-image">
                      🛏️
                    </div>

                    <strong>
                      Luxury Bed
                    </strong>

                    <span>
                      ₹32,999
                    </span>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =========================
          TRUST BAR
      ========================== */}

      <section className="home-trust-bar">

        <div>
          <strong>
            One Platform
          </strong>

          <span>
            For your digital catalogue
          </span>
        </div>

        <div>
          <strong>
            Simple
          </strong>

          <span>
            Easy business management
          </span>
        </div>

        <div>
          <strong>
            Professional
          </strong>

          <span>
            Built for modern businesses
          </span>
        </div>

        <div>
          <strong>
            Shareable
          </strong>

          <span>
            One link for your customers
          </span>
        </div>

      </section>


      {/* =========================
          FEATURES
      ========================== */}

      <section
        className="home-features"
        id="features"
      >

        <div className="home-section-heading">

          <span>
            POWERFUL FEATURES
          </span>

          <h2>
            Everything you need
            <br />
            to showcase your business.
          </h2>

          <p>
            CatalogPro gives you the tools to build,
            manage and share a professional digital
            catalogue without complicated software.
          </p>

        </div>


        <div className="home-feature-grid">

          <div className="home-feature-card">

            <div className="feature-icon">
              ◈
            </div>

            <h3>
              Business Profile
            </h3>

            <p>
              Create a professional business profile
              with your logo, cover image, contact
              details, location and business description.
            </p>

            <span>
              01
            </span>

          </div>


          <div className="home-feature-card">

            <div className="feature-icon">
              ▣
            </div>

            <h3>
              Products & Services
            </h3>

            <p>
              Add products, services and packages with
              images, descriptions, pricing and categories.
            </p>

            <span>
              02
            </span>

          </div>


          <div className="home-feature-card">

            <div className="feature-icon">
              ↗
            </div>

            <h3>
              Share Your Catalogue
            </h3>

            <p>
              Get your own catalogue link and share it
              with customers through WhatsApp, social
              media and anywhere online.
            </p>

            <span>
              03
            </span>

          </div>


          <div className="home-feature-card">

            <div className="feature-icon">
              ◉
            </div>

            <h3>
              Mobile Friendly
            </h3>

            <p>
              Your digital catalogue is designed to look
              great on mobile phones, tablets and desktop
              devices.
            </p>

            <span>
              04
            </span>

          </div>

        </div>

      </section>


      {/* =========================
          HOW IT WORKS
      ========================== */}

      <section
        className="home-how"
        id="how-it-works"
      >

        <div className="home-section-heading">

          <span>
            HOW IT WORKS
          </span>

          <h2>
            Launch your catalogue
            <br />
            in three simple steps.
          </h2>

          <p>
            No complicated setup. Create your account,
            add your products and start sharing.
          </p>

        </div>


        <div className="home-steps">

          <div className="home-step">

            <div className="step-number">
              01
            </div>

            <h3>
              Create Your Account
            </h3>

            <p>
              Register your account and add your
              business information to get started.
            </p>

          </div>


          <div className="step-line"></div>


          <div className="home-step">

            <div className="step-number">
              02
            </div>

            <h3>
              Build Your Catalogue
            </h3>

            <p>
              Add categories, products, services,
              images and pricing from your dashboard.
            </p>

          </div>


          <div className="step-line"></div>


          <div className="home-step">

            <div className="step-number">
              03
            </div>

            <h3>
              Share With Customers
            </h3>

            <p>
              Share your unique catalogue link and
              let customers browse your business online.
            </p>

          </div>

        </div>

      </section>


      {/* =========================
          FOR BUSINESSES
      ========================== */}

      <section
        className="home-businesses"
        id="businesses"
      >

        <div className="home-section-heading">

          <span>
            BUILT FOR BUSINESSES
          </span>

          <h2>
            One catalogue.
            <br />
            Many possibilities.
          </h2>

          <p>
            Whether you sell products, provide services
            or manage a local business, CatalogPro helps
            you create a professional online presence.
          </p>

        </div>


        <div className="home-business-grid">

          <div className="business-type-card">
            <span>01</span>
            <h3>
              Retail Stores
            </h3>
            <p>
              Showcase your products and collections
              in a simple digital catalogue.
            </p>
          </div>


          <div className="business-type-card">
            <span>02</span>
            <h3>
              Service Businesses
            </h3>
            <p>
              Present your services, packages and
              contact information professionally.
            </p>
          </div>


          <div className="business-type-card">
            <span>03</span>
            <h3>
              Local Businesses
            </h3>
            <p>
              Give your customers an easy way to
              discover what your business offers.
            </p>
          </div>


          <div className="business-type-card">
            <span>04</span>
            <h3>
              Growing Brands
            </h3>
            <p>
              Build a stronger digital presence with
              a catalogue you can update anytime.
            </p>
          </div>

        </div>

      </section>


      {/* =========================
          CTA
      ========================== */}

      <section className="home-cta">

        <div className="home-cta-glow"></div>

        <div className="home-cta-content">

          <span>
            READY TO GO DIGITAL?
          </span>

          <h2>
            Give your business
            <br />
            a catalogue it deserves.
          </h2>

          <p>
            Create your CatalogPro account and start
            building your professional digital catalogue.
          </p>

          <button
            className="home-primary-button"
            onClick={() => navigate("/register")}
          >
            Create Your Catalogue
            <span>→</span>
          </button>

        </div>

      </section>


      {/* =========================
          FOOTER
      ========================== */}

      <footer className="home-footer">

        <div className="footer-brand">

          <div className="home-logo-mark">
            C
          </div>

          <div>

            <strong>
              CatalogPro
            </strong>

            <span>
              Digital Catalogue Platform
            </span>

          </div>

        </div>


        <div className="footer-links">

          <a href="#features">
            Features
          </a>

          <a href="#how-it-works">
            How It Works
          </a>

          <a href="#businesses">
            Businesses
          </a>

          <button
            onClick={() => navigate("/login")}
          >
            Login
          </button>

        </div>


        <p>
          © 2026 CatalogPro. All rights reserved.
        </p>

      </footer>

    </div>
  );
}

export default Home;