import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Catalogue from "./pages/Catalogue";
import Dashboard from "./pages/Dashboard";
import Business from "./pages/Business";
import Categories from "./pages/Categories";
import Items from "./pages/Items";
import Plans from "./pages/Plans";
import Upgrade from "./pages/Upgrade";
import PaymentHistory from "./pages/PaymentHistory";

function App() {
  return (

      <Routes>

        {/* HOME */}

        <Route
          path="/"
          element={<Home />}
        />

        {/* LOGIN */}

        <Route
          path="/login"
          element={<Login />}
        />

        {/* REGISTER */}

        <Route
          path="/register"
          element={<Register />}
        />

        {/* DASHBOARD */}

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        {/* BUSINESS */}

        <Route
          path="/business"
          element={<Business />}
        />

        {/* CATEGORIES */}

        <Route
          path="/categories"
          element={<Categories />}
        />

        {/* ITEMS */}

        <Route
          path="/items"
          element={<Items />}
        />

        <Route
  path="/plans"
  element={<Plans />}
/>

<Route
  path="/upgrade"
  element={<Upgrade />}
/>

<Route
  path="/payment-history"
  element={< PaymentHistory/>}
/>

        {/* CATALOGUE */}

        <Route
          path="/:slug"
          element={<Catalogue />}
        />

        {/* 404 */}

        <Route
          path="*"
          element={
            <Navigate
              to="/"
              replace
            />
          }
        />

      </Routes>

  );
}

export default App;